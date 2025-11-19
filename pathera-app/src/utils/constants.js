// Constants for the application
export const APP_NAME = 'Pathera';

// Progress types for tracking user activities
export const PROGRESS_TYPES = {
  CV_REVIEWS: 'cvReviewsCompleted',
  INTERVIEWS: 'interviewsCompleted',
  PERSONAL_STATEMENTS: 'personalStatementsReviewed',
};

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${6} characters`,
  NAME_TOO_SHORT: `Name must be at least ${2} characters`,
  AUTH_FAILED: 'Authentication failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CV_REVIEWER: '/cv-reviewer',
  PERSONAL_STATEMENT: '/personal-statement',
  AI_INTERVIEWER: '/ai-interviewer',
  WORK_EXPERIENCE: '/work-experience',
};

// Work opportunity types
export const WORK_TYPES = {
  INTERNSHIP: 'internship',
  PART_TIME: 'part-time',
  FULL_TIME: 'full-time',
};

// Application status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

// Stripe configuration
export const STRIPE = {
  PRODUCT_ID: 'prod_TS7DQfPgsw963w',
  PRICE_ID_MONTHLY: 'prod_TS7DQfPgsw963w',
};

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'premium',
  ENTERPRISE: 'enterprise',
};
