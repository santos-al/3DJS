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
let S = 3;
const FPS = 480;
let size = 0.25;
let negSize = -0.25;

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
let dx = 0;
let dy = 0;

const vs = [
  { x: size, y: size, z: size },
  { x: negSize, y: size, z: size },
  { x: negSize, y: negSize, z: size },
  { x: size, y: negSize, z: size },

  { x: size, y: size, z: negSize },
  { x: negSize, y: size, z: negSize },
  { x: negSize, y: negSize, z: negSize },
  { x: size, y: negSize, z: negSize },
];

const fs = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

function upScale() {
  dz -= 0.025;
}

function downScale() {
  dz += 0.025;
}

function translate_z({ x, y, z }, dz) {
  return { x, y, z: z + dz };
}

function translate_y({ x, y, z }, dy) {
  return { x, y: y + dy, z };
}

function translate_x({ x, y, z }, dx) {
  return { x: x + dx, y, z };
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
let dir = undefined;
let trs = undefined;
let scale = undefined;

const dir_controls = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Enter",
]);

const trs_controls = new Set(["w", "a", "s", "d", "q"]);

const scale_controls = new Set(["-", "+"]);

function direction() {
  document.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (dir_controls.has(e.key)) {
      dir = e.key;
    } else if (trs_controls.has(e.key)) {
      trs = e.key;
    } else if (scale_controls.has(e.key)) {
      scale = e.key;
    }
  });
}

function draw() {
  dt = 1 / FPS;
  // dz += 1 * dt;

  // scale
  if (scale == "+") {
    upScale();
    scale = undefined;
  } else if (scale == "-") {
    downScale();
    scale = undefined;
  }

  if (dir == "Enter") {
  } else if (dir == "ArrowRight") {
    yAngle += 2 * Math.PI * dt;
  } else if (dir == "ArrowLeft") {
    yAngle -= 2 * Math.PI * dt;
  } else if (dir == "ArrowUp") {
    xAngle -= 2 * Math.PI * dt;
  } else if (dir == "ArrowDown") {
    xAngle += 2 * Math.PI * dt;
  }

  if (trs == "w") {
    dy += 0.0005;
  } else if (trs == "s") {
    dy -= 0.0005;
  } else if (trs == "a") {
    dx -= 0.0005;
  } else if (trs == "d") {
    dx += 0.0005;
  } else if (trs == "q") {
    dx = 0;
    dy = 0;
  }

  clear();
  // for (const v of vs) {
  //   point(
  //     screen(project(translate_z(rotate_xz(rotate_yz(v, xAngle), yAngle), dz))),
  //   );
  // }
  for (const f of fs) {
    for (let i = 0; i < f.length; i++) {
      const a = vs[f[i]];
      const b = vs[f[(i + 1) % f.length]];
      line(
        screen(
          project(
            translate_z(
              translate_y(
                translate_x(rotate_xz(rotate_yz(a, xAngle), yAngle), dx),
                dy,
              ),
              dz,
            ),
          ),
        ),
        screen(
          project(
            translate_z(
              translate_y(
                translate_x(rotate_xz(rotate_yz(b, xAngle), yAngle), dx),
                dy,
              ),
              dz,
            ),
          ),
        ),
      );
    }
  }

  setTimeout(draw, 3000 / FPS);
}

direction();
setTimeout(draw, 3000 / FPS);
