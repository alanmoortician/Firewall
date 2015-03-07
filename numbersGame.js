//Initializes stuff
function initializeEverything(){

	//Creates the canvas and the context
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	
	//sets some context variables
	context.font = "20px Arial";
	context.lineWidth = 5;
	
	posButton = document.getElementById('positive'); 
	//outputMontior = document.getElementById('outputMonitor');
	//outputMontior2 = document.getElementById('outputMonitor2');
	box = document.getElementById('mainBox');
	
	numberOfMoves =document.getElementById('numberOfMoves');
	moveCounter = 0;
	
	//add the event listeners
	canvas.addEventListener("mousemove" , onMouseMove, false);
	canvas.addEventListener("mouseout", onMouseOut, false);
	canvas.addEventListener("mousedown",onMouseDown,false);
	canvas.addEventListener("mouseup", onMouseUp, false);
	
	boxArray = new Array();
	changeTimer = 0; //this will hold the setTimeout object for the whilemousedown function
	boxiteratorcount = 0;//dev
	
	//these values have to do with generating random values and functions

	rangeHigh = 1;//max number in any box
	rangeLow = -1;//min number in any box
	
	workingNumber = 0;//the number to be pushed into boxes
	
	masterBoxNumber = 3; // controls the amount of squares.
	tileSize = context.canvas.width / masterBoxNumber;
	rowTileCount = masterBoxNumber;
	colTileCount = masterBoxNumber;
	
	//creates a fabulous gradient
	gradient=context.createLinearGradient(0,0,context.canvas.width,context.canvas.height);
	gradient.addColorStop("0","magenta");
	gradient.addColorStop("0.1","blue");
	gradient.addColorStop("0.2","red");
	gradient.addColorStop("0.3","magenta");
	gradient.addColorStop("0.4","blue");
	gradient.addColorStop("0.5","red");
	gradient.addColorStop("0.6","magenta");
	gradient.addColorStop("0.7","blue");
	gradient.addColorStop("0.8","red");
	gradient.addColorStop("0.9","magenta");
	gradient.addColorStop("1.0","red");
	
	startGame();
}

//Draws the Grid
function drawGrid(){
	for(var r=0; r<rowTileCount ; r++){
		for(var c=0; c<colTileCount; c++){
		context.strokeStyle = "black"; //reminds context that the lines for rectangles should be black
		context.strokeRect(c*tileSize,r*tileSize,tileSize,tileSize); 
		}
	}
}


/* ///In theory, this will return random equations to do work on the innerValue of boxes////
 * randomize it using Date() objects?
 */
function equationGenerator(){
	var startingValue = getNewValue();
	
	
	//When adding functions, remember to add the , after the }
	return{
		doWork: function(y){
			if(startingValue + y > 5){
				startingValue = y - 5;
			}else if(startingValue + y <-5){
				startingValue = y + 5;
			}
			else{
				startingValue += y;
			}
		},
		getValue: function(){
			return startingValue;
		}
	};
}

//creates a new starting value for the boxes
function getNewValue(){  
 return Math.floor( Math.random() * ( 1 + rangeHigh - rangeLow ) ) + rangeLow;
}

//Box information Object
function boxInformation(xPos, yPos, isHighlighted){
	this.xPos = xPos; //the x coordinate of the top left point
	this.yPos = yPos; //the y coordinate of the top left point
	this.xGrid = Math.floor(xPos / tileSize);
	this.yGrid = Math.floor(yPos / tileSize);
	this.isHighlighted = false; //true only when mouse hovers over square
	this.equation = equationGenerator(); //the good shit. holds the number and the mousedown function
	this.isOnAxis = false; //if true, square is on the same axis as active square
}

//Initializes the information of each box, inflating the box array 
function initBoxes(){
	for(var r=0; r<rowTileCount ; r++){
		boxArray[r] = new Array();
		for(var c=0; c<colTileCount; c++){
			//Inflates the boxArray
			boxArray[r][c] = new boxInformation(c*tileSize, r*tileSize, false);		
		}
	}
}

