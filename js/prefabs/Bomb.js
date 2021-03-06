var Bomberman = Bomberman || {};

Bomberman.Bomb = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);

    this.update_cell();
    
    this.bomb_radius = +properties.bomb_radius;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.exploded = false;
    

    this.exploding_animation = this.animations.add("exploding", [9, 10, 11], 3, true);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
    this.explode_timer = this.game.time.events.add(Phaser.Timer.SECOND * 3, this.explode_by_timer, this);
};

Bomberman.Bomb.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Bomb.prototype.constructor = Bomberman.Bomb;

Bomberman.Bomb.prototype.reset = function (position_x, position_y) {
    "use strict";
    this.exploded = false;
    Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
    this.exploding_animation.restart();
    this.explode_timer = this.game.time.events.add(Phaser.Timer.SECOND * 3, this.explode_by_timer, this);
    this.update_cell();

    
};

Bomberman.Bomb.prototype.update = function() {
    if(!this.exploded) {
        this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.explode_by_explosion, null, this);
    }
}

Bomberman.Bomb.prototype.update_cell = function() {
    this.cell_x = Math.floor((this.x - this.game_state.board.x) / this.game_state.board.cellWidth);
    this.cell_y = Math.floor((this.y - this.game_state.board.y) / this.game_state.board.cellHeight);
}

Bomberman.Bomb.prototype.explode_by_explosion = function() {
    if(!this.exploded) {
        this.exploded = true;
        console.log(this.x, this.y, ' :: Explode by collide other explosion: ');
        console.log('Timer BEFORE:', this.game.time.events);
        console.log('TimerEvent: ', this.explode_timer);
        this.game.time.events.remove(this.explode_timer);
        console.log('TimerEvent', this.explode_timer);
        console.log('Timer AFTER:', this.game.time.events);
        this.explode();
    }
}

Bomberman.Bomb.prototype.explode_by_timer = function() {
    if(!this.exploded) {
        this.exploded = true;
        console.log('Explode by collide timer: ');
        console.log('TimerEvent:', this.explode_timer);
        console.log('Timer:', this.game.time.events);
        this.explode();
    }
}


Bomberman.Bomb.prototype.explode = function () {
    "use strict";

    // 1. Remove bomb sprite
    this.kill();
    //console.log('BEFORE remove bomb at', this.x, this.y, this.cell_x, this.cell_y, this.game_state.bomb_board);
    this.game_state.bomb_board[this.cell_y][this.cell_x] = false;
    console.log('------\n\n');
    console.log('Set bomb_cell: ', this.cell_y, this.cell_x, this.game_state.bomb_board[this.cell_y][this.cell_x]);
    console.log('------\n\n');
    //console.log('AFTER remove bomb at', this.x, this.y, this.cell_x, this.cell_y, this.game_state.bomb_board);
    // 2. Add explosion sprite
    var explosion_name, explosion_position, explosion_properties, explosion, wall_tile, block_tile;
    explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving();
    explosion_position = new Phaser.Point(this.position.x, this.position.y);
    explosion_properties = {texture: "bomb_explosion_spritesheet", group: "explosions_center", duration: 0.5, anim: 'center'};
    // create an explosion in the bomb position
    explosion = Bomberman.create_prefab_from_pool(
        this.game_state.groups.explosions_center, 
        Bomberman.ExplosionCenter.prototype.constructor, 
        this.game_state,
        explosion_name, explosion_position, explosion_properties
    );
    
    // create explosions in each direction
    this.create_explosions(-1, -this.bomb_radius, -1, "x");
    this.create_explosions(1, this.bomb_radius, +1, "x");
    this.create_explosions(-1, -this.bomb_radius, -1, "y");
    this.create_explosions(1, this.bomb_radius, +1, "y");
    
    this.game_state.prefabs.player.current_bomb_index -= 1;
};

