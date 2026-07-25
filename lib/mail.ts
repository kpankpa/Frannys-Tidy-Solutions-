import nodemailer from "nodemailer";

export type ContactMailPayload = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  fromName?: string;
};

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
}

export function isMailConfigured() {
  return smtpConfigured();
}

export async function sendContactMail(payload: ContactMailPayload) {
  if (!smtpConfigured()) {
    throw new Error("SMTP is not configured.");
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure =
    process.env.SMTP_SECURE === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const fromAddress =
    process.env.SMTP_FROM?.trim() ||
    process.env.SMTP_USER!.trim();

  const fromName = payload.fromName?.trim() || "Frannys Website";

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
  });
}

export function buildContactMailtoUrl(input: {
  to: string;
  subject: string;
  body: string;
}) {
  const params = new URLSearchParams({
    subject: input.subject,
    body: input.body,
  });
  return `mailto:${input.to}?${params.toString()}`;
}
