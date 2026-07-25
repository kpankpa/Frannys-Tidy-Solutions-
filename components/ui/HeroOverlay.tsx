/** Shared left→right scrim used on full-bleed photo heroes. */
export function HeroOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/78 via-primary-dark/45 to-primary-dark/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/35 via-transparent to-primary-dark/20" />
    </>
  );
}
