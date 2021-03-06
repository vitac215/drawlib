/* Doodle Drawing Library
 */

/*
 * Root container for all drawable elements.
 */
function Doodle (context) {
    this.context = context;
    this.children = [];
}

// Variables to record the number of images and the number of images loaded
var images = 0;
var imagesLoaded = 0;

Doodle.prototype.draw = function() {
    var doodle = this;
    // Check if all images are loaded
    if (images == imagesLoaded) {
        // Draw all children
        for (var i = 0; i < this.children.length; i++) {
            // only draw if the children are visible
            if (this.children[i].visible == true) {
                this.context.save();
                this.children[i].draw(this.context);
                this.context.restore();
            }
        }
    }
    else {
        setTimeout(function(){
            // Try drawing again
            doodle.draw(doodle.context);    
        }, 200);
    }

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



/*
 * Text class (Primitive)
 */
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
    // Apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    context.beginPath();
    // If the text is bold
    if (this.bold) {
        context.font = "bold "+this.size+"pt "+this.font;
    }
    else {
        context.font = this.size+"pt "+this.font;
    }
    context.fillStyle = this.fill; 

    // Draw the text
    context.fillText(this.content, 0, this.getHeight());

    context.closePath(); 
};

Text.prototype.getWidth = function(context) {
    var size = MeasureText(this, this.bold, this.font, this.size);
    return size[0];
};

Text.prototype.getHeight = function(context) {
    var size = MeasureText(this, this.bold, this.font, this.size);
    return size[1]; 
};



/*
 * DoodleImage class (Primitive)
 */
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
    this.img = new Image();
    this.img.src = this.src;

    // Load all images before the whole drawing
    images++;
    // Add 1 to imagesLoaded when a image is loaded
    this.img.onload = function() {
        imagesLoaded++;
    }

};
DoodleImage.inheritsFrom(Drawable);

//DoodleImage methods here
DoodleImage.prototype.draw = function(context) {
    context.save();  

    // Apply translation ,rotation, or scale if necessary 
    applyTRS(context, this, this.left, this.top, this.theta, this.scale); 

    context.beginPath();
    // If the width and height of the image are not specified (i.e. default to -1)
    if (this.width == -1 && this.height == -1) {
        context.drawImage(this.img, 0, 0);
    }
    else {
        context.drawImage(this.img, 0, 0, this.width, this.height);   
    }

    context.closePath();   
    context.restore();
};

DoodleImage.prototype.getWidth = function(context) {
    return this.width;
};

DoodleImage.prototype.getHeight = function(context) {
    return this.height;
};



/*
 * Line class (Primitive)
 */
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
    // Apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    context.beginPath();  
    // Set the line width and line color
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    // set the start and end points, and draw the line
    context.moveTo(this.startX, this.startY);
    context.lineTo(this.endX, this.endY);
    context.stroke();
    context.closePath(); 
};

Line.prototype.getWidth = function(context) {
    return this.endX - this.startX;
};

Line.prototype.getHeight = function(context) {
    return this.endY - this.startY;
};



/*
 * Rectangle class (Primitive)
 */
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

    // Create the rectangle
    context.beginPath();   // question: weird thing happens if this is commented out
    context.rect(this.x, this.y, this.width, this.height);
    // Set line width and strokeStyle
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    // Draw the rectangle
    context.stroke();

    context.closePath(); 
};

Rectangle.prototype.getWidth = function(context) {
    return this.width;
};

Rectangle.prototype.getHeight = function(context) {
    return this.height;
};



/*
 * Container base class
 */
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
    this.children = [];
    this.width = attrs.width;
    this.height = attrs.height;
    this.fill = attrs.fill;
    this.borderColor = attrs.borderColor;
    this.borderWidth = attrs.borderWidth;
};
Container.inheritsFrom(Drawable);

//Rest of container methods here
Container.prototype.draw = function(context) {
    context.save();

    // Apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    // Create the container path
    context.beginPath();
    context.rect(0, 0, this.width, this.height);
    context.closePath();

    // Set line width and strokeStyle
    // Cautious: when strokeStyle has a value or stroke() is called, lineWidth is default to 1
    // so, only draw the path if the container's borderWidth has a value
    if (this.borderWidth > 0) {
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderColor;       
        // draw the container path
        context.stroke();
    };

    // Fill the container
    if (this.fill != false) {   // false = "black"
        context.fillStyle = this.fill;
        context.fill();
    };

    // Make a clip and draw the children in the container
    context.clip();

    this.layout(context);

    // Draw the children
    for (var i = 0; i < this.children.length; i++) {
        // only draw if the children are visible
        if (this.children[i].visible == true) {
            context.save();
            this.children[i].draw(context);
            context.restore();
        };
    };

    context.restore();
};

