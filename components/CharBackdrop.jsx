import { gridPath } from "@/lib/pixel";

// "Character select" stage behind the About photo, drawn at 64×80 game pixels:
// sunburst rays, sparkles, and an ordered-dither fade into the name plate.
// Colours are CSS variables (see .charcard__stage).
const W = 64;
const H = 80;
const CX = 32;
const CY = 25; // rays fan out from roughly where the head sits in the photo

const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a0 = (i * 30 * Math.PI) / 180;
  const a1 = a0 + (15 * Math.PI) / 180;
  const p = (a) => `${(CX + 120 * Math.cos(a)).toFixed(1)},${(CY + 120 * Math.sin(a)).toFixed(1)}`;
  return `${CX},${CY} ${p(a0)} ${p(a1)}`;
});

// Bottom rows get denser towards the plate: 25% → 50% → 75% → solid
const DITHER_TOP = 64;
const DITHER = Array.from({ length: H - DITHER_TOP }, (_, row) => {
  const y = DITHER_TOP + row;
  const level = row < 4 ? 1 : row < 9 ? 2 : row < 13 ? 3 : 4;
  return Array.from({ length: W }, (_, x) => {
    const on =
      level === 1 ? x % 2 === 0 && y % 2 === 0 :
      level === 2 ? (x + y) % 2 === 0 :
      level === 3 ? !(x % 2 === 1 && y % 2 === 1) :
      true;
    return on ? "#" : ".";
  }).join("");
});

const SPARKLE = [".#.", "###", ".#."];
const SPARKLES_A = [[7, 8], [52, 15], [10, 46]];
const SPARKLES_B = [[56, 40], [4, 28], [47, 56]];

const fill = (name) => ({ fill: `var(--cs-${name})` });

const CharBackdrop = () => (
  <svg className="charbg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true">
    <rect width={W} height={H} style={fill("bg")} />
    <g style={fill("ray")}>
      {RAYS.map((points) => <polygon key={points} points={points} />)}
    </g>
    <g className="charbg__sparkles charbg__sparkles--a" style={fill("sparkle")}>
      {SPARKLES_A.map(([x, y]) => <path key={x} transform={`translate(${x} ${y})`} d={gridPath(SPARKLE)} />)}
    </g>
    <g className="charbg__sparkles charbg__sparkles--b" style={fill("sparkle")}>
      {SPARKLES_B.map(([x, y]) => <path key={x} transform={`translate(${x} ${y})`} d={gridPath(SPARKLE)} />)}
    </g>
    <path transform={`translate(0 ${DITHER_TOP})`} d={gridPath(DITHER)} style={fill("floor")} />
  </svg>
);

export default CharBackdrop;
