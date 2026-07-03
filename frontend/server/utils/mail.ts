import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

interface MailAttachment {
  filename: string
  path: string
  cid?: string
}

interface MailOptions {
  to: string
  subject: string
  text: string
  html: string
  attachments?: MailAttachment[]
}

interface OfficialEmailParams {
  preheader: string
  title: string
  greeting?: string
  intro: string
  body?: string[]
  ctaLabel?: string
  ctaUrl?: string
  notice?: string
  closing?: string
}

const BRAND = {
  name: 'TraderVote',
  tagline: 'Trusted by Traders. Driven by Votes.',
  supportEmail: process.env.SMTP_REPLY_TO || 'support@tradervote.com',
  siteUrl: (process.env.NUXT_PUBLIC_SITE_URL || 'https://tradervote.com').replace(/\/$/, ''),
}

function smtpConfig(): SMTPTransport.Options {
  return {
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
  }
}

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD)
}

export async function sendMail(options: MailOptions) {
  if (!isMailConfigured()) {
    console.warn('[mail] SMTP credentials are missing; email skipped:', options.subject)
    return { skipped: true }
  }

  const transporter = nodemailer.createTransport(smtpConfig())

  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  })
}

export async function sendVerificationEmail(params: { to: string; name: string; verifyUrl: string }) {
  return sendOfficialMail({
    to: params.to,
    subject: 'Verify your TraderVote email',
    content: {
      preheader: 'Confirm your email address to finish setting up your TraderVote account.',
      title: 'Verify your email address',
      greeting: `Hi ${params.name},`,
      intro: 'Welcome to TraderVote. Please confirm this email address so we can protect your account and keep your reviews connected to the right profile.',
      body: [
        'This verification link is valid for 24 hours.',
        'After verification, you can sign in, submit broker reviews, and manage your account securely.',
      ],
      ctaLabel: 'Verify email',
      ctaUrl: params.verifyUrl,
      notice: 'If you did not create a TraderVote account, you can safely ignore this email.',
      closing: 'Thank you for helping build a more transparent trading community.',
    },
  })
}

export async function sendPasswordResetEmail(params: { to: string; name: string; resetUrl: string }) {
  return sendOfficialMail({
    to: params.to,
    subject: 'Reset your TraderVote password',
    content: {
      preheader: 'Use this secure link to reset your TraderVote password.',
      title: 'Reset your password',
      greeting: `Hi ${params.name},`,
      intro: 'We received a request to reset the password for your TraderVote account.',
      body: [
        'Use the button below to create a new password. For your security, this link is valid for 60 minutes and can only be used once.',
        'If you did not request this change, your current password will remain unchanged.',
      ],
      ctaLabel: 'Reset password',
      ctaUrl: params.resetUrl,
      notice: 'For account security, never forward this email or share the reset link with anyone.',
      closing: 'TraderVote Support',
    },
  })
}

export async function sendMailTestEmail(params: { to: string; name?: string }) {
  return sendOfficialMail({
    to: params.to,
    subject: 'TraderVote official email test',
    content: {
      preheader: 'This confirms that TraderVote official email delivery is working.',
      title: 'Official email test',
      greeting: `Hi ${params.name || 'there'},`,
      intro: 'This is a test message from the TraderVote website email system.',
      body: [
        'If you received this message, SMTP delivery, sender identity, reply-to address, and the official email template are working correctly.',
      ],
      ctaLabel: 'Open TraderVote',
      ctaUrl: BRAND.siteUrl,
      notice: 'No action is required. This message was sent by an administrator for configuration testing.',
      closing: 'TraderVote System',
    },
  })
}

async function sendOfficialMail(params: { to: string; subject: string; content: OfficialEmailParams }) {
  const rendered = renderOfficialEmail(params.content)
  return sendMail({
    to: params.to,
    subject: params.subject,
    text: rendered.text,
    html: rendered.html,
    attachments: officialMailAttachments(),
  })
}