Container.prototype.layout = function(context) {
    // No change to the children's layout
};

Container.prototype.getWidth = function(context) {
    return this.width;
};

Container.prototype.getHeight = function(context) {
    return this.height;
};



/*
 * Pile class (Container)
 */
function Pile(attrs) {
  Container.call(this, attrs);   
  //Rest of constructor code here
};
Pile.inheritsFrom(Container);

//Rest of pile methods here
Pile.prototype.draw = function(context) {
    context.save();

    // Apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    // Create the container path
    context.beginPath();
    context.rect(0, 0, this.width, this.height);
    context.closePath();

    // Set line width and strokeStyle
    // Cautious: when strokeStyle has a value or stroke() is called, lineWidth is default to 1
    // so, only draw the path if the container's borderWidth has a value
    if (this.borderWidth > 0) {
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderColor;       
        // draw the container path
        context.stroke();
    };

    // Fill the container
    if (this.fill != false) {   // false = "black"
        context.fillStyle = this.fill;
        context.fill();
    };

    // Make a clip and draw the children in the container
    context.clip();

    this.layout(context);

    // Draw the children
    for (var i = 0; i < this.children.length; i++) {
        // Only draw if the children are visible
        if (this.children[i].visible == true) {
            context.save();
            this.children[i].draw(context);
            context.restore();
        };
    };

    context.restore();
};

Pile.prototype.layout = function(context) {
    // Place all the children at its own top-left corner
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].visible == true) {
            this.children[i].top = 0;
            this.children[i].left = 0;
        };
    };
};

Pile.prototype.getWidth = function(context) {
    return this.width;
};

Pile.prototype.getHeight = function(context) {
    return this.height;
};




/*
 * Row class (Container)
 */
function Row(attrs) {
  Container.call(this, attrs);    
  //Rest of constructor code here
};
Row.inheritsFrom(Container);

//Rest of row methods here
Row.prototype.draw = function(context) {
    context.save();

    // Apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    // Create the container path
    context.beginPath();
    context.rect(0, 0, this.width, this.height);
    context.closePath();

    // Set line width and strokeStyle
    // Cautious: when strokeStyle has a value or stroke() is called, lineWidth is default to 1
    // so, only draw the path if the container's borderWidth has a value
    if (this.borderWidth > 0) {
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderColor;       
        // draw the container path
        context.stroke();
    };

    // Fill the container
    if (this.fill != false) {   // false = "black"
        context.fillStyle = this.fill;
        context.fill();
    };

    // Make a clip and draw the children in the container
    context.clip();

    this.layout(context);

    // Draw the children
    for (var i = 0; i < this.children.length; i++) {
        // Only draw if the children are visible
        if (this.children[i].visible == true) {
            context.save();
            this.children[i].draw(context);
            context.restore();
        };
    };

    context.restore();   
};

Row.prototype.layout = function(context) {
    // Place all the children in a single horizontal row with the children vertically centered
    var center = this.getHeight()/2;
    var left = 0;
    if (this.children[0]){
        left = this.children[0].borderWidth;
    }

    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].visible == true) {
            // Make the child vertically centered
            this.children[i].top = center - this.children[i].getHeight()/2;
            // Place the child in a single horizontal row
            this.children[i].left = left;
            left += this.children[i].getWidth() + this.children[i].borderWidth;
        };
    };
};

Row.prototype.getWidth = function(context) {
    return this.width;
};

Row.prototype.getHeight = function(context) {
    return this.height;
};



/*
 * Column class (Container)
 */
function Column(attrs) {
  Container.call(this, attrs);  
  //Rest of constructor code here
};
Column.inheritsFrom(Container);

//Rest of column methods here
Column.prototype.draw = function(context) {
    context.save();

    // Apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    // Create the container path
    context.beginPath();
    context.rect(0, 0, this.width, this.height);
    context.closePath();

    // Set line width and strokeStyle
    // Cautious: when strokeStyle has a value or stroke() is called, lineWidth is default to 1
    // so, only draw the path if the container's borderWidth has a value
    if (this.borderWidth > 0) {
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderColor;       
        // Draw the container path
        context.stroke();
    };

    // Fill the container
    if (this.fill != false) {   // false = "black"
        context.fillStyle = this.fill;
        context.fill();
    };

    // Make a clip and draw the children in the container
    context.clip();

    this.layout(context);

    // Draw the children
    for (var i = 0; i < this.children.length; i++) {
        // only draw if the children are visible
        if (this.children[i].visible == true) {
            context.save();
            this.children[i].draw(context);
            context.restore();
        };
    };

    context.restore();   
};

