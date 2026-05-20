// =============================
// 可调整参数区
// =============================

const CANVAS_W = 900;
const CANVAS_H = 1200;

// 信纸
const PAPER_X = 130;
const PAPER_Y = 80;
const PAPER_W = 640;
const PAPER_H = 1040;

const LINE_COUNT = 8;
const LINE_COLOR = [145, 48, 38, 120];

// 正文字体
const TEXT_SIZE = 34;
const TEXT_START_Y = 187;
const TEXT_CHAR_GAP = 42;
const TEXT_REVEAL_GAP = 5;
const TEXT_REVEAL_DURATION = 28;

// 正文列位置：右 → 左
const BODY_COL_INDEXES = [7, 6, 5, 4];

// 落款位置：最左边
const SIGN_X_COL_INDEX = 0;
const SIGN_START_Y = 840;
const SIGN_CHAR_GAP = 48;

// 三轮车 → 船：左 → 右
const VEHICLE_START_FRAME = 0;
const VEHICLE_FADE_DURATION = 90;
const VEHICLE_TO_RIGHT_DURATION = 460;
const VEHICLE_X_START = 95;
const VEHICLE_X_END = 900;
const VEHICLE_Y = 650;
const VEHICLE_FLOAT = 7;
const VEHICLE_SCALE = 0.64;

// 三轮车变船的区间
const MORPH_START_RATIO = 0.6;
const MORPH_END_RATIO = 0.8;
const VEHICLE_HANDOFF_RATIO = MORPH_END_RATIO;
const VEHICLE_HANDOFF_FRAME = Math.round(VEHICLE_TO_RIGHT_DURATION * VEHICLE_HANDOFF_RATIO);
const VEHICLE_HANDOFF_X =
  VEHICLE_X_START +
  (VEHICLE_X_END - VEHICLE_X_START) * easeInOutQuickBrake(VEHICLE_HANDOFF_RATIO);

// 船：成船后立刻向左开，直接开出纸面
const BOAT_RETURN_START_FRAME = VEHICLE_START_FRAME + VEHICLE_HANDOFF_FRAME + 1;
const BOAT_RETURN_DURATION = 520;
const BOAT_X_START = VEHICLE_HANDOFF_X;
const BOAT_X_EXIT = PAPER_X - 330;
const BOAT_Y_START = VEHICLE_Y;
const BOAT_Y_EXIT = 925;
const BOAT_FLOAT = 7;
const BOAT_SCALE = 0.68;

// 船路过落款时，夫木生 → 謝南枝
const SIGNATURE_TRIGGER_DISTANCE = 50;
const SIGNATURE_MORPH_DURATION = 190;

const NANZHI_TEXT = "謝南枝";
const NANZHI_TEXT_SIZE = 42;
const NANZHI_CHAR_GAP = 58;

// 文字避让 / 散开
const AVOID_RADIUS = 128;
const AVOID_STRENGTH = 72;
const LOCAL_SCATTER_X = 105;
const LOCAL_SCATTER_Y = 85;
const RETURN_SCATTER_X = 320;
const RETURN_SCATTER_Y = 250;
const SCATTER_ROTATE = 1.35;
const BODY_DISSOLVE_START_RATIO = 0.08;
const BODY_DISSOLVE_END_RATIO = 0.9;

// 船阶段涟漪
const RIPPLE_INTERVAL = 14;
const RIPPLE_STRENGTH = 20;
const RIPPLE_SPEED = 3.3;
const RIPPLE_MAX_RADIUS = 540;

// =============================
// 文字内容
// =============================

let bodyCols = [
  "與妻一別，八載有餘，日思夜想，歸期遙遙",
  "唯化數念做拼搏，憑勤儉來立業，今把",
  "三輪換貨船，終得揚帆啟航，江海有岸",
  "團圓可盼。"
];

let signature = "夫，木生。";

