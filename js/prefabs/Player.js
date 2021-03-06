var Bomberman = Bomberman || {};


Bomberman.DIRECTION = {
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 4,
};

Bomberman.Player = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.walking_speed = +properties.walking_speed;
    this.bomb_duration = +properties.bomb_duration;

    this.moving = false;
    
    this.animations.add("walking_up", [9,10,11], 8, true);
    this.animations.add("walking_right", [3,4,5], 8, true);
    this.animations.add("walking_left", [6,7,8], 8, true);
    this.animations.add("walking_down", [0,1,2], 8, true);


    this.die_anim = this.animations.add("death", [60,61,62,63,64,65,66,72,73,74,75,76,77,78,79], 15, false);
    this.die_anim.onComplete.add(this.die_reset, this);
    //this.animations.play("exploding");
    this.is_dead = false;
    
    /*
    facing : number
    A const reference to the direction the Body is traveling or facing.
    0: None
    1: Left
    2: Right
    3: Up
    4: Down
    */
    this.stopped_frames = [0, 6, 3, 9, 0];

    this.game_state.game.physics.arcade.enable(this);
    this.body.setSize(14,14,0,3);
    this.yMinus = 3;

    this.position_cell();

    this.targetPos = {x:0, y:0};
    
    //this.body.setSize(16,16,0,0);//this.body.setSize(14, 12, 0, 4);

    this.cursors = this.game_state.game.input.keyboard.createCursorKeys();
    
    this.y = this.y-this.yMinus;
    this.initial_position = new Phaser.Point(this.x, this.y);
    
    this.number_of_lives = localStorage.number_of_lives || +properties.number_of_lives;
    this.number_of_bombs = localStorage.number_of_bombs || +properties.number_of_bombs;
    this.current_bomb_index = 0;
};

Bomberman.Player.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Player.prototype.constructor = Bomberman.Player;

Bomberman.Player.prototype.update = function () {
    "use strict";
    
    if(!this.is_dead) {
        // 1. Handle logic
        this.handle_moving();
        this.handle_drop_bomb();
    }
    if(!this.is_dead) {
        // 2. Handle collision and death --> must be the last for the next check this.is_dead
        this.game_state.game.physics.arcade.collide(this, this.game_state.layers.walls);
        this.game_state.game.physics.arcade.collide(this, this.game_state.layers.blocks);
        this.game_state.game.physics.arcade.collide(this, this.game_state.groups.bombs);
    }

    if(!this.is_dead) {
        this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.die, null, this);
        this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemies, this.die, null, this);
        
    }
};


Bomberman.Player.prototype.position_cell = function() {
    this.cellX = Math.floor((this.x - this.game_state.board.x) / this.game_state.board.cellWidth);
    this.cellY = Math.floor((this.y - this.game_state.board.y) / this.game_state.board.cellHeight);
}

Bomberman.Player.prototype.cell_position = function(cellX, cellY) {
    var xPos = this.game_state.board.x + (cellX + 0.5) * this.game_state.board.cellWidth;
    var yPos = this.game_state.board.y + (cellY + 0.5) * this.game_state.board.cellHeight-this.yMinus;

    return {x:xPos, y:yPos};
}

Bomberman.Player.prototype.handle_drop_bomb = function() {
    if(this.is_dead)
        return;


    // if the spacebar is pressed and it is possible to drop another bomb, try dropping it
    if (this.game_state.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.current_bomb_index < this.number_of_bombs) {
        // drop the bomb only if it does not collide with another one

        var cell_x = Math.floor((this.x - this.game_state.board.x) / this.game_state.board.cellWidth);
        var cell_y = Math.floor((this.y - this.game_state.board.y) / this.game_state.board.cellHeight);
        var bomb_x = this.game_state.board.x + (0.5 + cell_x) * this.game_state.board.cellWidth;
        var bomb_y = this.game_state.board.y + (0.5 + cell_y) * this.game_state.board.cellWidth;

        if(!this.game_state.bomb_board[cell_y][cell_x]) {
            this.game_state.bomb_board[cell_y][cell_x] = true;
            //console.log('DROP_BOMB: ', cell_x, cell_y, this.x, this.y, this.game_state.bomb_board, this.game_state.bomb_board[cell_y][cell_x] );
            this.drop_bomb(bomb_x, bomb_y);
        
        }
    }

}

