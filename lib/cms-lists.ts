import {
  ABOUT_DIFFERENCE,
  ABOUT_JOURNEY,
  ABOUT_PROMISE,
  ABOUT_TRUST_POINTS,
  ABOUT_VALUES,
} from "@/lib/about-content";
import { howItWorks as defaultHowItWorks } from "@/lib/services";
import {
  SERVICE_PROCESS,
  SERVICE_SPACES,
} from "@/lib/services-page";

export type TitleBodyItem = { title: string; body: string };
export type JourneyItem = { year: string; title: string; body: string };
export type ProcessItem = { step: string; title: string; body: string };
export type HowItWorksItem = {
  step: number;
  title: string;
  description: string;
};

function parseJsonArray<T>(raw: string | undefined, fallback: T[]): T[] {
  if (!raw?.trim()) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export const DEFAULT_ABOUT_PROMISE = ABOUT_PROMISE;

export const DEFAULT_ABOUT_VALUES: TitleBodyItem[] = ABOUT_VALUES.map((v) => ({
  title: v.title,
  body: v.body,
}));

export const DEFAULT_ABOUT_JOURNEY: JourneyItem[] = ABOUT_JOURNEY.map((j) => ({
  year: j.year,
  title: j.title,
  body: j.body,
}));

export const DEFAULT_ABOUT_DIFFERENCE: TitleBodyItem[] = ABOUT_DIFFERENCE.map(
  (d) => ({
    title: d.title,
    body: d.body,
  }),
);

export const DEFAULT_ABOUT_TRUST: TitleBodyItem[] = ABOUT_TRUST_POINTS.map(
  (t) => ({
    title: t.title,
    body: t.body,
  }),
);

export const DEFAULT_HOW_IT_WORKS: HowItWorksItem[] = defaultHowItWorks.map(
  (s) => ({
    step: s.step,
    title: s.title,
    description: s.description,
  }),
);

export const DEFAULT_SERVICE_PROCESS: ProcessItem[] = SERVICE_PROCESS.map(
  (p) => ({
    step: p.step,
    title: p.title,
    body: p.body,
  }),
);

export const DEFAULT_SERVICE_SPACES: TitleBodyItem[] = SERVICE_SPACES.map(
  (s) => ({
    title: s.title,
    body: s.body,
  }),
);

export function parseTitleBodyList(
  raw: string | undefined,
  fallback: TitleBodyItem[],
): TitleBodyItem[] {
  const items = parseJsonArray<TitleBodyItem>(raw, fallback);
  const cleaned = items
    .filter((item) => item && typeof item.title === "string")
    .map((item) => ({
      title: String(item.title).trim().slice(0, 120),
      body: String(item.body ?? "").trim().slice(0, 400),
    }))
    .filter((item) => item.title);
  return cleaned.length > 0 ? cleaned : fallback;
}

export function parseJourneyList(
  raw: string | undefined,
  fallback: JourneyItem[] = DEFAULT_ABOUT_JOURNEY,
): JourneyItem[] {
  const items = parseJsonArray<JourneyItem>(raw, fallback);
  const cleaned = items
    .filter((item) => item && typeof item.title === "string")
    .map((item) => ({
      year: String(item.year ?? "").trim().slice(0, 40),
      title: String(item.title).trim().slice(0, 120),
      body: String(item.body ?? "").trim().slice(0, 400),
    }))
    .filter((item) => item.title);
  return cleaned.length > 0 ? cleaned : fallback;
}

export function parseProcessList(
  raw: string | undefined,
  fallback: ProcessItem[] = DEFAULT_SERVICE_PROCESS,
): ProcessItem[] {
  const items = parseJsonArray<ProcessItem>(raw, fallback);
  const cleaned = items
    .filter((item) => item && typeof item.title === "string")
    .map((item, i) => ({
      step: String(item.step ?? String(i + 1).padStart(2, "0"))
        .trim()
        .slice(0, 8),
      title: String(item.title).trim().slice(0, 120),
      body: String(item.body ?? "").trim().slice(0, 400),
    }))
    .filter((item) => item.title);
  return cleaned.length > 0 ? cleaned : fallback;
}

export function parseHowItWorksList(
  raw: string | undefined,
  fallback: HowItWorksItem[] = DEFAULT_HOW_IT_WORKS,
): HowItWorksItem[] {
  const items = parseJsonArray<HowItWorksItem>(raw, fallback);
  const cleaned = items
    .filter((item) => item && typeof item.title === "string")
    .map((item, i) => ({
      step: Math.max(1, Math.round(Number(item.step) || i + 1)),
      title: String(item.title).trim().slice(0, 80),
      description: String(item.description ?? "").trim().slice(0, 240),
    }))
    .filter((item) => item.title);
  return cleaned.length > 0 ? cleaned : fallback;
}
