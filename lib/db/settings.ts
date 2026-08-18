import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import {
  SETTINGS_DEFAULTS,
  SETTING_KEYS,
  getDefaultSiteConfig,
  siteConfigFromMap,
  type SettingKey,
  type SiteConfig,
} from "@/lib/site-config";

export {
  SETTING_KEYS,
  SETTINGS_DEFAULTS,
  getDefaultSiteConfig,
  siteConfigFromMap,
  type SettingKey,
  type SiteConfig,
  type ContentItem,
  type ServiceContentItem,
  type PromiseItem,
} from "@/lib/site-config";

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settings);
  const map: Record<string, string> = { ...SETTINGS_DEFAULTS };
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

export async function getSetting(key: SettingKey): Promise<string> {
  const row = await db.query.settings.findFirst({
    where: eq(settings.key, key),
  });
  return row?.value ?? SETTINGS_DEFAULTS[key];
}

export async function upsertSetting(key: string, value: string) {
  await upsertSettings({ [key]: value });
}

/** One round-trip for the whole payload. Skips keys that already match. */
export async function upsertSettings(entries: Record<string, string>) {
  const pairs = Object.entries(entries);
  if (pairs.length === 0) return;

  const current = await getAllSettings();
  const changed = pairs.filter(([key, value]) => current[key] !== value);
  if (changed.length === 0) return;

  const now = new Date();
  await db
    .insert(settings)
    .values(changed.map(([key, value]) => ({ key, value, updatedAt: now })))
    .onConflictDoUpdate({
      target: settings.key,
      set: {
        value: sql`excluded.value`,
        updatedAt: now,
      },
    });
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const s = await getAllSettings();
  return siteConfigFromMap(s);
}
