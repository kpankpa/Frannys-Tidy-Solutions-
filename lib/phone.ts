/**
 * Ghana phone helpers.
 * Storage form: local 0XXXXXXXXX (10 digits) when valid.
 * Matching uses E.164 digits (233XXXXXXXXX) so 020… / 233… / +233… align.
 */

export function toGhanaE164Digits(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("233") && digits.length === 12) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `233${digits.slice(1)}`;
  }

  // Mobile without leading 0 (e.g. 200928400)
  if (digits.length === 9 && /^[235]\d{8}$/.test(digits)) {
    return `233${digits}`;
  }

  return null;
}

/** Normalize for DB storage. Returns null if the number is not a plausible Ghana mobile. */
export function normalizeGhanaPhone(phone: string): string | null {
  const e164 = toGhanaE164Digits(phone);
  if (!e164) return null;
  return `0${e164.slice(3)}`;
}

export function phonesMatch(a: string, b: string): boolean {
  const ea = toGhanaE164Digits(a);
  const eb = toGhanaE164Digits(b);
  if (ea && eb) return ea === eb;

  const strip = (value: string) => value.replace(/[\s\-()+/]/g, "").trim();
  return strip(a) === strip(b) && strip(a).length > 0;
}

export function toWhatsAppE164(phone: string): string | null {
  return toGhanaE164Digits(phone);
}
