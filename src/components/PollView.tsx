import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Vote, Share2, BarChart3, ArrowLeft, Copy, Check } from 'lucide-react';
import { getPoll, votePoll } from '../utils/pollStorage';
import { Poll } from '../types/Poll';

const PollView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const loadPoll = () => {
      const foundPoll = getPoll(id);
      if (!foundPoll) {
        navigate('/');
        return;
      }
      setPoll(foundPoll);
      setLoading(false);
      
      // Check if user has already voted
      const voted = localStorage.getItem(`voted_${id}`);
      if (voted) {
        setHasVoted(true);
      }
    };

    loadPoll();
  }, [id, navigate]);

  const handleVote = async () => {
    if (!poll || !selectedOption || isVoting) return;

    setIsVoting(true);
    
    try {
      const updatedPoll = votePoll(poll.id, selectedOption);
      if (updatedPoll) {
        setPoll(updatedPoll);
        setHasVoted(true);
        localStorage.setItem(`voted_${poll.id}`, 'true');
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Poll not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <Vote className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Poll</h1>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
            
            <Link
              to={`/results/${poll.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              Results
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {poll.question}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{poll.totalVotes} votes</span>
                <span>•</span>
                <span>Created {poll.createdAt.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Voting */}
            {!hasVoted ? (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 mb-4">Choose your answer:</h3>
                {poll.options.map((option) => (
                  <label
                    key={option.id}
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{option.text}</span>
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        selectedOption === option.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === option.id && (
                          <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}

                <button
                  onClick={handleVote}
                  disabled={!selectedOption || isVoting}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isVoting ? 'Voting...' : 'Vote'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-600">Thanks for voting!</span>
                </div>
                
                {poll.options.map((option) => {
                  const percentage = getPercentage(option.votes, poll.totalVotes);
                  return (
                    <div key={option.id} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{option.text}</span>
                        <span className="text-sm text-gray-600">{option.votes} votes ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}

                <Link
                  to={`/results/${poll.id}`}
                  className="block w-full mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 text-center"
                >
                  View Full Results
                </Link>
              </div>
            )}
          </div>

          {/* Share prompt */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Share this poll</h3>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Get more responses by sharing this poll with others. The more votes, the better the insights!
            </p>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollView;