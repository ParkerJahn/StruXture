import * as validator from 'validator';
import { HttpsError } from 'firebase-functions/v1/auth';

/**
 * Security utility functions for backend validation and sanitization
 */

// Maximum input lengths
export const INPUT_LIMITS = {
  NAME: 100,
  EMAIL: 254,
  COMPANY: 200,
  PHONE: 20,
  URL: 2048,
  MESSAGE: 5000,
  COVER_LETTER: 10000,
  EXPERIENCE: 50,
  POSITION: 100,
};

// Rate limiting: Track by IP or user
interface RateLimitEntry {
  count: number;
  startTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS = 5; // Max 5 requests per hour per IP

/**
 * Sanitize text to prevent XSS and injection attacks
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Escape HTML special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): string {
  if (!email) {
    throw new HttpsError('invalid-argument', 'Email is required');
  }
  
  const sanitized = sanitizeText(email).toLowerCase();
  
  if (sanitized.length > INPUT_LIMITS.EMAIL) {
    throw new HttpsError(
      'invalid-argument',
      `Email must be less than ${INPUT_LIMITS.EMAIL} characters`
    );
  }
  
  if (!validator.isEmail(sanitized)) {
    throw new HttpsError('invalid-argument', 'Invalid email format');
  }
  
  return sanitized;
}

/**
 * Validate and sanitize URL
 */
export function validateURL(url: string, fieldName: string, required: boolean = false): string {
  if (!url) {
    if (required) {
      throw new HttpsError('invalid-argument', `${fieldName} is required`);
    }
    return '';
  }
  
  const sanitized = sanitizeText(url);
  
  if (sanitized.length > INPUT_LIMITS.URL) {
    throw new HttpsError(
      'invalid-argument',
      `${fieldName} must be less than ${INPUT_LIMITS.URL} characters`
    );
  }
  
  if (!validator.isURL(sanitized, {
    protocols: ['http', 'https'],
    require_protocol: true,
  })) {
    throw new HttpsError(
      'invalid-argument',
      `Invalid ${fieldName} format. Must be a valid URL with http:// or https://`
    );
  }
  
  return sanitized;
}

/**
 * Validate and sanitize phone number
 */
export function validatePhone(phone: string, required: boolean = false): string {
  if (!phone) {
    if (required) {
      throw new HttpsError('invalid-argument', 'Phone number is required');
    }
    return '';
  }
  
  const sanitized = sanitizeText(phone);
  
  if (sanitized.length > INPUT_LIMITS.PHONE) {
    throw new HttpsError(
      'invalid-argument',
      `Phone number must be less than ${INPUT_LIMITS.PHONE} characters`
    );
  }
  
  // Basic phone validation - allow various formats
  if (!/^[\d\s\-\+\(\)\.]+$/.test(sanitized)) {
    throw new HttpsError('invalid-argument', 'Invalid phone number format');
  }
  
  return sanitized;
}

/**
 * Validate text with length limit
 */
export function validateTextWithLimit(
  text: string,
  limit: number,
  fieldName: string,
  required: boolean = true
): string {
  if (!text) {
    if (required) {
      throw new HttpsError('invalid-argument', `${fieldName} is required`);
    }
    return '';
  }
  
  const sanitized = sanitizeText(text);
  
  if (sanitized.length === 0 && required) {
    throw new HttpsError('invalid-argument', `${fieldName} is required`);
  }
  
  if (sanitized.length > limit) {
    throw new HttpsError(
      'invalid-argument',
      `${fieldName} must be less than ${limit} characters`
    );
  }
  
  return sanitized;
}

/**
 * Check rate limit based on IP address
 */
export function checkRateLimit(identifier: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry) {
    // First request from this identifier
    rateLimitMap.set(identifier, {
      count: 1,
      startTime: now,
    });
    return;
  }
  
  const timePassed = now - entry.startTime;
  
  // Reset if time window has passed
  if (timePassed > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, {
      count: 1,
      startTime: now,
    });
    return;
  }
  
  // Check if limit exceeded
  if (entry.count >= MAX_REQUESTS) {
    const resetTime = new Date(entry.startTime + RATE_LIMIT_WINDOW);
    throw new HttpsError(
      'resource-exhausted',
      `Too many requests. Please try again after ${resetTime.toLocaleTimeString()}`
    );
  }
  
  // Increment counter
  entry.count += 1;
  rateLimitMap.set(identifier, entry);
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.startTime > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Get client identifier for rate limiting
 */
export function getClientIdentifier(context: any): string {
  // Try to get IP from various sources
  const ip = context.rawRequest?.ip || 
             context.rawRequest?.headers['x-forwarded-for'] ||
             context.rawRequest?.connection?.remoteAddress ||
             'unknown';
  
  // If user is authenticated, use their UID
  if (context.auth?.uid) {
    return `user_${context.auth.uid}`;
  }
  
  return `ip_${ip}`;
}

/**
 * Validate service type
 */
export function validateService(service: string): string {
  const sanitized = sanitizeText(service);
  
  const validServices = [
    'data-analytics',
    'business-intelligence',
    'cloud-infrastructure',
    'workflow-automation',
    'custom',
    'consultation',
  ];
  
  if (!validServices.includes(sanitized)) {
    throw new HttpsError('invalid-argument', 'Invalid service type');
  }
  
  return sanitized;
}

/**
 * Validate position type
 */
export function validatePosition(position: string): string {
  const sanitized = sanitizeText(position);
  
  const validPositions = [
    'developer',
    'designer',
    'analyst',
    'success',
    'other',
  ];
  
  if (!validPositions.includes(sanitized)) {
    throw new HttpsError('invalid-argument', 'Invalid position type');
  }
  
  return sanitized;
}

// Cleanup rate limits every 30 minutes
setInterval(cleanupRateLimits, 1800000);

