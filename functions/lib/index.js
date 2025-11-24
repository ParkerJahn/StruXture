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
exports.sendConsultation = exports.sendJobApplication = exports.helloWorld = exports.api = exports.health = void 0;
const functions = __importStar(require("firebase-functions"));
const nodemailer = __importStar(require("nodemailer"));
const security_1 = require("./security");
// HTTP function for health check
exports.health = functions.https.onRequest((request, response) => {
    response.json({
        status: 'OK',
        message: 'StruXture Backend is running',
        timestamp: new Date().toISOString(),
        service: 'Firebase Functions'
    });
});
// HTTP function for main API
exports.api = functions.https.onRequest((request, response) => {
    response.json({
        message: 'Welcome to StruXture API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api'
        }
    });
});
// Callable function example
exports.helloWorld = functions.https.onCall((data, context) => {
    return {
        message: `Hello from StruXture! You said: ${data.message || 'nothing'}`,
        timestamp: new Date().toISOString()
    };
});
// Callable function to send job application emails
// Note: CORS is handled automatically by Firebase callable functions
exports.sendJobApplication = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d;
    try {
        // Rate limiting check
        const clientId = (0, security_1.getClientIdentifier)(context);
        (0, security_1.checkRateLimit)(clientId);
        // Validate and sanitize all inputs
        const fullName = (0, security_1.validateTextWithLimit)(data.fullName, security_1.INPUT_LIMITS.NAME, 'Full Name', true);
        const email = (0, security_1.validateEmail)(data.email);
        const phone = (0, security_1.validatePhone)(data.phone, false);
        const position = (0, security_1.validatePosition)(data.position);
        const experience = (0, security_1.validateTextWithLimit)(data.experience, security_1.INPUT_LIMITS.EXPERIENCE, 'Experience', false);
        const linkedin = (0, security_1.validateURL)(data.linkedin, 'LinkedIn', false);
        const portfolio = (0, security_1.validateURL)(data.portfolio, 'Portfolio', false);
        const coverLetter = (0, security_1.validateTextWithLimit)(data.coverLetter, security_1.INPUT_LIMITS.COVER_LETTER, 'Cover Letter', true);
        // Get email credentials from Firebase config or environment variables
        const emailUser = ((_a = functions.config().email) === null || _a === void 0 ? void 0 : _a.user) || process.env.EMAIL_USER;
        const emailPass = ((_b = functions.config().email) === null || _b === void 0 ? void 0 : _b.pass) || ((_c = functions.config().email) === null || _c === void 0 ? void 0 : _c.password) || process.env.EMAIL_PASS;
        const recipientEmail = (((_d = functions.config().email) === null || _d === void 0 ? void 0 : _d.recipient) || process.env.EMAIL_RECIPIENT || emailUser || '').trim();
        if (!emailUser || !emailPass) {
            throw new functions.https.HttpsError('failed-precondition', 'Email credentials not configured');
        }
        // TODO: Replace these with your actual email credentials
        // For Gmail: Use an App Password (not your regular password)
        // Go to: Google Account > Security > 2-Step Verification > App Passwords
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass // Your app password
            }
        });
        const mailOptions = {
            from: emailUser,
            to: recipientEmail,
            subject: `New Job Application: ${position} - ${fullName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">New Job Application Received</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Applicant Information</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Position:</strong> ${position}</p>
            <p><strong>Experience:</strong> ${experience || 'Not provided'}</p>
            ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>` : ''}
            ${portfolio ? `<p><strong>Portfolio:</strong> <a href="${portfolio}">${portfolio}</a></p>` : ''}
          </div>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Cover Letter</h3>
            <p style="white-space: pre-wrap;">${coverLetter}</p>
          </div>

          <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
            This application was submitted via the StruXture careers page on ${new Date().toLocaleString()}.
          </p>
        </div>
      `
        };
        // Send email
        await transporter.sendMail(mailOptions);
        return {
            success: true,
            message: 'Application submitted successfully!'
        };
    }
    catch (error) {
        console.error('Error sending email:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to send application. Please try again later.');
    }
});
// Callable function to send consultation request emails
// Note: CORS is handled automatically by Firebase callable functions
exports.sendConsultation = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d;
    try {
        // Rate limiting check
        const clientId = (0, security_1.getClientIdentifier)(context);
        (0, security_1.checkRateLimit)(clientId);
        // Validate and sanitize all inputs
        const name = (0, security_1.validateTextWithLimit)(data.name, security_1.INPUT_LIMITS.NAME, 'Name', true);
        const email = (0, security_1.validateEmail)(data.email);
        const company = (0, security_1.validateTextWithLimit)(data.company, security_1.INPUT_LIMITS.COMPANY, 'Company', true);
        const phone = (0, security_1.validatePhone)(data.phone, false);
        const service = (0, security_1.validateService)(data.service);
        const message = (0, security_1.validateTextWithLimit)(data.message, security_1.INPUT_LIMITS.MESSAGE, 'Message', true);
        // Get email credentials from Firebase config or environment variables
        const emailUser = ((_a = functions.config().email) === null || _a === void 0 ? void 0 : _a.user) || process.env.EMAIL_USER;
        const emailPass = ((_b = functions.config().email) === null || _b === void 0 ? void 0 : _b.pass) || ((_c = functions.config().email) === null || _c === void 0 ? void 0 : _c.password) || process.env.EMAIL_PASS;
        const recipientEmail = (((_d = functions.config().email) === null || _d === void 0 ? void 0 : _d.recipient) || process.env.EMAIL_RECIPIENT || emailUser || '').trim();
        if (!emailUser || !emailPass) {
            throw new functions.https.HttpsError('failed-precondition', 'Email credentials not configured');
        }
        // Use the same transporter configuration as job applications
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });
        const mailOptions = {
            from: emailUser,
            to: recipientEmail,
            subject: `New Consultation Request: ${service} - ${company}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">New Consultation Request Received</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Service Interested In:</strong> ${service}</p>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Project Description</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
            This consultation request was submitted via the StruXture Get Started page on ${new Date().toLocaleString()}.
          </p>
        </div>
      `
        };
        // Send email
        await transporter.sendMail(mailOptions);
        return {
            success: true,
            message: 'Consultation request submitted successfully!'
        };
    }
    catch (error) {
        console.error('Error sending consultation email:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to send consultation request. Please try again later.');
    }
});
//# sourceMappingURL=index.js.map