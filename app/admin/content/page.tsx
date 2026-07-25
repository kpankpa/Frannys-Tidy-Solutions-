import { getSiteConfig } from "@/lib/db/settings";
import { cleaningServices } from "@/lib/services";
import { saveSiteContentAction } from "@/server/admin";
import { PendingSubmitButton } from "@/components/ui/PendingSubmitButton";
import { ensureAdminPage } from "@/lib/auth/admin-page";

const field =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

const sectionClass =
  "space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm";

export default async function AdminContentPage() {
  await ensureAdminPage();
  const site = await getSiteConfig();
  const whyItems = [0, 1, 2, 3].map(
    (i) => site.whyChooseItems[i] ?? { title: "", description: "" },
  );
  const promises = [0, 1, 2].map(
    (i) => site.servicePromises[i] ?? { title: "", body: "" },
  );
  const serviceById = new Map(site.serviceItems.map((s) => [s.id, s]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site content</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Edit marketing copy across Home, Shop, Services, Contact, and About.
          Business details (phone, email, hours, delivery fee) live under{" "}
          <a href="/admin/settings" className="font-medium text-primary hover:underline">
            Settings
          </a>
          . Product names and prices are under{" "}
          <a href="/admin/products" className="font-medium text-primary hover:underline">
            Products
          </a>
          .
        </p>
      </div>

      <form action={saveSiteContentAction} className="max-w-3xl space-y-6">
        <section className={sectionClass}>
          <h2 className="font-bold">Home</h2>
          <label className="block text-sm">
            <span className="font-medium">Tagline</span>
            <input name="tagline" defaultValue={site.tagline} className={field} />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Hero headline</span>
            <textarea
              name="heroHeadline"
              rows={3}
              defaultValue={site.heroHeadline}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Hero supporting text</span>
            <textarea
              name="heroSubcopy"
              rows={3}
              defaultValue={site.heroSubcopy}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Footer blurb</span>
            <textarea
              name="aboutBlurb"
              rows={2}
              defaultValue={site.aboutBlurb}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Why choose title</span>
            <input
              name="homeWhyTitle"
              defaultValue={site.homeWhyTitle}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Why choose description</span>
            <input
              name="homeWhyDescription"
              defaultValue={site.homeWhyDescription}
              className={field}
            />
          </label>
          <div className="space-y-3">
            <p className="text-sm font-medium">Why choose cards</p>
            {whyItems.map((item, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-[8px] border border-border/80 p-3 sm:grid-cols-2"
              >
                <label className="block text-sm sm:col-span-2">
                  <span className="text-muted">Card {i + 1} title</span>
                  <input
                    name={`whyTitle${i}`}
                    defaultValue={item.title}
                    className={field}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="text-muted">Card {i + 1} description</span>
                  <textarea
                    name={`whyDesc${i}`}
                    rows={2}
                    defaultValue={item.description}
                    className={field}
                  />
                </label>
              </div>
            ))}
          </div>
          <label className="block text-sm">
            <span className="font-medium">Home services title</span>
            <input
              name="homeServicesTitle"
              defaultValue={site.homeServicesTitle}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Home services description</span>
            <input
              name="homeServicesDescription"
              defaultValue={site.homeServicesDescription}
              className={field}
            />
          </label>
        </section>

        <section className={sectionClass}>
          <h2 className="font-bold">Shop page</h2>
          <label className="block text-sm">
            <span className="font-medium">Hero headline</span>
            <input
              name="shopHeroHeadline"
              defaultValue={site.shopHeroHeadline}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Hero supporting text</span>
            <textarea
              name="shopHeroSubcopy"
              rows={3}
              defaultValue={site.shopHeroSubcopy}
              className={field}
            />
          </label>
        </section>

        <section className={sectionClass}>
          <h2 className="font-bold">Services page</h2>
          <label className="block text-sm">
            <span className="font-medium">Hero headline</span>
            <input
              name="servicesHeroHeadline"
              defaultValue={site.servicesHeroHeadline}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Hero supporting text</span>
            <textarea
              name="servicesHeroSubcopy"
              rows={3}
              defaultValue={site.servicesHeroSubcopy}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Catalogue section title</span>
            <input
              name="servicesSectionHeadline"
              defaultValue={site.servicesSectionHeadline}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Catalogue section text</span>
            <textarea
              name="servicesSectionSubcopy"
              rows={2}
              defaultValue={site.servicesSectionSubcopy}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Why book supporting text</span>
            <input
              name="whyBookSubcopy"
              defaultValue={site.whyBookSubcopy}
              className={field}
            />
          </label>
          <div className="space-y-3">
            <p className="text-sm font-medium">Service cards</p>
            {cleaningServices.map((service) => {
              const current = serviceById.get(service.id) ?? service;
              return (
                <div
                  key={service.id}
                  className="space-y-3 rounded-[8px] border border-border/80 p-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {service.id}
                  </p>
                  <label className="block text-sm">
                    <span className="text-muted">Title</span>
                    <input
                      name={`serviceTitle_${service.id}`}
                      defaultValue={current.title}
                      className={field}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-muted">Description</span>
                    <textarea
                      name={`serviceDesc_${service.id}`}
                      rows={2}
                      defaultValue={current.description}
                      className={field}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Why book points</p>
            {promises.map((item, i) => (
              <div
                key={i}
                className="space-y-3 rounded-[8px] border border-border/80 p-3"
              >
                <label className="block text-sm">
                  <span className="text-muted">Point {i + 1} title</span>
                  <input
                    name={`promiseTitle${i}`}
                    defaultValue={item.title}
                    className={field}
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-muted">Point {i + 1} text</span>
                  <textarea
                    name={`promiseBody${i}`}
                    rows={2}
                    defaultValue={item.body}
                    className={field}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-bold">Contact page</h2>
          <label className="block text-sm">
            <span className="font-medium">Hero headline</span>
            <input
              name="contactHeroHeadline"
              defaultValue={site.contactHeroHeadline}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Hero supporting text</span>
            <textarea
              name="contactHeroSubcopy"
              rows={3}
              defaultValue={site.contactHeroSubcopy}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Topics section title</span>
            <input
              name="contactTopicsHeadline"
              defaultValue={site.contactTopicsHeadline}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Topics (one per line)</span>
            <textarea
              name="contactTopics"
              rows={6}
              defaultValue={site.contactTopics.join("\n")}
              className={field}
            />
          </label>
        </section>

        <section className={sectionClass}>
          <h2 className="font-bold">About page</h2>
          <label className="block text-sm">
            <span className="font-medium">About headline</span>
            <input
              name="aboutHeadline"
              defaultValue={site.aboutHeadline}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">About intro</span>
            <textarea
              name="aboutIntro"
              rows={3}
              defaultValue={site.aboutIntro}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Our story</span>
            <textarea
              name="aboutStory"
              rows={4}
              defaultValue={site.aboutStory}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Mission</span>
            <textarea
              name="aboutMission"
              rows={3}
              defaultValue={site.aboutMission}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Vision</span>
            <textarea
              name="aboutVision"
              rows={3}
              defaultValue={site.aboutVision}
              className={field}
            />
          </label>
        </section>

        <PendingSubmitButton>Save all content</PendingSubmitButton>
      </form>
    </div>
  );
}
