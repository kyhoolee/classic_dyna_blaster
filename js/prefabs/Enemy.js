var Bomberman = Bomberman || {};

Bomberman.Enemy = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);
    this.game_state.game.physics.arcade.enable(this);

    
    this.anchor.setTo(0.5);
    
    this.walking_speed = +properties.walking_speed;
    this.genre = properties.genre;


    
    this.set_genre_();
    this.is_dead = false;
    

    
    this.body.setSize(14,14,0,0);
    this.y = this.y - 1;

    this.moving = false;
    this.get_cell();
    this.targetPos = {x:0, y:0};

    // Init first moving direction
    var directions = [Bomberman.DIRECTION.UP, Bomberman.DIRECTION.DOWN, Bomberman.DIRECTION.LEFT, Bomberman.DIRECTION.RIGHT];
    this.signal = directions[Math.floor(Math.random() * directions.length)];


    
    this.die_anim.onComplete.add(this.kill, this);
};

// This constructor function must be on top of all other function
Bomberman.Enemy.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Enemy.prototype.constructor = Bomberman.Enemy;



Bomberman.Enemy.prototype.reset_prop = function(x,y, properties) {
    this.reset(x,y);

    
    this.walking_speed = +properties.walking_speed;
    this.genre = properties.genre;
    this.set_genre_();
    this.is_dead = false;

    this.body.setSize(14,14,0,0);
    this.y = this.y - 1;

    this.moving = false;
    this.get_cell();
    this.targetPos = {x:0, y:0};

    // Init first moving direction
    var directions = [Bomberman.DIRECTION.UP, Bomberman.DIRECTION.DOWN, Bomberman.DIRECTION.LEFT, Bomberman.DIRECTION.RIGHT];
    this.signal = directions[Math.floor(Math.random() * directions.length)];

};

Bomberman.Enemy.prototype.set_genre_ = function() {



    switch(this.genre) {
        case 1:
            var walk = [7, 8, 9];
            var dead = [10, 11, 0, 1, 2, 3];
            var stop = [7,7,7,7,7];
            /*
            facing : number
            A const reference to the direction the Body is traveling or facing.
            0: None
            1: Left
            2: Right
            3: Up
            4: Down
            */
            this.set_anim(walk, walk, walk, walk, 10, dead, 6, stop);
            break;
        case 2:
            var walk = [12,13,15,14];
            var dead = [16, 17, 0, 1, 2, 3];
            var stop = [12,12,12,12,12];
            this.set_anim(walk, walk, walk, walk, 10, dead, 6, stop);
            break;
        case 3:
            var walk = [18, 19, 20];
            var dead = [21,22,23,24, 4, 5, 6];
            var stop = [19,19,19,19,19];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break;
        case 4: 
            var walk = [25,26,27];
            var dead = [28, 29, 0, 1, 2, 3];
            var stop = [27,25,26,27,27];
            this.set_anim(walk, walk, walk, walk, 10, dead, 6, stop);
            break;
        case 5:
            var w_down = [39,40,41];
            var w_left = [30,31,32];
            var w_right = [36,37,38];
            var w_up = [33,34,35];
            var dead = [42,43,44,45, 4, 5, 6];
            var stop = [33,30,36,33,39];
            this.set_anim(w_down, w_left, w_right, w_up, 10, dead, 7, stop);
            break;
        case 6:
            var walk = [46,47,48];
            var dead = [49,50,51,52, 4, 5, 6];
            var stop = [46,46,46,46,46];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break; 
        case 7:
            var walk = [53,54,55];
            var dead = [56,57,58,59, 4, 5, 6];
            var stop = [53,53,53,53,53];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break;
        case 8: 
            var walk = [68,69,70];
            var dead = [71,72,73,74, 4, 5, 6];
            var stop = [69,70,68,69,69];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break;
        case 9:
            var walk = [75,76,77];
            var dead = [78,79, 0,1,2,3];
            var stop = [75,75,75,75,75];
            this.set_anim(walk, walk, walk, walk, 10, dead, 6, stop);
            break;
        case 10:
            var walk = [80,81,82];
            var dead = [83,84,85,86, 4, 5, 6];
            var stop = [80,80,80,80,80];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break;   
            
        case 11:
            var walk = [87,88,89];
            var dead = [90,91,92,93, 4, 5, 6];
            var stop = [87,87,87,87,87];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break;
        case 12:
            var walk = [94,95,96];
            var dead = [97,97,99,100, 4, 5, 6];
            var stop = [94,94,94,94,94];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break;
        case 13:
            var walk = [101,102,103];
            var dead = [104,105,106,107, 4, 5, 6];
            var stop = [101,101,101,101,101];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break;
        case 14: 
            var walk = [108,109,110];
            var dead = [111,112,113,114, 4, 5, 6];
            var stop = [108,108,108,108,108];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break;
        case 15:
            var w_down = [124,125,126];
            var w_left = [115,116,117];
            var w_right = [121,122,123];
            var w_up = [118,119,120];
            var dead = [127,128, 175,176, 4,5,6];
            var stop = [125,116,122,119,125];
            // 0: None
            // 1: Left
            // 2: Right
            // 3: Up
            // 4: Down
            this.set_anim(w_down, w_left, w_right, w_up, 10, dead, 7, stop);
            break;
        case 16:
            var w_down = [130];
            var w_left = [131];
            var w_right = [129];
            var w_up = [132];
            var dead = [133,134,135,136, 4, 5, 6];
            var stop = [130,131,129,131,130];
            this.set_anim(w_down, w_left, w_right, w_up, 10, dead, 7, stop);
            break; 
        case 17:
            var w_down = [137,138,147];
            var w_left = [142,141];
            var w_right = [143,144];
            var w_up = [139,140,145];
            var dead = [148,149,150,151, 4,5,6];
            var stop = [138,142,143,140,138];
            // 0: None
            // 1: Left
            // 2: Right
            // 3: Up
            // 4: Down
            this.set_anim(w_down, w_left, w_right, w_up, 10, dead, 7, stop);
            break;
        case 18: 
            var w_down = [155,156,157];
            var w_left = [152,153,154];
            var w_right = [158,159,160];
            var w_up = [161,162,163];
            var dead = [164,165,166,167, 4,5,6];
            var stop = [156,153,159,162,156];
            // 0: None
            // 1: Left
            // 2: Right
            // 3: Up
            // 4: Down
            this.set_anim(w_down, w_left, w_right, w_up, 10, dead, 7, stop);
            break;
        case 19:
            var walk = [168,169,170];
            var dead = [171,172,173,174, 4, 5, 6];
            var stop = [168,168,168,168,168];
            this.set_anim(walk, walk, walk, walk, 10, dead, 7, stop);
            break;

        default:
            var walk = [7, 8, 9];
            var dead = [10, 11, 0, 1, 2, 3];
            var stop = [7,7,7,7,7];
            /*
            facing : number
            A const reference to the direction the Body is traveling or facing.
            0: None
            1: Left
            2: Right
            3: Up
            4: Down
            */
            this.set_anim(walk, walk, walk, walk, 10, dead, 6, stop);

    }

    
};


