// "Push and Slide!" -> "push-and-slide"; used for project anchors like #project-push-and-slide
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const projectAnchor = (title) => `project-${slugify(title)}`;
