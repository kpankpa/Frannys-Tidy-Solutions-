import { eq } from "drizzle-orm";
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
  const existing = await db.query.settings.findFirst({
    where: eq(settings.key, key),
  });
  if (existing) {
    await db
      .update(settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(settings.id, existing.id));
  } else {
    await db.insert(settings).values({ key, value });
  }
}

export async function upsertSettings(entries: Record<string, string>) {
  for (const [key, value] of Object.entries(entries)) {
    await upsertSetting(key, value);
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const s = await getAllSettings();
  return siteConfigFromMap(s);
}
