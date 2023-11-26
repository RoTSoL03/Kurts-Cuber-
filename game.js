// Create the scene and camera
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2;  // Position the camera higher
camera.position.z = 5;

// Load the background texture
let textureLoader = new THREE.TextureLoader();
let backgroundTexture = textureLoader.load('bg.jpeg');

// Set the background of the scene
scene.background = backgroundTexture;

// Create the renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the cube
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 0.5;  // Position the cube on the platform
scene.add(cube);

// Add a black outline to the cube
let outlineGeometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
let outlineMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide});
let outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
cube.add(outline);

// Create the platforms
let platformGeometry = new THREE.BoxGeometry(5, 0.1, 5);
let platformMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
for (let i = 0; i < 10; i++) {
  let platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = -1;  // Position the platform below the cube
  platform.position.z = -i * 5;  // Position the platforms along the z-axis
  scene.add(platform);
}

// Define the colors
let colors = [
  new THREE.Color('blue'),
  new THREE.Color('gold'),
  new THREE.Color('red'),
  new THREE.Color('purple')
];
let colorIndex = 0;

// Create the obstacles
let obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
let obstacleMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
let obstacles = [];
for (let i = 0; i < 10; i++) {
  // Use the colors array for the obstacle material
  let obstacleMaterial = new THREE.MeshBasicMaterial({color: colors[colorIndex]});
  let obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  obstacle.position.y = 0;  // Lower the obstacle to touch the platform
  obstacle.position.z = -(i * 10 + 10);  // Position the obstacles further apart along the z-axis
  obstacle.position.x = Math.random() * 4 - 2;  // Position the obstacles randomly along the x-axis
  obstacles.push(obstacle);
  scene.add(obstacle);
  // Cycle through the colors
  colorIndex = (colorIndex + 1) % colors.length;

  // Add a glowing yellow outline to the obstacles
  let outlineGeometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
  let outlineMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.BackSide});
  let outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
  obstacle.add(outline);
}

// Create the spike obstacles
let spikeGeometry = new THREE.BoxGeometry(4, 1, 1);
let spikeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let spikes = [];

for (let i = 0; i < 10; i++) {
  if (Math.random() < 0.2) {  // Adjust the probability (e.g., 0.2 for 20% chance)
    let spikeMaterial = new THREE.MeshBasicMaterial({color: colors[colorIndex]});
    let spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
    spike.position.y = 0.0;  // Lower the spike to touch the platform
    spike.position.z = -(i * 10 + 10);  // Position the spikes further apart along the z-axis
    spike.position.x = Math.random() * 4 - 2;  // Position the spikes randomly along the x-axis
    spikes.push(spike);
    scene.add(spike);
    
    // Add a glowing yellow outline to the spikes
    let outlineGeometry = new THREE.BoxGeometry(4.1, 1.1, 1.1);
    let outlineMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.BackSide});
    let outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    spike.add(outline);

    // Cycle through the colors
    colorIndex = (colorIndex + 1) % colors.length;
  }
}


// Create the stars
let stars = [];
for (let i = 0; i < 100; i++) {
  let starGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  let starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.x = Math.random() * 10 - 5;
  star.position.y = Math.random() * 10;
  star.position.z = Math.random() * 10 - 5;
  stars.push(star);
  scene.add(star);  // Add stars to the main scene, not a specific cube
}


// Animation
let colorChangeSpeed = 0.01;  // Set the speed of the color change
let jumpTime = 200;  // Set the jump time to 1000 milliseconds (1 second)
let isJumping = false;
let jumpSpeed = 0.3;  // Increase the jump speed to make the cube jump higher
let fallSpeed = 0.2;  // Increase the fall speed to match the jump speed

let jumpRotation = 0;  // Variable to control the cube's rotation during jump
let spinSpeed = -0.5;   // Adjust the speed of cube spin during jump
let spinResetSpeed = 0.30;  // Adjust the speed of returning to the original angle

