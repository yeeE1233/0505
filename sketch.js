// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // Create a canvas that fills the entire screen
  let canvas = createCanvas(windowWidth, windowHeight);
  
  // Center the canvas on the screen
  canvas.style('display', 'block');
  canvas.position(0, 0); // Ensure the canvas starts at the top-left corner
  canvas.parent('body');

  // Use the device's camera
  video = createCapture({
    video: {
      facingMode: "user" // Use "environment" for rear camera
    }
  });

  // Match the video size to the canvas size
  video.size(windowWidth, windowHeight);
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(0); // Black background for better visibility
  image(video, 0, 0, width, height); // Scale video to fill the canvas

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
          circle(keypoint.x * width / video.width, keypoint.y * height / video.height, 16);
        }

        // Draw lines connecting keypoints for specific fingers
        const fingers = [
          { start: 1, end: 4 },  // Thumb
          { start: 5, end: 8 },  // Index finger
          { start: 9, end: 12 }, // Middle finger
          { start: 13, end: 16 }, // Ring finger
          { start: 17, end: 20 }  // Pinky finger
        ];

        for (let finger of fingers) {
          for (let i = finger.start; i < finger.end; i++) {
            let start = hand.keypoints[i];
            let end = hand.keypoints[i + 1];
            stroke(0, 255, 0);
            strokeWeight(4); // Make the lines thicker for better visibility
            line(
              start.x * width / video.width, start.y * height / video.height,
              end.x * width / video.width, end.y * height / video.height
            );
          }
        }
      }
    }
  }
}

function windowResized() {
  // Resize the canvas and video when the window size changes
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
