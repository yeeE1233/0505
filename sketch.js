// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

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

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Draw lines connecting keypoints for specific fingers
        // Thumb (keypoints 1 to 4)
        for (let i = 1; i < 4; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          stroke(0, 255, 0);
          line(start.x, start.y, end.x, end.y);
        }

        // Index finger (keypoints 5 to 8)
        for (let i = 5; i < 8; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          stroke(0, 255, 0);
          line(start.x, start.y, end.x, end.y);
        }

        // Middle finger (keypoints 9 to 12)
        for (let i = 9; i < 12; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          stroke(0, 255, 0);
          line(start.x, start.y, end.x, end.y);
        }

        // Ring finger (keypoints 13 to 16)
        for (let i = 13; i < 16; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          stroke(0, 255, 0);
          line(start.x, start.y, end.x, end.y);
        }

        // Pinky finger (keypoints 17 to 20)
        for (let i = 17; i < 20; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          stroke(0, 255, 0);
          line(start.x, start.y, end.x, end.y);
        }
      }
    }
  }
}
