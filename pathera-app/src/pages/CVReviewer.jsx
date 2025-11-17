import { useState } from 'react';
import { FileText, Upload, Download, Sparkles, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const CVReviewer = () => {
  const { user, updateProgress } = useAuth();
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [review, setReview] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'text'

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      // In production, you would parse the file here
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

    setIsReviewing(true);

    // Simulate CV review - Replace this with your Replit CV reviewer integration
    setTimeout(() => {
      setReview({
        overallScore: 78,
        sections: [
          {
            name: 'Contact Information',
            score: 95,
            status: 'excellent',
            feedback: 'Clear and professional contact details provided.',
          },
          {
            name: 'Professional Summary',
            score: 70,
            status: 'good',
            feedback: 'Good summary, but could be more impactful with specific achievements.',
          },
          {
            name: 'Work Experience',
            score: 85,
            status: 'excellent',
            feedback: 'Well-structured with clear responsibilities and achievements.',
          },
          {
            name: 'Skills',
            score: 60,
            status: 'needs-improvement',
            feedback: 'Skills section could be better organized. Consider grouping by category.',
          },
          {
            name: 'Education',
            score: 90,
            status: 'excellent',
            feedback: 'Comprehensive education section with relevant details.',
          },
        ],
        keyIssues: [
          'Missing quantifiable achievements in some positions',
          'Inconsistent date formatting',
          'Skills could be better categorized',
        ],
        recommendations: [
          'Add metrics to demonstrate impact (e.g., "Increased sales by 25%")',
          'Standardize date format throughout',
          'Group skills by category (Technical, Soft Skills, etc.)',
          'Consider adding a projects section',
        ],
      });
      updateProgress('cvReviewsCompleted');
      setIsReviewing(false);
    }, 2500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50';
      case 'good':
        return 'text-blue-600 bg-blue-50';
      case 'needs-improvement':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'needs-improvement':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">CV Reviewer</h1>
                <p className="text-purple-100">
                  Upload your CV and get instant AI-powered feedback
                </p>
              </div>
            </div>
          </div>

          {/* Upload Method Toggle */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
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
              disabled={isReviewing || (uploadMethod === 'file' ? !cvFile : !cvText.trim())}
              className="mt-4 w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
            >
              {isReviewing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Reviewing Your CV...</span>
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
              {/* Overall Score */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Overall Score</h2>
                  <span className="text-5xl font-bold text-purple-600">{review.overallScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${review.overallScore}%` }}
                  />
                </div>
              </div>

              {/* Section Breakdown */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Section Breakdown</h2>
                <div className="space-y-4">
                  {review.sections.map((section, index) => (
                    <div key={index} className={`p-4 rounded-lg ${getStatusColor(section.status)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(section.status)}
                          <h3 className="font-bold">{section.name}</h3>
                        </div>
                        <span className="font-bold">{section.score}/100</span>
                      </div>
                      <p className="text-sm ml-7">{section.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Issues */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <span>Key Issues</span>
                </h2>
                <ul className="space-y-2">
                  {review.keyIssues.map((issue, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span>Recommendations</span>
                </h2>
                <ul className="space-y-2">
                  {review.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Integration Note */}
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🔧 Ready for Replit Integration
            </h3>
            <p className="text-gray-700 mb-2">
              This page is set up for easy integration with your Replit CV reviewer. Here's how:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
              <li>Get your Replit API endpoint URL</li>
              <li>Replace the <code className="bg-yellow-100 px-1 rounded">handleReview</code> function's setTimeout with a fetch call to your Replit API</li>
              <li>Update the review object structure to match your API response</li>
              <li>Add proper error handling and file parsing logic</li>
              <li>Optional: Add authentication headers if your API requires them</li>
            </ol>
            <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Example integration code:
const response = await fetch('YOUR_REPLIT_API_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cv: cvText })
});
const data = await response.json();
setReview(data);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVReviewer;
