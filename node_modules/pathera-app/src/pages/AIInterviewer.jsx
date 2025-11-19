/*
 * AI INTERVIEWER - VOICE IMPROVEMENTS
 *
 * CURRENT FEATURES:
 * - Continuous speech recognition (won't cut off after pauses)
 * - Friendly voice with adjusted pitch and rate
 * - Real-time transcript display as you speak
 *
 * FOR BETTER VOICE QUALITY, INTEGRATE THESE APIS:
 *
 * 1. SPEECH-TO-TEXT (for better recording accuracy):
 *    - OpenAI Whisper API: https://platform.openai.com/docs/guides/speech-to-text
 *    - Google Cloud Speech-to-Text: https://cloud.google.com/speech-to-text
 *    - AssemblyAI: https://www.assemblyai.com/
 *
 * 2. TEXT-TO-SPEECH (for more natural, friendly voice):
 *    - ElevenLabs: https://elevenlabs.io/ (Most natural and emotional voices)
 *    - OpenAI TTS: https://platform.openai.com/docs/guides/text-to-speech
 *    - Google Cloud Text-to-Speech: https://cloud.google.com/text-to-speech
 *    - Amazon Polly: https://aws.amazon.com/polly/
 *
 * 3. INTEGRATION EXAMPLE (Replace speakText function):
 *    const speakText = async (text) => {
 *      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/voice-id', {
 *        method: 'POST',
 *        headers: {
 *          'Content-Type': 'application/json',
 *          'xi-api-key': 'YOUR_API_KEY'
 *        },
 *        body: JSON.stringify({ text, voice_settings: { stability: 0.5, similarity_boost: 0.75 } })
 *      });
 *      const audioBlob = await response.blob();
 *      const audioUrl = URL.createObjectURL(audioBlob);
 *      const audio = new Audio(audioUrl);
 *      audio.play();
 *    };
 *
 * 4. FOR RECORDING (Replace toggleRecording function):
 *    Use MediaRecorder API to capture audio, then send to Whisper API
 *    See: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
 */

