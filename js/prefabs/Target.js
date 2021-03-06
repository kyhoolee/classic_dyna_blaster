var Bomberman = Bomberman || {};

Bomberman.Target = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;

    // Spawn enemies periodically 
    this.spawn_timer = this.game.time.events.loop(Phaser.Timer.SECOND* 5, this.spawn_enemy, this);
    // this.spawn_timer = this.game.time.events.add(Phaser.Timer.SECOND * 3, this.spawn_enemy, this);
};

Bomberman.Target.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Target.prototype.constructor = Bomberman.Target;



Bomberman.Target.prototype.spawn_enemy = function () {

    var enemy_genre = Bomberman.getRandomInt(1, 19)
    var properties = {texture: "enemy_spritesheet", group: "enemies", genre: enemy_genre, walking_speed:32};
    
    var name = this.name + "_enemies_" + enemy_genre + "_" + this.game_state.groups.enemies.countLiving();
    var cell = this.get_cell();
    var cell_pos = this.get_cell_position(cell.x, cell.y);
    var position = new Phaser.Point(cell_pos.x, cell_pos.y);
    
    var item_prefab = Bomberman.create_prefab_from_pool(
        this.game_state.groups.enemies, 
        Bomberman.Enemy.prototype.constructor, 
        this.game_state, 
        name, 
        position, 
        properties);
                
    console.log('Done create enemy: ', position);
}

Bomberman.Target.prototype.get_cell = function() {
    var cellX = Math.floor((this.x - this.game_state.board.x) / this.game_state.board.cellWidth);
    var cellY = Math.floor((this.y - this.game_state.board.y) / this.game_state.board.cellHeight);
    return {x:cellX, y:cellY};
}

Bomberman.Target.prototype.get_cell_position = function(cellX, cellY) {
    var xPos = this.game_state.board.x + (cellX+0.5) * this.game_state.board.cellWidth;
    var yPos = this.game_state.board.y + (cellY+0.5) * this.game_state.board.cellHeight;

    return {x:xPos, y:yPos};
}

Bomberman.Target.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.kill, null, this);
};

Bomberman.Target.prototype.kill = function () {
    "use strict";
    var goal_position, goal_properties, goal;
    this.spawn_timer.destroy();
    Phaser.Sprite.prototype.kill.call(this);
    if (this.game_state.groups.targets.countLiving() === 0) {
        // create goal
        goal_position = new Phaser.Point(this.game_state.game.world.width / 2, this.game_state.game.world.height / 2);
        goal_properties = {texture: "goal_image", group: "goals"};
        goal = new Bomberman.Goal(this.game_state, "goal", goal_position, goal_properties);
        console.log('########## CREATE GOAL ########');
    }
};