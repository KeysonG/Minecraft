
var containerH = 600;
var containerW = 1000;
var cellWH = 50;
var groundArray = [];
var divArray = [];
var gameHeight = containerH/cellWH-1;


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
    	x = Math.floor(Math.random()*containerW/cellWH);
    	y = gameHeight-groundArray[x];
    	goodTree = checkTree(x,y);
    }
    divArray[y][x].css("background-image","url('assets/blocks/tree.png')").attr("colored",true);
    
    for(var k=y ; k>y-3; k--){
    	divArray[k][x].css("background-image","url('assets/blocks/tree.png')").attr("colored",true);
    }
    divArray[k][x].css("background-image","url('assets/blocks/leaf.png')").attr("colored",true);

}

function checkTree(x,y){
	if(y<=(gameHeight-groundArray[x-1]) && y<=(gameHeight-groundArray[x+1]) ){
		console.log("true");
		return true;
	}
	else{
		console.log("false");
		return false;
	}

}

function init(){
	createDivMatrix();
	buildGroundArray();
	placeTree();
}

// $(window).resize(function(){
// 	if($(window).width() < 600){
// 		containerW = 600;

// 	}
// });

init();
