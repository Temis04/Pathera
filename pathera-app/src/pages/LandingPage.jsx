import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Briefcase,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Interviewer',
      description: 'Practice interviews with our AI-powered interviewer. Get real-time feedback and improve your interview skills.',
      color: 'from-primary-500 to-primary-700',
    },
    {
      icon: FileText,
      title: 'CV Reviewer',
      description: 'Get instant feedback on your CV. Our AI analyzes your resume and provides actionable improvements.',
      color: 'from-purple-600 to-purple-800',
    },
    {
      icon: Briefcase,
      title: 'Work Experience Finder',
      description: 'Discover relevant work experience opportunities tailored to your career goals and skills.',
      color: 'from-dark-700 to-dark-900',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      features: [
        '3 CV Reviews per month',
        '5 AI Interview sessions',
        'Basic analytics',
        'Email support',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      price: '19',
      features: [
        'Unlimited CV Reviews',
        'Unlimited AI Interviews',
        'Advanced analytics',
        'Priority support',
        'Personal statement review',
        'Interview recording',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '49',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom AI training',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      image: '👩‍💻',
      rating: 5,
      text: 'Pathera helped me land my dream job! The AI interviewer was incredibly realistic and the CV feedback was spot-on.',
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      image: '👨‍💼',
      rating: 5,
      text: 'The personal statement reviewer gave me insights I never considered. Highly recommend to anyone job hunting!',
    },
    {
      name: 'Emma Williams',
      role: 'Data Scientist',
      image: '👩‍🔬',
      rating: 5,
      text: 'Best career preparation platform I\'ve used. The AI feedback is detailed and actually helpful.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Career Preparation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Path to Career Success
            <br />
            <span className="text-primary-600">Starts Here</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Prepare for your dream career with AI-powered interview practice,
            CV reviews, and personalized career guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg border-2 border-primary-600"
                >
                  Learn More
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features to Boost Your Career
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to prepare for your next career move
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl ${
                  plan.popular
                    ? 'ring-4 ring-primary-500 shadow-2xl scale-105'
                    : 'shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary-500 text-white text-sm font-bold px-4 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful job seekers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/pathera-logo.png"
              alt="Pathera Logo"
              className="h-16 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg items-center justify-center">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering your career journey with AI
          </p>
          <p className="text-gray-500 text-sm">
            &copy; 2024 Pathera. All rights reserved.
          </p>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
