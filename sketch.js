// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize = 100;
let isDragging = false; // 用於判斷是否正在用食指拖動圓
let isDraggingThumb = false; // 用於判斷是否正在用大拇指拖動圓
let previousX, previousY; // 儲存食指的上一個位置
let previousThumbX, previousThumbY; // 儲存大拇指的上一個位置
let trailGraphics; // 用於繪製軌跡的圖層

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 初始化圓的位置
  circleX = width / 2;
  circleY = height / 2;

  // 建立一個圖層來繪製軌跡
  trailGraphics = createGraphics(width, height);
  trailGraphics.clear();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 顯示軌跡圖層
  image(trailGraphics, 0, 0);

  // 畫出圓
  fill(0, 255, 0, 150);
  noStroke();
  circle(circleX, circleY, circleSize);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    let isTouching = false; // 判斷是否有食指接觸圓
    let isTouchingThumb = false; // 判斷是否有大拇指接觸圓

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 獲取食指的座標 (keypoints[8])
        let fingertip = hand.keypoints[8];
        // 獲取大拇指的座標 (keypoints[4])
        let thumbTip = hand.keypoints[4];

        // 計算食指與圓心的距離
        let dFinger = dist(fingertip.x, fingertip.y, circleX, circleY);
        // 計算大拇指與圓心的距離
        let dThumb = dist(thumbTip.x, thumbTip.y, circleX, circleY);

        // 如果食指接觸到圓，讓圓跟隨食指移動
        if (dFinger < circleSize / 2) {
          isTouching = true;

          // 如果之前沒有在拖動，初始化上一個位置
          if (!isDragging) {
            previousX = fingertip.x;
            previousY = fingertip.y;
          }

          // 更新圓的位置
          circleX = fingertip.x;
          circleY = fingertip.y;

          // 在圖層上畫出食指的軌跡
          trailGraphics.stroke(235, 0, 0); // 紅色線條
          trailGraphics.strokeWeight(20); // 線條粗細為 20
          trailGraphics.line(previousX, previousY, fingertip.x, fingertip.y);

          // 更新上一個位置
          previousX = fingertip.x;
          previousY = fingertip.y;

          isDragging = true;
        }

        // 如果大拇指接觸到圓，讓圓跟隨大拇指移動
        if (dThumb < circleSize / 2) {
          isTouchingThumb = true;

          // 如果之前沒有在拖動，初始化上一個位置
          if (!isDraggingThumb) {
            previousThumbX = thumbTip.x;
            previousThumbY = thumbTip.y;
          }

          // 更新圓的位置
          circleX = thumbTip.x;
          circleY = thumbTip.y;

          // 在圖層上畫出大拇指的軌跡
          trailGraphics.stroke(0, 255, 0); // 綠色線條
          trailGraphics.strokeWeight(10); // 線條粗細為 10
          trailGraphics.line(previousThumbX, previousThumbY, thumbTip.x, thumbTip.y);

          // 更新上一個位置
          previousThumbX = thumbTip.x;
          previousThumbY = thumbTip.y;

          isDraggingThumb = true;
        }

        // 繪製食指的點
        if (hand.handedness == "Left") {
          fill(255, 0, 255); // 左手顏色
        } else {
          fill(255, 255, 0); // 右手顏色
        }
        noStroke();
        circle(fingertip.x, fingertip.y, 16);

        // 繪製大拇指的點
        fill(0, 255, 255); // 大拇指顏色
        noStroke();
        circle(thumbTip.x, thumbTip.y, 16);
      }
    }

    // 如果沒有手指接觸圓，停止拖動
    if (!isTouching) {
      isDragging = false;
    }
    if (!isTouchingThumb) {
      isDraggingThumb = false;
    }
  }
}

