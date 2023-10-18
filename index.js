const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth

canvas.height = innerHeight
//https://www.youtube.com/watch?v=MCVU0w73uKI

//Player
class Player{
    constructor(){
        this.velocity = {
            x: 0,
            y: 0
        }
         
        this.rotation = 0
        const image = new Image()
        image.src = './img/spaceship.png'
        image.onload = () => {
            const scale = .15
            this.image = image
            this.width = image.width * scale //original width * .15 to get the proper scale
            this.height = image.height * scale //original height * .15 to get the proper scale
            this.position = {
                x: canvas.width / 2 - this.width / 2, 
                y: canvas.height - this.height - 20
            }
        }
    }
    draw() {
        //c.fillStyle = 'red'
        //c.fillRect(this.position.x , this.position.y , this.width,
            //this.height)

        c.save()
        c.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        )

        c.rotate(this.rotation)
        
        c.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        )

        c.drawImage(
            this.image, 
            this.position.x , 
            this.position.y, 
            this.width, 
            this.height
            )
        
        c.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x  += this.velocity.x
        }
    }
}

//Beng Beng
class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)

        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

//Beng Beng invader
class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }

    draw(){
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width,  this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

//Invader
class Invader{
    constructor({position}){
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = './img/invader.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale //original width * .15 to get the proper scale
            this.height = image.height * scale //original height * .15 to get the proper scale
            this.position = {
                // x: canvas.width / 2 - this.width / 2, 
                // y: canvas.height //Default will cause stacking
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        //c.fillStyle = 'red'
        //c.fillRect(this.position.x , this.position.y , this.width,
            //this.height)
        c.drawImage(
            this.image, 
            this.position.x , 
            this.position.y, 
            this.width, 
            this.height
            )
    }

    update({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x  += velocity.x
            this.position.y  += velocity.y
        }
    }

    shoot(InvaderProjectiles) {
        InvaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width /2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0 ,
                y: 5
            }
        }) )

    }
}

class Grid{
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []

        const column = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width  = column * 30

        for( let i = 0; i < column; i++){
            for( let y = 0; y < rows; y++){
            this.invaders.push(
                new Invader({
                    position: {
                        x: i * 30,
                        y: y * 30
                    }
                })
            )
        }
        console.log(this.invaders)
    }
}

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >+ canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

const player = new Player()
const projectiles = []
const grids = []
const InvaderProjectiles = []

const keys = {
    a: {
        pressed : false
    },
    d: {
        pressed : false
    },
    space: {
        pressed : false
    }
}

let frames = 0
let randomInterval = Math.floor(Math.random()* 500) + 500

function animate () {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update() //from player.draw() to player.update() in order to call this.draw and affect the position

    InvaderProjectiles.forEach((InvaderProjectile, index) => {
        if (InvaderProjectile.position.y + InvaderProjectile.heihgt >= canvas.height) {
                setTimeout(() => {
                    InvaderProjectiles.splice(index, 1) 
                }, 0)
        }
        else
            InvaderProjectile.update()

        if (InvaderProjectile.position.y + InvaderProjectile.position.height >= 
            player.position.y && 
            InvaderProjectile.position.x + InvaderProjectile.width >= 
            player.position.x && 
            InvaderProjectile.position.x <= player.position.x + 
            player.width) {
                console.log('you lose')
            }
    })

    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1) 
            }, 0)// additional frame before this is out

        }
        else{
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()

         //spawn beng beng
    if (frames % 100 === 0 && grid.invaders.length > 0) { 
        grid.invaders[Math.floor(Math.random() * 
            grid.invaders.length)].shoot(InvaderProjectiles)
    }

         grid.invaders.forEach((invader, i) => {
            invader.update({velocity : grid.velocity})

            //shot 
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= 
                        invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >=
                        projectile.position.x && 
                    projectile.position.x - projectile.radius <= 
                        invader.position.x + invader.width && 
                    projectile.position.y + projectile.radius >= 
                        invader.position.y
                    ){
                    setTimeout(() => {
                        const invaderfound = grid.invaders.find(
                            (invader2) => invader2 === invader
                            )
                        
                        const projectilefound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                            )
                        
                        //remove invader and projectile
                        if(invaderfound && projectilefound){
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if(grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[
                                    grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - 
                                firstInvader.position.x + 
                                lastInvader.width
                                grid.position.x = firstInvader.position.x
                            }   else {
                                grid.splice(gridIndex, 1)
                            }
                        }
                    }, 0 )
                }
            })
         })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -.15
    } 
    else if(keys.d.pressed && player.position.x +player.width <= canvas.width) {
        player.velocity.x = +7
        player.rotation = .15
    }  
    else {
        player.velocity.x = 0
        player.rotation = 0
    }

    //spawning enemies
    if (frames % randomInterval === 0){
        grids.push(new Grid)
        randomInterval = Math.floor(Math.random()* 500) + 500
        console.log(randomInterval)
    }

     
    

    frames++
}
animate()

//Player Movement
addEventListener('keydown', ({key}) => {
    // console.log(key) //record key pressed
    switch (key){
        case 'a': 
            //console.log('left')
            
            keys.a.pressed = true
            break
        case 'd':   
            //console.log('right')
            keys.d.pressed = true
            break
        case ' ': 
            //console.log('space')
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y 
                    },
                    velocity: {
                        x: 0,
                        y: -5
                    }
                })
            )
            break
    }
})

addEventListener('keyup', ({key}) => {
    // console.log(key) //record key pressed
    switch (key){
        case 'a': 
            //console.log('left')
            
            keys.a.pressed = false
            break
        case 'd':   
            //console.log('right')
            keys.d.pressed = false
            break
        case ' ': 
            //console.log('space')
            break
    }
})