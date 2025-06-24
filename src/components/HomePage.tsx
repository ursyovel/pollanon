import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Share2, BarChart3, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Vote className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">PollAnon</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Ask. Share. Vote. All anonymous.</p>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to a friendly and simple platform where{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              anyone can create anonymous polls
            </span>{' '}
            and share them instantly.
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Whether you're making group decisions, gathering opinions, or just having fun—no sign-ups, no names, just votes.
          </p>
          
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Zap className="w-5 h-5" />
            Create a Poll
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">✅ Create a poll in seconds</h3>
            <p className="text-gray-600 leading-relaxed">
              Just type your question, add options, and get a link. No personal info needed.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Share2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🔗 Share the link</h3>
            <p className="text-gray-600 leading-relaxed">
              Send it to friends, classmates, or your group chat—anywhere you want responses from.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🗳️ See real-time results</h3>
            <p className="text-gray-600 leading-relaxed">
              Watch the votes come in anonymously and instantly.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to ask something?</h3>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            Start your first poll now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;