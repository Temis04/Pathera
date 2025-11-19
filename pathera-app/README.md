# Pathera - AI-Powered Career Preparation Platform

A modern, fully functional website for career preparation featuring AI-powered CV reviews, interview practice, and personal statement analysis.

## Features

- **Landing Page**: Beautiful homepage with Pathera branding, features, pricing, and testimonials
- **Authentication**: Complete login/signup system with localStorage-based authentication
- **Dashboard**: User profile page with progress tracking and stats
- **CV Reviewer**: AI-powered CV analysis tool (ready for Replit integration)
- **Personal Statement Reviewer**: AI feedback for personal statements
- **AI Interviewer**: Interactive interview practice with AI
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **localStorage** - Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd pathera-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

### Build for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
pathera-app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx           # Navigation component
│   │   └── auth/
│   │       ├── AuthModal.jsx        # Login/Signup modal
│   │       └── ProtectedRoute.jsx   # Route protection
│   ├── pages/
│   │   ├── LandingPage.jsx          # Homepage
│   │   ├── Dashboard.jsx            # User dashboard
│   │   ├── CVReviewer.jsx           # CV review page
│   │   ├── PersonalStatement.jsx    # Personal statement page
│   │   └── AIInterviewer.jsx        # AI interview page
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── App.jsx                      # Main app component with routing
│   ├── main.jsx                     # App entry point
│   └── index.css                    # Global styles with Tailwind
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
└── package.json                     # Dependencies
```

## How to Use

### For Users

1. **Visit Landing Page**: Browse features, pricing, and testimonials
2. **Sign Up/Login**: Click "Login / Sign Up" button in navbar
3. **Access Dashboard**: View your progress and statistics
4. **Use Tools**:
   - Review your CV
   - Get feedback on personal statements
   - Practice interviews with AI

### For Developers

#### Authentication

The app uses a simple localStorage-based authentication system. To integrate with a real backend:

1. Open `src/context/AuthContext.jsx`
2. Replace the `login` and `signup` functions with API calls:

```javascript
const login = async (email, password) => {
  const response = await fetch('YOUR_API_URL/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const userData = await response.json();
  localStorage.setItem('patheraUser', JSON.stringify(userData));
  setUser(userData);
  return { success: true };
};
```

#### Integrating CV Reviewer from Replit

1. **Get your Replit API endpoint**
2. Open `src/pages/CVReviewer.jsx`
3. Find the `handleReview` function (around line 34)
4. Replace the setTimeout simulation with:

```javascript
const handleReview = async () => {
  if (uploadMethod === 'file' && !cvFile) {
    alert('Please upload a CV file first');
    return;
  }

  setIsReviewing(true);

  try {
    // For file upload
    const formData = new FormData();
    formData.append('cv', cvFile);

    const response = await fetch('YOUR_REPLIT_API_URL/review-cv', {
      method: 'POST',
      body: formData
    });

    const reviewData = await response.json();
    setReview(reviewData);
    updateProgress('cvReviewsCompleted');
  } catch (error) {
    alert('Error reviewing CV: ' + error.message);
  } finally {
    setIsReviewing(false);
  }
};
```

#### Integrating AI Interviewer

1. Open `src/pages/AIInterviewer.jsx`
2. Find the `sendMessage` function (around line 48)
3. Replace with your AI API:

```javascript
const sendMessage = async () => {
  if (!currentMessage.trim()) return;

  const userMessage = {
    sender: 'user',
    text: currentMessage,
    timestamp: new Date(),
  };

  setMessages([...messages, userMessage]);
  setCurrentMessage('');

  try {
    const response = await fetch('YOUR_AI_API_URL/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: currentMessage,
        interviewType: interviewType,
        history: messages
      })
    });

    const data = await response.json();

    setMessages(prev => [...prev, {
      sender: 'ai',
      text: data.response,
      timestamp: new Date(),
    }]);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Integrating Personal Statement Reviewer

1. Open `src/pages/PersonalStatement.jsx`
2. Find the `handleAnalyze` function (around line 14)
3. Replace with your AI API call following the same pattern as above

## Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these values to your brand colors
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
      },
    },
  },
}
```

### Adding New Features

1. Create a new page component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Update the navbar in `src/components/layout/Navbar.jsx`
4. Update progress tracking in `src/context/AuthContext.jsx` if needed

## Features Ready for Implementation

All pages are built with placeholder functionality and clear integration points for:

- ✅ CV Reviewer (Replit integration ready)
- ✅ AI Interviewer (API integration ready)
- ✅ Personal Statement Reviewer (API integration ready)
- ✅ User Authentication (Backend integration ready)
- ✅ Progress Tracking (Database integration ready)

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### Deploy to GitHub Pages

1. Update `vite.config.js`:
```javascript
export default {
  base: '/your-repo-name/',
}
```

2. Build and deploy:
```bash
npm run build
```

## Support

For issues or questions:
1. Check the inline comments in the code
2. Review the integration notes at the bottom of each feature page
3. Check the console for any error messages

## License

MIT License - feel free to use this for your project!

## Next Steps

1. ✅ Website is fully functional and ready to use
2. 🔄 Integrate your Replit CV reviewer
3. 🔄 Build and integrate AI interviewer
4. 🔄 Add backend authentication
5. 🔄 Deploy to production

---

Built with ❤️ for Pathera
