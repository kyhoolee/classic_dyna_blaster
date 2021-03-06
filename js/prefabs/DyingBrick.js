var Bomberman = Bomberman || {};

Bomberman.DyingBrick = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);

    this.die_anim = this.animations.add("die", [3,4,5,6,7,8], 6, false);
    this.die_anim.onComplete.add(this.kill, this);
    this.animations.play("die");
};

Bomberman.DyingBrick.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.DyingBrick.prototype.constructor = Bomberman.DyingBrick;

Bomberman.DyingBrick.prototype.reset = function (position_x, position_y) {
    "use strict";
    Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
    this.die_anim.restart();

    
};