let bodyGlyphs = [];
let signatureGlyphs = [];
let ripples = [];
let startFrame = 0;
let signatureTriggerFrame = null;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  pixelDensity(2);
  textFont('"WordArtCustom", serif');
  textAlign(CENTER, CENTER);

  buildGlyphs();
  startFrame = frameCount;
}

function draw() {
  let f = frameCount - startFrame;

  background(238, 224, 198);

  drawTexture();
  drawPaper();

  updateRipples();
  drawRippleRings();

  drawLines();

  updateSignatureTrigger(f);

  drawBodyText(f);
  drawSignatureText(f);

  drawVehicleToRightStage(f);
  drawBoatReturnStage(f);
}

function mousePressed() {
  startFrame = frameCount;
  ripples = [];
  signatureTriggerFrame = null;
}

// =============================
// 坐标工具
// =============================

function getColumnCenter(index) {
  let gap = PAPER_W / LINE_COUNT;
  return PAPER_X + gap * index + gap / 2;
}

function getSignatureX() {
  return getColumnCenter(SIGN_X_COL_INDEX);
}

function getSignatureCenterY() {
  return SIGN_START_Y + SIGN_CHAR_GAP * 2;
}

// =============================
// 生成文字
// =============================

function buildGlyphs() {
  bodyGlyphs = [];
  signatureGlyphs = [];

  let order = 0;

  for (let c = 0; c < bodyCols.length; c++) {
    let str = bodyCols[c];
    let x = getColumnCenter(BODY_COL_INDEXES[c]);

    for (let i = 0; i < str.length; i++) {
      bodyGlyphs.push({
        char: str[i],
        x,
        y: TEXT_START_Y + i * TEXT_CHAR_GAP,
        order
      });
      order++;
    }
  }

  let signX = getSignatureX();

  for (let i = 0; i < signature.length; i++) {
    signatureGlyphs.push({
      char: signature[i],
      x: signX,
      y: SIGN_START_Y + i * SIGN_CHAR_GAP,
      order
    });
    order++;
  }
}

function revealAmount(order, f) {
  return constrain((f - order * TEXT_REVEAL_GAP) / TEXT_REVEAL_DURATION, 0, 1);
}

// =============================
// 纸张
// =============================

function drawTexture() {
  randomSeed(12);
  noStroke();

  for (let i = 0; i < 1500; i++) {
    fill(95, 65, 35, random(3, 9));
    circle(random(width), random(height), random(0.4, 1.8));
  }
}

function drawPaper() {
  noStroke();

  fill(245, 226, 202, 190);
  rect(PAPER_X, PAPER_Y, PAPER_W, PAPER_H);

  fill(180, 115, 80, 20);
  rect(PAPER_X, PAPER_Y, PAPER_W, 50);
  rect(PAPER_X, PAPER_Y + PAPER_H - 55, PAPER_W, 55);

  stroke(120, 75, 45, 18);
  strokeWeight(1);
  line(PAPER_X + 120, PAPER_Y, PAPER_X + 96, PAPER_Y + PAPER_H);
  line(PAPER_X + PAPER_W - 60, PAPER_Y, PAPER_X + PAPER_W - 82, PAPER_Y + PAPER_H);
}

// =============================
// 红线：直接出现
// =============================

function drawLines() {
  let gap = PAPER_W / LINE_COUNT;

  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], LINE_COLOR[3]);
  strokeWeight(1);
  noFill();

  rect(PAPER_X, PAPER_Y, PAPER_W, PAPER_H);

  for (let i = 1; i < LINE_COUNT; i++) {
    let x = PAPER_X + i * gap;

    beginShape();
    for (let y = PAPER_Y; y <= PAPER_Y + PAPER_H; y += 8) {
      let o = rippleOffset(x, y);
      vertex(x + o.x * 0.32, y + o.y * 0.32);
    }
    endShape();
  }
}

// =============================
// 正文：逐字出现 + 避让 + 船返回时消散
// =============================

