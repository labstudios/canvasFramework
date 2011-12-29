var Ball = new Class({

    Extends: CanvasObject,
    
    Implements: [Events],
    
    speed: 3,
    vx: 7,
    vy: 7,
    radius: 25,
    color: "#FF0000",
    
    initialize: function(color)
    {
        this.parent();
        this.addEvent(Event.ENTER_FRAME, this.onEnterFrame.bind(this));
        this.addEvent(Event.ADDED_TO_STAGE, this.added.bind(this));
        if(color)
        {
            this.color = color;
        }
        
        
    },
    
    added: function(){
       this.x = (Math.random() * (this.stage.width - 100)) + 50;
       this.y = (Math.random() * (this.stage.height - 100)) + 50;  
    },
    
    onEnterFrame: function()
    {
        this.x += this.vx;
        this.y += this.vy;
        
        if(this.left() < 0 || this.right() > this.stage.width)
        {
            this.vx *= -1;
        }
        if(this.top() < 0 || this.bottom() > this.stage.height)
        {
            this.vy *= -1;
        }
    },
    
    draw: function()
    {
        this.centeredCircle(this.radius, this.color);
    },
    
    bottom: function()
    {
        return this.y + this.radius;
    },
    
    top: function()
    {
        return this.y - this.radius;
    },
    
    left: function()
    {
        return this.x - this.radius;
    },
    
    right: function()
    {
        return this.x + this.radius;
    }
});




var Backdrop = new Class({

    Extends: CanvasObject,
    
    Implements: [Events],
    
    draw:function(){
        this.rectangle(this.stage.width, this.stage.height, "#000000");
    }
});

document.addEvent("domready", function(){
   
    
   var backdrop = new Layer({animate: false});
   var l1 = new Layer();
   
   var ball = l1.addChild(new Ball());
   var ball2 = l1.addChild(new Ball("#0000FF"));
   
   var bkg = backdrop.addChild(new Backdrop());
   
   
   ball2.vx = -5.5;
   ball2.vy = 5.5;
   Stage.instance().startRunning();
   
    
});