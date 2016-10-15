// Things to check:
//   text    fillText(last param)
//   rect    context.beginpath()
//   img     context.save()

/* Doodle Drawing Library
 *
 * Drawable and Primitive are base classes and have been implemented for you.
 * Do not modify them! 
 *
 * Stubs have been added to indicate where you need to complete the
 * implementation.
 * Please email me if you find any errors!
 */

/*
 * Root container for all drawable elements.
 */
function Doodle (context) {
    this.context = context;
    this.children = [];
}

Doodle.prototype.draw = function() {
 	// draw all children
    for (var i = 0; i < this.children.length; i++) {
        console.log("children: "+this.children[i]);
        // only draw if the children are visible
        if (this.children[i].visible == true) {
            this.context.save();
            this.children[i].draw(this.context);
            this.context.restore();
        };
    };
    return;
};



/* Base class for all drawable objects.
 * Do not modify this class!
 */
function Drawable (attrs) {
    var dflt = { 
        left: 0,
        top: 0,
        visible: true,
        theta: 0,
        scale: 1
    };
    attrs = mergeWithDefault(attrs, dflt);
    this.left = attrs.left;
    this.top = attrs.top;
    this.visible = attrs.visible;
    this.theta = attrs.theta*Math.PI/180;
    this.scale = attrs.scale;
};

/*
 * Summary: returns the calculated width of this object
 */
Drawable.prototype.getWidth = function(context) {
  console.log("ERROR: Calling unimplemented draw method on drawable object.");
  return 0;
};

/*
 * Summary: returns the calculated height of this object
 */
Drawable.prototype.getHeight = function(context) {
  console.log("ERROR: Calling unimplemented draw method on drawable object.");
  return 0;
};

/*
 * Summary: Uses the passed in context object (passed in by a doodle object)
 * to draw itself.
 */
Drawable.prototype.draw = function(context) {
    console.log("ERROR: Calling unimplemented draw method on drawable object.");
};




/* Base class for objects that cannot contain child objects.
 * Do not modify this class!
 */
function Primitive(attrs) {
    var dflt = {
        lineWidth: 1,
        color: "black"
    };
    attrs = mergeWithDefault(attrs, dflt);
    Drawable.call(this, attrs);
    this.lineWidth = attrs.lineWidth;
    this.color = attrs.color;
};
Primitive.inheritsFrom(Drawable);



function Text(attrs) {
    var dflt = {
        content: "",
        fill: "black", //color
        font: "Helvetica", //font family
        size: 12, //Size in pt
        bold: false //bold boolean
    };
    attrs = mergeWithDefault(attrs, dflt);
    Drawable.call(this, attrs);
  
    //Rest of constructor code here
    this.content = attrs.content;
    this.fill = attrs.fill;
    this.font = attrs.font;
    this.size = attrs.size;
    this.bold = attrs.bold;
};
Text.inheritsFrom(Drawable);

//Text methods here
Text.prototype.draw = function(context) {
        // context.translate(this.left, this.top);
        // context.rotate(this.theta);
        // context.scale(this.scale, this.scale);
    // apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    context.beginPath();
    // if the text is bold
    if (this.bold) {
        context.font = "bold "+this.size+"pt "+this.font;
    }
    else {
        context.font = this.size+"pt "+this.font;
    }
    context.fillStyle = this.fill; 
    context.fillText(this.content, 0, 0);
    context.closePath();

    console.log(this);  
};

Text.prototype.getWidth = function(context) {
    var size = MeasureText(this, this.bold, this.font, this.size);
    return size[0];
};

Text.prototype.getHeight = function(context) {
    var size = MeasureText(this, this.bold, this.font, this.size);
    return size[1]; 
};



function DoodleImage(attrs) {
    var dflt = {
        width: -1,
        height: -1,
        src: "",
    };
    attrs = mergeWithDefault(attrs, dflt);
    Drawable.call(this, attrs);
 
    //Rest of constructor code here
    this.width = attrs.width;
    this.height = attrs.height;
    this.src = attrs.src;
};
DoodleImage.inheritsFrom(Drawable);

//DoodleImage methods here
DoodleImage.prototype.draw = function(context) {
    console.log(this); 
    // create a new image object
    var img = new Image();
    img.src = this.src;
    img.left = this.left;
    img.top = this.top;
    img.theta = this.theta;
    img.scale = this.scale;
    img.width = this.width;
    img.height = this.height;

    // make sure the image is loaded before drawing
    img.onload = function() {
        context.save();  //  question: why this is needed ... already call that in drawable.draw
        // apply translation ,rotation, or scale if necessary
        applyTRS(context, img, img.left, img.top, img.theta, img.scale); 

        context.beginPath();
        // If the width and height of the image are not specified (i.e. default to -1)
        if (img.width == -1 && img.height == -1) {
            context.drawImage(img, 0, 0);
        }
        else {
            context.drawImage(img, 0, 0, img.width, img.height);   
        }
        context.closePath();   
        context.restore();
    };
};

DoodleImage.prototype.getWidth = function(context) {
    return this.width;
};

DoodleImage.prototype.getHeight = function(context) {
    return this.height;
};



function Line(attrs) {
    var dflt = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    };
    attrs = mergeWithDefault(attrs, dflt);
    Primitive.call(this, attrs);
    //Rest of constructor code here
    this.startX = attrs.startX;
    this.startY = attrs.startY;
    this.endX = attrs.endX;
    this.endY = attrs.endY;
};
Line.inheritsFrom(Primitive);

