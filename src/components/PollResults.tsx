import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BarChart3, Share2, ArrowLeft, Copy, Check, Vote } from 'lucide-react';
import { getPoll } from '../utils/pollStorage';
import { Poll } from '../types/Poll';

const PollResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
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
    };

    loadPoll();
    
    // Refresh results every 5 seconds
    const interval = setInterval(loadPoll, 5000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  const handleShare = async () => {
    const url = window.location.origin + `/poll/${id}`;
    
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

  const getWinningOption = () => {
    if (!poll || poll.totalVotes === 0) return null;
    return poll.options.reduce((prev, current) => 
      prev.votes > current.votes ? prev : current
    );
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

  const winningOption = getWinningOption();
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to={`/poll/${poll.id}`}
              className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Poll Results</h1>
            </div>
          </div>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share Poll'}
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Question & Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {poll.question}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{poll.totalVotes}</div>
                <div className="text-sm text-blue-800">Total Votes</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-2xl font-bold text-green-600">{poll.options.length}</div>
                <div className="text-sm text-green-800">Options</div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="text-2xl font-bold text-purple-600">
                  {poll.createdAt.toLocaleDateString()}
                </div>
                <div className="text-sm text-purple-800">Created</div>
              </div>
            </div>

            {winningOption && poll.totalVotes > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 text-yellow-600">🏆</div>
                  <h3 className="font-semibold text-yellow-800">Current Leader</h3>
                </div>
                <p className="text-yellow-900 font-medium">{winningOption.text}</p>
                <p className="text-sm text-yellow-700">
                  {winningOption.votes} votes ({getPercentage(winningOption.votes, poll.totalVotes)}%)
                </p>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Results</h3>
              <div className="text-sm text-gray-500">
                Updates every 5 seconds
              </div>
            </div>

            {poll.totalVotes === 0 ? (
              <div className="text-center py-12">
                <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No votes yet</h4>
                <p className="text-gray-600 mb-6">Be the first to vote on this poll!</p>
                <Link
                  to={`/poll/${poll.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <Vote className="w-4 h-4" />
                  Cast Your Vote
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedOptions.map((option, index) => {
                  const percentage = getPercentage(option.votes, poll.totalVotes);
                  const isWinner = option.id === winningOption?.id;
                  
                  return (
                    <div key={option.id} className="relative">
                      <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        isWinner 
                          ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`text-lg font-bold ${
                              isWinner ? 'text-yellow-600' : 'text-gray-400'
                            }`}>
                              #{index + 1}
                            </div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {option.text}
                            </h4>
                            {isWinner && <div className="text-yellow-600">🏆</div>}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {percentage}%
                            </div>
                            <div className="text-sm text-gray-600">
                              {option.votes} votes
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              isWinner
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                                : 'bg-gradient-to-r from-blue-400 to-purple-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to={`/poll/${poll.id}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Vote className="w-4 h-4" />
              Vote on This Poll
            </Link>
            
            <Link
              to="/create"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-4 h-4">➕</div>
              Create Your Own Poll
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollResults;