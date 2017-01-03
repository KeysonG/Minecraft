
var containerH = 600;
var containerW = 1000;
var cellWH = 50;
var groundArray = [];
var divArray = [];

function createDivMatrix(){
    //createMatrixOfDivsHere
    for(var i = 0; i<containerH/cellWH; i++){
    	divArray[i] = Array(containerW/cellWH);
    	var row = $("<div/>");
    	row.appendTo($("#game"));
    		
    	for(var j = 0; j<containerW/cellWH; j++){
	    	var cell = divArray[i][j]=$("<div/>");
	    	cell.addClass("cell");
	    	cell.data("row", i);
	    	cell.data("column", j);
	    	cell.appendTo($(row));
    	}
    }
}


function buildGroundArray(){
    var maxHeight = 4;
      for(var i =0;i<containerW/cellWH;i++){
    	var height = Math.floor(Math.random() * maxHeight)+1;
    		groundArray.push(height);
        for(var j= ((containerH/cellWH)-1); j>(((containerH/cellWH)-1) -groundArray[i]); j--){
            divArray[j][i].css("background-image","url('assets/blocks/dirt.png')").attr("colored",true);
            if(j===(12-groundArray[i])){
            	divArray[j][i].css("background-image","url('assets/blocks/grass.png')").attr("colored",true);
            }
        }
    }

}

function placeTree(){
    var treePosition = Math.floor(Math.random()*containerW);
    return groundArray[treePosition]+1;
}

function buildTree(){
    var treeStartX = placeTree();
    var treeStartY = placeTree
}

function init(){
	createDivMatrix();
	buildGroundArray();
}

init();
