import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

// HTTP function for health check
export const health = functions.https.onRequest((request, response) => {
  response.json({
    status: 'OK',
    message: 'StruXture Backend is running',
    timestamp: new Date().toISOString(),
    service: 'Firebase Functions'
  });
});

// HTTP function for main API
export const api = functions.https.onRequest((request, response) => {
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
export const helloWorld = functions.https.onCall((data, context) => {
  return {
    message: `Hello from StruXture! You said: ${data.message || 'nothing'}`,
    timestamp: new Date().toISOString()
  };
});

// Callable function to send job application emails
// Note: CORS is handled automatically by Firebase callable functions
export const sendJobApplication = functions.https.onCall(async (data, context) => {
  try {
    // Validate required fields
    const { fullName, email, phone, position, experience, linkedin, portfolio, coverLetter } = data;
    
    if (!fullName || !email || !position || !coverLetter) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    // Get email credentials from Firebase config or environment variables
    const emailUser = functions.config().email?.user || process.env.EMAIL_USER;
    const emailPass = functions.config().email?.pass || functions.config().email?.password || process.env.EMAIL_PASS;
    const recipientEmail = (functions.config().email?.recipient || process.env.EMAIL_RECIPIENT || emailUser || '').trim();

    if (!emailUser || !emailPass) {
      throw new functions.https.HttpsError('failed-precondition', 'Email credentials not configured');
    }

    // TODO: Replace these with your actual email credentials
    // For Gmail: Use an App Password (not your regular password)
    // Go to: Google Account > Security > 2-Step Verification > App Passwords
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser, // Your email
        pass: emailPass  // Your app password
      }
    });
    const mailOptions = {
      from: emailUser,
      to: recipientEmail, // Where to send applications
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
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send application. Please try again later.');
  }
});

// Callable function to send consultation request emails
// Note: CORS is handled automatically by Firebase callable functions
export const sendConsultation = functions.https.onCall(async (data, context) => {
  try {
    // Validate required fields
    const { name, email, company, phone, service, message } = data;
    
    if (!name || !email || !company || !service || !message) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    // Get email credentials from Firebase config or environment variables
    const emailUser = functions.config().email?.user || process.env.EMAIL_USER;
    const emailPass = functions.config().email?.pass || functions.config().email?.password || process.env.EMAIL_PASS;
    const recipientEmail = (functions.config().email?.recipient || process.env.EMAIL_RECIPIENT || emailUser || '').trim();

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
      to: recipientEmail, // Same email as job applications
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
  } catch (error) {
    console.error('Error sending consultation email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send consultation request. Please try again later.');
  }
}); 