//Line methods here
Line.prototype.draw = function(context) {
    // apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    context.beginPath();  
    // set the line width and line color
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    // set the start and end points, and draw the line
    context.moveTo(this.startX, this.startY);
    context.lineTo(this.endX, this.endY);
    context.stroke();
    context.closePath(); 

    console.log(this); 
};

Line.prototype.getWidth = function(context) {
    return this.endX - this.startX;
};

Line.prototype.getHeight = function(context) {
    return this.endY - this.startY;
};



function Rectangle(attrs) {
    var dflt = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    attrs = mergeWithDefault(attrs, dflt);
    Primitive.call(this, attrs);
    //Rest of constructor code here
    this.x = attrs.x;
    this.y = attrs.y;
    this.width = attrs.width;
    this.height = attrs.height;
};
Rectangle.inheritsFrom(Primitive);

//Rectangle Methods here
Rectangle.prototype.draw = function(context) {
    // apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    // create the rectangle
    context.beginPath();   // question: weird thing happens if this is commented out
    context.rect(this.x, this.y, this.width, this.height);
    // set line width and strokeStyle
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    // draw the rectangle
    context.stroke();
    context.closePath(); 

    console.log(this);
};

Rectangle.prototype.getWidth = function(context) {
    return this.width;
};

Rectangle.prototype.getHeight = function(context) {
    return this.height;
};



function Container(attrs) {
    var dflt = {
        width: 100,
        height: 100,
        fill: false,
        borderColor: "black",
        borderWidth: 0,
    };
    attrs = mergeWithDefault(attrs, dflt);
    Drawable.call(this, attrs);    
    //Rest of constructor code here
};
Container.inheritsFrom(Drawable);

//Rest of container methods here
Container.prototype.draw = function(context) {
    
};

Container.prototype.layout = function(context) {
    
};

Container.prototype.getWidth = function(context) {
    
};

Container.prototype.getHeight = function(context) {
    
};



function Pile(attrs) {
  Container.call(this, attrs);   
  //Rest of constructor code here
};
Pile.inheritsFrom(Container);

//Rest of pile methods here
Pile.prototype.draw = function(context) {
    
};

Pile.prototype.layout = function(context) {
    
};

Pile.prototype.getWidth = function(context) {
    
};

Pile.prototype.getHeight = function(context) {
    
};




function Row(attrs) {
  Container.call(this, attrs);    
  //Rest of constructor code here
};
Row.inheritsFrom(Container);

//Rest of row methods here
Row.prototype.draw = function(context) {
    
};

Row.prototype.layout = function(context) {
    
};

Row.prototype.getWidth = function(context) {
    
};

Row.prototype.getHeight = function(context) {
    
};



function Column(attrs) {
  Container.call(this, attrs);  
  //Rest of constructor code here
};
Column.inheritsFrom(Container);

//Rest of column methods here
Column.prototype.draw = function(context) {
    
};

Column.prototype.layout = function(context) {
    
};

Column.prototype.getWidth = function(context) {
    
};

Column.prototype.getHeight = function(context) {
    
};



function Circle(attrs) {
  Container.call(this, attrs);      
  var dflt = {
    layoutCenterX: this.width / 2,
    layoutCenterY: this.height / 2,
    layoutRadius: Math.min(this.width, this.height) / 2 - 30
  };
  attrs = mergeWithDefault(attrs, dflt);
  //Rest of constructor code here
};
Circle.inheritsFrom(Container);

//Rest of circle methods here
Circle.prototype.draw = function(context) {
    
};

Circle.prototype.layout = function(context) {
    
};

Circle.prototype.getWidth = function(context) {
    
};

Circle.prototype.getHeight = function(context) {
    
}



function OvalClip(attrs) {
  Container.call(this, attrs);
  //Rest of constructor code here
};
OvalClip.inheritsFrom(Container);

//Rest of ovalClip methods here
OvalClip.prototype.draw = function(context) {
    
};

OvalClip.prototype.layout = function(context) {
    
};

OvalClip.prototype.getWidth = function(context) {
    
};

OvalClip.prototype.getHeight = function(context) {
    
};



/**
 * Measurement function to measure canvas fonts
 *
 * @return: Array with two values: the first [0] is the width and the seconds [1] is the height 
 *          of the font to be measured. 
 **/
function MeasureText(text, bold, font, size)
{
    // This global variable is used to cache repeated calls with the same arguments
    var str = text + ':' + bold + ':' + font + ':' + size;
    if (typeof(__measuretext_cache__) == 'object' && __measuretext_cache__[str]) {
        return __measuretext_cache__[str];
    }

    var div = document.createElement('DIV');
        div.innerHTML = text;
        div.style.position = 'absolute';
        div.style.top = '-100px';
        div.style.left = '-100px';
        div.style.fontFamily = font;
        div.style.fontWeight = bold ? 'bold' : 'normal';
        div.style.fontSize = size + 'pt';
    document.body.appendChild(div);
    
    var size = [div.offsetWidth, div.offsetHeight];

    document.body.removeChild(div);
    
    // Add the sizes to the cache as adding DOM elements is costly and can cause slow downs
    if (typeof(__measuretext_cache__) != 'object') {
        __measuretext_cache__ = [];
    }
    __measuretext_cache__[str] = size;
    
    return size;
};

/**
 * Apply translation, rotation, or scale to an object if necessary
 *
 * @return: none
 **/
function applyTRS(context, thisObj, left, top, theta, scale) {
    context.translate(thisObj.left, thisObj.top);
    context.rotate(thisObj.theta);
    context.scale(thisObj.scale, thisObj.scale);
};