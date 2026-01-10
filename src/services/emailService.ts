import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailQueue {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

const emailQueue: EmailQueue[] = [];
let isProcessing = false;

const processEmailQueue = async () => {
  if (isProcessing || emailQueue.length === 0) return;
  
  console.log(`Starting email queue processing. Queue length: ${emailQueue.length}`);
  isProcessing = true;
  
  while (emailQueue.length > 0) {
    const email = emailQueue.shift();
    if (email) {
      try {
        console.log(`Attempting to send email to: ${email.to}`);
        await transporter.sendMail({
          from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
          to: email.to,
          subject: email.subject,
          html: email.html,
          attachments: email.attachments || []
        });
        console.log(`✅ Email sent successfully to: ${email.to}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${email.to}:`, error);
      }
      
      // Wait 2 seconds before next email
      console.log('Waiting 2 seconds before next email...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('Email queue processing completed');
  isProcessing = false;
};

export const sendJobApplicationNotification = async (
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  companyName: string,
  resumePath?: string,
  companyEmail?: string
) => {
  console.log('Queuing job application notifications...');
  const adminEmail = process.env.ADMIN_EMAIL || "karmansingharora01@gmail.com";
  
  const emailContent = `
    <h2>New Job Application Received</h2>
    <p><strong>Applicant:</strong> ${applicantName}</p>
    <p><strong>Email:</strong> ${applicantEmail}</p>
    <p><strong>Job Title:</strong> ${jobTitle}</p>
    <p><strong>Company:</strong> ${companyName}</p>
    <p><strong>Applied At:</strong> ${new Date().toLocaleString()}</p>
  `;

  const attachments = resumePath ? [{
    filename: `${applicantName}_Resume.pdf`,
    path: `./uploads/${resumePath.split('/').pop()}`
  }] : [];

  // Add admin notification to queue
  emailQueue.push({
    to: adminEmail,
    subject: `New Application: ${jobTitle} at ${companyName}`,
    html: emailContent,
    attachments
  });
  console.log(`Admin notification queued for: ${adminEmail}`);

  // Add company HR notification to queue if email exists
  if (companyEmail) {
    emailQueue.push({
      to: companyEmail,
      subject: `New Application for ${jobTitle}`,
      html: emailContent,
      attachments
    });
    console.log(`Company notification queued for: ${companyEmail}`);
  } else {
    console.log('No company email provided, skipping company notification');
  }

  // Start processing queue
  processEmailQueue();
};

export const sendCandidateWelcomeEmail = async (
  candidateEmail: string,
  candidateName: string
) => {
  console.log('Queuing candidate welcome email...');
  const welcomeContent = `
    <h2>Welcome to CrossNations Job Portal!</h2>
    <p>Dear ${candidateName},</p>
    <p>Thank you for registering with CrossNations Job Portal. Your profile has been created successfully.</p>
    <p>You can now browse and apply for jobs that match your skills and preferences.</p>
    <p>Best regards,<br>CrossNations Job Portal Team</p>
  `;

  emailQueue.push({
    to: candidateEmail,
    subject: 'Welcome to CrossNations Job Portal',
    html: welcomeContent
  });
  console.log(`Welcome email queued for candidate: ${candidateEmail}`);

  processEmailQueue();
};

export const sendJobCreationNotification = async (
  jobTitle: string,
  companyName: string,
  companyEmail?: string
) => {
  console.log('Queuing job creation notifications...');
  const adminEmail = process.env.ADMIN_EMAIL || "karmansingharora01@gmail.com";
  
  const emailContent = `
    <h2>New Job Posted</h2>
    <p><strong>Job Title:</strong> ${jobTitle}</p>
    <p><strong>Company:</strong> ${companyName}</p>
    <p><strong>Posted At:</strong> ${new Date().toLocaleString()}</p>
  `;

  // Notify admin
  emailQueue.push({
    to: adminEmail,
    subject: `New Job Posted: ${jobTitle}`,
    html: emailContent
  });
  console.log(`Job creation notification queued for admin: ${adminEmail}`);

  // Notify company if email exists
  if (companyEmail) {
    emailQueue.push({
      to: companyEmail,
      subject: `Job Posted Successfully: ${jobTitle}`,
      html: `
        <h2>Job Posted Successfully</h2>
        <p>Your job posting for <strong>${jobTitle}</strong> has been published on CrossNations Job Portal.</p>
        <p>You will receive notifications when candidates apply for this position.</p>
        <p>Best regards,<br>CrossNations Job Portal Team</p>
      `
    });
    console.log(`Job creation confirmation queued for company: ${companyEmail}`);
  }

  processEmailQueue();
};

export const sendApplicationConfirmation = async (
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  companyName: string
) => {
  console.log('Queuing application confirmation email...');
  const confirmationContent = `
    <h2>Application Submitted Successfully</h2>
    <p>Dear ${applicantName},</p>
    <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
    <p>We have received your application and will review it shortly. You will be contacted if your profile matches our requirements.</p>
    <p>Best regards,<br>CrossNations Job Portal Team</p>
  `;

  emailQueue.push({
    to: applicantEmail,
    subject: `Application Confirmation: ${jobTitle}`,
    html: confirmationContent
  });
  console.log(`Confirmation email queued for applicant: ${applicantEmail}`);

  processEmailQueue();
};