import { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle, AlertCircle, TrendingUp, Target, Briefcase, Star } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const CVReviewer = () => {
  const { user, updateProgress } = useAuth();
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [review, setReview] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleReview = () => {
    if (uploadMethod === 'file' && !cvFile) {
      alert('Please upload a CV file first');
      return;
    }
    if (uploadMethod === 'text' && !cvText.trim()) {
      alert('Please paste your CV text first');
      return;
    }
    if (!targetRole.trim()) {
      alert('Please enter your target career/role');
      return;
    }

    setIsReviewing(true);

    // Simulate CV review - Replace this with your Replit CV reviewer integration
    setTimeout(() => {
      setReview({
        overallScore: 78,
        rating: 'Good',
        ratingDescription: 'Your CV shows strong potential with room for targeted improvements',

        strengths: [
          {
            section: 'Work Experience',
            score: 88,
            feedback: 'Excellent presentation of your work history with clear progression',
            details: [
              'Strong use of action verbs to describe responsibilities',
              'Clear career progression shown across roles',
              'Relevant experience highlighted effectively'
            ]
          },
          {
            section: 'Education',
            score: 92,
            feedback: 'Well-structured education section with relevant coursework',
            details: [
              'All relevant qualifications included',
              'Clear formatting with dates and institutions',
              'Relevant certifications highlighted'
            ]
          },
          {
            section: 'Contact Information',
            score: 95,
            feedback: 'Professional and complete contact details',
            details: [
              'All essential contact information present',
              'Professional email address used',
              'LinkedIn profile included'
            ]
          }
        ],

        improvements: [
          {
            section: 'Skills',
            score: 65,
            currentIssue: 'Skills section lacks organization and relevance to target role',
            howToImprove: [
              `Reorganize skills by category (Technical, Leadership, ${targetRole}-specific)`,
              `Add specific tools and technologies relevant to ${targetRole} positions`,
              'Remove outdated or irrelevant skills',
              'Include proficiency levels for key skills'
            ],
            priority: 'High'
          },
          {
            section: 'Professional Summary',
            score: 70,
            currentIssue: 'Summary is generic and doesn\'t highlight unique value proposition',
            howToImprove: [
              `Tailor summary specifically for ${targetRole} positions`,
              'Add 2-3 quantifiable achievements',
              'Highlight unique skills that set you apart',
              'Keep it concise (3-4 lines maximum)'
            ],
            priority: 'High'
          },
          {
            section: 'Achievements',
            score: 60,
            currentIssue: 'Achievements lack quantifiable metrics and impact',
            howToImprove: [
              'Add specific numbers and percentages (e.g., "Increased sales by 35%")',
              'Use the CAR method (Challenge, Action, Result)',
              'Focus on outcomes that matter for ' + targetRole,
              'Include awards or recognition received'
            ],
            priority: 'Medium'
          }
        ],

        careerPaths: [
          {
            role: targetRole,
            match: 92,
            description: `Based on your CV, you're well-positioned for ${targetRole} roles`,
            nextSteps: [
              `Highlight projects involving ${targetRole}-related skills`,
              'Consider certifications in relevant technologies',
              'Network with professionals in this field',
              'Tailor your CV to emphasize transferable skills'
            ]
          },
          {
            role: `Senior ${targetRole}`,
            match: 75,
            description: 'With additional experience, you could progress to senior positions',
            nextSteps: [
              'Gain 2-3 more years of specialized experience',
              'Take on leadership responsibilities in current role',
              'Develop expertise in niche areas',
              'Build a portfolio of significant achievements'
            ]
          },
          {
            role: targetRole.includes('Software') ? 'Technical Lead' : 'Team Lead',
            match: 68,
            description: 'Your experience shows leadership potential',
            nextSteps: [
              'Seek opportunities to mentor junior team members',
              'Lead cross-functional projects',
              'Develop strategic thinking skills',
              'Obtain leadership or management training'
            ]
          }
        ],

        overallRecommendations: [
          `Tailor your CV specifically for ${targetRole} applications`,
          'Add quantifiable achievements to every role listed',
          'Include keywords from job descriptions in your field',
          'Keep CV to 2 pages maximum',
          'Use consistent formatting throughout'
        ]
      });
      updateProgress('cvReviewsCompleted');
      setIsReviewing(false);
    }, 3000);
  };

  const getRatingColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
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
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">CV Reviewer</h1>
                <p className="text-purple-100">
                  Get personalized AI-powered feedback tailored to your career goals
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Your CV</h2>

            {/* Target Role Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What role are you targeting? *
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                This helps us provide personalized feedback for your career path
              </p>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setUploadMethod('file')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  uploadMethod === 'file'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setUploadMethod('text')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  uploadMethod === 'text'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Paste Text
              </button>
            </div>

            {uploadMethod === 'file' ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {cvFile ? (
                    <div>
                      <p className="text-gray-900 font-medium mb-1">{cvFile.name}</p>
                      <p className="text-sm text-gray-500">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-900 font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">PDF, DOC, or DOCX (max. 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV content here..."
                className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              />
            )}

            <button
              onClick={handleReview}
              disabled={isReviewing || (uploadMethod === 'file' ? !cvFile : !cvText.trim()) || !targetRole.trim()}
              className="mt-4 w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
            >
              {isReviewing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Analyzing Your CV...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Review CV</span>
                </>
              )}
            </button>
          </div>

          {/* Review Results */}
          {review && (
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-purple-100 mb-4">
                    <span className="text-5xl font-bold text-purple-600">{review.overallScore}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{review.rating}</h2>
                  <p className="text-lg text-gray-600">{review.ratingDescription}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-800 h-4 rounded-full transition-all"
                    style={{ width: `${review.overallScore}%` }}
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
                  {review.strengths.map((strength, index) => (
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
                  {review.improvements.map((improvement, index) => (
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
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                  <Briefcase className="w-7 h-7 text-purple-600" />
                  <span>Recommended Career Paths</span>
                </h2>
                <p className="text-gray-600 mb-6">Based on your CV and target role: <span className="font-bold text-purple-600">{targetRole}</span></p>

                <div className="space-y-4">
                  {review.careerPaths.map((path, index) => (
                    <div key={index} className="bg-white p-5 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{path.role}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-primary-600"
                              style={{ width: `${path.match}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-purple-600">{path.match}% Match</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{path.description}</p>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Next Steps:</h4>
                        <ul className="space-y-1">
                          {path.nextSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                              <span className="text-purple-600 mt-1">→</span>
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
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <span>Overall Recommendations</span>
                </h2>
                <ul className="space-y-3">
                  {review.overallRecommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-3 text-gray-700 p-3 bg-purple-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
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

export default CVReviewer;
