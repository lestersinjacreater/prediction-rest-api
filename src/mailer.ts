import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendWelcomeEmail = async (email: string, username: string): Promise<void> => {
  try {
    const templatePath = path.join(__dirname, 'templates', 'welcome-email.ejs');
    const emailHtml = await ejs.renderFile(templatePath, { username });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to HANDS LIMITED',
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendTestimonialThanksEmail = async (email: string, username: string): Promise<void> => {
  try {
    const templatePath = path.join(__dirname, 'templates', 'testimonial-thanks.ejs');
    const emailHtml = await ejs.renderFile(templatePath, { username });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Your Testimonial - HANDS LIMITED',
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log('Testimonial thank you email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending testimonial thank you email:', error);
    throw error;
  }
};

export const sendClientConfirmationEmail = async (email: string, firstname: string, lastname: string): Promise<void> => {
  try {
    const templatePath = path.join(__dirname, 'templates', 'client-confirmation.ejs');
    const emailHtml = await ejs.renderFile(templatePath, { firstname, lastname });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Message Received - HANDS LIMITED',
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log('Client confirmation email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending client confirmation email:', error);
    throw error;
  }
};

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP server connection error:', error);
  } else {
    console.log('SMTP server connection successful');
  }
});