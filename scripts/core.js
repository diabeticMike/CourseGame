var BootScene = new Phaser.Class({
    Extends:Phaser.Scene,

    initialize:
    function BootScene()
    {
      Phaser.Scene.call(this, {key:'BootScene'});
    },

    preload:function()
    {

        this.load.image('tiles', 'assets/set.png');
        this.load.tilemapTiledJSON('map', 'assets/js1.json');
        //this.load.image('hero', 'assets/oo.JPG');
        this.load.spritesheet('hero', 'assets/derter4.png', { frameWidth: 50, frameHeight: 60});
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
        this.player.setCollideWorldBounds(true);
        //
        //this.player.animations.add('front',[1,2],1,true);
        this.anims.create({
          key: 'down',
          frames: this.anims.generateFrameNumbers('hero', { start: 1, end: 6 }),
          frameRate: 15,
          repeat: -1
        });

        this.anims.create({
          key: 'stay',
          frames: [{key:'hero', frame:0}],
          frameRate: 15
        });



        //this.physics.arcade.enable(player);
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
    //  this.player.anims.play('stay', true);
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
        this.player.anims.play('down', true)
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
