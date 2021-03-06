var Bomberman = Bomberman || {};

Bomberman.create_prefab_from_pool = function (pool, prefab_constructor, game_state, prefab_name, prefab_position, prefab_properties) {
    "use strict";
    var prefab;
    // get the first dead prefab from the pool
    prefab = pool.getFirstDead();
    if (!prefab) {
        // if there is no dead prefab, create a new one
        prefab = new prefab_constructor(game_state, prefab_name, prefab_position, prefab_properties);
    } else {
        if(typeof(prefab.reset_prop) === 'function') {
            prefab.reset_prop(prefab_position.x, prefab_position.y, prefab_properties);
        } else {
            // if there is a dead prefab, reset it in the new position
            prefab.reset(prefab_position.x, prefab_position.y);
        }
    }
};


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
Bomberman.getRandomArbitrary = function (min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
Bomberman.getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}