function drawBodyText(f) {
  textSize(TEXT_SIZE);
  textAlign(CENTER, CENTER);

  let returnProgress = getBoatReturnProgress(f);
  let dissolveProgress = smoothstep(
    BODY_DISSOLVE_START_RATIO,
    BODY_DISSOLVE_END_RATIO,
    returnProgress
  );
  let globalScatter = dissolveProgress;
  let globalFade = 1 - dissolveProgress;

  for (let g of bodyGlyphs) {
    let appear = revealAmount(g.order, f);
    if (appear <= 0) continue;

    let avoid = vehicleAvoidData(g.x, g.y, f);

    // 碰撞时直接散开；不再叠加避让位移，避免文字回弹。
    let localScatter = avoid.amount;
    let scatter = max(globalScatter, localScatter);

    let sx = noise(g.order * 0.31, 2.1) * 2 - 1;
    let sy = noise(g.order * 0.47, 8.8) * 2 - 1;

    let scatterX =
      sx * LOCAL_SCATTER_X * localScatter +
      sx * RETURN_SCATTER_X * globalScatter;

    let scatterY =
      sy * LOCAL_SCATTER_Y * localScatter +
      sy * RETURN_SCATTER_Y * globalScatter;

    let rot = sx * SCATTER_ROTATE * scatter;

    let fade = globalFade * (1 - constrain(localScatter * 0.85, 0, 1));
    let alpha = 230 * appear * fade;

    if (alpha <= 1) continue;

    push();
    translate(
      g.x + scatterX,
      g.y + scatterY
    );
    rotate(rot);

    noStroke();

    fill(20, 18, 15, alpha * 0.16);
    text(g.char, 1.5, 1.5);

    fill(20, 18, 15, alpha);
    text(g.char, 0, 0);

    pop();
  }
}

// =============================
// 落款：夫，木生。→ 謝南枝
// =============================

function updateSignatureTrigger(f) {
  if (signatureTriggerFrame !== null) return;

  let state = getBoatReturnState(f);
  if (!state) return;

  let signX = getSignatureX();
  let signY = getSignatureCenterY();

  let d = dist(state.x, state.y + 35, signX, signY);

  // 船路过落款处时触发
  if (d < SIGNATURE_TRIGGER_DISTANCE || state.x < signX + 20) {
    signatureTriggerFrame = f;
  }
}

function drawSignatureText(f) {
  if (signatureTriggerFrame === null) {
    drawOriginalSignature(f);
    return;
  }

  let localF = f - signatureTriggerFrame;
  let morph = constrain(localF / SIGNATURE_MORPH_DURATION, 0, 1);
  let eased = smoothstep(0, 1, morph);

  if (morph < 1) {
    drawSignatureMorph(f, eased);
  } else {
    drawFinalNanZhi(f);
  }
}

function drawOriginalSignature(f) {
  textSize(TEXT_SIZE);
  textAlign(CENTER, CENTER);

  for (let g of signatureGlyphs) {
    let appear = revealAmount(g.order, f);
    if (appear <= 0) continue;

    push();
    translate(g.x, g.y);

    noStroke();
    fill(20, 18, 15, 230 * appear * 0.16);
    text(g.char, 1.5, 1.5);

    fill(20, 18, 15, 230 * appear);
    text(g.char, 0, 0);

    pop();
  }
}

function drawSignatureMorph(f, m) {
  let signX = getSignatureX();

  textAlign(CENTER, CENTER);

  // 旧落款退场：夫，木生。
  textSize(TEXT_SIZE);

  for (let i = 0; i < signatureGlyphs.length; i++) {
    let oldG = signatureGlyphs[i];

    let mappedIndex = floor(map(i, 0, signatureGlyphs.length - 1, 0, NANZHI_TEXT.length - 1));
    let targetY = SIGN_START_Y + mappedIndex * NANZHI_CHAR_GAP;

    let x = lerp(oldG.x, signX, m);
    let y = lerp(oldG.y, targetY, m);

    let alpha = 230 * (1 - m);
    let scaleV = lerp(1, 0.66, m);

    push();
    translate(x, y);
    scale(scaleV);
    rotate((i - 2) * 0.13 * m);

    noStroke();
    fill(20, 18, 15, alpha);
    text(oldG.char, 0, 0);

    pop();
  }

  // 新落款出现：謝南枝
  textSize(NANZHI_TEXT_SIZE);

  for (let i = 0; i < NANZHI_TEXT.length; i++) {
    let targetX = signX;
    let targetY = SIGN_START_Y + i * NANZHI_CHAR_GAP;

    let sourceIndex = floor(map(i, 0, NANZHI_TEXT.length - 1, 0, signatureGlyphs.length - 1));
    let source = signatureGlyphs[sourceIndex];

    let x = lerp(source.x, targetX, m);
    let y = lerp(source.y, targetY, m);

    let alpha = 235 * m;
    let scaleV = lerp(0.72, 1, m);

    push();
    translate(x, y);
    scale(scaleV);

    noStroke();
    fill(20, 18, 15, alpha * 0.13);
    text(NANZHI_TEXT[i], 1.5, 1.5);

    fill(20, 18, 15, alpha);
    text(NANZHI_TEXT[i], 0, 0);

    pop();
  }
}

function drawFinalNanZhi(f) {
  let signX = getSignatureX();

  textSize(NANZHI_TEXT_SIZE);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < NANZHI_TEXT.length; i++) {
    let x = signX;
    let y = SIGN_START_Y + i * NANZHI_CHAR_GAP;

    push();
    translate(x, y);

    noStroke();
    fill(20, 18, 15, 235 * 0.13);
    text(NANZHI_TEXT[i], 1.5, 1.5);

    fill(20, 18, 15, 235);
    text(NANZHI_TEXT[i], 0, 0);

    pop();
  }
}

// =============================
// 文字自动避让
// =============================

function vehicleAvoidData(x, y, f) {
  let influences = getVehicleInfluences(f);

  let amount = 0;

  for (let inf of influences) {
    let dx = x - inf.x;
    let dy = y - inf.y;
    let d = sqrt(dx * dx + dy * dy);

    if (d < inf.r) {
      let p = 1 - d / inf.r;
      amount = max(amount, p);
    }
  }

  return {
    amount
  };
}

function getVehicleInfluences(f) {
  let arr = [];

  let toRight = getVehicleToRightState(f);
  if (toRight) {
    arr.push({
      x: toRight.x,
      y: toRight.y + 20,
      r: AVOID_RADIUS,
      strength: AVOID_STRENGTH * toRight.alpha
    });
  }

  let back = getBoatReturnState(f);
  if (back) {
    arr.push({
      x: back.x,
      y: back.y + 25,
      r: AVOID_RADIUS * 0.92,
      strength: AVOID_STRENGTH * 0.9
    });
  }

  return arr;
}

// =============================
// 涟漪：只在船返回阶段产生
// =============================

function rippleOffset(x, y) {
  let ox = 0;
  let oy = 0;

  for (let r of ripples) {
    let dx = x - r.x;
    let dy = y - r.y;
    let d = sqrt(dx * dx + dy * dy);
    let diff = abs(d - r.radius);

    if (diff < 78) {
      let force = map(diff, 0, 78, r.strength, 0);
      let wave = sin(diff * 0.18 - r.age * 0.16);

      ox += (dx / max(d, 1)) * force * wave;
      oy += (dy / max(d, 1)) * force * wave;
    }
  }

  return createVector(ox, oy);
}

function updateRipples() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];

    r.age++;
    r.radius += RIPPLE_SPEED;
    r.strength *= 0.982;

    if (r.radius > RIPPLE_MAX_RADIUS || r.strength < 0.6) {
      ripples.splice(i, 1);
    }
  }
}

