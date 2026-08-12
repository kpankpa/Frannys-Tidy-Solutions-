import {
  SETTING_KEYS,
  type ServiceContentItem,
  type ServicePackageItem,
} from "@/lib/site-config";
import { getSiteConfig, upsertSetting } from "./settings";

export async function listCleaningServices(): Promise<ServiceContentItem[]> {
  const site = await getSiteConfig();
  return site.serviceItems;
}

export async function listServicePackages(): Promise<ServicePackageItem[]> {
  const site = await getSiteConfig();
  return site.servicePackages;
}

export async function getCleaningServiceById(
  id: string,
): Promise<ServiceContentItem | null> {
  const services = await listCleaningServices();
  return services.find((service) => service.id === id) ?? null;
}

export async function saveCleaningServices(items: ServiceContentItem[]) {
  await upsertSetting(SETTING_KEYS.serviceItems, JSON.stringify(items));
}

export async function saveServicePackages(items: ServicePackageItem[]) {
  await upsertSetting(SETTING_KEYS.servicePackages, JSON.stringify(items));
}
