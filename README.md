# Canvas Objects #

## Problem(s) ##

The available programming for Canvas tags is relatively limited. Those of us coming from a Flash background will quickly find canvas very limiting and, in truth, a huge step backwards. Some of the major limitations follow:

+ Inability to treat a drawn item as an object
+ Inability to natively move an object in an XY coordinate system (thus complicating animation)
+ Inability to reliably layer objects over-top of one another

Still, with all these limitations the canvas tag is a start with a lot of promise. As we are moving into an age where JavaScript will be needed to be compatible with all manner of peripheral devices such as phones and tablets, we need to beef up cabability in order to facilitate this change. Since it will take years of squabbling over needed standards, and even longer for certain browsers (you know who I am talking about) to to update changes, it falls on the developers to take action.

## Goal ##

Create a system where: 

+ objects handle drawing themselves
+ the system handles refreshing the canvas
+ having animated and un-animated layers is possible

## Solutions ##

Any time I think "Object-Oriented JavaScript," I instantly think MooTools, so MooTools became the base of the project.

Another thing that seemed necessary was the capability of static variables in the MooTools classes. The idea and code came from [here](http://www.amazon.com/Pro-JavaScript-MooTools-Mark-Obcena/dp/1430230541/ "Pro JavaScript with MooTools").

So far there are 3 classes to make up the system.

### Stage ###

This is the class that handles telling everything to animate. If no container (such as a div) is provided, it will assume that the entire project is a canvas and will use the body (i.e. the whole page) as its container. This class also allows for a singleton instance to be used (where the body is the primary container).

If you wish to use an area of the page as a container, a stage object must be created.

### Layer ###

The layer creates a canvas tag and tells all objects inside it to move. You must have at least one layer. The first layer created will be farthest to the back. New layers go to the front. 

If a layer is not intended to animate (i.e. is a static backdrop) that layer can be set animate:false as part of the options object. This will help reduce processor usage.

### CanvasObject ###

This is the item that is added to a layer. Generally, you will make your own classes that extend the CanvasObject. 

It has a draw function that is called (and expected to be overridden) to handle art. Technically it is called every "frame" if on an animated layer, but I would discourage using it for animation math or object positioning; ENTER_FRAME and EXIT_FRAME events are fired for that purpose. Base the location of your art on the x,y variables of the CanvasObject.

## Files ##

js/canvas.js is the main part of the project. js/index.js is there as a test area for the classes mentioned above.

## Admissions ##

First, you may notice that there are some similarities here with AS3. I wish to make clear that the goal is not to re-write Flash, but I do borrow a few ideas from it. I have extensive background in AS3, so it's just a part of how I think.

Second, this is not fully tested code, and there is a lot more I want to do with it. At this point I think I have spent almost as much time on the documentation as I have on the code itself. My primary test involves using body as my stage container. While I get the wisdom in allowing multiple containers on a page, it is not yet tested; but i hope I have the roots in place.

Third, yes you will still have to handle the drawing of your objects. There are a few functions in CanvasObject that are there to help, but I would still consider them limited at best. So, if you want certain things to work (such as x, y, and alpha) you will need to consider them in your draw function.

## TODO ##

+ collision testing
+ easily add image without editing draw function
+ be able to create CanvasObject without having to extend the class
+ set up standard CanvasObject extend template
+ asset management