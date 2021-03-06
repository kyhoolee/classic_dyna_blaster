var Bomberman = Bomberman || {};

Bomberman.Item = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    
    this.anim = this.animations.add("exciting", properties.anim, 2, true);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exciting");

    // this.scale.setTo(0.75);
};

Bomberman.Item.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Item.prototype.constructor = Bomberman.Item;

Bomberman.Item.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.collect_item, null, this);
};

Bomberman.Item.prototype.reset_prop = function(x,y, properties) {
    this.reset(x,y);
    this.anim = this.animations.add("exciting", properties.anim, 2, true);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exciting");
};

Bomberman.Item.prototype.collect_item = function () {
    "use strict";
    // by default, an item is destroyed when collected
    this.kill();
};