var Bomberman = Bomberman || {};

Bomberman.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "player": Bomberman.Player.prototype.constructor,
        "enemy": Bomberman.Enemy.prototype.constructor,
        "target": Bomberman.Target.prototype.constructor
    };

    this.item_prefab = {
        "life": Bomberman.LifeItem.prototype.constructor,
        "armor": Bomberman.BombItem.prototype.constructor,
        
        "bomb": Bomberman.BombItem.prototype.constructor,
        "power": Bomberman.BombItem.prototype.constructor,
        "range": Bomberman.LifeItem.prototype.constructor,
        "speed": Bomberman.BombItem.prototype.constructor,

        "bomb_down": Bomberman.LifeItem.prototype.constructor,
        "power_down": Bomberman.BombItem.prototype.constructor,
        "speed_down": Bomberman.LifeItem.prototype.constructor,
        "range_down": Bomberman.BombItem.prototype.constructor,

        "bomb_pass": Bomberman.LifeItem.prototype.constructor,
        "brick_pass": Bomberman.BombItem.prototype.constructor,
        "undead": Bomberman.LifeItem.prototype.constructor,
        "bomb_kick": Bomberman.BombItem.prototype.constructor,
        "remote_control": Bomberman.LifeItem.prototype.constructor,

    };
    
    // define available items
    this.items = {
        life: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [34, 48]}},
        armor: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [12, 13]}},

        bomb: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [28, 42]}},
        power: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [72, 72]}},
        range: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [29, 43]}},
        speed: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [31, 45]}},

        bomb_down: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [8, 9]}},
        power_down: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [73, 73]}},
        speed_down: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [22, 23]}},
        range_down: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [60, 60]}},

        bomb_pass: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [32, 46]}},
        brick_pass: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [33, 47]}},
        undead: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [99, 100]}},
        bomb_kick: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [69, 69]}},
        remote_control: {prob: 0.1, prop: {texture: "item_spritesheet", group: "items", anim: [30, 44]}},
    };

    this.item_total_prob = 0.0;
    for (var key in this.items) {
        // check if the property/key is defined in the object itself, not in parent
        if (this.items.hasOwnProperty(key)) {           
            this.item_total_prob += this.items[key].prob;
        }
    }
    this.item_total_prob = this.item_total_prob / 0.8;
};

Bomberman.TiledState.prototype = Object.create(Phaser.State.prototype);
Bomberman.TiledState.prototype.constructor = Bomberman.TiledState;

Bomberman.TiledState.prototype.init = function (level_data) {
    "use strict";
    var tileset_index;
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 0;
    
    // create map and set tileset
    this.map = this.game.add.tilemap(level_data.map.key);
    
    /*
    game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');

    map = game.add.tilemap('mario');
    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    
    */


    tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
        console.log('TILE_SET: ', tileset_index, tileset);
        /*
        //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        //  The second parameter maps this name to the Phaser.Cache key 'tiles'
        */
        this.map.addTilesetImage(tileset.name, level_data.map.tilesets[tileset_index]);
        tileset_index += 1;
    }, this);
    
    if (this.level_data.first_level) {
        localStorage.clear();
    }
};

Bomberman.TiledState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles;
    
    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        if (layer.properties.collision) { // collision layer
            collision_tiles = [];
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                data_row.forEach(function (tile) {
                    // check if it's a valid tile index and isn't already in the list
                    if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                        collision_tiles.push(tile.index);
                    }
                }, this);
            }, this);
            this.map.setCollision(collision_tiles, true, layer.name);
        }
    }, this);
    // resize the world to be the size of the current layer
    this.layers[this.map.layer.name].resizeWorld();

    console.log('this.layers:: ', this.layers);
    /*
    Cell-grid hash for movement and item logic
    */
    // this.collision_data = this.layers.collision.layer.data.map(function(row) {
    //     return row.map(function (cell) {
    //         return cell.canCollide ? true: false;
    //     });
    // });

    var base_layer = this.map.layer;
    this.board = {
        x: base_layer.x,
        y: base_layer.y,
        height: base_layer.height,
        width: base_layer.width,
        cellWidth: base_layer.widthInPixels / base_layer.width,
        cellHeight: base_layer.heightInPixels / base_layer.height
    };


    this.bomb_board = [];
    for(let i = 0; i < this.board.height ; i ++) {
        var row = [];
        for(let j = 0 ; j < this.board.width ; j ++) {
            row.push(false);
        }
        this.bomb_board.push(row);
    }

    console.log('----->>>>>>this.bomb_board: ', this.bomb_board);


    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);

    var explosion_types = [
        'explosions_center', 
        'explosions_end_left', 'explosions_end_right', 'explosions_mid_x',
        'explosions_end_up', 'explosions_end_down', 'explosions_mid_y'
    ];

    explosion_types.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    this.prefabs = {};
    
    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }
    
    this.init_hud();
};

Bomberman.TiledState.prototype.create_object = function (object) {
    "use strict";
    var object_y, position, prefab;
    // tiled coordinates starts in the bottom left corner
    object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
    position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};
    // create object according to its type
    if (this.prefab_classes.hasOwnProperty(object.type)) {
        prefab = new this.prefab_classes[object.type](this, object.name, position, object.properties);
    }
    this.prefabs[object.name] = prefab;
};

Bomberman.TiledState.prototype.init_hud = function () {
    "use strict";
    var lives_position, lives_prop, lives;
    
    // create the lives prefab
    lives_position = new Phaser.Point(0.9 * this.game.world.width, 0.07 * this.game.world.height);
    lives_prop = {group: "hud", texture: "heart_image", number_of_lives: 3};
    lives = new Bomberman.Lives(this, "lives", lives_position, lives_prop);
};

Bomberman.TiledState.prototype.game_over = function () {
    "use strict";
    this.game.state.restart(true, false, this.level_data);
};

Bomberman.TiledState.prototype.next_level = function () {
    "use strict";
    localStorage.number_of_lives = this.prefabs.player.number_of_lives;
    localStorage.number_of_bombs = this.prefabs.player.number_of_bombs;
    this.game.state.start("BootState", true, false, this.level_data.next_level, "TiledState");
};
