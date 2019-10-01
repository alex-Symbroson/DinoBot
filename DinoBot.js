(function(){

var debug = false;
var speed = 1;

// runner instance
var r = new Runner();

// dino state
var state = "run", ducking;

// speed adjustment
if(speed && speed != 1)
{
	var _n = performance.now;
	Performance.prototype.now = () => 2 * _n.apply(performance);
}

// main script
if(window["_itvDinoBot"] != null) clearInterval(_itvDinoBot);

window["_itvDinoBot"] = setInterval(function()
{
    var ts = state;
    state = r.tRex.jumping ? "jump" : r.tRex.ducking ? "duck" : "run";
    if(state != ts) dbg(state);
    if(state == "run") ducking = false;

    if(r.horizon.obstacles.length > 0) test(0);
}, 50);

// check and react on obstackle
function test(i)
{
    var o = r.horizon.obstacles[i];
    var p = r.tRex;

	// obstacle near
    if(o.xPos - p.xPos < 100 + r.currentSpeed*4)
    {
    	// obs on ground
        if(state != "jump" && o.yPos > 80) jump();

		// obs in air
        if(state != "duck" && o.yPos < 80 && o.yPos > 60) duck(1);
    }

	// obstacle passed
    if((p.xPos > getX2(o) - 25) || (o.xPos - p.xPos > 130 + r.currentSpeed*4))
    {
    	// undo action
        if(state == "jump" && !ducking) duck(2);
        if(state == "duck") unduck(1);
    }
}

// returns the max x expansion of an obstacle
function getX2(o) {
    var b = o.collisionBoxes;
    var max = 0;
    
    for(var i in b)
        if( max < o.xPos + b[i].x + b[i].width)
            max = o.xPos + b[i].x + b[i].width;
    
    return max;
}


// Keyboard emulators

function jump()
{
    dbg("- jump"); 
    r.onKeyDown(new KeyboardEvent("keyDown", {keyCode:38, which:38}));
    
    setTimeout(function(){
        dbg("- unjump");
        r.onKeyUp(new KeyboardEvent("keyUp", {keyCode:38, which:38}));
    }, 300);
}

function duck(i)
{
    dbg("- duck "  + (i || ''));
    r.onKeyDown(new KeyboardEvent("keyDown", {keyCode:40, which:40}));
    ducking = true;
}

function unduck(i)
{
    dbg("- unduck "  + (i || ''));
    r.onKeyUp(new KeyboardEvent("keyUp", {keyCode:40, which:40}));
    ducking = false;
}


function dbg(s) { if(debug) console.log(s); }

})();