Bomberman.Enemy.prototype.set_anim = function(walk_down, walk_left, walk_right, walk_up, w_anim_speed, dead, d_anim_speed, stop) {
    this.animations.add("walking_down", walk_down, w_anim_speed, true);
    this.animations.add("walking_left", walk_left, w_anim_speed, true);
    this.animations.add("walking_right", walk_right, w_anim_speed, true);
    this.animations.add("walking_up", walk_up, w_anim_speed, true);

    this.die_anim = this.animations.add("dead", dead, d_anim_speed, false);
    
    this.stopped_frames = stop; 
};





Bomberman.Enemy.prototype.get_cell = function() {
    this.cellX = Math.floor((this.x - this.game_state.board.x) / this.game_state.board.cellWidth);
    this.cellY = Math.floor((this.y - this.game_state.board.y) / this.game_state.board.cellHeight);
}

Bomberman.Enemy.prototype.get_cell_center = function(cellX, cellY) {
    var xPos = this.game_state.board.x + (cellX + 0.5) * this.game_state.board.cellWidth;
    var yPos = this.game_state.board.y + (cellY + 0.5) * this.game_state.board.cellHeight-1;

    return {x:xPos, y:yPos};
}



Bomberman.Enemy.prototype.update = function () {
    "use strict";
    // var new_position;
    // this.game_state.game.physics.arcade.collide(this, this.game_state.layers.walls, this.switch_direction, null, this);
    // this.game_state.game.physics.arcade.collide(this, this.game_state.layers.blocks, this.switch_direction, null, this);
    // this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.bombs, this.switch_direction, null, this);
    

    if(!this.is_dead) {
        // 1. Check moving by colliding wall + blocks + bomb
        this.handle_moving();

        // 2. Handle collision and death --> must be the last for the next check this.is_dead
        this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.die, null, this);
    }
};

Bomberman.Enemy.prototype.die = function() {
    this.is_dead = true;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.die_anim.play();
}



