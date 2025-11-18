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
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const interimTranscriptRef = useRef('');

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

  const startInterview = (type) => {
    setInterviewType(type);
    setInterviewStarted(true);
    const welcomeMessage = "Hello! I'm your AI interviewer. Let's start with a simple question: Can you tell me about yourself and your background?";
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

    // Simulate AI response - Replace with your actual AI API integration
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

      if (voiceEnabled) {
        speakText(randomResponse);
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
    setMessages([]);
    setCurrentMessage('');
    setInterviewComplete(false);
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