let obstacleSpeed = 0.05;
let isGameOver = false;
let score = 0;
let animate = function () {
  if (isGameOver) return;
  requestAnimationFrame(animate);

  // Continuous movement based on key flags
  if (moveLeft && cube.position.x > -2.5 + cube.geometry.parameters.width / 2) {
    cube.position.x -= 0.2;
  }
  if (moveRight && cube.position.x < 2.5 - cube.geometry.parameters.width / 2) {
    cube.position.x += 0.2;
  }
// Check for collisions with obstacles and spikes
  let cubeBox = new THREE.Box3().setFromObject(cube);

  for (let i = 0; i < obstacles.length; i++) {
    let obstacleBox = new THREE.Box3().setFromObject(obstacles[i]);
    if (cubeBox.intersectsBox(obstacleBox)) {
      isGameOver = true;
      updateHighScore();  // Update high score if needed
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      document.getElementById('gameOverScreen').style.display = 'flex';
    }
  }

  for (let i = 0; i < spikes.length; i++) {
    let spikeBox = new THREE.Box3().setFromObject(spikes[i]);
    if (cubeBox.intersectsBox(spikeBox)) {
      isGameOver = true;
      updateHighScore();  // Update high score if needed
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      document.getElementById('gameOverScreen').style.display = 'flex';
    }
  }

  if (isJumping) {
    if (jumpTime > 0) {
      cube.position.y += jumpSpeed;
      jumpRotation += spinSpeed;  // Increase the rotation angle during jump
      cube.rotation.x = jumpRotation;
      jumpTime -= 16.66;
    } else {
      isJumping = false;
      jumpTime = 200;
      jumpRotation = 0;  // Reset the jump rotation angle
    }
  } else if (cube.position.y > 0.5) {
    cube.position.y -= fallSpeed;
  } else {
    // Reset rotation angle when cube is on the ground
    cube.rotation.x -= spinResetSpeed;
    if (cube.rotation.x < 0) {
      cube.rotation.x = 0;
    }
  }

  // Move the stars
  for (let i = 0; i < stars.length; i++) {
    stars[i].position.z += obstacleSpeed;
    if (stars[i].position.z > 5) {
      stars[i].position.z = -5;  // Reposition the stars further away along the z-axis
      stars[i].position.x = Math.random() * 10 - 5;  // Reposition the stars randomly along the x-axis
    }
  }


  // Move the obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].position.z += obstacleSpeed;
    if (obstacles[i].position.z > 5) {
      obstacles[i].position.z = -95;  // Reposition the obstacles further away along the z-axis
      obstacles[i].position.x = Math.random() * 4 - 2;  // Reposition the obstacles randomly along the x-axis
      score++;  // Increase the score when the cube passes an obstacle
      document.getElementById('score').textContent = 'Score: ' + score;
    }

  }

  // Move the spike obstacles
  for (let i = 0; i < spikes.length; i++) {
    spikes[i].position.z += obstacleSpeed;
    if (spikes[i].position.z > 5) {
      spikes[i].position.z = -95;  // Reposition the spikes further away along the z-axis
      spikes[i].position.x = Math.random() * 4 - 2;  // Reposition the spikes randomly along the x-axis
    }
  }



  obstacleSpeed += 0.0002;  // Increase the obstacle speed...

  camera.position.x = cube.position.x;
  renderer.render(scene, camera);
};


// Flag variables for continuous movement
let moveLeft = false;
let moveRight = false;
// Keyboard controls
window.addEventListener('keydown', function (event) {
  if (isGameOver) return;
  switch (event.keyCode) {
    case 37: // Left arrow key
      moveLeft = true;
      break;
    case 39: // Right arrow key
      moveRight = true;
      break;
    case 32: // Space key
      if (!isJumping && cube.position.y <= 0.5) {
        isJumping = true;
      }
      break;
  }
}, false);

window.addEventListener('keyup', function (event) {
  // Reset the move flags on key release
  switch (event.keyCode) {
    case 37: // Left arrow key
      moveLeft = false;
      break;
    case 39: // Right arrow key
      moveRight = false;
      break;
  }
}, false);

// Update high score in local storage
function updateHighScore() {
  let currentHighScore = localStorage.getItem('highScore');
  if (currentHighScore === null || score > parseInt(currentHighScore)) {
    localStorage.setItem('highScore', score.toString());
  }
}

// Display high score
function displayHighScore() {
  let currentHighScore = localStorage.getItem('highScore');
  if (currentHighScore !== null) {
    document.getElementById('highScore').textContent = 'High Score: ' + currentHighScore;
  }
}

// Display high score on page load
displayHighScore();

let backgroundMusic = new Audio('press_start.mp3');

// Start button
document.getElementById('startButton').addEventListener('click', function () {
  document.getElementById('startScreen').style.display = 'none';
  backgroundMusic.play();
  animate();
});

// Restart button
document.getElementById('restartButton').addEventListener('click', function () {
  location.reload();  // Reload the page to restart the game
});


// Event listener for the tutorial button
document.getElementById('tutorialButton').addEventListener('click', function () {
  document.getElementById('tutorialContent').style.display = 'block';
});

// Event listener for the close tutorial button
document.getElementById('closeTutorialButton').addEventListener('click', function () {
  document.getElementById('tutorialContent').style.display = 'none';
});
