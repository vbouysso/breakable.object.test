class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        //variables/settings for physics engine
        this.ACCELERATION = 2000;
        this.MAX_SPEED = 2; 
        this.DRAG = 5000;   
        this.passiveHPLoss = 3;
        this.ONE_SEC = 60;
        this.emenyHPLoss = 30;
        enemySpeed = -1;
        this.maxEnemySpeed = -200;
        score = 0;
        this.oncepersec = true;
       
        //place back ground 
        this.magicworld = this.add.tileSprite(0, 0, 480, game.config.height * (2/3), 'magicworld').setOrigin(0);

        //create player animations
        this.anims.create({
            key: 'right',            
            frames: this.anims.generateFrameNumbers('miku', {start: 6, end: 8, first: 6}),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: 'left',            
            frames: this.anims.generateFrameNumbers('miku', {start: 0, end: 2, first: 0}),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: 'down',          
            frames: this.anims.generateFrameNumbers('miku', {start: 3, end: 5, first: 3}),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: 'up',            
            frames: this.anims.generateFrameNumbers('miku', {start: 9, end: 11, first: 9}),
            frameRate: 4,
            repeat: 0
        });

        //create wall breaking animations
        this.anims.create({
            key: 'break1',            
            frames: this.anims.generateFrameNumbers('wall', {start: 4, end: 7, first: 4}),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'break2',            
            frames: this.anims.generateFrameNumbers('wall', {start: 0, end: 3, first: 0}),
            frameRate: 8,
            repeat: 0
        });


        //create groups for wall objects
        this.walls = this.add.group({runChildUpdate: true})
        this.halfbrokenwalls = this.add.group({runChildUpdate: true})
        this.walldust = this.add.group({runChildUpdate: true})
        
        for(let i = 0; i < game.config.width; i += 50) {    //add row of wall objects
            let thiswall = new BasicEnemy(this, i, 200, 0, 'wall');
            this.walls.add(thiswall);
        }

        this.player = this.physics.add.sprite(100,100,'miku').setScale(0.7); 
        this.player.setCollideWorldBounds(true);  
        cursors = this.input.keyboard.createCursorKeys();


        //add colliders and overlaps for player and groups
        this.physics.add.collider(this.player, this.walls, initialWallHit, null, this);   
        function initialWallHit (player, wall) 
        {
            wall.anims.play('break1', true);
            // this.halfbrokenwalls.add(wall)
            this.halfbrokenwalls.add(wall);
            this.walls.remove(wall);
        }

        this.physics.add.collider(this.player, this.halfbrokenwalls, secondWallHit, null, this);  
        function secondWallHit (player, wall)
        {
            if(wall.anims.isPlaying == true){
                console.log("still playing break1")
            }
            else{
            player.acceleration = 0;
            wall.anims.play('break2', true);
            this.walldust.add(wall);
            this.halfbrokenwalls.remove(wall);
            }
        }

        this.physics.add.overlap(this.player, this.walldust, stepOnDust, null, this);
        function stepOnDust(player, wall)
        {
            //PLAY SOUND THAT INDICATES YOU ARE WALKING OVER BROKEN OBJECT REMAINS
            //I COULDNT GET IT TO PLAY PROPERLY
            // this.sound.play('walk3'), { volume: 0.2};
            //add small dust animation by feet of player for extra polish?
        }

    }
    

    update() {

        if(cursors.left.isDown) {
            this.player.body.setAccelerationX(-this.ACCELERATION);
            this.player.resetFlip(true, false);
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
            // play(key [, ignoreIfPlaying] [, startFrame])
            this.player.anims.play('left', true);

        } else if(cursors.right.isDown) {
            this.player.body.setAccelerationX(this.ACCELERATION);
            this.player.resetFlip();
            this.player.anims.play('right', true);
        
        } else if(cursors.up.isDown) {
            this.player.body.setAccelerationY(-this.ACCELERATION);
            this.player.resetFlip();
            this.player.anims.play('up', true);

        } else if(cursors.down.isDown) {
            this.player.body.setAccelerationY(this.ACCELERATION);
            this.player.resetFlip();
            this.player.anims.play('down', true);
        }
        else {
            // set acceleration to 0 so DRAG will take over
            this.player.body.setAccelerationX(0);
            this.player.body.setAccelerationY(0);
            this.player.body.setDragX(this.DRAG);
            this.player.body.setDragY(this.DRAG);
        }
    }
}