Bomberman.Bomb.prototype.create_explosions = function (initial_index, final_index, step, axis) {
    "use strict";
    var index, explosion_name, explosion_position, explosion, explosion_properties, wall_tile, block_tile;
    explosion_properties = {texture: "bomb_explosion_spritesheet", group: "explosions", duration: 0.5};
    for (index = initial_index; Math.abs(index) <= Math.abs(final_index); index += step) {
        explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving();
        // the position is different accoring to the axis
        if (axis === "x") {
            explosion_position = new Phaser.Point(this.position.x + (index * this.width), this.position.y);
        } else {
            explosion_position = new Phaser.Point(this.position.x, this.position.y + (index * this.height));
        }
        var explosion_constructor = Bomberman.ExplosionCenter.prototype.constructor;
        var explosion_group = this.game_state.groups.explosions_center;
        if(axis == 'x') {
            if(index == final_index ) {
                if(index < 0) {
                    // explosion_properties.anims = 'end_x_left';
                    explosion_constructor = Bomberman.ExplosionEndLeft.prototype.constructor;
                    explosion_group = this.game_state.groups.explosions_end_left;
                    explosion_properties.group = 'explosions_end_left';
                } else {
                    // explosion_properties.anims = 'end_x_right';
                    explosion_constructor = Bomberman.ExplosionEndRight.prototype.constructor;
                    explosion_group = this.game_state.groups.explosions_end_right;
                    explosion_properties.group = 'explosions_end_right';
                }
            } else {
                // explosion_properties.anims = 'mid_x';
                explosion_constructor = Bomberman.ExplosionMidX.prototype.constructor;
                explosion_group = this.game_state.groups.explosions_mid_x;
                explosion_properties.group = 'explosions_mid_x';
            }
        } else {
            if(index == final_index ) {
                if(index < 0) {
                    //explosion_properties.anims = 'end_y_up';
                    explosion_constructor = Bomberman.ExplosionEndUp.prototype.constructor;
                    explosion_group = this.game_state.groups.explosions_end_up;
                    explosion_properties.group = 'explosions_end_up';
                } else {
                    // explosion_properties.anims = 'end_y_down';
                    explosion_constructor = Bomberman.ExplosionEndDown.prototype.constructor;
                    explosion_group = this.game_state.groups.explosions_end_down;
                    explosion_properties.group = 'explosions_end_down';
                }
            } else {
                // explosion_properties.anims = 'mid_y';
                explosion_constructor = Bomberman.ExplosionMidY.prototype.constructor;
                explosion_group = this.game_state.groups.explosions_mid_y;
                explosion_properties.group = 'explosions_mid_y';
            }
        }
        wall_tile = this.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, this.game_state.map.tileWidth, this.game_state.map.tileHeight, "walls");
        block_tile = this.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, this.game_state.map.tileWidth, this.game_state.map.tileHeight, "blocks");
        if (!wall_tile && !block_tile) {
            // create a new explosion in the new position
            explosion = Bomberman.create_prefab_from_pool(
                explosion_group, 
                explosion_constructor, 
                this.game_state, 
                explosion_name, 
                explosion_position, 
                explosion_properties);
        } else {
            if (block_tile) {
                //1. Show brick dying 
                this.dying_brick(
                    {x: block_tile.x * block_tile.width, y: block_tile.y * block_tile.height},
                    {x: block_tile.width, y: block_tile.height}
                );

                //2. Check for item to spawn
                this.check_for_item(
                    {x: block_tile.x * block_tile.width, y: block_tile.y * block_tile.height},
                    {x: block_tile.width, y: block_tile.height}
                );


                this.game_state.map.removeTile(block_tile.x, block_tile.y, "blocks");
            }
            break;
        }
    }
};

Bomberman.Bomb.prototype.check_for_item = function (block_position, block_size) {
    "use strict";
    var random_number, item_prefab_name, item, prob, name, position, prop, constructor, item_prefab;
    random_number = Math.random()
    prob = 0;
    // search for the first item that can be spawned
    for (item_prefab_name in this.game_state.items) {
        if (this.game_state.items.hasOwnProperty(item_prefab_name)) {
            item = this.game_state.items[item_prefab_name];
            
            
            // spawns an item if the random number is less than the item prob
            var next_prob = prob + item.prob / this.game_state.item_total_prob
            //console.log('Item:: ', item_prefab_name, item.prob, prob, next_prob, random_number);
            if (random_number > prob && random_number < next_prob) {
                console.log('Item:: ', item_prefab_name, item.prob, prob, next_prob, random_number);
                name = this.name + "_items_" + this.game_state.groups[item.prop.group].countLiving();
                position = new Phaser.Point(block_position.x + (block_size.x / 2), block_position.y + (block_size.y / 2));
                console.log(position);
                prop = item.prop;
                constructor = this.game_state.item_prefab[item_prefab_name];
                item_prefab = Bomberman.create_prefab_from_pool(this.game_state.groups.items, constructor, this.game_state, name, position, prop);
                break;

            }

            prob = next_prob;
        }
    }

};


Bomberman.Bomb.prototype.dying_brick = function (block_position, block_size) {
    "use strict";
    var item, name, position, item_properties, item_prefab;

    item_properties = {texture: "bomb_explosion_spritesheet", group: "dying_bricks", duration: 0.5};
    
    name = this.name + "_dying_bricks_" + this.game_state.groups.dying_bricks.countLiving();
    position = new Phaser.Point(block_position.x, block_position.y);
    
    item_prefab = Bomberman.create_prefab_from_pool(
        this.game_state.groups.dying_bricks, 
        Bomberman.DyingBrick.prototype.constructor, 
        this.game_state, 
        name, 
        position, 
        item_properties);
                
    console.log('Done create dying_brick: ', item_prefab);
};