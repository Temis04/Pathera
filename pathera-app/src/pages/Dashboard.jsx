import { useNavigate } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const tools = [
    {
      icon: FileText,
      title: 'CV Reviewer',
      description: 'Get AI-powered feedback on your CV',
      color: 'from-purple-600 to-purple-800',
      path: '/cv-reviewer',
      completed: user.progress.cvReviewsCompleted,
    },
    {
      icon: BookOpen,
      title: 'Personal Statement',
      description: 'Review and improve your personal statement',
      color: 'from-primary-600 to-primary-800',
      path: '/personal-statement',
      completed: user.progress.personalStatementsReviewed,
    },
    {
      icon: MessageSquare,
      title: 'AI Interviewer',
      description: 'Practice interviews with AI',
      color: 'from-dark-700 to-dark-900',
      path: '/ai-interviewer',
      completed: user.progress.interviewsCompleted,
    },
  ];

  const stats = [
    {
      label: 'CV Reviews',
      value: user.progress.cvReviewsCompleted,
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Interviews Completed',
      value: user.progress.interviewsCompleted,
      icon: MessageSquare,
      color: 'text-dark-700',
      bg: 'bg-dark-100',
    },
    {
      label: 'Statements Reviewed',
      value: user.progress.personalStatementsReviewed,
      icon: BookOpen,
      color: 'text-primary-600',
      bg: 'bg-primary-100',
    },
    {
      label: 'Total Activities',
      value: user.progress.cvReviewsCompleted + user.progress.interviewsCompleted + user.progress.personalStatementsReviewed,
      icon: TrendingUp,
      color: 'text-purple-700',
      bg: 'bg-purple-100',
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-primary-100 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatDate(user.joinedDate)}</span>
                </p>
              </div>
              <Award className="w-16 h-16 text-primary-200" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tools Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Career Tools
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => navigate(tool.path)}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mb-4`}>
                    <tool.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {tool.completed} completed
                    </span>
                    <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Quick Tips for Success</span>
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Review your CV regularly to keep it updated with new skills and experiences</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Practice interviews consistently to build confidence</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Tailor your personal statement for each application</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
