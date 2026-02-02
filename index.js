// x' = x / z
// y' = y / z

console.log(game);
const ctx = game.getContext("2d");
const WIDTH = 800;
const HEIGHT = 800;

game.width = WIDTH;
game.height = HEIGHT;
const FOREGROUND = "#50FF50";
const BACKGROUND = "#000000";
const S = 20;
const FPS = 240;

const p1 = { x: 1, y: 0, z: 0 };

ctx.fillRect(0, 0, game.width, game.height);

function clear() {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, game.width, game.height);
}

function point({ x, y }) {
  ctx.fillStyle = FOREGROUND;
  ctx.fillRect(x - S / 2, y - S / 2, S, S);
}

function screen(p) {
  return {
    x: ((p.x + 1) / 2) * WIDTH,
    y: (1 - (p.y + 1) / 2) * HEIGHT,
  };
}

function project({ x, y, z }) {
  return {
    x: x / z,
    y: y / z,
  };
}

let dz = 1;

const vs = [
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },

  { x: 0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
];

const fs = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

function translate_z({ x, y, z }, dz) {
  return { x, y, z: z + dz };
}

function rotate_xz({ x, y, z }, angle) {
  return {
    x: x * Math.cos(angle) - z * Math.sin(angle),
    y,
    z: x * Math.sin(angle) + z * Math.cos(angle),
  };
}

function rotate_yz({ x, y, z }, angle) {
  return {
    x,
    y: z * Math.sin(angle) + y * Math.cos(angle),
    z: z * Math.cos(angle) - y * Math.sin(angle),
  };
}

function line(p1, p2) {
  ctx.strokeStyle = FOREGROUND;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

let angle = 0;

function draw() {
  dt = 1 / FPS;
  // dz += 1 * dt;
  angle += 2 * Math.PI * dt;

  clear();
  // for (const v of vs) {
  //   point(screen(project(translate_z(rotate_xz(v, angle), dz))));
  // }
  for (const f of fs) {
    for (let i = 0; i < f.length; i++) {
      const a = vs[f[i]];
      const b = vs[f[(i + 1) % f.length]];
      line(
        screen(project(translate_z(rotate_xz(a, angle), dz))),
        screen(project(translate_z(rotate_xz(b, angle), dz))),
        // screen(project(translate_z(rotate_yz(rotate_xz(a, angle), angle), dz))),
        // screen(project(translate_z(rotate_yz(rotate_xz(b, angle), angle), dz))),
      );
    }
  }
  setTimeout(draw, 3000 / FPS);
}

setTimeout(draw, 3000 / FPS);
