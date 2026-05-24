import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendMonthlyDueNotification(params: {
    to: string;
    memberName: string;
    memberNumber: string;
    dueAmount: number;
    dueDate: string;
    month: string;
    year: number;
  }) {
    const { to, memberName, memberNumber, dueAmount, month, year } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
    .header { background: #4f46e5; padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: #c7d2fe; margin: 8px 0 0; }
    .body { padding: 32px; }
    .greeting { font-size: 18px; color: #1f2937; margin-bottom: 16px; }
    .amount-box { background: #f0f9ff; border: 2px solid #4f46e5; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .amount-label { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
    .amount-value { color: #4f46e5; font-size: 36px; font-weight: bold; }
    .details { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6b7280; font-size: 14px; }
    .detail-value { color: #1f2937; font-size: 14px; font-weight: 600; }
    .footer { background: #f9fafb; padding: 24px; text-align: center; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Market Boys Shomiti</h1>
      <p>মাসিক চাঁদার বিজ্ঞপ্তি</p>
    </div>
    <div class="body">
      <p class="greeting">প্রিয় ${memberName},</p>
      <p style="color:#4b5563;">আপনার ${month} ${year} মাসের মাসিক চাঁদার বিজ্ঞপ্তি নিচে দেওয়া হলো।</p>
      <div class="amount-box">
        <div class="amount-label">প্রদেয় চাঁদার পরিমাণ</div>
        <div class="amount-value">৳ ${dueAmount.toLocaleString('en-IN')}</div>
      </div>
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">সদস্য নম্বর</span>
          <span class="detail-value">${memberNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">মাস</span>
          <span class="detail-value">${month} ${year}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">শেষ তারিখ</span>
          <span class="detail-value">${new Date(params.dueDate).toLocaleDateString('en-BD')}</span>
        </div>
      </div>
      <p style="color:#4b5563; font-size:14px;">অনুগ্রহ করে নির্ধারিত সময়ের মধ্যে চাঁদা পরিশোধ করুন। যেকোনো সমস্যায় Admin-এর সাথে যোগাযোগ করুন।</p>
    </div>
    <div class="footer">
      <p>Market Boys Shomiti | সমিতি ম্যানেজমেন্ট সিস্টেম</p>
      <p>এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।</p>
    </div>
  </div>
</body>
</html>`;

    try {
      await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to,
        subject: `Market Boys Shomiti — ${month} ${year} মাসিক চাঁদার বিজ্ঞপ্তি`,
        html,
      });
      this.logger.log(`Due notification sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
    }
  }

  async sendDepositConfirmation(params: {
    to: string;
    memberName: string;
    memberNumber: string;
    amount: number;
    date: string;
    description?: string;
  }) {
    const { to, memberName, memberNumber, amount, date, description } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
    .header { background: #059669; padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: #a7f3d0; margin: 8px 0 0; }
    .body { padding: 32px; }
    .amount-box { background: #f0fdf4; border: 2px solid #059669; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .amount-value { color: #059669; font-size: 36px; font-weight: bold; }
    .details { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6b7280; font-size: 14px; }
    .detail-value { color: #1f2937; font-size: 14px; font-weight: 600; }
    .footer { background: #f9fafb; padding: 24px; text-align: center; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Market Boys Shomiti</h1>
      <p>জমা নিশ্চিতকরণ</p>
    </div>
    <div class="body">
      <p style="font-size:18px; color:#1f2937;">প্রিয় ${memberName},</p>
      <p style="color:#4b5563;">আপনার নিম্নলিখিত জমা সফলভাবে রেকর্ড করা হয়েছে।</p>
      <div class="amount-box">
        <div style="color:#6b7280; font-size:14px; margin-bottom:8px;">জমার পরিমাণ</div>
        <div class="amount-value">৳ ${amount.toLocaleString('en-IN')}</div>
      </div>
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">সদস্য নম্বর</span>
          <span class="detail-value">${memberNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">তারিখ</span>
          <span class="detail-value">${new Date(date).toLocaleDateString('en-BD')}</span>
        </div>
        ${description ? `<div class="detail-row"><span class="detail-label">বিবরণ</span><span class="detail-value">${description}</span></div>` : ''}
      </div>
    </div>
    <div class="footer">
      <p>Market Boys Shomiti | সমিতি ম্যানেজমেন্ট সিস্টেম</p>
      <p>এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।</p>
    </div>
  </div>
</body>
</html>`;

    try {
      await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to,
        subject: `Market Boys Shomiti — জমা নিশ্চিতকরণ ৳ ${amount.toLocaleString('en-IN')}`,
        html,
      });
      this.logger.log(`Deposit confirmation sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send deposit confirmation to ${to}:`, error);
    }
  }

  async sendWelcomeEmail(params: {
    to: string;
    memberName: string;
    memberNumber: string;
    email: string;
    password: string;
    loginUrl: string;
  }) {
    const { to, memberName, memberNumber, email, password, loginUrl } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
    .header { background: #4f46e5; padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: #c7d2fe; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .welcome { font-size: 20px; color: #1f2937; font-weight: bold; margin-bottom: 8px; }
    .subtitle { color: #6b7280; margin-bottom: 24px; font-size: 14px; }
    .credentials-box { background: #f0f9ff; border: 2px solid #4f46e5; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .credentials-title { color: #4f46e5; font-weight: bold; font-size: 14px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
    .credential-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e0e7ff; }
    .credential-row:last-child { border-bottom: none; }
    .credential-label { color: #6b7280; font-size: 14px; }
    .credential-value { color: #1f2937; font-size: 14px; font-weight: bold; font-family: monospace; background: #e0e7ff; padding: 4px 10px; border-radius: 6px; }
    .login-btn { display: block; background: #4f46e5; color: white; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 24px 0; }
    .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .warning p { color: #92400e; font-size: 13px; margin: 0; }
    .footer { background: #f9fafb; padding: 24px; text-align: center; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Market Boys Shomiti</h1>
      <p>সমিতি ম্যানেজমেন্ট সিস্টেম — স্বাগতম!</p>
    </div>
    <div class="body">
      <div class="welcome">স্বাগতম, ${memberName}!</div>
      <div class="subtitle">আপনার Market Boys Shomiti অ্যাকাউন্ট তৈরি করা হয়েছে। নিচের তথ্য দিয়ে লগইন করুন।</div>
      
      <div class="credentials-box">
        <div class="credentials-title">🔐 লগইন তথ্য</div>
        <div class="credential-row">
          <span class="credential-label">ওয়েবসাইট</span>
          <span class="credential-value">${loginUrl}</span>
        </div>
        <div class="credential-row">
          <span class="credential-label">ইমেইল</span>
          <span class="credential-value">${email}</span>
        </div>
        <div class="credential-row">
          <span class="credential-label">পাসওয়ার্ড</span>
          <span class="credential-value">${password}</span>
        </div>
        <div class="credential-row">
          <span class="credential-label">সদস্য নম্বর</span>
          <span class="credential-value">${memberNumber}</span>
        </div>
      </div>

      <a href="${loginUrl}" class="login-btn">এখনই লগইন করুন →</a>

      <div class="warning">
        <p>⚠️ <strong>গুরুত্বপূর্ণ:</strong> প্রথম লগইনের পর অবশ্যই আপনার পাসওয়ার্ড পরিবর্তন করুন। এই ইমেইলটি নিরাপদ স্থানে সংরক্ষণ করুন।</p>
      </div>
    </div>
    <div class="footer">
      <p>Market Boys Shomiti | সমিতি ম্যানেজমেন্ট সিস্টেম</p>
      <p>এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।</p>
    </div>
  </div>
</body>
</html>`;

    try {
      this.logger.log(`Resend API key present: ${!!process.env.RESEND_API_KEY}`);
      this.logger.log(`Sending welcome email from: ${process.env.EMAIL_FROM}`);
      await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to,
        subject: `Market Boys Shomiti — আপনার অ্যাকাউন্ট তৈরি হয়েছে`,
        html,
      });
      this.logger.log(`Welcome email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}:`, error);
    }
  }
}
