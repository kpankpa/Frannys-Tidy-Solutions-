import { getSiteConfig } from "@/lib/db/settings";
import { cleaningServices } from "@/lib/services";
import { saveSiteContentAction } from "@/server/admin";
import { PendingSubmitButton } from "@/components/ui/PendingSubmitButton";
import { ensureAdminPage } from "@/lib/auth/admin-page";

const field =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

const sectionClass =
  "space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminContentPage({ searchParams }: PageProps) {
  await ensureAdminPage();
  const site = await getSiteConfig();
  const params = await searchParams;
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
          Business details (phone, email, hours, logo, receipt) live under{" "}
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

      {params.error === "InvalidImageUrl" ? (
        <p className="max-w-3xl rounded-[8px] bg-danger/10 px-3 py-2 text-sm text-danger">
          One of the image URLs is invalid. Use a site path, /uploads/... path,
          or https image URL.
        </p>
      ) : null}

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
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium">Hero primary button</span>
              <input
                name="heroCtaPrimary"
                defaultValue={site.heroCtaPrimary}
                className={field}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Hero secondary button</span>
              <input
                name="heroCtaSecondary"
                defaultValue={site.heroCtaSecondary}
                className={field}
              />
            </label>
          </div>
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
            <span className="font-medium">Home shop title</span>
            <input
              name="homeShopTitle"
              defaultValue={site.homeShopTitle}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Home shop description</span>
            <input
              name="homeShopDescription"
              defaultValue={site.homeShopDescription}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Home shop link label</span>
            <input
              name="homeShopCta"
              defaultValue={site.homeShopCta}
              className={field}
            />
          </label>
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
          <label className="block text-sm">
            <span className="font-medium">How it works title</span>
            <input
              name="homeHowTitle"
              defaultValue={site.homeHowTitle}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">How it works description</span>
            <input
              name="homeHowDescription"
              defaultValue={site.homeHowDescription}
              className={field}
            />
          </label>
          <div className="space-y-3">
            <p className="text-sm font-medium">How it works steps</p>
            {[0, 1, 2, 3].map((i) => {
              const step = site.howItWorks[i] ?? {
                step: i + 1,
                title: "",
                description: "",
              };
              return (
                <div
                  key={i}
                  className="grid gap-3 rounded-[8px] border border-border/80 p-3 sm:grid-cols-2"
                >
                  <label className="block text-sm">
                    <span className="text-muted">Step {i + 1} title</span>
                    <input
                      name={`howTitle${i}`}
                      defaultValue={step.title}
                      className={field}
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="text-muted">Step {i + 1} text</span>
                    <textarea
                      name={`howDesc${i}`}
                      rows={2}
                      defaultValue={step.description}
                      className={field}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <label className="block text-sm">
            <span className="font-medium">Closing CTA title</span>
            <input
              name="homeCtaTitle"
              defaultValue={site.homeCtaTitle}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Closing CTA text</span>
            <textarea
              name="homeCtaDescription"
              rows={2}
              defaultValue={site.homeCtaDescription}
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
                  <label className="block text-sm">
                    <span className="text-muted">Image URL</span>
                    <input
                      name={`serviceImage_${service.id}`}
                      defaultValue={current.image ?? service.image}
                      className={field}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <label className="block text-sm">
            <span className="font-medium">Packages section title</span>
            <input
              name="packagesHeadline"
              defaultValue={site.packagesHeadline}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Packages section text</span>
            <textarea
              name="packagesSubcopy"
              rows={2}
              defaultValue={site.packagesSubcopy}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Process section title</span>
            <input
              name="serviceProcessTitle"
              defaultValue={site.serviceProcessTitle}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Process section text</span>
            <input
              name="serviceProcessSubcopy"
              defaultValue={site.serviceProcessSubcopy}
              className={field}
            />
          </label>
          <div className="space-y-3">
            <p className="text-sm font-medium">Booking process steps</p>
            {[0, 1, 2, 3].map((i) => {
              const item = site.serviceProcess[i] ?? {
                step: String(i + 1).padStart(2, "0"),
                title: "",
                body: "",
              };
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-[8px] border border-border/80 p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block text-sm">
                      <span className="text-muted">Step label</span>
                      <input
                        name={`processStep${i}`}
                        defaultValue={item.step}
                        className={field}
                      />
                    </label>
                    <label className="block text-sm sm:col-span-2">
                      <span className="text-muted">Title</span>
                      <input
                        name={`processTitle${i}`}
                        defaultValue={item.title}
                        className={field}
                      />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="text-muted">Text</span>
                    <textarea
                      name={`processBody${i}`}
                      rows={2}
                      defaultValue={item.body}
                      className={field}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <label className="block text-sm">
            <span className="font-medium">Spaces section title</span>
            <input
              name="serviceSpacesTitle"
              defaultValue={site.serviceSpacesTitle}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Spaces image URL</span>
            <input
              name="serviceSpacesImage"
              defaultValue={site.serviceSpacesImage}
              className={field}
            />
          </label>
          <div className="space-y-3">
            <p className="text-sm font-medium">Spaces we serve</p>
            {[0, 1, 2, 3].map((i) => {
              const item = site.serviceSpaces[i] ?? { title: "", body: "" };
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-[8px] border border-border/80 p-3"
                >
                  <label className="block text-sm">
                    <span className="text-muted">Space {i + 1} title</span>
                    <input
                      name={`spaceTitle${i}`}
                      defaultValue={item.title}
                      className={field}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-muted">Space {i + 1} text</span>
                    <textarea
                      name={`spaceBody${i}`}
                      rows={2}
                      defaultValue={item.body}
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
          <label className="block text-sm">
            <span className="font-medium">Promise line</span>
            <textarea
              name="aboutPromise"
              rows={2}
              defaultValue={site.aboutPromise}
              className={field}
            />
          </label>
          <div className="space-y-3">
            <p className="text-sm font-medium">Trust points</p>
            {[0, 1, 2, 3].map((i) => {
              const item = site.aboutTrustPoints[i] ?? { title: "", body: "" };
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-[8px] border border-border/80 p-3"
                >
                  <label className="block text-sm">
                    <span className="text-muted">Point {i + 1} title</span>
                    <input
                      name={`aboutTrustTitle${i}`}
                      defaultValue={item.title}
                      className={field}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-muted">Point {i + 1} text</span>
                    <textarea
                      name={`aboutTrustBody${i}`}
                      rows={2}
                      defaultValue={item.body}
                      className={field}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">What makes us different</p>
            {[0, 1, 2].map((i) => {
              const item = site.aboutDifference[i] ?? { title: "", body: "" };
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-[8px] border border-border/80 p-3"
                >
                  <label className="block text-sm">
                    <span className="text-muted">Item {i + 1} title</span>
                    <input
                      name={`aboutDiffTitle${i}`}
                      defaultValue={item.title}
                      className={field}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-muted">Item {i + 1} text</span>
                    <textarea
                      name={`aboutDiffBody${i}`}
                      rows={2}
                      defaultValue={item.body}
                      className={field}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Values</p>
            {[0, 1, 2, 3].map((i) => {
              const item = site.aboutValues[i] ?? { title: "", body: "" };
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-[8px] border border-border/80 p-3"
                >
                  <label className="block text-sm">
                    <span className="text-muted">Value {i + 1} title</span>
                    <input
                      name={`aboutValueTitle${i}`}
                      defaultValue={item.title}
                      className={field}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-muted">Value {i + 1} text</span>
                    <textarea
                      name={`aboutValueBody${i}`}
                      rows={2}
                      defaultValue={item.body}
                      className={field}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Journey timeline</p>
            {[0, 1, 2, 3].map((i) => {
              const item = site.aboutJourney[i] ?? {
                year: "",
                title: "",
                body: "",
              };
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-[8px] border border-border/80 p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block text-sm">
                      <span className="text-muted">Year / label</span>
                      <input
                        name={`aboutJourneyYear${i}`}
                        defaultValue={item.year}
                        className={field}
                      />
                    </label>
                    <label className="block text-sm sm:col-span-2">
                      <span className="text-muted">Title</span>
                      <input
                        name={`aboutJourneyTitle${i}`}
                        defaultValue={item.title}
                        className={field}
                      />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="text-muted">Text</span>
                    <textarea
                      name={`aboutJourneyBody${i}`}
                      rows={2}
                      defaultValue={item.body}
                      className={field}
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-bold">Customer reviews</h2>
          <p className="text-sm text-muted">
            Approve quotes to show them on Home and About. Leave a row blank to
            hide it.
          </p>
          <label className="block text-sm">
            <span className="font-medium">Section title</span>
            <input
              name="testimonialsTitle"
              defaultValue={site.testimonialsTitle}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Section description</span>
            <input
              name="testimonialsDescription"
              defaultValue={site.testimonialsDescription}
              className={field}
            />
          </label>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => {
              const item = site.testimonials[i] ?? {
                name: "",
                role: "",
                quote: "",
                rating: 5,
                approved: false,
              };
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-[8px] border border-border/80 p-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Review {i + 1}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="text-muted">Name</span>
                      <input
                        name={`testimonialName${i}`}
                        defaultValue={item.name}
                        className={field}
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="text-muted">Role / city</span>
                      <input
                        name={`testimonialRole${i}`}
                        defaultValue={item.role}
                        className={field}
                      />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="text-muted">Quote</span>
                    <textarea
                      name={`testimonialQuote${i}`}
                      rows={2}
                      defaultValue={item.quote}
                      className={field}
                    />
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="block text-sm">
                      <span className="text-muted">Rating (1-5)</span>
                      <input
                        name={`testimonialRating${i}`}
                        type="number"
                        min={1}
                        max={5}
                        defaultValue={item.rating}
                        className={field}
                      />
                    </label>
                    <label className="mt-5 inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name={`testimonialApproved${i}`}
                        value="on"
                        defaultChecked={item.approved}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="font-medium">Approved (show on site)</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-bold">Service packages (fixed prices)</h2>
          <p className="text-sm text-muted">
            Shown on the Services page as &quot;from GH₵&quot; packages. Leave a
            row blank to skip it.
          </p>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => {
              const item = site.servicePackages[i] ?? {
                name: "",
                description: "",
                priceFromCedis: 0,
              };
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-[8px] border border-border/80 p-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Package {i + 1}
                  </p>
                  <label className="block text-sm">
                    <span className="text-muted">Name</span>
                    <input
                      name={`packageName${i}`}
                      defaultValue={item.name}
                      className={field}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-muted">Description</span>
                    <textarea
                      name={`packageDesc${i}`}
                      rows={2}
                      defaultValue={item.description}
                      className={field}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-muted">From price (GH₵)</span>
                    <input
                      name={`packagePrice${i}`}
                      type="number"
                      min={0}
                      step="1"
                      defaultValue={item.priceFromCedis || ""}
                      className={field}
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </section>

        <PendingSubmitButton>Save all content</PendingSubmitButton>
      </form>
    </div>
  );
}
