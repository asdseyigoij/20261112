// 宣告全域變數
let stopSpriteSheet; // 停止狀態的圖片精靈
let walkSpriteSheet; // 走路狀態的圖片精靈
let pushSpriteSheet; // 發功狀態的圖片精靈（空白鍵）
let jumpSpriteSheet; // 跳躍狀態的圖片精靈（上鍵）

let stopTotalFrames = 13; // 停止精靈圖總幀數
let walkTotalFrames = 8;  // 走路精靈圖總幀數
let pushTotalFrames = 24; // 發功精靈圖總幀數（24張）
let jumpTotalFrames = 19; // 跳躍精靈圖總幀數（19張）

let currentFrame = 0; // 目前顯示的畫格索引
let stopFrameWidth, stopFrameHeight;
let walkFrameWidth, walkFrameHeight;
let pushFrameWidth, pushFrameHeight; // 發功圖單張寬高（寬 3259, 高 171）
let jumpFrameWidth, jumpFrameHeight; // 跳躍圖單張寬高（寬 3054, 高 214）

let scaledWidth;  // 調整大小後的角色顯示寬度
let scaledHeight; // 調整大小後的角色顯示高度

let xPos; // 角色在畫布上的 X 軸座標
let yPos; // 角色在畫布上的 Y 軸座標

let animFrameRate = 14; // 動畫播放的幀率
let moveSpeed = 15;     // 角色移動速度

let direction = 1;         // 移動方向：1 表示面向右方，-1 表示面向左方
let currentState = 'stop'; // 目前狀態：'stop', 'walkRight', 'walkLeft', 'push', 'jump'

function preload() {
  // 預先載入所有動作的圖片精靈檔案
  stopSpriteSheet = loadImage('1/stop/stop.png');
  walkSpriteSheet = loadImage('1/walk/walk.png');
  pushSpriteSheet = loadImage('1/push/push.png');
  jumpSpriteSheet = loadImage('1/jump/jump.png');
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  frameRate(animFrameRate);
  
  // 計算各動作單張圖片的寬高
  stopFrameWidth = 1529 / stopTotalFrames;
  stopFrameHeight = 183;
  
  walkFrameWidth = 1019 / walkTotalFrames;
  walkFrameHeight = 195;
  
  pushFrameWidth = 3259 / pushTotalFrames;
  pushFrameHeight = 171;
  
  jumpFrameWidth = 3054 / jumpTotalFrames;
  jumpFrameHeight = 214;
  
  // 設定角色高度約為畫布的 1/3，並按比例計算寬度
  scaledHeight = windowHeight / 3;
  scaledWidth = (walkFrameWidth * scaledHeight) / walkFrameHeight;
  
  // 初始位置設定在畫布 X 軸的 2/3 位置，底部貼齊畫布底端
  xPos = (windowWidth * 2) / 3;
  yPos = windowHeight - scaledHeight;
}

function draw() {
  // 每一幀重新繪製淺紫色背景（RGB: 230, 230, 250），防止殘影
  background(230, 230, 250);
  
  // 處理左右移動邏輯
  if (currentState === 'walkRight') {
    if (xPos < windowWidth - scaledWidth) {
      xPos += moveSpeed;
    } else {
      xPos = windowWidth - scaledWidth;
    }
  } else if (currentState === 'walkLeft') {
    if (xPos > 0) {
      xPos -= moveSpeed;
    } else {
      xPos = 0;
    }
  }
  
  // 開始繪製角色
  push();
  if (direction === -1) {
    translate(xPos + scaledWidth, yPos);
    scale(-1, 1);
    drawCurrentSprite(0);
  } else {
    translate(xPos, yPos);
    drawCurrentSprite(0);
  }
  pop();
  
  // 更新動畫畫格與播放邏輯
  updateAnimationFrames();
}

// 根據目前狀態繪製對應的精靈圖
function drawCurrentSprite(ox) {
  if (currentState === 'stop') {
    image(stopSpriteSheet, ox, 0, scaledWidth, scaledHeight, currentFrame * stopFrameWidth, 0, stopFrameWidth, stopFrameHeight);
  } else if (currentState === 'walkRight' || currentState === 'walkLeft') {
    image(walkSpriteSheet, ox, 0, scaledWidth, scaledHeight, currentFrame * walkFrameWidth, 0, walkFrameWidth, walkFrameHeight);
  } else if (currentState === 'push') {
    image(pushSpriteSheet, ox, 0, scaledWidth, scaledHeight, currentFrame * pushFrameWidth, 0, pushFrameWidth, pushFrameHeight);
  } else if (currentState === 'jump') {
    image(jumpSpriteSheet, ox, 0, scaledWidth, scaledHeight, currentFrame * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight);
  }
}

// 更新動畫畫格與單次播放判定
function updateAnimationFrames() {
  if (currentState === 'stop') {
    currentFrame = (currentFrame + 1) % stopTotalFrames;
  } else if (currentState === 'walkRight' || currentState === 'walkLeft') {
    currentFrame = (currentFrame + 1) % walkTotalFrames;
  } else if (currentState === 'push') {
    currentFrame++;
    // 播放完 24 張後執行一次就回到 stop 狀態
    if (currentFrame >= pushTotalFrames) {
      currentState = 'stop';
      currentFrame = 0;
    }
  } else if (currentState === 'jump') {
    currentFrame++;
    // 播放完 19 張後執行一次就回到 stop 狀態
    if (currentFrame >= jumpTotalFrames) {
      currentState = 'stop';
      currentFrame = 0;
    }
  }
}

function keyPressed() {
  // 如果正在執行單次動畫（push 或 jump），則不允許中斷
  if (currentState === 'push' || currentState === 'jump') {
    return;
  }
  
  // 當按下右鍵
  if (keyCode === RIGHT_ARROW) {
    currentState = 'walkRight';
    direction = 1;
    currentFrame = 0;
  } 
  // 當按下左鍵
  else if (keyCode === LEFT_ARROW) {
    currentState = 'walkLeft';
    direction = -1;
    currentFrame = 0;
  } 
  // 當按下空白鍵（發功 Push）
  else if (key === ' ' || keyCode === 32) {
    currentState = 'push';
    currentFrame = 0;
  }
  // 當按下上鍵（跳躍 Jump）
  else if (keyCode === UP_ARROW) {
    currentState = 'jump';
    currentFrame = 0;
  }
}

function keyReleased() {
  // 當放開左右方向鍵時，如果沒有在做特殊動作，切回停止狀態
  if ((keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) && (currentState === 'walkRight' || currentState === 'walkLeft')) {
    currentState = 'stop';
    currentFrame = 0;
  }
}

function windowResized() {
  // 視窗大小改變時自動調整畫布與比例
  resizeCanvas(windowWidth, windowHeight);
  scaledHeight = windowHeight / 3;
  scaledWidth = (walkFrameWidth * scaledHeight) / walkFrameHeight;
  yPos = windowHeight - scaledHeight;
}