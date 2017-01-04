
var containerH = 600;
var containerW = 1000;
var cellWH = 50;
var groundArray = [];
var divArray = [];
var gameHeight = containerH/cellWH-1;
var gameWidth = containerW/cellWH-1;
var treePositionX;
var treePositionY;
var trunkHeight = 2;
var bushHeight = 3;
var bushWidth = 3;
var rockPositionX;
var rockPositionY;
var rockAmount = 2;
var cloudPositionX;
var cloudPositionY;
var cloudWidth =3;
var cloudHeight =2;

function reset(){
	$(".landingpage").hide();
    $("#toolbar").css("display","inline-block");
    $("#container").css("text-align", "left");
	$("body").css("text-align", "left");
	$("#game").css("border", "1px solid black");
	$("#newGame").show();	
	groundArray = [];

}

function createDivMatrix(){
    //createMatrixOfDivsHere
    $("#game").css("width", containerW+"px");
     $("#game").css("height", containerH+"px");

    for(var i = 0; i<containerH/cellWH; i++){
    	divArray[i] = Array(containerW/cellWH);
    	var row = $("<div/>");
    	row.appendTo($("#game"));
    		
    	for(var j = 0; j<containerW/cellWH; j++){
	    	var cell = divArray[i][j]=$("<div/>").on("click",mineOrPlant);
	    	cell.addClass("cell");
	    	cell.css("width", cellWH+"px");
	    	cell.css("height", cellWH+"px");
	    	cell.data("row", i);
	    	cell.data("column", j);
	    	cell.appendTo($(row));

    	}
    }
}


function buildGroundArray(){
    var maxHeight = 3;
      for(var i =0;i<containerW/cellWH;i++){
    	var height = Math.floor(Math.random() * maxHeight)+1;
    		groundArray.push(height);
        for(var j= ((containerH/cellWH)-1); j>(((containerH/cellWH)-1) -groundArray[i]); j--){
            divArray[j][i].addClass("dirt").attr("colored",true);
            
            if(j===(containerH/cellWH-groundArray[i])){
            	divArray[j][i].removeClass("dirt").addClass("dirtGrass").attr("colored",true);
            }
        }
    }

}

function placeTree(){
	var goodTree = false;

    while(!goodTree){
    	treePositionX = Math.floor(Math.random()*containerW/cellWH);
    	treePositionY = gameHeight-groundArray[treePositionX];
    	goodTree = checkTree(treePositionX,treePositionY);
    }
    buildTrunk();
    buildBush();
    
}

function placeRock(){
	var goodRock = false;
	while(!goodRock){
	rockPositionX = Math.floor(Math.random()*containerW/cellWH);
	rockPositionY = gameHeight-groundArray[rockPositionX];
	goodRock = checkRock(rockPositionX, rockPositionY);
	}
	for(var i = rockPositionY; i>rockPositionY-rockAmount; i--){
	divArray[i][rockPositionX].addClass("stone").attr("colored",true);
	}
}

function placeCloud(){
	var goodCloud = false;
	while(!goodCloud){
		cloudPositionX =  Math.floor(Math.random()*containerW/cellWH);
		cloudPositionY = Math.floor(Math.random()*10) +2;
		goodCloud = checkCloud(cloudPositionX,cloudPositionY);

	}

	buildCloud(cloudPositionX, cloudPositionY);
}

function generateSky(){
     for(var i = 0; i<containerH/cellWH; i++){
    	for(var j = 0; j<containerW/cellWH; j++){
    		if((divArray[i][j].attr("colored") !=="true")){
    			divArray[i][j].addClass("sky");
    		}
    	}
	}
}

function checkTree(treePositionX,treePositionY){
	if(treePositionY<=(gameHeight-groundArray[treePositionX-1]) && treePositionY<=(gameHeight-groundArray[treePositionX+1]) ){

		return true;
	}
	else{
		console.log("false");
		return false;
	}

}
function buildTrunk(){
	//first block
	divArray[treePositionY][treePositionX].addClass("tree").attr("colored",true);
    
    //rest of tree
    for(var k=treePositionY ; k>treePositionY-trunkHeight; k--){
    	divArray[k][treePositionX].addClass("tree").attr("colored",true);
    }
    //leaf
     
}
function buildBush(){
	for(var i = treePositionY-trunkHeight; i>treePositionY-trunkHeight-bushHeight;i--){
		for(var t = treePositionX; t<treePositionX+bushWidth; t++){
			divArray[i][t-1].addClass("treeBush").attr("colored",true);
		}
	}
}

