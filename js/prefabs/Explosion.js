var Bomberman = Bomberman || {};

Bomberman.Explosion = function (game_state, name, position, properties) {
    "use strict";
    Bomberman.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.duration = +properties.duration;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;

    
    // create the kill timer with autoDestroy equals false
    this.kill_timer = this.game_state.time.create(false);
    this.kill_timer.add(Phaser.Timer.SECOND * 0.5, this.kill, this);
    this.kill_timer.start();

    this.game_state.groups.explosions.add(this);
};

Bomberman.Explosion.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Explosion.prototype.constructor = Bomberman.Explosion;

Bomberman.Explosion.prototype.reset = function (position_x, position_y) {
    "use strict";
    Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
    if(this.exploding_animation) {
        this.exploding_animation.restart();
    }
    // add another kill event
    this.kill_timer.add(Phaser.Timer.SECOND * this.duration, this.kill, this);
};

// 1. Center 
Bomberman.ExplosionCenter = function(game_state, name, position, properties) {
    Bomberman.Explosion.call(this, game_state, name, position, properties);
    var anims = [44,45,46,47];
    this.exploding_animation = this.animations.add("exploding", anims, 8, false);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
}

Bomberman.ExplosionCenter.prototype = Object.create(Bomberman.Explosion.prototype);
Bomberman.ExplosionCenter.prototype.constructor = Bomberman.ExplosionCenter;

Bomberman.ExplosionCenter.prototype.reset = function (position_x, position_y) {
    "use strict";
    Bomberman.Explosion.prototype.reset.call(this, position_x, position_y);
};


// 2. 
Bomberman.ExplosionEndLeft = function(game_state, name, position, properties) {
    Bomberman.Explosion.call(this, game_state, name, position, properties);
    var anims = [32,33,34,35];
    this.exploding_animation = this.animations.add("exploding", anims, 8, false);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
}

Bomberman.ExplosionEndLeft.prototype = Object.create(Bomberman.Explosion.prototype);
Bomberman.ExplosionEndLeft.prototype.constructor = Bomberman.ExplosionEndLeft;

Bomberman.ExplosionEndLeft.prototype.reset = function (position_x, position_y) {
    "use strict";
    Bomberman.Explosion.prototype.reset.call(this, position_x, position_y);
};


// 3. 
Bomberman.ExplosionEndRight = function(game_state, name, position, properties) {
    Bomberman.Explosion.call(this, game_state, name, position, properties);
    var anims = [24,25,26,27];
    this.exploding_animation = this.animations.add("exploding", anims, 8, false);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
}

Bomberman.ExplosionEndRight.prototype = Object.create(Bomberman.Explosion.prototype);
Bomberman.ExplosionEndRight.prototype.constructor = Bomberman.ExplosionEndRight;

Bomberman.ExplosionEndRight.prototype.reset = function (position_x, position_y) {
    "use strict";
    Bomberman.Explosion.prototype.reset.call(this, position_x, position_y);
};

// 4. 
Bomberman.ExplosionEndUp = function(game_state, name, position, properties) {
    Bomberman.Explosion.call(this, game_state, name, position, properties);
    var anims = [20,21,22,23];
    this.exploding_animation = this.animations.add("exploding", anims, 8, false);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
}

Bomberman.ExplosionEndUp.prototype = Object.create(Bomberman.Explosion.prototype);
Bomberman.ExplosionEndUp.prototype.constructor = Bomberman.ExplosionEndUp;

Bomberman.ExplosionEndUp.prototype.reset = function (position_x, position_y) {
    "use strict";
    Bomberman.Explosion.prototype.reset.call(this, position_x, position_y);
};

// 5. 
Bomberman.ExplosionEndDown = function(game_state, name, position, properties) {
    Bomberman.Explosion.call(this, game_state, name, position, properties);
    var anims = [28,29,30,31];
    this.exploding_animation = this.animations.add("exploding", anims, 8, false);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
}

Bomberman.ExplosionEndDown.prototype = Object.create(Bomberman.Explosion.prototype);
Bomberman.ExplosionEndDown.prototype.constructor = Bomberman.ExplosionEndDown;

Bomberman.ExplosionEndDown.prototype.reset = function (position_x, position_y) {
    "use strict";
    Bomberman.Explosion.prototype.reset.call(this, position_x, position_y);
};

// 6. 
Bomberman.ExplosionMidX = function(game_state, name, position, properties) {
    Bomberman.Explosion.call(this, game_state, name, position, properties);
    var anims = [40,41,42,43];
    this.exploding_animation = this.animations.add("exploding", anims, 8, false);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
}

Bomberman.ExplosionMidX.prototype = Object.create(Bomberman.Explosion.prototype);
Bomberman.ExplosionMidX.prototype.constructor = Bomberman.ExplosionMidX;

Bomberman.ExplosionMidX.prototype.reset = function (position_x, position_y) {
    "use strict";
    Bomberman.Explosion.prototype.reset.call(this, position_x, position_y);
};


// 7. 
Bomberman.ExplosionMidY = function(game_state, name, position, properties) {
    Bomberman.Explosion.call(this, game_state, name, position, properties);
    var anims = [36,37,38,39];
    this.exploding_animation = this.animations.add("exploding", anims, 8, false);
    //this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
}

Bomberman.ExplosionMidY.prototype = Object.create(Bomberman.Explosion.prototype);
Bomberman.ExplosionMidY.prototype.constructor = Bomberman.ExplosionMidY;

Bomberman.ExplosionMidY.prototype.reset = function (position_x, position_y) {
    "use strict";
    Bomberman.Explosion.prototype.reset.call(this, position_x, position_y);
};