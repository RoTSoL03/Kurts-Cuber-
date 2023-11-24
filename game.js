// Create the scene and camera
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 2;  // Position the camera higher
    camera.position.z = 5;

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

    // Animation
    let colorChangeSpeed = 0.01;  // Set the speed of the color change
    let isJumping = false;
    let jumpSpeed = 0.1;  // Increase the jump speed to make the cube jump higher
    let fallSpeed = 0.1;  // Increase the fall speed to match the jump speed
    let obstacleSpeed = 0.02;
    let isGameOver = false;
    let score = 0;
    let animate = function () {
      if (isGameOver) return;
      requestAnimationFrame(animate);
      // Check for collisions
      let cubeBox = new THREE.Box3().setFromObject(cube);
      for (let i = 0; i < obstacles.length; i++) {
        let obstacleBox = new THREE.Box3().setFromObject(obstacles[i]);
        if (cubeBox.intersectsBox(obstacleBox)) {
          isGameOver = true;
          backgroundMusic.pause();
          backgroundMusic.currentTime = 0;
          document.getElementById('gameOverScreen').style.display = 'flex';
        }
      }
      if (isJumping) {
        if (cube.position.y >= 2) {  // Increase the jump height
          isJumping = false;
        } else {
          cube.position.y += jumpSpeed;
          cube.rotation.x -= 0.1;  // Make the cube spin when it jumps
        }
      } else if (cube.position.y > 0.5) {
        cube.position.y -= fallSpeed;
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



      obstacleSpeed += 0.0001;  // Increase the obstacle speed as the game progresses
      camera.position.x = cube.position.x;
      renderer.render(scene, camera);

    };

    // Keyboard controls
    window.addEventListener('keydown', function (event) {
      if (isGameOver) return;
      switch (event.keyCode) {
        case 37: // Left arrow key
          if (cube.position.x > -2.5 + cube.geometry.parameters.width / 2) {  // Check if the cube is within the borders
            cube.position.x -= 0.2;  // Increase the amount of movement
          }
          break;
        case 39: // Right arrow key
          if (cube.position.x < 2.5 - cube.geometry.parameters.width / 2) {  // Check if the cube is within the borders
            cube.position.x += 0.2;  // Increase the amount of movement
          }
          break;
        case 32: // Space key
          if (!isJumping && cube.position.y <= 0.5) {
            isJumping = true;
          }
          break;
      }
    }, false);



    let backgroundMusic = new Audio('Music/bgMusic.mp3');

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
