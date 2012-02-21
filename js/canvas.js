Class.Mutators.Static = function(members){
    this.extend(members);
};

var FrameEvent = {
    ADDED_TO_STAGE: "addedToStage",
    ENTER_FRAME: "enterFrame",
    EXIT_FRAME: "exitFrame",
    RENDER: "render"
};

var MouseEvent = {
	CLICK: "click",
	MOUSE_OVER: "mouseover",
	MOUSE_OUT: "mouseout",
	MOUSE_ENTER: "mouseenter",
	MOUSE_LEAVE: "mouseleave",
	MOUSE_MOVE: "mousemove",
	MOUSE_UP: "mouseup",
	MOUSE_DOWN: "mousedown"
};

var RegPoints = {
	TOP_LEFT: "tl",
	TOP_RIGHT: "tr",
	TOP_CENTER: "tc",
	CENTER: "cc",
	CENTER_LEFT: "cl",
	CENTER_RIGHT: "cr",
	BOTTOM_LEFT: "bl",
	BOTTOM_RIGHT: "br",
	BOTTOM_CENTER: "bc"
};

/**
 * A simple point class to handle XY Coords
 * @author	Brent Allen
 */
var Point = new Class({
	
	x:0,
	y:0,
	
	initialize: function(xcoord, ycoord)
	{
		this.x = xcoord == null ? 0:xcoord;
		this.y = ycoord == null ? 0:ycoord;
	}
});

/**
 * A simple point class to handle XY Coords
 * @author	Brent Allen
 */
var BoundingBox = new Class({
	
	x:0,
	y:0,
	width: 0,
	height: 0,
	
	initialize: function(xcoord, ycoord, w,h)
	{
		this.x = xcoord == null ? 0:xcoord;
		this.y = ycoord == null ? 0:ycoord;
		this.width = w == null ? 0:w;
		this.height = h == null ? 0:h;
	},
	
	left: function()
	{
		return this.x;
	},
	
	right: function()
	{
		return this.x + this.width;
	},
	
	top: function()
	{
		return this.y;
	},
	
	bottom: function()
	{
		return this.y + this.height;
	}
});

/**
 * Handles adding layers and telling them to animate
 * @author	Brent Allen
*/
var Stage = new Class({

    //Extends: ,
    
    Implements: [Options, Events],
    
    Static: {
        stage:null,
        instance:function()
        {
            if(!Stage.stage)
            {
                Stage.stage = new Stage();
            }
            return Stage.stage;
        }  
    },
    
    options:{
        fullWindow:true,
        fps: 24,
        width: 50,
        height: 50,
        autoRun: true
    },
    
    fps: 24,
    width: 50,
    height: 50,
    layers: new Array(),
    
    initialize: function(element, options)
    {
        this.element = element == null ? document.getElement("body"):document.id(element);
        if(this.options.fullWindow)
        {
            this.options.width = window.innerWidth;
            this.options.height = window.innerHeight;
        }
        this.setOptions(options);
        this.width = this.options.width;
        this.height = this.options.height;
        this.fps = this.options.fps;
        if(this.options.autoRun)
        {
			this.startRunning();
        }
    },
    
    addLayer:function(layer)
    {
        this.layers.push(layer);
        this.element.set("html", "");
        this.layers.each(function(layer)
        {
            layer.element.inject(this.element);
        }, this);
    },
    
    startRunning:function()
    {
        this.run.periodical(1000/this.fps, this);
    },
    
    run: function()
    {
        this.layers.each(function(layer)
        {
            layer.build();
        }, this);
    }
});

var Layer = new Class({

    
    Implements: [Options, Events],
    Static: {
        autoAdd: true
    },
    options:{
        animate:true,
        enableMouseEvents: false
    },
    stage:null,
    children: new Array(),
    builtOnce: false,
    context: null,
    
    initialize: function(options, stage)
    {
        this.setOptions(options);
        if(stage)
        {
            this.stage = stage;
        }
        else
        {
            this.stage = Stage.instance();
        }
        this.element = new Element("canvas", {width: this.stage.width, height: this.stage.height});
        this.element.setStyles({
            position: 'absolute',
            top: "0",
            left: "0"
        });
        this.context = this.element.getContext("2d");
        Layer.autoAdd ? this.stage.addLayer(this):null;
        if(this.options.enableMouseEvents)
        {
        	//add events to the layer
        }
    },
    
    build:function()
    {
        if(this.options.animate || !this.builtOnce)
        {
            this.context.clearRect(0,0, this.stage.width, this.stage.height);
            this.children.each(function(child){
                child.run();
            }, this);
            this.builtOnce = true;
        }
    },
    
    addChild: function(co)
    {
        this.children.push(co);
        co.stage = this.stage;
        co.layer = this;
        co.context = this.context;
        co.fireEvent(FrameEvent.ADDED_TO_STAGE);
        return co;
    }
});

