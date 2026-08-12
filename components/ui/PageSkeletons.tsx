import {
  PAGE_HERO_INNER_CLASS,
  PAGE_HERO_SECTION_CLASS,
} from "@/lib/hero-layout";
import {
  Skeleton,
  SkeletonLine,
  SkeletonSubtitle,
  SkeletonTitle,
} from "@/components/ui/Skeleton";

function HeroSkeleton() {
  return (
    <section className={PAGE_HERO_SECTION_CLASS}>
      <Skeleton className="absolute inset-0 rounded-none bg-primary/20" />
      <div className={PAGE_HERO_INNER_CLASS}>
        <SkeletonTitle className="h-10 max-w-xl bg-white/20 sm:h-12" />
        <div className="mt-6 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-32 bg-white/20" />
          <Skeleton className="h-10 w-36 bg-white/15" />
        </div>
      </div>
    </section>
  );
}

function SectionBlockSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <section className="bg-surface py-14 sm:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <SkeletonTitle className="mx-auto" />
          <SkeletonSubtitle className="mx-auto mt-3" />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: cards }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-border bg-surface">
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-2 p-4">
            <SkeletonLine className="w-3/4" />
            <SkeletonLine className="w-1/2" />
            <Skeleton className="mt-3 h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <SectionBlockSkeleton />
      <section className="py-14 sm:py-16">
        <div className="container-page">
          <SkeletonTitle />
          <SkeletonSubtitle className="mt-3" />
          <div className="mt-8 flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-[250px] shrink-0 rounded-2xl sm:w-auto sm:flex-1" />
            ))}
          </div>
        </div>
      </section>
      <SectionBlockSkeleton cards={3} />
    </>
  );
}

export function HeroContentPageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <section className="border-b border-border bg-surface py-14 sm:py-16">
        <div className="container-page mx-auto max-w-3xl text-center">
          <SkeletonTitle className="mx-auto" />
          <SkeletonSubtitle className="mx-auto mt-3" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-[4/5] rounded-2xl" />
          <div className="space-y-4">
            <SkeletonTitle />
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine className="w-5/6" />
          </div>
        </div>
      </section>
      <SectionBlockSkeleton cards={2} />
    </>
  );
}

export function ShopPageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <section className="py-10 sm:py-14">
        <div className="container-page space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 w-full sm:w-40" />
          </div>
          <ProductGridSkeleton />
        </div>
      </section>
    </>
  );
}

export function ServicesPageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <section className="bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SkeletonTitle />
          <SkeletonSubtitle className="mt-3" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ContactPageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <section className="bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SkeletonTitle />
          <SkeletonSubtitle className="mt-3" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-16 sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-3">
            <SkeletonTitle />
            <SkeletonSubtitle />
            <SkeletonLine />
          </div>
          <Skeleton className="aspect-[3/4] max-w-lg rounded-2xl" />
        </div>
      </section>
    </>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square rounded-[12px]" />
        <div className="space-y-4">
          <SkeletonTitle className="w-full max-w-none" />
          <SkeletonSubtitle />
          <Skeleton className="h-8 w-28" />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine className="w-5/6" />
          <Skeleton className="mt-4 h-12 w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
}

export function FormPageSkeleton() {
  return (
    <div className="container-page py-10 sm:py-14">
      <SkeletonTitle />
      <SkeletonSubtitle className="mt-3" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Skeleton className="min-h-[28rem] rounded-[10px]" />
        <Skeleton className="min-h-[20rem] rounded-[10px]" />
      </div>
    </div>
  );
}

export function SimplePageSkeleton() {
  return (
    <div className="container-page py-16 sm:py-20">
      <SkeletonTitle className="mx-auto" />
      <SkeletonSubtitle className="mx-auto mt-3" />
      <Skeleton className="mx-auto mt-10 h-64 max-w-lg rounded-2xl" />
    </div>
  );
}
