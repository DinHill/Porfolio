import { circlePath, gridPath, heightAt, skylinePath } from "@/lib/pixel";

// Low-res landscape (128×72 "game pixels") behind the Studio viewport HUD. The viewport is often
// narrower than 16:9 and crops the sides, so the sun, moon and player sit near the middle.
// Colours come from CSS variables, so the light theme shows a day scene and the dark theme a night one.
const W = 128;
const H = 72;
const GROUND = 58;

const SKY_BANDS = [0, 16, 27, 35, 41, 46, GROUND];

const BACK = [[0, 40], [14, 30], [26, 38], [40, 24], [54, 36], [70, 28], [84, 38], [100, 26], [116, 36], [128, 32]];
const FRONT = [[0, 50], [18, 44], [36, 50], [58, 46], [80, 52], [100, 45], [128, 50]];

// Night sky stars, split into two groups that twinkle out of step
const STARS_A = [[6, 4], [22, 11], [37, 3], [51, 14], [66, 6], [79, 19], [112, 4], [123, 15], [9, 22], [58, 24]];
const STARS_B = [[15, 7], [30, 18], [45, 8], [73, 12], [86, 3], [106, 22], [118, 9], [3, 14], [92, 26], [40, 28]];
const dots = (points) => points.map(([x, y]) => `M${x} ${y}h1v1h-1z`).join("");

const CLOUD = [
  "...####.....",
  ".########...",
  "###########.",
  "############",
];
const PINE = [
  "..#..",
  ".###.",
  "#####",
  ".###.",
  "#####",
];
const PLAYER = [
  ".kkkkk.",
  "kkkkkkk",
  "ksssssk",
  "ksksksk",
  "ksssssk",
  ".kkkkk.",
  "bbbbbbb",
  "sbbbbbs",
  ".ggggg.",
  ".gg.gg.",
];
const PLAYER_PALETTE = { k: "#1d1a2e", s: "#ffc94d", b: "#4cc9f0", g: "#3d3463" };

// Moves a sprite path to (x, y)
const at = (x, y, d) => <path transform={`translate(${x} ${y})`} d={d} />;

const fill = (name) => ({ fill: `var(--sc-${name})` });

const PixelScene = () => {
  const pines = [10, 24, 56, 118].map((x) => ({ x, y: heightAt(FRONT, x) - 5 }));
  // The player stands on the highest ground under its 7-pixel-wide sprite
  const playerX = 84;
  const playerY = Math.min(...Array.from({ length: 7 }, (_, i) => heightAt(FRONT, playerX + i))) - PLAYER.length;
  const specks = Array.from({ length: 18 }, (_, i) => [(i * 37 + 5) % W, GROUND + 3 + ((i * 5) % 11)]);
  const tufts = Array.from({ length: 14 }, (_, i) => (i * 29 + 3) % W);

  return (
    <svg className="scene" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" aria-hidden="true">
      {SKY_BANDS.slice(0, -1).map((y, i) => (
        <rect key={y} x="0" y={y} width={W} height={SKY_BANDS[i + 1] - y} style={fill(`sky-${i}`)} />
      ))}

      <g className="scene__night">
        <path className="scene__stars scene__stars--a" d={dots(STARS_A)} style={fill("star")} />
        <path className="scene__stars scene__stars--b" d={dots(STARS_B)} style={fill("star")} />
        <path d={circlePath(88, 23, 5)} style={fill("moon")} />
        <path d="M86 21h2v2h-2zM90 25h1v1h-1zM87 26h1v1h-1z" style={fill("crater")} />
      </g>

      <g className="scene__day">
        <path d={circlePath(88, 22, 6)} style={fill("sun")} />
        <g className="scene__clouds" style={fill("cloud")}>
          {at(10, 8, gridPath(CLOUD))}
          {at(44, 20, gridPath(CLOUD))}
          {at(96, 26, gridPath(CLOUD))}
        </g>
      </g>

      <path d={skylinePath(BACK, W, GROUND)} style={fill("back")} />
      <path d={skylinePath(FRONT, W, GROUND)} style={fill("front")} />

      {pines.map(({ x, y }) => (
        <g key={x}>
          <path transform={`translate(${x - 2} ${y})`} d={gridPath(PINE)} style={fill("tree")} />
          <rect x={x} y={y + 5} width="1" height="2" style={fill("trunk")} />
        </g>
      ))}

      <rect x="0" y={GROUND} width={W} height={H - GROUND} style={fill("dirt")} />
      <rect x="0" y={GROUND} width={W} height="2" style={fill("grass")} />
      <path d={tufts.map((x) => `M${x} ${GROUND - 1}h1v1h-1zM${x + 2} ${GROUND - 1}h1v1h-1z`).join("")} style={fill("grass")} />
      <path d={dots(specks)} style={fill("speck")} />

      <g transform={`translate(${playerX} ${playerY})`}>
        <g className="scene__player">
          {Object.entries(PLAYER_PALETTE).map(([ch, color]) => (
            <path key={ch} d={gridPath(PLAYER, ch)} fill={color} />
          ))}
        </g>
      </g>
    </svg>
  );
};

export default PixelScene;
