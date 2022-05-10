console.log("hello from main.js");

let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Load, Play]
}

let game = new Phaser.Game(config);

let cursors;
let gamePointer;
let enemySpeed;
let score;
let centerX = game.config.width/2;