var CanvasObject = new Class({

    Implements: [Options, Events],
    
    options:{
        init:null,        
        draw:null,
        width: 0,
        height: 0,
        topLeft: 0
    },
            
    stage: null,
    layer: null,
    context: null,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    topLeft: 0,
    registrationPos: RegPoints.TOP_LEFT,
    hitBox: null,
    alpha: 1,
    
    initialize: function(options)
    {
        this.setOptions(options);
        this.options.init ? this.options.init.call(this):null;
        if(this.options.draw)
        {
            this.draw = this.options.draw.bind(this);         
            this.addEvent(FrameEvent.RENDER, this.draw.bind(this));
        }
        else
        {
            this.addEvent(FrameEvent.RENDER, this.draw.bind(this));   
        }
    },
    
    run: function()
    {
        this.fireEvent(FrameEvent.ENTER_FRAME);
        this.fireEvent(FrameEvent.RENDER);
        this.fireEvent(FrameEvent.EXIT_FRAME);
    },
    
    draw: function()
    {
        //polymorphosize
    },
    
    setHitBounds: function(width, height, regPos)
    {
		width = width == null ? 0:width;
		height = height == null ? 0:height;
		this.registrationPos = regPos == null ? this.registrationPos:regPos;
    	
    	var firstCoord = this.registrationPos[0];
    	var secondCoord = this.registrationPos[1];
    	var x = 0;
    	var y = 0;
    	if(firstCoord == 't')
    	{
    		y = -height/2;
    	}
    	else if(firstCoord == 'b')
    	{
    		y = height/2;
    	}
    	if(secondCoord == 'l')
    	{
    		x = -width/2;
    	}
    	else if(secondCoord == 'r')
    	{
    		x = width/2;
    	}
    	
    	this.hitBox = new BoundingBox(x,y,width, height);
    },
    
    hitTestObject: function(cobj)
    {
    	if(instanceOf(cobj, CanvasObject) && cobj.hitBox && this.hitBox)
    	{
    		var bbox1 = new BoundingBox(this.x + this.hitBox.x, this.y + this.hitBox.y, this.hitBox.width, this.hitBox.height);
    		var bbox2 = new BoundingBox(cobj.x + cobj.hitBox.x, cobj.y + cobj.hitBox.y, cobj.hitBox.width, cobj.hitBox.height);
    		
    		//check left and right sides
    		if((bbox1.left() > bbox2.left() && bbox1.left() < bbox2.right() ) ||
    			(bbox2.left() > bbox1.left() && bbox2.left() < bbox1.right() ))
    		{
    			//now check top and bottom
    			if((bbox1.top() > bbox2.top() && bbox1.top() < bbox2.bottom() ) ||
    				(bbox2.top() > bbox1.top() && bbox2.top() < bbox1.bottom() ))
    			{
    				return true;	
    			}
    		}
    	}
    	
    	return false;
    },
    
    centeredCircle: function(radius, color)
    {
        if(!color)
        {
            color = "#000000";
        }
        if(!radius)
        {
            radius = 10;
        }
        if(this.context)
        {
            this.context.fillStyle = color;
            this.context.globalAlpha = this.alpha;
            this.context.beginPath();
            this.context.arc(this.x,this.y,radius,0,Math.PI*2,true);
            this.context.closePath();
            this.context.fill();
        }
    },
    
    centeredRectangle: function(width, height, color)
    {
        if(!color)
        {
            color = "#000000";
        }
        if(this.context)
        {
            this.context.fillStyle = color;
            this.context.globalAlpha = this.alpha;
            this.context.fillRect(this.x - width/2, this.y - height/2, width, height);
        }
    },
    
    rectangle: function(width, height, color)
    {
        if(!color)
        {
            color = "#000000";
        }
        if(this.context)
        {
            this.context.fillStyle = color;
            this.context.globalAlpha = this.alpha;
            this.context.fillRect(this.x, this.y, width, height);
        }
    },
    
    circle: function(radius, color)
    {
        if(!color)
        {
            color = "#000000";
        }
        if(!radius)
        {
            radius = 10;
        }
        if(this.context)
        {
            this.context.fillStyle = color;
            this.context.globalAlpha = this.alpha;
            this.context.beginPath();
            this.context.arc(this.x + radius,this.y + radius,radius,0,Math.PI*2,true);
            this.context.closePath();
            this.context.fill();
        }
    }
});