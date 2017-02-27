var app = {
    inicio: function(){
             
        velocidadX = 0;
        velocidadY = 0;
        puntuacion = 0;
        vidas = 3;
        mensaje = "";
        
        alto = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;
        
        app.vigilaSensores();
        app.iniciaJuego();
               
        
    },
    
    iniciaJuego: function() {
                        
        function preload() {
            
            // carga el tipo de motor de física, en este caso ARCADE
            game.physics.startSystem(Phaser.Physics.ARCADE);
            
            game.load.image('sky','assets/sky.png');
            game.load.image('mybullet', 'assets/bullet134.png');
            game.load.image('ship', 'assets/ship.png');
            game.load.image('alien', 'assets/space-baddie-purple.png');
            
        }
                                            
        function create() {
            
            // creamos el background
            background = game.add.tileSprite(0, 0, 1920, 1200, "sky");
            
            // añadimos texto en el juego
            scoreText = game.add.text(16, 16, puntuacion, {fontSize: '50px', fill: '#757676'});
            livesText = game.add.text(ancho-100, 16, vidas, {fontSize: '50px', fill: '#FF0000'});
            
            // creamos los sprites
            ship = game.add.sprite(ancho/2, 500, 'ship');
                                            
            // aquí establecemos que, sobre el sprite ship, actúen las 'leyes de la física' del motor arcade
            game.physics.arcade.enable(ship);
                                  
            // activamos los límites para que no traspase los bordes de la pantalla
            ship.body.collideWorldBounds = true;
                        
            // Create the weapon
            
            // Creates 30 bullets, using the 'bullet' graphic
            weapon = game.add.weapon(30, 'mybullet');

            //  The bullet will be automatically killed when it leaves the world bounds
            weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

            //  Because our bullet is drawn facing up, we need to offset its rotation:
            weapon.bulletAngleOffset = 90;

            //  The speed at which the bullet is fired
            weapon.bulletSpeed = 400;

            //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
            weapon.fireRate = 100;
            
            //  Set the weapon to autofire - you can toggle this on and off during play as well
            weapon.autofire = true;

            //  Tell the Weapon to track the 'player' Sprite, offset by 45px horizontally, 0 vertically
            weapon.trackSprite(ship, 45, 0);

            // create the aliens
            aliens = game.add.group();
            aliens.enableBody = true;
            //aliens.centerX;
            aliens.physicsBodyType = Phaser.Physics.ARCADE;
            
            
            for (var y = 0; y < 6; y++)
            {
                for (var x = 0; x < 6; x++)
                {
                    var alien = aliens.create(45 + x * 48, y * 50, 'alien');
                    alien.name = 'alien' + x.toString() + y.toString();
                    alien.checkWorldBounds = true;
                    alien.events.onOutOfBounds.add(alienOut, this);
                    alien.body.velocity.y = 10 + Math.random() * 50;
                }
            }
            
                        
        }
        
        function alienOut(alien) {

            //  Move the alien to the top of the screen again
            alien.reset(alien.x, 0);

            //  And give it a new random velocity
            alien.body.velocity.y = 10 + Math.random() * 50;

        }
        
        function update() {
            
            var factorDificultad = 200;
            ship.body.velocity.y = (velocidadY * factorDificultad);
            ship.body.velocity.x = (velocidadX * (-1 * factorDificultad));
            
                        
            // detecta cuando los sprites se superponen (overlap) e incrementa la puntuación
            //game.physics.arcade.overlap(ship, objetivo, app.incrementaPuntuacion, null, this);
            game.physics.arcade.overlap(weapon.bullets, aliens, collisionHandler, app.incrementaPuntuacion, this);
            game.physics.arcade.overlap(ship, aliens, shipCollision, null, this);
            
            finalScore();
        } 
                      
        function finalScore () {

           if (puntuacion == 36){
                alert("Perfect!");
                //break;
               app.recomienza(); 
                               
            } else if (puntuacion - (vidas-3) == 36){
                alert("Well done!");
                //break;
                app.recomienza(); 
                            
            }
                      
            
            
        }
        
        function collisionHandler (bullet, alien) {

            //  When a bullet hits an alien we kill them both
            bullet.kill();
            alien.kill();
            
        }
        
        function shipCollision (ship, alien) {

            //  When an alien hits the ship
            alien.kill();
            vidas = vidas - 1;
            
            if (vidas == -1) {
                alert("try again!");
                app.recomienza();                
            } else {
                livesText.text = vidas;
            }
            
            
        }
            
        var estados = {preload: preload, create: create, update: update};
        var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
        
    },
    
    incrementaPuntuacion: function() {
        puntuacion = puntuacion + 1;
        scoreText.text = puntuacion;

    },
    
    recomienza: function() {
        document.location.reload(true);
    },
  
    vigilaSensores: function() {
        
        function onError() {
            console.log('onError!');
        }
        
        function onSuccess(datosAceleracion) {
            app.registraDireccion(datosAceleracion);
        }
        
        navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 10});
    },
    
        
    registraDireccion: function(datosAceleracion){
        velocidadX = datosAceleracion.x;
        velocidadY = datosAceleracion.y;
    }
    
    
};
        
 
if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
