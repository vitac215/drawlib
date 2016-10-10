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
 	// Your draw code here
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
}

/*
 * Summary: returns the calculated width of this object
 */
Drawable.prototype.getWidth = function(context) {
  console.log("ERROR: Calling unimplemented draw method on drawable object.");
  return 0;
}

/*
 * Summary: returns the calculated height of this object
 */
Drawable.prototype.getHeight = function(context) {
  console.log("ERROR: Calling unimplemented draw method on drawable object.");
  return 0;
}

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
}
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
}
Text.inheritsFrom(Drawable);

//Text methods here

function DoodleImage(attrs) {
    var dflt = {
        width: -1,
        height: -1,
        src: "",
    };
    attrs = mergeWithDefault(attrs, dflt);
    Drawable.call(this, attrs);
 
    //Rest of constructor code here
}
DoodleImage.inheritsFrom(Drawable);

//DoodleImage methods here

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
}
Line.inheritsFrom(Primitive);

//Line methods here

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
}
Rectangle.inheritsFrom(Primitive);

//Rectangle Methods here

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
}
Container.inheritsFrom(Drawable);

//Rest of container methods here

function Pile(attrs) {
  Container.call(this, attrs);   
  //Rest of constructor code here
}
Pile.inheritsFrom(Container);

//Rest of pile methods here

function Row(attrs) {
  Container.call(this, attrs);    
  //Rest of constructor code here
}
Row.inheritsFrom(Container);

//Rest of row methods here

function Column(attrs) {
  Container.call(this, attrs);  
  //Rest of constructor code here
}
Column.inheritsFrom(Container);

//Rest of column methods here

function Circle(attrs) {
  Container.call(this, attrs);      
  var dflt = {
    layoutCenterX: this.width / 2,
    layoutCenterY: this.height / 2,
    layoutRadius: Math.min(this.width, this.height) / 2 - 30
  };
  attrs = mergeWithDefault(attrs, dflt);
  //Rest of constructor code here
}
Circle.inheritsFrom(Container);

//Rest of circle methods here

function OvalClip(attrs) {
  Container.call(this, attrs);
  //Rest of constructor code here
}
OvalClip.inheritsFrom(Container);

//Rest of ovalClip methods here

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
}