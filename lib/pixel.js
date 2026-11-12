// Helpers for drawing pixel art as SVG paths. Every shape is made of 1×1 cells, so with
// shape-rendering="crispEdges" it scales up into sharp pixels at any size.

// One rectangle per run of `ch` on each row of a text grid
export const gridPath = (rows, ch = "#") => {
  let d = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== ch) {
        x++;
        continue;
      }
      const start = x;
      while (row[x] === ch) x++;
      d += `M${start} ${y}h${x - start}v1h${start - x}z`;
    }
  });
  return d;
};

// Filled pixel circle, one run per row
export const circlePath = (cx, cy, r) => {
  let d = "";
  for (let dy = -r; dy <= r; dy++) {
    const half = Math.floor(Math.sqrt((r + 0.5) ** 2 - dy * dy));
    d += `M${cx - half} ${cy + dy}h${half * 2 + 1}v1h${-(half * 2 + 1)}z`;
  }
  return d;
};

// Height of a skyline at x, interpolated between [x, y] control points
export const heightAt = (points, x) => {
  const i = points.findIndex(([px]) => px >= x);
  if (i <= 0) return points[Math.max(i, 0)][1];
  const [x0, y0] = points[i - 1];
  const [x1, y1] = points[i];
  return Math.round(y0 + ((y1 - y0) * (x - x0)) / (x1 - x0));
};

// Stepped skyline (mountains, hills) filled down to `bottom`, in columns `step` pixels wide
export const skylinePath = (points, width, bottom, step = 2) => {
  let d = "";
  for (let x = 0; x < width; x += step) {
    d += `M${x} ${heightAt(points, x)}h${step}V${bottom}h${-step}z`;
  }
  return d;
};
