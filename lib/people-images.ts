/** Team photos from `public/people-images` (branded shirts). */

export type PeopleImage = {
  src: string;
  alt: string;
};

function peopleImagePath(filename: string) {
  return `/people-images/${encodeURIComponent(filename)}`;
}

export const PEOPLE_IMAGES: PeopleImage[] = [
  {
    src: peopleImagePath("WhatsApp Image 2026-07-24 at 06.59.08 (1).jpeg"),
    alt: "Frannys Tidy Solutions team members smiling in branded shirts outdoors",
  },
  {
    src: peopleImagePath("WhatsApp Image 2026-07-24 at 06.59.08.jpeg"),
    alt: "Frannys team wearing branded black and yellow shirts",
  },
  {
    src: peopleImagePath("WhatsApp Image 2026-07-24 at 06.47.23.jpeg"),
    alt: "Frannys Tidy Solutions staff in company branded apparel",
  },
];