Bomberman.Enemy.prototype.check_cell_collide = function(targetCellX, targetCellY) {
    //cell.canCollide
    if(targetCellX < 0 || targetCellY < 0 
        || targetCellX > this.game_state.board.width
        || targetCellY > this.game_state.board.height) {
        return true;
    }

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

Bomberman.Enemy.prototype.make_move_signal = function() {
    this.prev_signal = this.signal;

    // Create moving signal for enemy


    // 1. Simple logic is keeping moving in 1 direction
    // And switch to opposite direction if colliding

    if(this.can_move_signal(this.signal)) {
        // Keep moving by previous direction;
        return;
    } else {
        // Switch direction if can not move previous direction
        var check_list = [Bomberman.DIRECTION.UP, Bomberman.DIRECTION.DOWN, Bomberman.DIRECTION.LEFT, Bomberman.DIRECTION.RIGHT]
         

        switch (this.signal) {
            case Bomberman.DIRECTION.UP:
                check_list = [Bomberman.DIRECTION.DOWN, Bomberman.DIRECTION.LEFT, Bomberman.DIRECTION.RIGHT];
                break;
            case Bomberman.DIRECTION.DOWN:
                check_list = [Bomberman.DIRECTION.UP, Bomberman.DIRECTION.RIGHT, Bomberman.DIRECTION.LEFT];
                break;
            case Bomberman.DIRECTION.LEFT:
                check_list = [Bomberman.DIRECTION.RIGHT, Bomberman.DIRECTION.DOWN, Bomberman.DIRECTION.UP];
                break;
            case Bomberman.DIRECTION.RIGHT:
                check_list = [Bomberman.DIRECTION.LEFT, Bomberman.DIRECTION.UP, Bomberman.DIRECTION.DOWN];
                break;
        }

        for(let i = 0 ; i < check_list.length ; i ++) {
            if(this.can_move_signal(check_list[i])){
                this.signal = check_list[i];
                return;
            }
        }
    }

    /**
     * Other logic can be
     * - Moving based on target
     * + Grid search - moving on dynamic route of targeting 
     * + 
     */


}

Bomberman.Enemy.prototype.can_move_signal = function(signal) {
    

    if(signal === Bomberman.DIRECTION.UP) {
        
        var targetCellX = this.cellX;
        var targetCellY = this.cellY - 1;

        return !this.check_cell_collide(targetCellX, targetCellY);
    } else if(signal === Bomberman.DIRECTION.DOWN) {
        
        var targetCellX = this.cellX;
        var targetCellY = this.cellY + 1;

        return !this.check_cell_collide(targetCellX, targetCellY);
    } else if(signal === Bomberman.DIRECTION.LEFT) {
        
        var targetCellX = this.cellX - 1;
        var targetCellY = this.cellY;

        return !this.check_cell_collide(targetCellX, targetCellY);
    } else if(signal === Bomberman.DIRECTION.RIGHT) {
        
        var targetCellX = this.cellX + 1;
        var targetCellY = this.cellY;

        return !this.check_cell_collide(targetCellX, targetCellY);
    }

    return false;
}

Bomberman.Enemy.prototype.handle_signal = function(signal, targetCellX, targetCellY) {
    if(this.moving === true) {
        // do nothing just move
    } else {
        if(this.body.facing != signal) {
            this.body.facing = signal;
        } else {

            if(!this.check_cell_collide(targetCellX, targetCellY)) {
                this.moving = true;
                this.targetCellX = targetCellX;
                this.targetCellY = targetCellY;
                this.moving_dir = signal;
            } else {
                this.moving = false;
            }

        }
    }
}

Bomberman.Enemy.prototype.handle_moving = function() {

    // 1. Plan route to move
    if(this.moving === false) {
        //console.log('FALSE-moving: ');
        this.make_move_signal();
    

        this.get_cell();

        if(this.signal === Bomberman.DIRECTION.UP) {
            this.handle_signal(this.signal, this.cellX, this.cellY - 1);

        } else if(this.signal === Bomberman.DIRECTION.DOWN) {
            this.handle_signal(this.signal, this.cellX, this.cellY + 1);
            
        } else if(this.signal === Bomberman.DIRECTION.LEFT) {
            this.handle_signal(this.signal, this.cellX - 1, this.cellY);
            
        } else if(this.signal === Bomberman.DIRECTION.RIGHT) {
            this.handle_signal(this.signal, this.cellX + 1, this.cellY);
            
        }
    }

    
    // 2. Step on pre-defined route
    if(this.moving === true) {
        //console.log('TRUE-moving: ');
        var dir_name = 'right';
        if(this.moving_dir == Bomberman.DIRECTION.RIGHT) {
            this.animations.play("walking_right");
            dir_name = 'right';
        } else if(this.moving_dir == Bomberman.DIRECTION.LEFT) {
            this.animations.play("walking_left");
            dir_name = 'left';
        } else if(this.moving_dir == Bomberman.DIRECTION.UP) {
            this.animations.play("walking_up");
            dir_name = 'up';
        } else if(this.moving_dir == Bomberman.DIRECTION.DOWN) {
            this.animations.play("walking_down");
            dir_name = 'down';
        }

        this.targetPos = this.get_cell_center(this.targetCellX, this.targetCellY);
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
        this.animations.stop();
        this.frame = this.stopped_frames[this.body.facing];

    }


}

