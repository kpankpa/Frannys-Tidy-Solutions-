import { Button } from "@/components/ui/Button";
import { PAGE_SUBTITLE_CLASS, PAGE_TITLE_CLASS } from "@/lib/section-typography";

export default function SiteNotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className={PAGE_TITLE_CLASS}>Page not found</h1>
      <p className={`${PAGE_SUBTITLE_CLASS} max-w-md`}>
        That page does not exist. Head back to the shop or home.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button href="/">Home</Button>
        <Button href="/shop" variant="outline">
          Shop
        </Button>
      </div>
    </div>
  );
}