Column.prototype.layout = function(context) {
    // Place all the children in a single vertical column with the children horizontally centered
    var center = this.getWidth()/2;
    var top = 0;
    if (this.children[0]){
        top = this.children[0].borderWidth;
    }

    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].visible == true) {
            // Make the child vertically centered
            this.children[i].left = center - this.children[i].getWidth()/2;
            // Place the child in a single horizontal row
            this.children[i].top = top;
            top += this.children[i].getHeight() + this.children[i].borderWidth;
        };
    }; 
};

Column.prototype.getWidth = function(context) {
    return this.width;
};

Column.prototype.getHeight = function(context) {
    return this.height;
};



/*
 * Circle class (Container)
 */
function Circle(attrs) {
  Container.call(this, attrs);      
  var dflt = {
    layoutCenterX: this.width / 2,
    layoutCenterY: this.height / 2,
    layoutRadius: Math.min(this.width, this.height) / 2 - 30
  };
  attrs = mergeWithDefault(attrs, dflt);
  //Rest of constructor code here
  this.layoutCenterX = attrs.layoutCenterX;
  this.layoutCenterY = attrs.layoutCenterY;
  this.layoutRadius = attrs.layoutRadius;
};
Circle.inheritsFrom(Container);

//Rest of circle methods here
Circle.prototype.draw = function(context) {
    context.save();

    // Apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    // Create the container path
    context.beginPath();
    context.arc(this.layoutCenterX, this.layoutCenterY, this.layoutRadius, 0, 2*Math.PI);
    context.closePath();

    // Set line width and strokeStyle
    // Cautious: when strokeStyle has a value or stroke() is called, lineWidth is default to 1
    // so, only draw the path if the container's borderWidth has a value
    if (this.borderWidth > 0) {
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderColor;       
        // draw the container path
        context.stroke();
    };

    // Fill the container
    if (this.fill != false) {   // false = "black"
        context.fillStyle = this.fill;
        context.fill();
    };

    this.layout(context);

    // Draw the children
    for (var i = 0; i < this.children.length; i++) {
        // Only draw if the children are visible
        if (this.children[i].visible == true) {
            context.save();
            this.children[i].draw(context);
            context.restore();
        };
    };

    context.restore(); 
};

Circle.prototype.layout = function(context) {
    var angle = 2*Math.PI / this.children.length;

    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].visible == true) {
            // Place the chilren so that their centers lie positioned at equal angles around a circule perimeter 
            this.children[i].top = this.layoutCenterY - this.layoutRadius * Math.sin(angle*i) - this.children[i].height/2;
            this.children[i].left = this.layoutCenterX - this.layoutRadius * Math.cos(angle*i) - this.children[i].width/2; 
        };
    }; 
};

Circle.prototype.getWidth = function(context) {
    return this.width;
};

Circle.prototype.getHeight = function(context) {
    return this.height;
}



/*
 * Oval clip class (Container)
 */
function OvalClip(attrs) {
  Container.call(this, attrs);
  //Rest of constructor code here
};
OvalClip.inheritsFrom(Container);

//Rest of ovalClip methods here
OvalClip.prototype.draw = function(context) {
    context.save();

    // Apply translation ,rotation, or scale if necessary
    applyTRS(context, this, this.left, this.top, this.theta, this.scale);

    // Create the container path
    context.beginPath();
    context.ellipse(this.width/2, this.height/2, this.width/2, this.height/2, 0, 2*Math.PI, 0);
    context.closePath();

    // Set line width and strokeStyle
    // Cautious: when strokeStyle has a value or stroke() is called, lineWidth is default to 1
    // so, only draw the path if the container's borderWidth has a value
    if (this.borderWidth > 0) {
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderColor;       
        // Draw the container path
        context.stroke();
    };

    // Fill the container
    if (this.fill != false) {   // false = "black"
        context.fillStyle = this.fill;
        context.fill();
    };

    // Make a clip and draw the children in the container
    context.clip();

    this.layout(context);

    // Draw the children
    for (var i = 0; i < this.children.length; i++) {
        // Only draw if the children are visible
        if (this.children[i].visible == true) {
            context.save();
            this.children[i].draw(context);
            context.restore();
        };
    };

    context.restore();   
};

OvalClip.prototype.layout = function(context) {
    // No change to the children's layout
};

OvalClip.prototype.getWidth = function(context) {
    return this.width;
};

OvalClip.prototype.getHeight = function(context) {
    return this.height;
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
 * Apply translation, rotation, or scale to an doodle object if necessary
 *
 * @return: none
 **/
function applyTRS(context, thisObj, left, top, theta, scale) {
    context.translate(thisObj.left, thisObj.top);
    context.rotate(thisObj.theta);
    context.scale(thisObj.scale, thisObj.scale);
};