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
const FPS = 480;

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

let xAngle = 0;
let yAngle = 0;
let dir = "ArrowLeft";

const controls = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Enter",
]);

function direction() {
  document.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (controls.has(e.key)) {
      dir = e.key;
    }
  });
}

function draw() {
  dt = 1 / FPS;
  // dz += 1 * dt;
  if (dir == "Enter") {
    // xAngle += 2 * Math.PI;
    // yAngle += 2 * Math.PI;
  } else if (dir == "ArrowRight") {
    xAngle += 2 * Math.PI * dt;
  } else if (dir == "ArrowLeft") {
    xAngle -= 2 * Math.PI * dt;
  } else if (dir == "ArrowUp") {
    yAngle -= 2 * Math.PI * dt;
  } else if (dir == "ArrowDown") {
    yAngle += 2 * Math.PI * dt;
  }

  console.log(yAngle);

  clear();
  // for (const v of vs) {
  //   point(screen(project(translate_z(rotate_xz(v, angle), dz))));
  // }
  if (dir == "ArrowLeft" || dir == "ArrowRight") {
    for (const f of fs) {
      for (let i = 0; i < f.length; i++) {
        const a = vs[f[i]];
        const b = vs[f[(i + 1) % f.length]];
        line(
          screen(
            project(translate_z(rotate_xz(rotate_yz(a, yAngle), xAngle), dz)),
          ),
          screen(
            project(translate_z(rotate_xz(rotate_yz(b, yAngle), xAngle), dz)),
          ),
        );
      }
    }
  } else if (dir == "ArrowUp" || dir == "ArrowDown") {
    for (const f of fs) {
      for (let i = 0; i < f.length; i++) {
        const a = vs[f[i]];
        const b = vs[f[(i + 1) % f.length]];
        line(
          screen(
            project(translate_z(rotate_yz(rotate_xz(a, xAngle), yAngle), dz)),
          ),
          screen(
            project(translate_z(rotate_yz(rotate_xz(b, xAngle), yAngle), dz)),
          ),
        );
      }
    }
  }

  setTimeout(draw, 3000 / FPS);
}

direction();
setTimeout(draw, 3000 / FPS);
