"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePosition = exports.validateService = exports.getClientIdentifier = exports.cleanupRateLimits = exports.checkRateLimit = exports.validateTextWithLimit = exports.validatePhone = exports.validateURL = exports.validateEmail = exports.sanitizeText = exports.INPUT_LIMITS = void 0;
const validator = __importStar(require("validator"));
const auth_1 = require("firebase-functions/v1/auth");
/**
 * Security utility functions for backend validation and sanitization
 */
// Maximum input lengths
exports.INPUT_LIMITS = {
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
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS = 5; // Max 5 requests per hour per IP
/**
 * Sanitize text to prevent XSS and injection attacks
 */
function sanitizeText(input) {
    if (!input)
        return '';
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
exports.sanitizeText = sanitizeText;
/**
 * Validate and sanitize email
 */
function validateEmail(email) {
    if (!email) {
        throw new auth_1.HttpsError('invalid-argument', 'Email is required');
    }
    const sanitized = sanitizeText(email).toLowerCase();
    if (sanitized.length > exports.INPUT_LIMITS.EMAIL) {
        throw new auth_1.HttpsError('invalid-argument', `Email must be less than ${exports.INPUT_LIMITS.EMAIL} characters`);
    }
    if (!validator.isEmail(sanitized)) {
        throw new auth_1.HttpsError('invalid-argument', 'Invalid email format');
    }
    return sanitized;
}
exports.validateEmail = validateEmail;
/**
 * Validate and sanitize URL
 */
function validateURL(url, fieldName, required = false) {
    if (!url) {
        if (required) {
            throw new auth_1.HttpsError('invalid-argument', `${fieldName} is required`);
        }
        return '';
    }
    const sanitized = sanitizeText(url);
    if (sanitized.length > exports.INPUT_LIMITS.URL) {
        throw new auth_1.HttpsError('invalid-argument', `${fieldName} must be less than ${exports.INPUT_LIMITS.URL} characters`);
    }
    if (!validator.isURL(sanitized, {
        protocols: ['http', 'https'],
        require_protocol: true,
    })) {
        throw new auth_1.HttpsError('invalid-argument', `Invalid ${fieldName} format. Must be a valid URL with http:// or https://`);
    }
    return sanitized;
}
exports.validateURL = validateURL;
/**
 * Validate and sanitize phone number
 */
function validatePhone(phone, required = false) {
    if (!phone) {
        if (required) {
            throw new auth_1.HttpsError('invalid-argument', 'Phone number is required');
        }
        return '';
    }
    const sanitized = sanitizeText(phone);
    if (sanitized.length > exports.INPUT_LIMITS.PHONE) {
        throw new auth_1.HttpsError('invalid-argument', `Phone number must be less than ${exports.INPUT_LIMITS.PHONE} characters`);
    }
    // Basic phone validation - allow various formats
    if (!/^[\d\s\-\+\(\)\.]+$/.test(sanitized)) {
        throw new auth_1.HttpsError('invalid-argument', 'Invalid phone number format');
    }
    return sanitized;
}
exports.validatePhone = validatePhone;
/**
 * Validate text with length limit
 */
function validateTextWithLimit(text, limit, fieldName, required = true) {
    if (!text) {
        if (required) {
            throw new auth_1.HttpsError('invalid-argument', `${fieldName} is required`);
        }
        return '';
    }
    const sanitized = sanitizeText(text);
    if (sanitized.length === 0 && required) {
        throw new auth_1.HttpsError('invalid-argument', `${fieldName} is required`);
    }
    if (sanitized.length > limit) {
        throw new auth_1.HttpsError('invalid-argument', `${fieldName} must be less than ${limit} characters`);
    }
    return sanitized;
}
exports.validateTextWithLimit = validateTextWithLimit;
/**
 * Check rate limit based on IP address
 */
function checkRateLimit(identifier) {
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
        throw new auth_1.HttpsError('resource-exhausted', `Too many requests. Please try again after ${resetTime.toLocaleTimeString()}`);
    }
    // Increment counter
    entry.count += 1;
    rateLimitMap.set(identifier, entry);
}
exports.checkRateLimit = checkRateLimit;
/**
 * Clean up old rate limit entries (call periodically)
 */
function cleanupRateLimits() {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now - entry.startTime > RATE_LIMIT_WINDOW) {
            rateLimitMap.delete(key);
        }
    }
}
exports.cleanupRateLimits = cleanupRateLimits;
/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(context) {
    var _a, _b, _c, _d, _e;
    // Try to get IP from various sources
    const ip = ((_a = context.rawRequest) === null || _a === void 0 ? void 0 : _a.ip) ||
        ((_b = context.rawRequest) === null || _b === void 0 ? void 0 : _b.headers['x-forwarded-for']) ||
        ((_d = (_c = context.rawRequest) === null || _c === void 0 ? void 0 : _c.connection) === null || _d === void 0 ? void 0 : _d.remoteAddress) ||
        'unknown';
    // If user is authenticated, use their UID
    if ((_e = context.auth) === null || _e === void 0 ? void 0 : _e.uid) {
        return `user_${context.auth.uid}`;
    }
    return `ip_${ip}`;
}
exports.getClientIdentifier = getClientIdentifier;
/**
 * Validate service type
 */
function validateService(service) {
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
        throw new auth_1.HttpsError('invalid-argument', 'Invalid service type');
    }
    return sanitized;
}
exports.validateService = validateService;
/**
 * Validate position type
 */
function validatePosition(position) {
    const sanitized = sanitizeText(position);
    const validPositions = [
        'developer',
        'designer',
        'analyst',
        'success',
        'other',
    ];
    if (!validPositions.includes(sanitized)) {
        throw new auth_1.HttpsError('invalid-argument', 'Invalid position type');
    }
    return sanitized;
}
exports.validatePosition = validatePosition;
// Cleanup rate limits every 30 minutes
setInterval(cleanupRateLimits, 1800000);
//# sourceMappingURL=security.js.map