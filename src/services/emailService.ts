import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "email-smtp.eu-north-1.amazonaws.com",
  port: 587,
  secure: false,
  auth: {
    user: "AKIAVEWO74GVYN4MU3X5",
    pass: "BDn/wWYBOvFwAPaxgvs+7rloHryqx3OqW+3+CHXkwMm5",
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
          from: '"No Reply Test" <no-reply@crossnation.com.au>',
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
  const adminEmail = "karmansingharora01@gmail.com";
  
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