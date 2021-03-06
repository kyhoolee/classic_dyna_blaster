var Bomberman = Bomberman || {};

var game = new Phaser.Game(240, 240, Phaser.CANVAS);

/*
Adds a new State into the StateManager. 
You must give each State a unique key by which you'll identify it.
The State can be either a Phaser.State object (or an object that extends it), 
a plain JavaScript object or a function.
If a function is given a new state object will be created by calling it.

Parameters

key	string			
A unique key you use to reference this state, i.e. "MainMenu", "Level1".

state	Phaser.State | object | function			
The state you want to switch to.

autoStart	boolean	<optional>
false	
If true the State will be started immediately after adding it.
*/
game.state.add("BootState", new Bomberman.BootState());
game.state.add("LoadingState", new Bomberman.LoadingState());
game.state.add("TiledState", new Bomberman.TiledState());


/*
start(key, clearWorld, clearCache, parameter)
Start the given State. 
If a State is already running then State.shutDown will be called (if it exists) before switching to the new State.

Parameters

key	string			
The key of the state you want to start.

clearWorld	boolean	<optional>
true	
Clear everything in the world? 
This clears the World display list fully 
(but not the Stage, so if you've added your own objects to the Stage they will need managing directly)

clearCache	boolean	<optional>
false	
Clear the Game.Cache? 
This purges out all loaded assets. 
The default is false and you must have clearWorld=true if you want to clearCache as well.

parameter	*	<repeatable>
Additional parameters that will be passed to the State.init function (if it has one).
--> Parameter pass to State.init method 
--> so you had to use init method to pass params across State
--> Or using global variables 
*/

game.state.start("BootState", true, false, "assets/levels/level1.json", "TiledState");


/*
Reference play: 
https://www.retrogames.cc/arcade-games/dynablaster-bomber-man.html
*/