Bomberman.Player.prototype.drop_bomb = function (bomb_x, bomb_y) {
    "use strict";
    var bomb, bomb_name, bomb_position, bomb_properties;
    // get the first dead bomb from the pool
    bomb_name = this.name + "_bomb_" + this.game_state.groups.bombs.countLiving();

    // Set bomb at center of the player-current-cell
    

    bomb_position = new Phaser.Point(bomb_x, bomb_y);
    bomb_properties = {"texture": "bomb_explosion_spritesheet", "group": "bombs", bomb_radius: 3};
    bomb = Bomberman.create_prefab_from_pool(this.game_state.groups.bombs, Bomberman.Bomb.prototype.constructor, this.game_state, bomb_name, bomb_position, bomb_properties);
    this.current_bomb_index += 1;
};


Bomberman.Player.prototype.check_cell_collide = function(targetCellX, targetCellY) {
    //cell.canCollide
    var result = (
        this.game_state.layers.blocks.layer.data[targetCellY][targetCellX].canCollide
        || this.game_state.layers.walls.layer.data[targetCellY][targetCellX].canCollide
        || this.game_state.bomb_board[targetCellY][targetCellX]
        );
    // console.log('TARGET-CELL: ', targetCellX, ' -- ', targetCellY);
    // console.log(this.game_state.layers.blocks.layer.data[targetCellY][targetCellX]);
    // console.log(this.game_state.layers.walls.layer.data[targetCellY][targetCellX]);
    // console.log(this.game_state.bomb_board[targetCellY][targetCellX]);
    return result;
}

