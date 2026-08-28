/** Shared Unsplash URLs for static section demos (SkillHub showcase). */
const unsplash = (photoId: string, width = 1600) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=75`;

export const DEMO_IMAGES = {
  heroTeam: unsplash("photo-1524178232363-1fb2b075b655", 1200),
  heroOffice: unsplash("photo-1497366216548-3fcbfee4df48"),
  heroCollaboration: unsplash("photo-1522202176988-66273c2fd55f"),
  heroWorkshop: unsplash("photo-1517245386807-bb43f82c33c4"),
  heroPresentation: unsplash("photo-1552664730-d307ca884978"),
  heroLaptop: unsplash("photo-1460925895917-afdab827c52f"),
} as const;
