if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'pixi'
], function(
	$,
	PIXI
) {
	return function() {
		//set up renderer
		var WIDTH = 800;
		var HEIGHT = 600;
		var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, null, false, true);
		document.body.appendChild(renderer.view);

		var stage = new PIXI.Stage(0xffffff);
		var isDragging = false;
		var mouseX = null;
		var mouseY = null;
		stage.mousedown = function(evt) {
			mouseX = evt.originalEvent.x;
			mouseY = evt.originalEvent.y;
			if(playerHitBox.contains(mouseX, mouseY)) {
				isDragging = true;
			}
		};
		stage.mousemove = function(evt) {
			if(isDragging) {
				mouseX = evt.originalEvent.x;
				mouseY = evt.originalEvent.y;
			}
		};
		stage.mouseup = function(evt) {
			if(isDragging) {
				isDragging = false;
				mouseX = null;
				mouseY = null;
			}
		};

		var graphics = new PIXI.Graphics();
		stage.addChild(graphics);

		//player vars
		var PLAYER_SPEED = 300;
		var PLAYER_RADIUS = 24;
		var DIAGONAL_MULT = 1 / Math.sqrt(2);
		var playerPos = {
			x: WIDTH / 2,
			y: HEIGHT / 2
		};
		var playerMoveDir = {
			horizontal: 0,
			vertical: 0
		};
		var playerHitBox = new PIXI.Circle(playerPos.x, playerPos.y, PLAYER_RADIUS);

		//do this on every frame
		function eachFrame(ms, time) {
			var t = ms / 1000;

			//move player
			var isMovingDiagonally = (playerMoveDir.x !== 0 && playerMoveDir.y !== 0);
			playerPos.x += playerMoveDir.horizontal * PLAYER_SPEED * (isMovingDiagonally ? DIAGONAL_MULT : 1) * t;
			playerPos.y += playerMoveDir.vertical * PLAYER_SPEED * (isMovingDiagonally ? DIAGONAL_MULT : 1) * t;

			//enforce bounds
			if(playerPos.x < PLAYER_RADIUS) {
				playerPos.x = PLAYER_RADIUS;
			}
			else if(playerPos.x > WIDTH - PLAYER_RADIUS) {
				playerPos.x = WIDTH - PLAYER_RADIUS;
			}
			if(playerPos.y < PLAYER_RADIUS) {
				playerPos.y = PLAYER_RADIUS;
			}
			else if(playerPos.y > HEIGHT - PLAYER_RADIUS) {
				playerPos.y = HEIGHT - PLAYER_RADIUS;
			}

			//hit boxes
			playerHitBox.x = playerPos.x;
			playerHitBox.y = playerPos.y;

			//render
			graphics.clear();
			graphics.lineStyle(0, 0x000000, 1);
			graphics.beginFill(0x0000ff);
			graphics.drawCircle(playerPos.x, playerPos.y, PLAYER_RADIUS);
			if(isDragging) {
				var distX = playerPos.x - mouseX;
				var distY = playerPos.y - mouseY;
				var dist = Math.sqrt(distX * distX + distY * distY);
				graphics.lineStyle(1, 0x000000, 1);
				graphics.beginFill(0x0000ff, 0);
				graphics.drawCircle(playerPos.x, playerPos.y, dist);
			}
			renderer.render(stage);
		}

		//set up animation frame functionality
		var prevTime;
		requestAnimationFrame(function(time) {
			prevTime = time;
			loop(time);
		});
		function loop(time) {
			var ms = time - prevTime;
			prevTime = time;
			eachFrame(ms, time);
			requestAnimationFrame(loop);
		}

		//handle keyboard events
		var keyboardState = {
			W: false,
			A: false,
			S: false,
			D: false
		};
		var KEY_LOOKUP = {
			87: 'W',
			65: 'A',
			83: 'S',
			68: 'D'
		};
		$(document).on('keyup', function(evt) {
			var key = KEY_LOOKUP[evt.which];
			if(key) {
				if(keyboardState[key]) {
					keyboardState[key] = false;
					if(key === 'W') {
						playerMoveDir.vertical = (keyboardState.S ? 1 : 0);
					}
					else if(key === 'A') {
						playerMoveDir.horizontal = (keyboardState.D ? 1 : 0);
					}
					else if(key === 'S') {
						playerMoveDir.vertical = (keyboardState.W ? -1 : 0);
					}
					else if(key === 'D') {
						playerMoveDir.horizontal = (keyboardState.A ? -1 : 0);
					}
				}
			}
		});
		$(document).on('keydown', function(evt) {
			var key = KEY_LOOKUP[evt.which];
			if(key) {
				if(!keyboardState[key]) {
					keyboardState[key] = true;
					if(key === 'W') {
						playerMoveDir.vertical = -1;
					}
					else if(key === 'A') {
						playerMoveDir.horizontal = -1;
					}
					else if(key === 'S') {
						playerMoveDir.vertical = 1;
					}
					else if(key === 'D') {
						playerMoveDir.horizontal = 1;
					}
				}
			}
		});
	};
});