Bomberman.Player.prototype.handle_moving = function() {
    if(this.is_dead)
        return;


    if(this.cursors.up.isDown) {
        if(this.moving === true) {
            // do nothing just move
        } else {
            if(this.body.facing != Bomberman.DIRECTION.UP) {
                this.body.facing = Bomberman.DIRECTION.UP;
            } else {
                
                // move to next cell
                this.position_cell();
                this.targetCellX = this.cellX;
                this.targetCellY = Math.max(0, this.cellY - 1);

                if(!this.check_cell_collide(this.targetCellX, this.targetCellY)) {
                    // console.log('>>> can walk to target-cell: ', 
                    //     this.targetCellX, this.targetCellY, 
                    //     ' from current_cell: ', this.cellX, this.cellY);
                    this.moving = true;
                    this.moving_dir = Bomberman.DIRECTION.UP;
                } else {
                    // console.log('<<< can not walk to target-cell: ', 
                    //     this.targetCellX, this.targetCellY, 
                    //     ' from current_cell: ', this.cellX, this.cellY);
                    this.moving = false;
                }

            }
        }
    } else if(this.cursors.down.isDown) {
        if(this.moving === true) {
            // do nothing just move
        } else {
            if(this.body.facing != Bomberman.DIRECTION.DOWN) {
                this.body.facing = Bomberman.DIRECTION.DOWN;
            } else {
                
                // move to next cell
                this.position_cell();
                this.targetCellX = this.cellX;
                this.targetCellY = Math.min(this.game_state.board.height - 1, this.cellY + 1);

                if(!this.check_cell_collide(this.targetCellX, this.targetCellY)) {
                    // console.log('>>> can walk to target-cell: ', 
                    //     this.targetCellX, this.targetCellY, 
                    //     ' from current_cell: ', this.cellX, this.cellY);
                    this.moving = true;
                    this.moving_dir = Bomberman.DIRECTION.DOWN;
                } else {
                    // console.log('<<< can not walk to target-cell: ', 
                    //     this.targetCellX, this.targetCellY, 
                    //     ' from current_cell: ', this.cellX, this.cellY);
                    this.moving = false;
                }

            }
        }
    } else if(this.cursors.left.isDown) {
        if(this.moving === true) {
            // do nothing just move
        } else {
            if(this.body.facing != Bomberman.DIRECTION.LEFT) {
                //this.scale.setTo(-1, 1);
                this.body.facing = Bomberman.DIRECTION.LEFT;
            } else {
                
                // move to next cell
                this.position_cell();
                this.targetCellY = this.cellY;
                this.targetCellX = Math.max(0, this.cellX - 1);


                if(!this.check_cell_collide(this.targetCellX, this.targetCellY)) {
                    // console.log('>>> can walk to target-cell: ', 
                    //     this.targetCellX, this.targetCellY, 
                    //     ' from current_cell: ', this.cellX, this.cellY);
                    this.moving = true;
                    this.moving_dir = Bomberman.DIRECTION.LEFT;
                } else {
                    // console.log('<<< can not walk to target-cell: ', 
                    //     this.targetCellX, this.targetCellY, 
                    //     ' from current_cell: ', this.cellX, this.cellY);
                    this.moving = false;
                }

            }
        }
    } else if(this.cursors.right.isDown) {
        if(this.moving === true) {
            // do nothing just move
        } else {
            if(this.body.facing != Bomberman.DIRECTION.RIGHT) {
                this.scale.setTo(1, 1);
                this.body.facing = Bomberman.DIRECTION.RIGHT;
            } else {
                
                // move to next cell
                this.position_cell();
                this.targetCellY = this.cellY;
                this.targetCellX = Math.min(this.game_state.board.width-1, this.cellX + 1);
                

                if(!this.check_cell_collide(this.targetCellX, this.targetCellY)) {
                    // console.log('>>> can walk to target-cell: ', 
                    //     this.targetCellX, this.targetCellY, 
                    //     ' from current_cell: ', this.cellX, this.cellY);
                    this.moving = true;
                    this.moving_dir = Bomberman.DIRECTION.RIGHT;
                } else {
                    // console.log('<<< can not walk to target-cell: ', 
                    //     this.targetCellX, this.targetCellY, 
                    //     ' from current_cell: ', this.cellX, this.cellY);
                    this.moving = false;
                }

            }
        }
        
    }

    if(this.moving === true) {
        var dir_name = 'right';
        if(this.moving_dir == Bomberman.DIRECTION.RIGHT) {
            this.animations.play("walking_right");
            this.targetPos = this.cell_position(this.targetCellX, this.targetCellY);
            // var xDis = Math.min(Math.abs(targetPos.x - this.x), this.walking_speed);
            // this.body.velocity.x = +xDis;
            // this.body.velocity.y = 0;
            this.game.physics.arcade.moveToXY(this, this.targetPos.x, this.targetPos.y, this.walking_speed);
            dir_name = 'right';
            // console.log('currentPos: ', this.x, this.y);
            // console.log('targetPos: ', this.targetPos);
            // console.log('this.body.velocity: ', this.body.velocity);
        } else if(this.moving_dir == Bomberman.DIRECTION.LEFT) {
            this.animations.play("walking_left");
            this.targetPos = this.cell_position(this.targetCellX, this.targetCellY);
            // var xDis = Math.min(Math.abs(targetPos.x - this.x), this.walking_speed);
            // this.body.velocity.x = -xDis;
            // this.body.velocity.y = 0;
            this.game.physics.arcade.moveToXY(this, this.targetPos.x, this.targetPos.y, this.walking_speed);
            dir_name = 'left';
            // console.log('currentPos: ', this.x, this.y);
            // console.log('targetPos: ', this.targetPos);
            // console.log('this.body.velocity: ', this.body.velocity);
        } else if(this.moving_dir == Bomberman.DIRECTION.UP) {
            this.animations.play("walking_up");
            this.targetPos = this.cell_position(this.targetCellX, this.targetCellY);
            // var yDis = Math.min(Math.abs(targetPos.y - this.y), this.walking_speed);
            // this.body.velocity.y = -yDis;
            // this.body.velocity.x = 0;
            this.game.physics.arcade.moveToXY(this, this.targetPos.x, this.targetPos.y, this.walking_speed);
            dir_name = 'up';
            // console.log('currentPos: ', this.x, this.y);
            // console.log('targetPos: ', this.targetPos);
            // console.log('this.body.velocity: ', this.body.velocity);
        } else if(this.moving_dir == Bomberman.DIRECTION.DOWN) {
            this.animations.play("walking_down");
            this.targetPos = this.cell_position(this.targetCellX, this.targetCellY);
            // var yDis = Math.min(Math.abs(targetPos.y - this.y), this.walking_speed);
            // this.body.velocity.y = +yDis;
            // this.body.velocity.x = 0;

            this.game.physics.arcade.moveToXY(this, this.targetPos.x, this.targetPos.y, this.walking_speed);
            dir_name = 'down';
            // console.log('currentPos: ', this.x, this.y);
            // console.log('targetPos: ', this.targetPos);
            // console.log('this.body.velocity: ', this.body.velocity);
        }

        this.targetPos = this.cell_position(this.targetCellX, this.targetCellY);
        this.game.physics.arcade.moveToXY(this, this.targetPos.x, this.targetPos.y, this.walking_speed);
        // console.log('MOVING_DIR: ', dir_name, ' ++ current_cell: ', this.cellX, this.cellY);
        // console.log('TARGET: ', this.targetCellX, this.targetCellY);
        // console.log('Position: ', this.x, this.y, ' ==> ', this.targetPos.x, this.targetPos.y);
        // console.log('Diff: ', this.targetPos.x - this.x, this.targetPos.y - this.y);
        // console.log('VELOCITY: ', this.body.velocity.x, this.body.velocity.y);

    }
    

    if(Math.abs(this.targetPos.x - this.x) + Math.abs(this.targetPos.y - this.y) <= 2) {
        this.x = this.targetPos.x;
        this.y = this.targetPos.y;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.moving = false;
    }

    
    
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        // stop current animation
        this.animations.stop();

        /*
        frame	string | number	
        If this Sprite is using part of a sprite sheet or texture atlas 
        you can specify the exact frame to use by giving a string or numeric index.
        */
        this.frame = this.stopped_frames[this.body.facing];
        /*
        facing : number
        A const reference to the direction the Body is traveling or facing.
        0: None
        1: Left
        2: Right
        3: Up
        4: Down
        */

    }


}



