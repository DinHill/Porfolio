// Event vocabulary shared by the browser tracker and the server. Anything outside these lists is ignored.

export const SECTIONS = ["work", "experience", "skills", "about", "contact"];

// Clicks that mean "this visitor wants to get in touch" — the last step of the funnel
export const CONTACT_ACTIONS = ["message", "email", "cv", "linkedin", "phone"];
export const ACTIONS = [...CONTACT_ACTIONS, "github", "play", "video"];

export const ACTION_LABELS = {
  message: "Sent a message",
  email: "Email (copy or mailto)",
  cv: "Opened / downloaded CV",
  linkedin: "LinkedIn",
  phone: "Phone",
  github: "GitHub",
  play: "Play link",
  video: "Video link",
};

// Ordered funnel. A visitor counts at a step only if they also reached every step before it.
export const FUNNEL = [
  { id: "visit", label: "Landed on the site" },
  { id: "work", label: "Scrolled to Work" },
  { id: "project", label: "Opened a project" },
  { id: "contact", label: "Reached Contact" },
  { id: "reach", label: "Reached out" },
];