import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  Send,
  Mic,
  MicOff,
  Clock,
  Award,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const AIInterviewer = () => {
  const { user, updateProgress } = useAuth();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewType, setInterviewType] = useState('');
  const [careerField, setCareerField] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCareerSelection, setShowCareerSelection] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const interimTranscriptRef = useRef('');
  const questionsRef = useRef([]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keep listening continuously
      recognitionRef.current.interimResults = true; // Show results as you speak
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Update the message field with interim results
        if (interimTranscript) {
          setCurrentMessage(interimTranscriptRef.current + interimTranscript);
        }

        // Add final transcript to the accumulated text
        if (finalTranscript) {
          interimTranscriptRef.current += finalTranscript;
          setCurrentMessage(interimTranscriptRef.current);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access to use voice features.');
          setIsRecording(false);
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Don't stop on no-speech, just continue listening
          console.log('No speech detected, continuing...');
        } else if (event.error === 'aborted') {
          // Recognition was aborted, don't show error
          setIsRecording(false);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        // If we're still supposed to be recording, restart it
        if (isRecording) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log('Recognition already started');
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isRecording]);

  const careerFields = [
    { id: 'software', name: 'Software Engineering', icon: '💻' },
    { id: 'finance', name: 'Finance & Banking', icon: '💼' },
    { id: 'law', name: 'Law', icon: '⚖️' },
    { id: 'engineering', name: 'Engineering', icon: '🔧' },
    { id: 'medicine', name: 'Medicine & Healthcare', icon: '⚕️' },
    { id: 'marketing', name: 'Marketing', icon: '📱' },
    { id: 'consulting', name: 'Consulting', icon: '📊' },
    { id: 'data', name: 'Data Science', icon: '📈' },
  ];

  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'Practice technical and problem-solving questions',
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

  // Question banks for different careers and interview types
  const questionBanks = {
    software: {
      technical: [
        "Tell me about yourself and your experience with software development.",
        "What programming languages are you most proficient in and why?",
        "Can you explain the difference between object-oriented and functional programming?",
        "Describe a challenging bug you've encountered and how you resolved it.",
        "How do you approach writing clean, maintainable code?",
        "What's your experience with version control systems like Git?",
        "Explain how you would optimize a slow-running application.",
        "What testing methodologies do you follow in your development process?",
      ],
      behavioral: [
        "Tell me about yourself and your journey into software engineering.",
        "Describe a time when you had to learn a new technology quickly. How did you approach it?",
        "Tell me about a project you're most proud of and why.",
        "How do you handle feedback and code reviews from your peers?",
        "Describe a situation where you disagreed with a team member about a technical decision.",
        "Tell me about a time you failed or made a significant mistake. What did you learn?",
        "How do you stay updated with the latest technology trends?",
        "Describe your ideal team environment and why.",
      ],
      general: [
        "Tell me about yourself and what interests you about this role.",
        "Why are you interested in software engineering?",
        "What are your greatest strengths and weaknesses as a developer?",
        "Where do you see yourself in 5 years?",
        "Why do you want to work for our company?",
        "What motivates you in your work?",
      ],
    },
    finance: {
      technical: [
        "Tell me about yourself and your background in finance.",
        "Explain the concept of time value of money and its applications.",
        "How do you value a company using DCF analysis?",
        "What's the difference between equity and debt financing?",
        "Explain what happens when the Federal Reserve raises interest rates.",
        "How would you assess the financial health of a company?",
        "What financial metrics do you consider most important and why?",
        "Walk me through a recent financial news story and its implications.",
      ],
      behavioral: [
        "Tell me about yourself and why you're interested in finance.",
        "Describe a time when you had to analyze complex data to make a recommendation.",
        "Tell me about a time you worked under pressure with tight deadlines.",
        "How do you handle situations where you make an error in your analysis?",
        "Describe a situation where you had to explain complex financial concepts to non-experts.",
        "Tell me about a time you identified a problem others had missed.",
        "How do you prioritize multiple tasks with competing deadlines?",
      ],
      general: [
        "Tell me about yourself and your interest in our firm.",
        "Why finance over other career paths?",
        "What areas of finance interest you most?",
        "How do you keep up with financial markets and news?",
        "What do you know about our company and recent deals?",
        "Where do you see yourself in your finance career?",
      ],
    },
    law: {
      technical: [
        "Tell me about yourself and your legal background.",
        "Explain the difference between civil and criminal law.",
        "How would you approach researching a complex legal issue?",
        "Describe a recent legal case that interested you and why.",
        "What is the doctrine of precedent and why is it important?",
        "How do you handle conflicting legal authorities?",
        "Explain the concept of duty of care in tort law.",
        "Walk me through how you would prepare for a client meeting.",
      ],
      behavioral: [
        "Tell me about yourself and why you want to practice law.",
        "Describe a time when you had to argue a position you didn't personally agree with.",
        "Tell me about a complex problem you had to solve with limited information.",
        "How do you handle working on multiple cases simultaneously?",
        "Describe a situation where you had to work with a difficult colleague or client.",
        "Tell me about a time you had to meet a critical deadline under pressure.",
        "How do you ensure attention to detail in your work?",
      ],
      general: [
        "Tell me about yourself and what draws you to our firm.",
        "Why law rather than another profession?",
        "What area of law interests you most and why?",
        "What do you know about our firm's practice areas?",
        "How do you balance work-life demands in a legal career?",
        "Where do you see your legal career in 5-10 years?",
      ],
    },
    engineering: {
      technical: [
        "Tell me about yourself and your engineering background.",
        "Describe a complex engineering problem you've solved.",
        "How do you approach the design process for a new project?",
        "Explain a time when you had to make a trade-off between different design parameters.",
        "What CAD software are you proficient in and what have you built with it?",
        "How do you ensure safety and compliance in your engineering work?",
        "Describe your experience with project management and meeting deadlines.",
        "What engineering principles do you apply most frequently?",
      ],
      behavioral: [
        "Tell me about yourself and your passion for engineering.",
        "Describe a project that didn't go as planned. How did you handle it?",
        "Tell me about a time you had to work in a multidisciplinary team.",
        "How do you approach learning new engineering tools or methodologies?",
        "Describe a situation where you had to convince others of your design approach.",
        "Tell me about a time you identified a potential safety issue.",
        "How do you handle feedback on your technical work?",
      ],
      general: [
        "Tell me about yourself and why you chose engineering.",
        "What type of engineering projects excite you most?",
        "Why are you interested in this engineering role?",
        "What engineering innovations have inspired you recently?",
        "How do you stay current with engineering advancements?",
        "Where do you see yourself in your engineering career?",
      ],
    },
    medicine: {
      technical: [
        "Tell me about yourself and your medical background.",
        "Describe your clinical experience and what you've learned.",
        "How do you approach diagnosing a patient with unclear symptoms?",
        "What recent medical research or development has interested you?",
        "Explain your understanding of evidence-based medicine.",
        "How do you prioritize patient care in a busy clinical environment?",
        "Describe your experience working with multidisciplinary healthcare teams.",
      ],
      behavioral: [
        "Tell me about yourself and why you want to pursue medicine.",
        "Describe a time when you had to deliver difficult news to someone.",
        "Tell me about a challenging patient interaction and how you handled it.",
        "How do you manage stress in high-pressure medical situations?",
        "Describe a time you made a mistake. How did you handle it?",
        "Tell me about a time you advocated for a patient.",
        "How do you maintain empathy while staying professional?",
      ],
      general: [
        "Tell me about yourself and your journey to medicine.",
        "Why medicine and why this specialty?",
        "What qualities make a good doctor?",
        "How do you handle work-life balance in medicine?",
        "What concerns you most about modern healthcare?",
        "Where do you see yourself in your medical career?",
      ],
    },
    marketing: {
      technical: [
        "Tell me about yourself and your marketing experience.",
        "Describe a successful marketing campaign you've worked on.",
        "How do you measure the effectiveness of a marketing campaign?",
        "What digital marketing tools and platforms are you proficient in?",
        "Explain your approach to market research and analysis.",
        "How do you identify and target the right audience?",
        "Describe your experience with SEO, SEM, or social media marketing.",
        "How do you stay current with marketing trends and consumer behavior?",
      ],
      behavioral: [
        "Tell me about yourself and what drew you to marketing.",
        "Describe a marketing campaign that didn't perform well. What did you learn?",
        "Tell me about a time you had to be creative under tight constraints.",
        "How do you handle disagreements with stakeholders about campaign direction?",
        "Describe a time you used data to change a marketing strategy.",
        "Tell me about a time you had to manage multiple campaigns simultaneously.",
      ],
      general: [
        "Tell me about yourself and your passion for marketing.",
        "What brands do you admire and why?",
        "Why are you interested in marketing for our company?",
        "What marketing trends are you most excited about?",
        "How do you measure success in your marketing work?",
        "Where do you see yourself in the marketing field?",
      ],
    },
    consulting: {
      technical: [
        "Tell me about yourself and your consulting experience.",
        "Walk me through how you would approach a case study.",
        "How do you structure a business problem?",
        "Estimate the market size for [product/service].",
        "What frameworks do you use for problem-solving?",
        "Describe your experience with data analysis and presentation.",
        "How would you advise a client looking to enter a new market?",
      ],
      behavioral: [
        "Tell me about yourself and why consulting interests you.",
        "Describe a time when you had to influence someone without authority.",
        "Tell me about a complex problem you broke down into manageable parts.",
        "How do you handle ambiguous situations with limited information?",
        "Describe a time you had to quickly build rapport with a new client.",
        "Tell me about a time you delivered difficult recommendations.",
        "How do you manage competing priorities from different stakeholders?",
      ],
      general: [
        "Tell me about yourself and what attracts you to consulting.",
        "Why consulting over industry roles?",
        "What do you know about our firm?",
        "What type of consulting projects interest you most?",
        "How do you handle the demanding nature of consulting work?",
        "Where do you see yourself in consulting?",
      ],
    },
    data: {
      technical: [
        "Tell me about yourself and your data science background.",
        "Explain the bias-variance tradeoff in machine learning.",
        "What's your experience with Python, R, or SQL?",
        "Describe a data science project you've worked on from start to finish.",
        "How do you handle missing or messy data?",
        "Explain the difference between supervised and unsupervised learning.",
        "What data visualization tools do you use and why?",
        "How do you validate and test your models?",
      ],
      behavioral: [
        "Tell me about yourself and your journey into data science.",
        "Describe a time when your analysis led to unexpected insights.",
        "Tell me about a project where you had to explain technical findings to non-technical stakeholders.",
        "How do you approach learning new data science techniques?",
        "Describe a time you had to work with imperfect or limited data.",
        "Tell me about a time you had to defend your analytical approach.",
      ],
      general: [
        "Tell me about yourself and what excites you about data science.",
        "Why data science over other technical fields?",
        "What data science problems interest you most?",
        "How do you stay current with developments in data science?",
        "What role do you see AI playing in the future?",
        "Where do you see yourself in data science?",
      ],
    },
  };

  const speakText = (text) => {
    if (!voiceEnabled || !synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Select a more natural-sounding voice if available
    const voices = synthRef.current.getVoices();
    // Prefer female voices as they often sound friendlier, or voices with "natural" in the name
    const preferredVoice = voices.find(voice =>
      voice.name.includes('Google') ||
      voice.name.includes('Female') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Natural')
    ) || voices.find(voice => voice.lang === 'en-US') || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Adjust settings for a warmer, friendlier tone
    utterance.rate = 0.95; // Slightly slower for clarity and friendliness
    utterance.pitch = 1.1; // Slightly higher pitch for warmth
    utterance.volume = 0.9; // Slightly softer for a gentler feel

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const selectInterviewType = (type) => {
    setInterviewType(type);
    setShowCareerSelection(true);
  };

  const startInterview = (field) => {
    setCareerField(field);
    setShowCareerSelection(false);
    setInterviewStarted(true);

    // Load questions for the selected career and interview type
    const questions = questionBanks[field][interviewType] || [];
    questionsRef.current = questions;
    setCurrentQuestionIndex(0);

    const welcomeMessage = `Hello! I'm your AI interviewer. Today we'll be conducting a ${interviewTypes.find(t => t.id === interviewType)?.title.toLowerCase()} for ${careerFields.find(c => c.id === field)?.name}. ${questions[0]}`;

    setMessages([
      {
        sender: 'ai',
        text: welcomeMessage,
        timestamp: new Date(),
      },
    ]);

    if (voiceEnabled) {
      setTimeout(() => speakText(welcomeMessage), 500);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    } else {
      try {
        // Reset the interim transcript when starting new recording
        interimTranscriptRef.current = '';
        recognitionRef.current.start();
        setIsRecording(true);
        setIsListening(true);
        stopSpeaking();
      } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Could not start voice recognition. Please try again.');
      }
    }
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
    interimTranscriptRef.current = ''; // Reset the transcript accumulator
    stopSpeaking();

    // Progress to next question
    setTimeout(() => {
      const questions = questionsRef.current;
      const nextIndex = currentQuestionIndex + 1;

      let aiResponse;

      if (nextIndex < questions.length) {
        // More questions available
        const acknowledgments = [
          "Thank you for that answer. ",
          "I appreciate your response. ",
          "That's helpful to know. ",
          "Interesting perspective. ",
          "Good, thank you. ",
        ];
        const randomAck = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
        aiResponse = randomAck + questions[nextIndex];
        setCurrentQuestionIndex(nextIndex);
      } else {
        // Interview complete
        aiResponse = "Thank you for completing the interview! You've answered all my questions. I'll now provide you with feedback on your performance. Good luck with your career journey!";
        setInterviewComplete(true);
        updateProgress('interviewsCompleted');
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponse,
          timestamp: new Date(),
        },
      ]);

      if (voiceEnabled) {
        speakText(aiResponse);
      }
    }, 1500);
  };

  const endInterview = () => {
    setInterviewComplete(true);
    updateProgress('interviewsCompleted');
    const finalMessage = "Thank you for completing the interview! Your performance has been recorded. You can review your answers and get detailed feedback below.";
    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: finalMessage,
        timestamp: new Date(),
      },
    ]);

    if (voiceEnabled) {
      stopSpeaking();
      setTimeout(() => speakText(finalMessage), 500);
    }
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewType('');
    setCareerField('');
    setShowCareerSelection(false);
    setMessages([]);
    setCurrentMessage('');
    setInterviewComplete(false);
    setCurrentQuestionIndex(0);
    questionsRef.current = [];
    stopSpeaking();
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled) {
      stopSpeaking();
    }
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="pt-32 pb-12 px-4">
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
                    Practice career-specific interviews with AI and get instant feedback
                  </p>
                </div>
              </div>
            </div>

            {!showCareerSelection ? (
              /* Interview Types */
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Step 1: Choose Interview Type
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {interviewTypes.map((type) => (
                    <div
                      key={type.id}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                      onClick={() => selectInterviewType(type.id)}
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
            ) : (
              /* Career Field Selection */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Step 2: Choose Your Career Field
                  </h2>
                  <button
                    onClick={() => setShowCareerSelection(false)}
                    className="text-gray-600 hover:text-gray-900 text-sm flex items-center space-x-1"
                  >
                    <span>← Back</span>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Selected: <span className="font-semibold text-primary-600">
                    {interviewTypes.find(t => t.id === interviewType)?.title}
                  </span>
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  {careerFields.map((field) => (
                    <div
                      key={field.id}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:scale-105"
                      onClick={() => startInterview(field.id)}
                    >
                      <div className="text-4xl mb-3 text-center">{field.icon}</div>
                      <h3 className="text-center font-bold text-gray-900 text-sm">
                        {field.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <button
                  onClick={toggleVoice}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    voiceEnabled
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={voiceEnabled ? 'Voice ON' : 'Voice OFF'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="hidden sm:inline">{voiceEnabled ? 'Voice ON' : 'Voice OFF'}</span>
                </button>
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
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Voice Status Indicator */}
          {(isListening || isSpeaking) && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
              <Radio className="w-5 h-5 text-primary-600 animate-pulse" />
              <span className="text-primary-900 font-medium">
                {isListening && 'Listening... Speak now'}
                {isSpeaking && 'AI is speaking...'}
              </span>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="ml-auto px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                >
                  Stop Speaking
                </button>
              )}
            </div>
          )}

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
                  <p className="text-sm mb-1 font-semibold">
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
                  onClick={toggleRecording}
                  disabled={isSpeaking}
                  className={`p-3 rounded-lg transition-colors ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isRecording ? 'Listening...' : 'Type your answer or use voice...'}
                  disabled={isRecording || isSpeaking}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-500 focus:border-transparent outline-none disabled:bg-gray-100"
                />
                <button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || isSpeaking}
                  className="p-3 bg-dark-600 text-white rounded-lg hover:bg-dark-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Click the microphone to answer with your voice, or type your response
              </p>
            </div>
          )}

          {/* Feedback Section (shown when interview is complete) */}
          {interviewComplete && (
            <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interview Feedback</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-bold text-green-900 mb-2">Strengths</h4>
                  <ul className="space-y-1 text-green-800 text-sm">
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

        </div>
      </div>
    </div>
  );
};

export default AIInterviewer;
