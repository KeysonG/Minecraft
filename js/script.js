
var containerH = 100;
var containerW = 80;
var groundArray = [];
var divArray = [];
function createDivMatrix(){
    //createMatrixOfDivsHere
}


function buildGroundArray(){

    var maxHeight = 10;
    var height = Math.floor(Math.random() * maxHeight)
    groundArray.push(height);

    for(var i =0;i<groundArray.length;i++){
        for(var j=0;j<groundArray[i];j++){
            $("#"+i+"-"+j).css("background","url('ground.jpg')").attr("colored",true);
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