function renderOfficialEmail(params: OfficialEmailParams) {
  const ctaBlock = params.ctaLabel && params.ctaUrl
    ? `
      <tr>
        <td style="padding:26px 0 10px;">
          <a href="${escapeAttribute(params.ctaUrl)}" style="display:inline-block;background:#12b8a6;color:#ffffff;font-size:15px;font-weight:700;line-height:20px;text-decoration:none;padding:13px 22px;border-radius:8px;">
            ${escapeHtml(params.ctaLabel)}
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0 0;color:#64748b;font-size:13px;line-height:20px;">
          If the button does not work, copy and paste this link into your browser:<br>
          <a href="${escapeAttribute(params.ctaUrl)}" style="color:#0f766e;word-break:break-all;">${escapeHtml(params.ctaUrl)}</a>
        </td>
      </tr>
    `
    : ''

  const body = (params.body || [])
    .map((line) => `<p style="margin:16px 0 0;color:#334155;font-size:15px;line-height:24px;">${escapeHtml(line)}</p>`)
    .join('')

  const notice = params.notice
    ? `
      <tr>
        <td style="padding-top:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
            <tr>
              <td style="padding:14px 16px;color:#475569;font-size:13px;line-height:20px;">
                ${escapeHtml(params.notice)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    : ''

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(params.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#eef4f6;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(params.preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef4f6;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #dbe5ea;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#071013;padding:24px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <img src="cid:tradervote-logo" width="150" alt="TraderVote" style="display:block;max-width:150px;height:auto;border:0;">
                      <div style="margin-top:8px;color:#91a3ad;font-size:12px;line-height:18px;">${escapeHtml(BRAND.tagline)}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px 28px;">
                <h1 style="margin:0;color:#0f172a;font-size:26px;line-height:32px;font-weight:800;">${escapeHtml(params.title)}</h1>
                <p style="margin:20px 0 0;color:#334155;font-size:15px;line-height:24px;">${escapeHtml(params.greeting || 'Hi,')}</p>
                <p style="margin:12px 0 0;color:#334155;font-size:15px;line-height:24px;">${escapeHtml(params.intro)}</p>
                ${body}
                <table role="presentation" cellspacing="0" cellpadding="0">
                  ${ctaBlock}
                </table>
                ${notice}
                <p style="margin:24px 0 0;color:#334155;font-size:15px;line-height:24px;">${escapeHtml(params.closing || 'TraderVote Team')}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:19px;">
                <strong style="color:#334155;">${escapeHtml(BRAND.name)}</strong><br>
                Official website: <a href="${escapeAttribute(BRAND.siteUrl)}" style="color:#0f766e;text-decoration:none;">${escapeHtml(BRAND.siteUrl)}</a><br>
                Support: <a href="mailto:${escapeAttribute(BRAND.supportEmail)}" style="color:#0f766e;text-decoration:none;">${escapeHtml(BRAND.supportEmail)}</a><br>
                This is an automated service email related to your TraderVote account.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const textParts = [
    BRAND.name,
    BRAND.tagline,
    '',
    params.title,
    '',
    params.greeting || 'Hi,',
    params.intro,
    ...(params.body || []),
    params.ctaUrl ? `Link: ${params.ctaUrl}` : '',
    params.notice || '',
    params.closing || 'TraderVote Team',
    '',
    `Official website: ${BRAND.siteUrl}`,
    `Support: ${BRAND.supportEmail}`,
  ].filter(Boolean)

  return { html, text: textParts.join('\n') }
}

function officialMailAttachments(): MailAttachment[] {
  const logoPath = resolve(process.cwd(), 'public/images/brand/TV_full_color.svg')
  if (!existsSync(logoPath)) return []
  return [{ filename: 'tradervote-logo.svg', path: logoPath, cid: 'tradervote-logo' }]
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, '&#096;')
}
