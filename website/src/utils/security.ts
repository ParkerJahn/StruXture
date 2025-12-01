import validator from 'validator';

/**
 * Security utility functions for input sanitization and validation
 */

// Maximum input lengths to prevent abuse
export const INPUT_LIMITS = {
  NAME: 100,
  EMAIL: 254, // RFC 5321
  COMPANY: 200,
  PHONE: 20,
  URL: 2048,
  MESSAGE: 5000,
  COVER_LETTER: 10000,
  EXPERIENCE: 50,
  POSITION: 100,
};

// Rate limiting configuration
export const RATE_LIMIT = {
  MAX_SUBMISSIONS: 3, // Max submissions per time window
  TIME_WINDOW: 3600000, // 1 hour in milliseconds
  STORAGE_KEY: 'form_submissions',
};

/**
 * Sanitize text input to prevent XSS attacks
 * Uses a comprehensive regex-based approach for client and server
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove potentially dangerous characters
  sanitized = sanitized
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .trim();
  
  return sanitized;
}

/**
 * Sanitize and validate email
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  const sanitized = sanitizeText(email).toLowerCase();
  
  if (!validator.isEmail(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  // Check length
  if (sanitized.length > INPUT_LIMITS.EMAIL) {
    throw new Error(`Email must be less than ${INPUT_LIMITS.EMAIL} characters`);
  }
  
  return sanitized;
}

/**
 * Sanitize and validate URL
 */
export function sanitizeURL(url: string, required: boolean = false): string {
  if (!url) {
    if (required) throw new Error('URL is required');
    return '';
  }
  
  const sanitized = sanitizeText(url);
  
  if (!validator.isURL(sanitized, { 
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
  })) {
    throw new Error('Invalid URL format. Must include http:// or https://');
  }
  
  if (sanitized.length > INPUT_LIMITS.URL) {
    throw new Error(`URL must be less than ${INPUT_LIMITS.URL} characters`);
  }
  
  return sanitized;
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string, required: boolean = false): string {
  if (!phone) {
    if (required) throw new Error('Phone number is required');
    return '';
  }
  
  const sanitized = sanitizeText(phone);
  
  // Allow various phone formats
  if (!validator.isMobilePhone(sanitized, 'any', { strictMode: false })) {
    // If not a valid mobile phone, check if it's at least numeric with allowed characters
    if (!/^[\d\s\-\+\(\)\.]+$/.test(sanitized)) {
      throw new Error('Invalid phone number format');
    }
  }
  
  if (sanitized.length > INPUT_LIMITS.PHONE) {
    throw new Error(`Phone number must be less than ${INPUT_LIMITS.PHONE} characters`);
  }
  
  return sanitized;
}

/**
 * Sanitize text with length limit
 */
export function sanitizeTextWithLimit(text: string, limit: number, fieldName: string): string {
  if (!text) return '';
  
  const sanitized = sanitizeText(text);
  
  if (sanitized.length > limit) {
    throw new Error(`${fieldName} must be less than ${limit} characters`);
  }
  
  return sanitized;
}

/**
 * Check rate limiting for form submissions
 */
export function checkRateLimit(): { allowed: boolean; remaining: number; resetTime: Date } {
  if (typeof window === 'undefined') {
    return { allowed: true, remaining: RATE_LIMIT.MAX_SUBMISSIONS, resetTime: new Date() };
  }
  
  try {
    const storageKey = RATE_LIMIT.STORAGE_KEY;
    const stored = localStorage.getItem(storageKey);
    const now = Date.now();
    
    if (!stored) {
      // First submission
      const data = {
        count: 1,
        startTime: now,
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
      return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_SUBMISSIONS - 1,
        resetTime: new Date(now + RATE_LIMIT.TIME_WINDOW),
      };
    }
    
    const data = JSON.parse(stored);
    const timePassed = now - data.startTime;
    
    // Reset if time window has passed
    if (timePassed > RATE_LIMIT.TIME_WINDOW) {
      const newData = {
        count: 1,
        startTime: now,
      };
      localStorage.setItem(storageKey, JSON.stringify(newData));
      return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_SUBMISSIONS - 1,
        resetTime: new Date(now + RATE_LIMIT.TIME_WINDOW),
      };
    }
    
    // Check if limit exceeded
    if (data.count >= RATE_LIMIT.MAX_SUBMISSIONS) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(data.startTime + RATE_LIMIT.TIME_WINDOW),
      };
    }
    
    // Increment counter
    data.count += 1;
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    return {
      allowed: true,
      remaining: RATE_LIMIT.MAX_SUBMISSIONS - data.count,
      resetTime: new Date(data.startTime + RATE_LIMIT.TIME_WINDOW),
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow submission if there's an error (fail open)
    return { allowed: true, remaining: RATE_LIMIT.MAX_SUBMISSIONS, resetTime: new Date() };
  }
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size must be less than 5MB',
    };
  }
  
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File must be PDF, DOC, or DOCX format',
    };
  }
  
  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'File must have .pdf, .doc, or .docx extension',
    };
  }
  
  return { valid: true };
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

