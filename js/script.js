
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
	$("body").css("text-align", "left");
	$("#game").css("border", "1px solid black");
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
	    	var cell = divArray[i][j]=$("<div/>");
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
            divArray[j][i].css("background-image","url('assets/blocks/dirt.png')").attr("colored",true);
            
            if(j===(containerH/cellWH-groundArray[i])){
            	divArray[j][i].css("background-image","url('assets/blocks/grass.png')").attr("colored",true);
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
	divArray[i][rockPositionX].css("background-image", "url('assets/blocks/rock.png')").attr("colored",true);
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
    			divArray[i][j].css("background", "lightblue");
    		}
    	}
	}
}

function checkTree(treePositionX,treePositionY){
	if(treePositionY<=(gameHeight-groundArray[treePositionX-1]) && treePositionY<=(gameHeight-groundArray[treePositionX+1]) ){
		
		return true;
	}
	else{
		return false;
	}

}
function buildTrunk(){
	//first block
	divArray[treePositionY][treePositionX].css("background-image","url('assets/blocks/tree.png')").attr("colored",true);
    
    //rest of tree
    for(var k=treePositionY ; k>treePositionY-trunkHeight; k--){
    	divArray[k][treePositionX].css("background-image","url('assets/blocks/tree.png')").attr("colored",true);
    }
    //leaf
     
}
function buildBush(){
	for(var i = treePositionY-trunkHeight; i>treePositionY-trunkHeight-bushHeight;i--){
		for(var t = treePositionX; t<treePositionX+bushWidth; t++){
			divArray[i][t-1].css("background-image","url('assets/blocks/leaf.gif')").attr("colored",true);
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
			divArray[i][t].css("background","white").attr("colored",true);
		}
	}
}
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

