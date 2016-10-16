window.onload = function () {

	// Set up the canvas
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var root = new Doodle(context);

    // Container for background
    var background = new Container({
    	width: 1024,
    	height: 768,
    	borderWidth: 0,
    	//fill: "#ffffff",
    	fill: "#448ccb"
    });

    // Column for snow man
    var column = new Column({
    	width: 500,
    	height: 600,
    	left: 260,
    	top: 150,
    	borderWidth: 0,
    	borderColor: ""
    });

    // Container for snow man's hands
    var container1 = new Container({
    	width: 500,
    	height: 600,
    	left: 260,
    	top: 150,
    	borderWidth: 0,
    	borderColor: ""
    });

    // Snow man
    (function(){
    	var snowman_head = new OvalClip({
    		width: 200,
    		height: 180,
    		borderWidth: 0,
    		fill: "white",
    	});
    	var snowman_body = new OvalClip({
    		width: 300,
    		height: 260,
    		borderWidth: 0,
    		fill: "white"
    	});
    	var snowman_eye1 = new Circle({
    		width: 10,
    		height: 10,
    		left: 60,
    		top: 70,
    		borderWidth: 1,
    		layoutCenterX: 0,
    		layoutCenterY: 0,
    		layoutRadius: 5,
    		fill: "black"
    	});
    	var snowman_eye2 = new Circle({
    		width: 10,
    		height: 10,
    		left: 140,
    		top: 70,
    		borderWidth: 1,
    		layoutCenterX: 0,
    		layoutCenterY: 0,
    		layoutRadius: 5,
    		fill: "black"
    	});
    	var snowman_mouth1 = new Line({
    		startX: 92,
    		startY: 110,
    		endX: 102,
    		endY: 120,
    		color: "black",
    		lineWidth: 2
    	});
    	var snowman_mouth2 = new Line({
    		startX: 102,
    		startY: 120,
    		endX: 112,
    		endY: 110,
    		color: "black",
    		lineWidth: 2
    	});
    	var snowman_hand1 = new Line({
    		startX: 50,
    		startY: 170,
    		endX: 150,
    		endY: 240,
    		color: "#4a3621",
    		lineWidth: 3
    	});
    	var snowman_hand2 = new Line({
    		startX: 450,  // container width - snowman_hand1.startX
    		startY: 170,
    		endX: 350,
    		endY: 240,
    		color: "#4a3621",
    		lineWidth: 3
    	});

    	snowman_head.children.push(snowman_eye1, snowman_eye2, snowman_mouth1, snowman_mouth2);
    	column.children.push(snowman_head, snowman_body);
    	container1.children.push(snowman_hand1, snowman_hand2);
    	background.children.push(column, container1);
    	root.children.push(background);
    })();

    // Title
    var text = new Text({
        top: 20,
        left: 50,
        font: "Chalkduster",
        size: "40",
        fill: "#ffffff",
        content: "Snowman"
    });

    root.children.push(text);

    // Add effect to the snowflakes
    function switch_snowflake(){
	    //context.clearRect(0, 0, canvas.width, canvas.height);
	    var snowflake_container = new Circle({
			width: 100,
			height: 100,
			left: 510,
			top: 380,
			borderWidth: 0,
			layoutCenterX: 0,
			layoutCenterY: 0,
			layoutRadius: 330   	
	    });

	 //    // On and off
	    // var onoff = Math.floor(Math.random()*10);
		// if (onoff%2) {
		//     for (var i = 0; i < 10; i++) {
		//     	var snowflake = new DoodleImage({
		//     		src: "images/snowflake_white.png",
		//     		width: 80,
		//     		height: 80
		//     	})
		//     	snowflake_container.children.push(snowflake);
		//     }  
		// }
		// else {
		//     for (var i = 0; i < 10; i++) {
		//     	var snowflake = new DoodleImage({
		//     		src: "images/snowflake.png",
		//     		width: 80,
		//     		height: 80
		//     	})
		//     	snowflake_container.children.push(snowflake);
		//     }   
		// }

		// Twinkle
	    for (var i = 0; i < 10; i++) {
	    	var twinkle = Math.floor(Math.random()*10);
	    	if (twinkle>3) {
		    	var snowflake = new DoodleImage({
		    		src: "images/snowflake_white.png",
		    		width: 80,
		    		height: 80
		    	})
	    	}
	    	else {
		    	var snowflake = new DoodleImage({
		    		src: "images/snowflake.png",
		    		width: 80,
		    		height: 80
		    	})
		    }
	    	snowflake_container.children.push(snowflake);
	    }  
	    
	    // Draw
	    root.children.push(snowflake_container);
	    root.draw();
    }

    switch_snowflake();
    setInterval(switch_snowflake, 200);

 };