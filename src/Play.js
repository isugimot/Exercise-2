class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        //add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.setCollideWorldBounds(true)
        this.ball.setBounce(0.5)
        this.ball.setDamping(true).setDrag(0.5)

        //add Wall A
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)

        //add Wall B
        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down= false

        //
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        this.shotNumber = 0;
        this.holeIn = 0;

        this.input.on('pointerdown', (pointer) => {
            let shotDirection
            let shotDirection_X
            pointer.y <= this.ball.y ? shotDirection = 1 : shotDirection = -1
            pointer.x <= this.ball.x ? shotDirection_X = 1 : shotDirection_X = -1
            
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * shotDirection_X)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
            this.shotNumber += 1;
        })

        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.x = width / 2
            ball.y = height - height / 10
            ball.body.setVelocityX(0);
            ball.body.setVelocityY(0);
            this.holeIn += 1;
        })
        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        this.percent = 0
        this.scoreP = this.add.text(0, height/50, this.shotNumber + ' shots, ' + this.holeIn + ' point, ' +this.percent + '%', scoreConfig)
        this.movement = 1;
    }

    update() {
        if(this.shotNumber > 0){
            this.percent = Math.round(((this.holeIn) / this.shotNumber) *100)
        }else{
            this.percent = 0
        }
        this.scoreP.text = this.shotNumber + ' shots, ' + this.holeIn + ' point, ' + this.percent + '%'

        if(this.oneWay.x >= width - this.oneWay.width/2){
            this.movement = -1
        }else if(this.oneWay.x <= 0 + this.oneWay.width/2){
            this.movement = 1;
        }
        this.oneWay.x += this.movement * 3
    }
}