//retrieves the box information and draws it
function drawInsideRectangles(){
	for(var r=0; r<rowTileCount ; r++){
		for(var c=0; c<colTileCount; c++){
			
			//draws the information in the center of the box
			if(boxArray[r][c].isOnAxis == true){
			context.fillStyle = 'red'; //if the box is on an axis, paint it red
			context.fillText(boxArray[r][c].equation.getValue(),  
			boxArray[r][c].xPos + (tileSize /2), 
			boxArray[r][c].yPos + (tileSize /2));
			context.fillStyle = 'black'; //switch the box back to black for the next box
			}else{
			context.fillText(boxArray[r][c].equation.getValue(),  
			boxArray[r][c].xPos + (tileSize /2), 
			boxArray[r][c].yPos + (tileSize /2));}
				
			//draws a fabulous gradient rectangle around the highlighted box
			if(boxArray[r][c].isHighlighted){
				context.strokeStyle=gradient;
				context.strokeRect(boxArray[r][c].xPos + 5, boxArray[r][c].yPos + 5, tileSize - 10, tileSize - 10);	
			}
		}
	}
}

function startGame(){
	initBoxes();
	gameLoop();
}

function drawScreen(){
	clear(); 											//Clears the previous board state
	drawInsideRectangles(); 							//Draws info of each box based on info
	drawGrid(); 									//Draws the Grid
	var col = Math.floor(mouseX / tileSize);//for mouse monitor
	var row = Math.floor(mouseY / tileSize);//for mouse monitor
	//outputMonitor.innerHTML = boxArray[row][col].xGrid + " " + boxArray[row][col].yGrid; 	//Optional Dev Tool
	
}

function clear(){
	context.clearRect(0,0, context.canvas.width, context.canvas.height);
}

function gameLoop(){
	window.setTimeout(gameLoop, 50); //old timer
	drawScreen();
}



//finds all the other boxes sharing an axis coordinate
function iterateAxisMates(){
	for(var r=0; r<rowTileCount ; r++){
		for(var c=0; c<colTileCount; c++){ 
			//code
		}
	}

}

//Sets all boxes isHighlighted value to false
function allBoxesFalse(){
	for(var r=0; r<rowTileCount ; r++){
		for(var c=0; c<colTileCount; c++){ 
			boxArray[r][c].isHighlighted = false;
		}
	}
}

//Marks the box under the cursor as isHighlighted = true
function highlightBox(row, col){
	allBoxesFalse();
	boxArray[row][col].isHighlighted = true;
	

	for(var r=0; r<rowTileCount ; r++){
		for(var c=0; c<colTileCount; c++){ 
			boxArray[r][c].isOnAxis = false;
			if(boxArray[r][c].xGrid == col || boxArray[r][c].yGrid == row){
				boxArray[r][c].isOnAxis = true;
			}
		}
	}
}

/*----------------------------*/
/*-Event Listeners Start Here*-/
/*----------------------------*/

function onMouseMove(e){
	mouseX = e.clientX-canvas.offsetLeft;
	mouseY = e.clientY-canvas.offsetTop;
	var col = Math.floor(mouseX / tileSize);
	var row = Math.floor(mouseY / tileSize);
	highlightBox(row, col);
}

function onMouseDown(e){
	var col = Math.floor(mouseX / tileSize);
	var row = Math.floor(mouseY / tileSize);
	
	workingNumber = boxArray[row][col].equation.getValue();
	
	//finds other boxes on the same axis
	for(var r=0; r<rowTileCount ; r++){
		for(var c=0; c<colTileCount; c++){ 
			if(boxArray[r][c].xGrid == col || boxArray[r][c].yGrid == row){
				if(boxArray[r][c].xGrid + boxArray[r][c].yGrid != col + row){
					if(posButton.checked == true){
						boxArray[r][c].equation.doWork(workingNumber);
					} else {
						boxArray[r][c].equation.doWork(-workingNumber);
					}
				}
			}
		}
	}
	boxArray[row][col].equation.doWork(-workingNumber);
	//outputMonitor2.innerHTML = workingNumber;
	moveCounter++;		
	numberOfMoves.innerHTML = "Number of Moves: " + moveCounter;			
	
	
}

function onMouseUp(e){						
	for(var r=0; r<rowTileCount ; r++){
		for(var c=0; c<colTileCount; c++){ 
			boxArray[r][c].isOnAxis = false;
		}
	}
	
}

//boxArray[row][col].equation.doWork(workingNumber);//calls the equation function of the box


function onMouseOut(e){
	onMouseUp();
	allBoxesFalse();
}

window.onload = initializeEverything;

/*if(boxArray[r][c].xGrid + boxArray[r][c].yGrid != col + row)
 * outputMonitor.innerHTML = "Monitor Something Here";
 * this.equation = function(){this.innerValue -= workingNumber;};
 * 
 * 	this.equation = function(){this.innerValue = innerValue--;};
 */