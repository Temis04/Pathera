import { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle, AlertCircle, TrendingUp, Target, Briefcase, Star } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const PersonalStatement = () => {
  const { user, updateProgress } = useAuth();
  const [statement, setStatement] = useState('');
  const [targetField, setTargetField] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!statement.trim()) {
      alert('Please enter your personal statement first');
      return;
    }
    if (!targetField.trim()) {
      alert('Please enter your target field/program');
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis - Replace this with your actual AI integration
    setTimeout(() => {
      setAnalysis({
        overallScore: 82,
        rating: 'Strong',
        ratingDescription: 'Your personal statement shows great potential with focused improvements needed',

        strengths: [
          {
            section: 'Opening Paragraph',
            score: 90,
            feedback: 'Compelling and engaging introduction that captures attention',
            details: [
              'Strong opening hook that draws the reader in',
              'Clear statement of purpose and motivation',
              'Sets the tone effectively for the rest of the statement'
            ]
          },
          {
            section: 'Personal Experiences',
            score: 85,
            feedback: 'Well-articulated experiences that support your goals',
            details: [
              'Specific examples that demonstrate growth and learning',
              'Good connection between experiences and career goals',
              'Shows reflection and self-awareness'
            ]
          },
          {
            section: 'Passion & Motivation',
            score: 88,
            feedback: 'Genuine enthusiasm for the field comes through clearly',
            details: [
              'Authentic voice and personal connection to the field',
              'Clear explanation of what drives your interest',
              'Demonstrates long-term commitment'
            ]
          }
        ],

        improvements: [
          {
            section: 'Academic Achievements',
            score: 70,
            currentIssue: 'Achievements mentioned but not connected to career goals',
            howToImprove: [
              `Link academic achievements specifically to ${targetField} requirements`,
              'Add specific grades, awards, or recognition received',
              'Explain how coursework prepared you for this field',
              'Include research projects or relevant academic work'
            ],
            priority: 'High'
          },
          {
            section: 'Career Goals',
            score: 65,
            currentIssue: 'Career goals are too vague and not field-specific',
            howToImprove: [
              `Specify exactly what you want to achieve in ${targetField}`,
              'Mention specific roles, specializations, or areas of focus',
              'Connect your goals to current trends in the field',
              'Show understanding of career progression in this area'
            ],
            priority: 'High'
          },
          {
            section: 'Unique Value',
            score: 72,
            currentIssue: 'What makes you unique is not clearly articulated',
            howToImprove: [
              'Highlight specific skills or experiences others might not have',
              'Explain your unique perspective or background',
              'Show how diversity of experience benefits the field',
              'Make your differentiators explicit and memorable'
            ],
            priority: 'Medium'
          },
          {
            section: 'Conclusion',
            score: 68,
            currentIssue: 'Ending feels rushed and doesn\'t leave lasting impression',
            howToImprove: [
              'Summarize key themes powerfully',
              'End with forward-looking statement about your impact',
              'Circle back to opening hook for cohesion',
              'Leave reader with memorable closing thought'
            ],
            priority: 'Medium'
          }
        ],

        careerPaths: [
          {
            field: targetField,
            match: 88,
            description: `Your statement demonstrates strong alignment with ${targetField} goals`,
            nextSteps: [
              `Research leading institutions/programs in ${targetField}`,
              'Connect with professionals currently working in this field',
              'Develop specific technical or domain knowledge',
              'Seek relevant internships or research opportunities'
            ]
          },
          {
            field: `Research in ${targetField}`,
            match: 75,
            description: 'Your analytical approach suggests research potential',
            nextSteps: [
              'Identify specific research questions you\'re interested in',
              'Read recent publications in your area of interest',
              'Reach out to professors doing relevant research',
              'Consider pursuing research assistant positions'
            ]
          },
          {
            field: `Leadership in ${targetField}`,
            match: 70,
            description: 'Your experiences show leadership capabilities',
            nextSteps: [
              'Highlight leadership experiences more explicitly',
              'Develop strategic thinking and management skills',
              'Seek opportunities to lead projects or teams',
              'Study successful leaders in your target field'
            ]
          }
        ],

        overallRecommendations: [
          `Tailor your statement specifically for ${targetField} programs/positions`,
          'Use concrete examples with specific details and outcomes',
          'Show, don\'t just tell - use stories to illustrate points',
          'Keep statement focused and avoid tangents',
          'Have multiple people review and provide feedback',
          'Revise multiple times - first drafts are never final'
        ]
      });
      updateProgress('personalStatementsReviewed');
      setIsAnalyzing(false);
    }, 3000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-orange-100 text-orange-700';
      case 'Low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
                <p className="text-primary-100">
                  Get personalized AI-powered feedback tailored to your field and goals
                </p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Personal Statement</h2>

            {/* Target Field Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What field/program are you applying to? *
              </label>
              <input
                type="text"
                value={targetField}
                onChange={(e) => setTargetField(e.target.value)}
                placeholder="e.g., Computer Science Masters, Medical School, MBA Program"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                This helps us provide personalized feedback for your specific field
              </p>
            </div>

            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Paste your personal statement here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                {statement.length} characters
              </span>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !statement.trim() || !targetField.trim()}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze Statement</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary-100 mb-4">
                    <span className="text-5xl font-bold text-primary-600">{analysis.overallScore}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{analysis.rating}</h2>
                  <p className="text-lg text-gray-600">{analysis.ratingDescription}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-primary-800 h-4 rounded-full transition-all"
                    style={{ width: `${analysis.overallScore}%` }}
                  />
                </div>
              </div>

              {/* Strengths - What You Did Well */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                  <span>What You Did Well</span>
                </h2>
                <p className="text-gray-600 mb-6">These sections are strong and working in your favor</p>

                <div className="space-y-4">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="border-l-4 border-green-500 bg-green-50 p-5 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{strength.section}</h3>
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-green-600 fill-green-600" />
                          <span className="text-xl font-bold text-green-600">{strength.score}/100</span>
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium mb-3">{strength.feedback}</p>
                      <ul className="space-y-2">
                        {strength.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                  <TrendingUp className="w-7 h-7 text-orange-600" />
                  <span>Areas for Improvement</span>
                </h2>
                <p className="text-gray-600 mb-6">Specific sections that need attention and how to improve them</p>

                <div className="space-y-6">
                  {analysis.improvements.map((improvement, index) => (
                    <div key={index} className="border-l-4 border-orange-500 bg-orange-50 p-5 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{improvement.section}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(improvement.priority)}`}>
                              {improvement.priority} Priority
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-sm font-medium text-gray-600">Current Score:</span>
                            <span className="text-xl font-bold text-orange-600">{improvement.score}/100</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span>Current Issue:</span>
                        </h4>
                        <p className="text-gray-700 ml-6">{improvement.currentIssue}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                          <Target className="w-4 h-4 text-orange-600" />
                          <span>How to Improve:</span>
                        </h4>
                        <ul className="space-y-2 ml-6">
                          {improvement.howToImprove.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-3 text-gray-700">
                              <span className="font-bold text-orange-600 mt-0.5">{idx + 1}.</span>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Path Recommendations */}
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-primary-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                  <Briefcase className="w-7 h-7 text-primary-600" />
                  <span>Recommended Paths</span>
                </h2>
                <p className="text-gray-600 mb-6">Based on your statement and target field: <span className="font-bold text-primary-600">{targetField}</span></p>

                <div className="space-y-4">
                  {analysis.careerPaths.map((path, index) => (
                    <div key={index} className="bg-white p-5 rounded-lg border border-primary-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{path.field}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-600 to-purple-600"
                              style={{ width: `${path.match}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-primary-600">{path.match}% Match</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{path.description}</p>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Next Steps:</h4>
                        <ul className="space-y-1">
                          {path.nextSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                              <span className="text-primary-600 mt-1">→</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Recommendations */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-primary-600" />
                  <span>Overall Recommendations</span>
                </h2>
                <ul className="space-y-3">
                  {analysis.overallRecommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-3 text-gray-700 p-3 bg-primary-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalStatement;
