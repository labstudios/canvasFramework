Class.Mutators.Static = function(members){
    this.extend(members);
};

var FrameEvent = {
    ADDED_TO_STAGE: "addedToStage",
    ENTER_FRAME: "enterFrame",
    EXIT_FRAME: "exitFrame",
    RENDER: "render"
};

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
        animate:true
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
        draw:null      
    },
            
    stage: null,
    layer: null,
    context: null,
    x: 0,
    y: 0,
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