function drawRippleRings() {
  noFill();

  for (let r of ripples) {
    stroke(95, 68, 42, map(r.strength, 0, RIPPLE_STRENGTH, 0, 62));
    strokeWeight(1);

    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.045) {
      let wobble = sin(a * 7 + r.age * 0.08) * 3;
      let rx = cos(a) * (r.radius + wobble);
      let ry = sin(a) * (r.radius * 0.62 + wobble);
      vertex(r.x + rx, r.y + ry);
    }
    endShape(CLOSE);
  }
}

// =============================
// 阶段 1：三轮车从左到右，并变成船
// =============================

function getVehicleToRightState(f) {
  let vf = f - VEHICLE_START_FRAME;
  if (vf < 0 || vf > VEHICLE_HANDOFF_FRAME) return null;

  let progress = constrain(vf / VEHICLE_TO_RIGHT_DURATION, 0, 1);
  let eased = easeInOutQuickBrake(progress);

  return {
    progress,
    eased,
    alpha: smoothstep(0, VEHICLE_FADE_DURATION, vf),
    x: lerp(VEHICLE_X_START, VEHICLE_X_END, eased),
    y: VEHICLE_Y + sin(progress * TWO_PI) * VEHICLE_FLOAT
  };
}

function drawVehicleToRightStage(f) {
  let state = getVehicleToRightState(f);
  if (!state) return;

  let morph = smoothstep(MORPH_START_RATIO, MORPH_END_RATIO, state.progress);

  drawRickshawToBoat(state.x, state.y, morph, state.alpha, 1);
}

// =============================
// 阶段 2：船从右到左，路过落款，再开出纸面
// =============================

function getBoatReturnProgress(f) {
  let bf = f - BOAT_RETURN_START_FRAME;
  if (bf < 0) return 0;
  return constrain(bf / BOAT_RETURN_DURATION, 0, 1);
}

function getBoatReturnState(f) {
  let bf = f - BOAT_RETURN_START_FRAME;
  if (bf < 0 || bf > BOAT_RETURN_DURATION) return null;

  let progress = constrain(bf / BOAT_RETURN_DURATION, 0, 1);
  let eased = easeInOutCubic(progress);

  return {
    progress,
    eased,
    x: lerp(BOAT_X_START, BOAT_X_EXIT, progress),
    y: lerp(BOAT_Y_START, BOAT_Y_EXIT, eased) + sin(progress * TWO_PI) * BOAT_FLOAT
  };
}

function drawBoatReturnStage(f) {
  let state = getBoatReturnState(f);
  if (!state) return;

  // 开出纸面时淡出
  let exitFade = smoothstep(0.83, 1, state.progress);
  let alpha = 1 - exitFade;
  if (alpha <= 0) return;

  // 车变成船时已经是返航方向，这里不再额外转向。
  let directionScale = -1;

  // 船阶段产生涟漪
  let bf = f - BOAT_RETURN_START_FRAME;
  if (bf % RIPPLE_INTERVAL === 0 && state.progress < 0.86) {
    ripples.push({
      x: state.x,
      y: state.y + 38,
      radius: 5,
      age: 0,
      strength: RIPPLE_STRENGTH
    });
  }

  drawBoat(state.x, state.y, alpha, 1, directionScale);
}

// =============================
// 三轮车 → 船 形变绘制
// direction = 1：朝右
// =============================

