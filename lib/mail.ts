import nodemailer from "nodemailer";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Sends a plain notification to the site owner via Gmail SMTP. Throws if SMTP env vars are missing. */
export async function sendMail(opts: {
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("SMTP_USER / SMTP_PASS are not set");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: pass.replace(/\s/g, "") },
  });

  await transporter.sendMail({
    from: `Portfolio <${user}>`,
    to: process.env.CONTACT_TO_EMAIL ?? user,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
    html: `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(opts.text)}</pre>`,
  });
}
