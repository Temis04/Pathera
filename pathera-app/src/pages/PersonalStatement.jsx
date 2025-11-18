import { useState } from 'react';
import { BookOpen, Upload, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const PersonalStatement = () => {
  const { user, updateProgress } = useAuth();
  const [statement, setStatement] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!statement.trim()) {
      alert('Please enter your personal statement first');
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis - Replace this with your actual AI integration
    setTimeout(() => {
      setAnalysis({
        score: 85,
        strengths: [
          'Clear and engaging opening paragraph',
          'Good use of specific examples',
          'Shows passion for the field',
        ],
        improvements: [
          'Could add more quantifiable achievements',
          'Consider restructuring the middle section for better flow',
          'Conclusion could be more impactful',
        ],
        suggestions: 'Your personal statement demonstrates strong potential. Focus on making your achievements more concrete with specific metrics and outcomes.',
      });
      updateProgress('personalStatementsReviewed');
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Personal Statement Reviewer
                </h1>
                <p className="text-blue-100">
                  Get AI-powered feedback to make your personal statement stand out
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Personal Statement
              </h2>
              <textarea
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Paste your personal statement here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">
                  {statement.length} characters
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !statement.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                AI Analysis
              </h2>

              {!analysis ? (
                <div className="h-96 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Your analysis will appear here</p>
                    <p className="text-sm mt-2">Enter your statement and click Analyze</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Overall Score</span>
                      <span className="text-3xl font-bold text-blue-600">{analysis.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${analysis.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Strengths</span>
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2 text-gray-700">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span>Areas for Improvement</span>
                    </h3>
                    <ul className="space-y-2">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start space-x-2 text-gray-700">
                          <span className="text-orange-600 mt-1">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Suggestions</h3>
                    <p className="text-gray-700">{analysis.suggestions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Integration Note */}
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🔧 Ready for Integration
            </h3>
            <p className="text-gray-700 mb-2">
              This is a placeholder implementation. To integrate your actual AI personal statement reviewer:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
              <li>Replace the <code className="bg-yellow-100 px-1 rounded">handleAnalyze</code> function's setTimeout with your API call</li>
              <li>Update the analysis object structure to match your AI response</li>
              <li>Add error handling and loading states</li>
              <li>Consider adding file upload functionality for document analysis</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalStatement;
