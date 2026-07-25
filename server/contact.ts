"use server";

import { getSiteConfig } from "@/lib/db/settings";
import {
  buildContactMailtoUrl,
  isMailConfigured,
  sendContactMail,
} from "@/lib/mail";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { normalizeGhanaPhone } from "@/lib/phone";
import {
  clampText,
  isHoneypotFilled,
  LIMITS,
} from "@/lib/validation";

export type ContactMailInput = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  location?: string;
  message: string;
  website?: string;
};

export type SendContactState =
  | { ok: true; mode: "smtp" }
  | { ok: true; mode: "mailto"; mailtoUrl: string }
  | { ok: false; error: string };

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendContactEmailAction(
  input: ContactMailInput,
): Promise<SendContactState> {
  const ip = await getClientIp();

  const ipLimit = rateLimit({
    key: `contact-mail:ip:${ip}`,
    limit: 6,
    windowMs: 15 * 60 * 1000,
  });
  if (!ipLimit.ok) {
    return { ok: false, error: rateLimitMessage(ipLimit.retryAfterSec) };
  }

  if (isHoneypotFilled(input.website)) {
    return { ok: false, error: "Could not send your message." };
  }

  const name = clampText(input.name, LIMITS.name);
  const email = clampText(input.email, 120).toLowerCase();
  const phoneRaw = clampText(input.phone ?? "", LIMITS.phone);
  const phone = phoneRaw
    ? normalizeGhanaPhone(phoneRaw) ?? phoneRaw.replace(/[\s\-()+/]/g, "")
    : "";
  const subject = clampText(input.subject, LIMITS.serviceType);
  const location = clampText(input.location ?? "", LIMITS.location);
  const message = clampText(input.message, LIMITS.message);

  if (!name || !email || !subject || !message) {
    return {
      ok: false,
      error: "Name, email, subject, and message are required.",
    };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const emailLimit = rateLimit({
    key: `contact-mail:email:${email}`,
    limit: 4,
    windowMs: 60 * 60 * 1000,
  });
  if (!emailLimit.ok) {
    return { ok: false, error: rateLimitMessage(emailLimit.retryAfterSec) };
  }

  try {
    const site = await getSiteConfig();
    const to = (process.env.CONTACT_TO_EMAIL?.trim() || site.email).trim();

    const text = [
      `New website enquiry for ${site.name}`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Subject: ${subject}`,
      location ? `Location: ${location}` : null,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailSubject = `[${site.shortName} Contact] ${subject}`;

    if (isMailConfigured()) {
      await sendContactMail({
        to,
        replyTo: email,
        subject: mailSubject,
        text,
        fromName: site.name,
      });
      return { ok: true, mode: "smtp" };
    }

    // No SMTP yet: open the visitor's mail app addressed to the business inbox.
    const mailtoUrl = buildContactMailtoUrl({
      to,
      subject: mailSubject,
      body: text,
    });
    return { ok: true, mode: "mailto", mailtoUrl };
  } catch {
    return {
      ok: false,
      error: "Could not send your email right now. Please try again.",
    };
  }
}
