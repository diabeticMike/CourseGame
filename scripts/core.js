var BootScene = new Phaser.Class({
    Extends:Phaser.Scene,

    initialize:
    function BootScene()
    {
      Phaser.Scene.call(this, {key:'BootScene'});
    },

    preload:function()
    {

        this.load.spritesheet('robot', 'assets/robot.png',{frameWidth:50, frameHeight:60});
        this.load.image('tiles', 'assets/set.png');
        this.load.tilemapTiledJSON('map', 'assets/js1.json');
        //this.load.image('hero', 'assets/oo.JPG'); 50 60
        this.load.spritesheet('hero', 'assets/derter5.png', { frameWidth: 50, frameHeight: 60});
        this.load.image('bullet','assets/bullet.png')
    },

    create:function()
    {
        this.scene.start('WorldScene');
    }
})

var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:
    function WorldScene()
    {
      Phaser.Scene.call(this,{key:'WorldScene'})
    },

    preload:function()
    {

    },

    create:function()
    {
        //MAP
        var map = this.make.tilemap({key:'map'});
        var tileset = map.addTilesetImage('Industrial-TileSheet', 'tiles');
        var grass = map.createStaticLayer('L1', tileset, 0, 0);
        var walls = map.createStaticLayer('L2', tileset, 0, 0);
        var box = map.createStaticLayer('L3', tileset, 0, 0);
        //PLAYER
        this.player = this.physics.add.sprite(50,100,'hero');
        this.player.setScale(1.5);
        this.player.setCollideWorldBounds(true);
        //ENEMIES

        this.enemy = this.add.group
        ({
            key:'robot',
            repeat:0,
            setXY:{
              x:500,
              y:70,
              stepX:80,
              stepY:20
            }

        });



        this.anims.create({
          key: 'down',
          frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 13}),
          frameRate: 15,
          repeat: -1
        });

        this.anims.create({
          key: 'up',
          frames: this.anims.generateFrameNumbers('hero', { start: 14, end: 19 }),
          frameRate: 15,
          repeat: -1
        });

        this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });


        //
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        var shootTime = 0;
        var bullets;
        //colisions
        walls.setCollisionByExclusion([-1]);
        box.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, walls);
        this.physics.add.collider(this.player, box);
        //KEYS
        this.cursors = this.input.keyboard.createCursorKeys();
        //CAMERA
         this.cameras.main.setBounds(0, 0);
         this.cameras.main.startFollow(this.player);
         this.cameras.main.roundPixels = true;


    },

    update:function()
    {


      this.player.body.setVelocity(0);

      var enemies = this.enemy.getChildren();
      var numEnemies = enemies.length;

      for(let i = 0; i < numEnemies; i++)
      {
        //game.physics.collide(this.player, enemies[i], test);
        //enemies[i].y+=0.5;
        if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds()))
        {
          this.cameras.main.shake(400,0.02);
        }
      }


      //horizontal
      if(this.cursors.left.isDown)
      {
        this.player.body.setVelocityX(-180);
      }

      else if(this.cursors.right.isDown)
      {
        this.player.body.setVelocityX(180);
      }

      //vertical
      if(this.cursors.up.isDown)
      {
        this.player.body.setVelocityY(-180);
      }

      else if(this.cursors.down.isDown)
      {
        this.player.body.setVelocityY(180);
      }

      //animations
      if (this.cursors.left.isDown)
      {
        this.player.anims.play('left', true);
      }
        else if (this.cursors.right.isDown)
      {
        this.player.anims.play('right', true);
      }
        else if (this.cursors.up.isDown)
      {
        this.player.anims.play('up', true);
      }
        else if (this.cursors.down.isDown)
      {
        this.player.anims.play('down', true);
      }
        else
      {
        this.player.anims.stop();
      }
    }
})




const config =
    {
      type : Phaser.AUTO,
      width: 800,
      height:600,
    //  zoom:2,
      pixelArt:true,
      physics:
      {
        default:'arcade',
        arcade:
            {
              gravity: {y:0}
            }
      },
      scene:
      [
        BootScene,
        WorldScene
      ]
    };

var game = new Phaser.Game(config);