function checkRock(){
	if(rockPositionX === treePositionX){
		return false;
	}
	else{
		return true;
	}
}
function checkCloud(cloudPositionX,cloudPositionY){
	if(cloudPositionY >= (treePositionY-trunkHeight-bushHeight) || cloudPositionX+cloudWidth<=1 || cloudPositionX+cloudWidth+1>=gameWidth){
		return false;
	}
	else{
		return true;
	}
}
function buildCloud(cloudPositionX,cloudPositionY){
	for(var i = cloudPositionY; i>cloudPositionY-cloudHeight; i--){
			for(var t = cloudPositionX; t<cloudPositionX+cloudWidth; t++){
			divArray[i][t].addClass("cloud").attr("colored",true);
		}
	}
}


function mineOrPlant(){
	console.log($(this));
	if(tb.selectedTool){
		if(tb.selectedTool.constructor === Tool){
		if(tb.selectedTool.farms.constructor == Array) {

			for(var i=0;i<tb.selectedTool.farms.length;i++){
				if($(this).hasClass(tb.selectedTool.farms[i])){
					$(this).removeClass(tb.selectedTool.farms[i]);
					$(this).addClass("sky");
					if(tb.invClasses.indexOf(tb.selectedTool.farms[i])==-1) {
						tb.addInventoryItem(tb.selectedTool.farms[i]);
					}
				}
			}
		}
		else{
			console.log("im in");
			if($(this).hasClass(tb.selectedTool.farms)) {
				$(this).removeClass(tb.selectedTool.farms)
				$(this).addClass("sky");
				if(tb.invClasses.indexOf(tb.selectedTool.farms)==-1) {
					tb.addInventoryItem(tb.selectedTool.farms);
				}
			}
		}
	}
	else{
		if($(this).hasClass("sky")){
			$(this).addClass(tb.selectedTool.attr("class")).removeClass("sky invItem itemSelected");
		}
	}
	}

}



var Tool = function(name,img,icon,farms) {
    var that = this;
    this.name = name;
    this.icon = icon;
	this.farms = farms;
    this.selectTool = function(){
		tb.removeSelected();
        tb.selectedTool = that;
        that.div.addClass("toolSel");
        $(document.body).css({'cursor' : "url('"+that.icon+ "'),pointer"});

    };
    this.img = $("<img>").attr("src", img).addClass("toolImg");
    this.div = $("<div>").addClass("tool").click(this.selectTool);
    (this.img).appendTo(this.div);
    (this.div).appendTo($("#toolbar"));

};

var InventoryItem = function(image){
	this.counter = 0;
	this.image = image;
}


var toolbar = function(){
    this.tools = [];
	this.selectedTool;
	this.invDiv;
	this.invItems = [];
	this.invClasses = [];
	var that = this;
    this.addTools = function(items){
        for(var i=0;i<items.length;i++){
            var tool = new Tool(items[i][0],items[i][1],items[i][2],items[i][3]);
            this.tools.push(tool);
        }
		this.invDiv = $("<div>").addClass("invDiv").appendTo("#toolbar");
    };

    this.addInventoryItem = function(type){
		console.log("added" + type);
		this.invItems.push($("<div>").addClass(type).addClass("invItem").on("click",this.selectItem).appendTo(this.invDiv));
		this.invClasses.push(type);
	};
	this.removeSelected = function(){
		for(var i=0;i<this.tools.length;i++){
			if(this.tools[i].div.hasClass("toolSel")){
				this.tools[i].div.removeClass("toolSel");
			}
		}
		for(var i=0;i<this.invItems.length;i++){
			if(this.invItems[i].hasClass("itemSelected")){
				this.invItems[i].removeClass("itemSelected");
			}
		}

	};
	this.selectItem = function(){
		that.removeSelected();
		$(this).addClass("itemSelected");
		tb.selectedTool= $(this);
		$("body").css("cursor",tb.selectedTool.css("background-image")+",pointer");
	};

};




var tb = new toolbar();
tb.addTools([["axe", "assets/tools/axe.png","assets/tools/axeCurs.png",["tree","treeBush"]],["picaxe", "assets/tools/pickaxe.png","assets/tools/pickaxeCurs.png","stone"],["shovel","assets/tools/shovel.png","assets/tools/shovelCurs.png",["dirt","dirtGrass"]]]);

function init(){
	reset();
	createDivMatrix();
	buildGroundArray();
	placeTree();
	placeRock();
	placeCloud();
	placeCloud();
	generateSky();
}
function newGame(){
	$("#game").html("");
	init();
}
// $(window).resize(function(){
// 	if($(window).width() < 600){
// 		containerW = 600;

// 	}
// });

