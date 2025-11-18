import { useState } from 'react';
import {
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  Send,
  Mic,
  MicOff,
  Clock,
  Award
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const AIInterviewer = () => {
  const { user, updateProgress } = useAuth();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewType, setInterviewType] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);

  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'Practice coding and technical problem-solving questions',
      icon: '💻',
      difficulty: 'Advanced',
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      description: 'Common behavioral questions using the STAR method',
      icon: '🗣️',
      difficulty: 'Intermediate',
    },
    {
      id: 'general',
      title: 'General Interview',
      description: 'Mix of general questions about your background and experience',
      icon: '👔',
      difficulty: 'Beginner',
    },
  ];

  const startInterview = (type) => {
    setInterviewType(type);
    setInterviewStarted(true);
    setMessages([
      {
        sender: 'ai',
        text: "Hello! I'm your AI interviewer. Let's start with a simple question: Can you tell me about yourself and your background?",
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      sender: 'user',
      text: currentMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setCurrentMessage('');

    // Simulate AI response - Replace with your actual AI integration
    setTimeout(() => {
      const aiResponses = [
        "That's interesting. Can you elaborate on that experience?",
        "Great answer! Now, tell me about a challenge you faced and how you overcame it.",
        "Excellent. How do you handle working under pressure?",
        "Thank you for sharing that. What are your strengths and weaknesses?",
        "Good response. Where do you see yourself in five years?",
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: randomResponse,
          timestamp: new Date(),
        },
      ]);
    }, 1500);
  };

  const endInterview = () => {
    setInterviewComplete(true);
    updateProgress('interviewsCompleted');
    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: "Thank you for completing the interview! Your performance has been recorded. You can review your answers and get detailed feedback below.",
        timestamp: new Date(),
      },
    ]);
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewType('');
    setMessages([]);
    setCurrentMessage('');
    setInterviewComplete(false);
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-dark-700 to-dark-900 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">AI Interviewer</h1>
                  <p className="text-dark-100">
                    Practice realistic interviews with AI and get instant feedback
                  </p>
                </div>
              </div>
            </div>

            {/* Interview Types */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Choose Interview Type
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {interviewTypes.map((type) => (
                  <div
                    key={type.id}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                    onClick={() => startInterview(type.id)}
                  >
                    <div className="text-5xl mb-4">{type.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{type.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {type.difficulty}
                      </span>
                      <Play className="w-5 h-5 text-dark-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>Interview Tips</span>
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Take your time to think before answering</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Use the STAR method for behavioral questions (Situation, Task, Action, Result)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Be specific with examples from your experience</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Practice makes perfect - try different interview types</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Interview Header */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-dark-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-dark-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {interviewTypes.find(t => t.id === interviewType)?.title}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{messages.length} exchanges</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!interviewComplete && (
                  <button
                    onClick={endInterview}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    End Interview
                  </button>
                )}
                <button
                  onClick={resetInterview}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-white rounded-xl shadow-lg mb-6 h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-dark-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm mb-1">
                    {message.sender === 'user' ? 'You' : 'AI Interviewer'}
                  </p>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          {!interviewComplete && (
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-3 rounded-lg transition-colors ${
                    isRecording
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim()}
                  className="p-3 bg-dark-600 text-white rounded-lg hover:bg-dark-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Feedback Section (shown when interview is complete) */}
          {interviewComplete && (
            <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interview Feedback</h3>
              <div className="space-y-4">
                <div className="bg-dark-50 border-l-4 border-dark-500 p-4 rounded">
                  <h4 className="font-bold text-dark-900 mb-2">Strengths</h4>
                  <ul className="space-y-1 text-dark-800 text-sm">
                    <li>• Clear and concise responses</li>
                    <li>• Good use of specific examples</li>
                    <li>• Professional communication style</li>
                  </ul>
                </div>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                  <h4 className="font-bold text-orange-900 mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1 text-orange-800 text-sm">
                    <li>• Consider adding more quantifiable achievements</li>
                    <li>• Expand on your problem-solving approach</li>
                    <li>• Practice the STAR method for behavioral questions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Integration Note */}
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🔧 Ready for AI Integration
            </h3>
            <p className="text-gray-700 mb-2">
              This is a placeholder implementation. To integrate your actual AI interviewer:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
              <li>Replace the <code className="bg-yellow-100 px-1 rounded">sendMessage</code> function with your AI API call</li>
              <li>Implement speech-to-text for the microphone button</li>
              <li>Add real-time AI response generation</li>
              <li>Implement proper interview scoring and feedback</li>
              <li>Consider adding video recording functionality</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewer;