Bomberman.Player.prototype.die = function () {
    "use strict";
    if(this.is_dead) {
        return;
    }


    // 1. Play dying animation
    console.log('Player die:: ', new Date().toLocaleString(), ' :: ', this);
    this.animations.stop();
    this.is_dead = true;
    this.moving = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.die_anim.play();

}

Bomberman.Player.prototype.die_reset = function() {
    // 2. Reset logic
    console.log('Finish die animation - start reset logic');
    // decrease the number of lives
    this.number_of_lives -= 1;
    this.animations.stop('death', true);

    // console.log('Player-At-collision: ', this.x, this.y, this.x, this.y);
    // console.log('Thing1: ', thing1);
    // console.log('Thing2: ', thing2);

    if (this.game_state.prefabs.lives.number_of_lives <= 0) {
        // if there are no more lives, it's game over
        this.game_state.game_over();
    } else {
        // if there are remaining lives, restart the player position
        this.x = this.initial_position.x;
        this.y = this.initial_position.y;
        // console.log('Player initial_position: ', this.initial_position.x, this.initial_position.y);
        this.moving = false;
        
        this.position_cell();

        this.targetPos = {x:0, y:0};

        this.body.velocity.x = 0; 
        this.body.velocity.y = 0;

        this.is_dead = false;
    }

    
};