function drawRickshawToBoat(x, y, m, alphaMul, direction) {
  push();

  translate(x, y);
  let vehicleScale = lerp(VEHICLE_SCALE, BOAT_SCALE, m);
  scale(direction * vehicleScale, vehicleScale);

  drawingContext.globalAlpha = alphaMul;

  let carA = 220 * (1 - m);
  let boatA = 230 * m;

  strokeWeight(2);
  noFill();

  // =========================
  // 三轮车部分：朝右，逐渐变船
  // =========================

  stroke(28, 24, 20, carA);

  // 前大轮在右
  let frontWheelR = lerp(38, 3, m);
  ellipse(95, 42, frontWheelR * 2, frontWheelR * 2);

  for (let a = 0; a < TWO_PI; a += PI / 8) {
    line(
      95,
      42,
      95 + cos(a) * frontWheelR * (1 - m),
      42 + sin(a) * frontWheelR * (1 - m)
    );
  }

  // 后轮在左
  let backWheelR = lerp(35, 3, m);
  ellipse(-100, 44, backWheelR * 2, backWheelR * 2);

  for (let a = 0; a < TWO_PI; a += PI / 8) {
    line(
      -100,
      44,
      -100 + cos(a) * backWheelR * (1 - m),
      44 + sin(a) * backWheelR * (1 - m)
    );
  }

  // 车架逐渐拉平到船身
  stroke(28, 24, 20, carA);
  line(95, 42, lerp(45, 8, m), lerp(-10, 44, m));
  line(45, -10, lerp(-25, -92, m), lerp(42, 58, m));
  line(95, 42, lerp(-25, -92, m), lerp(42, 58, m));
  line(45, -10, -20, -8);
  line(-20, -8, -80, 42);

  // 车把
  line(98, 8, 132, -14);
  line(132, -14, 115, -22);
  line(98, 8, 95, 42);

  // 座椅
  noStroke();
  fill(28, 24, 20, carA);
  ellipse(5, -18, 42 * (1 - m), 14 * (1 - m));

  // 左侧车厢
  noFill();
  stroke(28, 24, 20, carA);
  rect(-145, -22, 100 * (1 - m * 0.55), 66 * (1 - m * 0.35), 8);

  // 座垫
  fill(160, 80, 45, 70 * (1 - m));
  noStroke();
  rect(-135, -8, 76 * (1 - m), 36 * (1 - m), 5);

  // 顶棚支架
  noFill();
  stroke(28, 24, 20, carA);
  line(-52, -22, lerp(-40, 8, m), lerp(-105, -118, m));
  line(-132, -22, lerp(-145, 8, m), lerp(-105, -118, m));
  line(-40, -105, -145, -105);

  // 顶棚逐渐消失
  fill(28, 24, 20, 90 * (1 - m));
  noStroke();
  quad(-35, -112, -150, -112, -145, -94, -42, -94);

  // =========================
  // 船部分：逐渐出现，无船舱
  // =========================

  push();
  scale(-1, 1);
  drawBoatCore(boatA);
  pop();

  pop();
}

// =============================
// 船：无船舱
// directionScale 控制船的朝向：-1 为返航方向
// =============================

function drawBoat(x, y, alphaMul, scaleMul, directionScale) {
  push();

  translate(x, y);
  scale(directionScale * BOAT_SCALE * scaleMul, BOAT_SCALE * scaleMul);

  drawingContext.globalAlpha = alphaMul;

  drawBoatCore(230);

  pop();
}

function drawBoatCore(alpha) {
  if (alpha <= 0) return;

  // 船身
  fill(28, 24, 20, alpha);
  stroke(28, 24, 20, alpha);
  strokeWeight(2);

  beginShape();
  vertex(-120, 48);
  vertex(130, 48);
  vertex(92, 76);
  vertex(-82, 72);
  endShape(CLOSE);

  // 桅杆
  stroke(28, 24, 20, alpha * 0.96);
  strokeWeight(2);
  line(8, 44, 8, -120);

  // 帆
  noStroke();

  fill(28, 24, 20, alpha * 0.33);
  triangle(8, -120, 8, 44, 88, 24);

  fill(28, 24, 20, alpha * 0.21);
  triangle(8, -102, 8, 44, -48, 28);

  // 水面影
  noStroke();
  fill(40, 32, 25, alpha * 0.14);
  ellipse(10, 78, 200, 20);
}

// =============================
// easing
// =============================

function smoothstep(edge0, edge1, x) {
  let v = constrain((x - edge0) / (edge1 - edge0), 0, 1);
  return v * v * (3 - 2 * v);
}

function easeInOutCubic(x) {
  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeInOutQuickBrake(x) {
  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 2.6) / 2;
}
