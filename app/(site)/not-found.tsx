import { Button } from "@/components/ui/Button";

export default function SiteNotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
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
