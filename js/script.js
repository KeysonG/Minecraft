
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
var bushWidth = 3; //have to have number divisible by 3
var rockPositionX;
var rockPositionY;
var rockAmount = 2;
var cloudPositionX;
var cloudPositionY;
var cloudWidth =3;
var cloudHeight =2;
var groundMaxHeight = 4;
var noise;
var audio;
var enterSound;
var placeSound;
var mineSound;
var tb;


function landinpage(){
	$("div.glitch").click(init);
	// $("div.glitch").click(function(){
	// })
	audio = new Audio('assets/sound.mp3');
	audio.play();
	noise = new Audio('assets/noise.mp3');
	enterSound = new Audio('assets/enter.mp3');
	placeSound = new Audio('assets/place.mp3');
	mineSound = new Audio('assets/mine.mp3');
	winSound = new Audio('assets/wingold.mp3');

	$(".glitch").hover(function(){
		noise.play();
	},function(){noise.pause();});
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
      for(var i =0;i<containerW/cellWH;i++){
    	var height = Math.floor(Math.random() * groundMaxHeight)+1;
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



function checkCloud(cloudPositionX,cloudPositionY){
	if(((cloudPositionY >= (treePositionY-trunkHeight-bushHeight)&&!((cloudPositionX+cloudWidth<treePositionX-bushWidth/3) || (cloudPositionX > treePositionX+bushWidth/3))) || cloudPositionX+cloudWidth<=1 || cloudPositionX+cloudWidth+1>=gameWidth)){
		return false;
	}
	else{
		return true;
	}
}


function placeCloud(){
	var goodCloud = false;
	while(!goodCloud){
		cloudPositionX =  Math.floor(Math.random()*containerW/cellWH);
		cloudPositionY = Math.floor(Math.random()*4) +2;
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
function placeExtra(type,amount){
    var count = amount || 1;
    for(var i = 0; i<count;i++) {
        x = Math.floor(Math.random() * containerW / cellWH);
        y = Math.floor(Math.random() * groundArray[x]);

        divArray[gameHeight - y][x].attr(type, true);
        console.log(x, y);
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

function buildCloud(cloudPositionX,cloudPositionY){
	for(var i = cloudPositionY; i>cloudPositionY-cloudHeight; i--){
			for(var t = cloudPositionX; t<cloudPositionX+cloudWidth; t++){
			divArray[i][t].addClass("cloud").attr("colored",true);
		}
	}
}


function mineOrPlant(){
	if(tb.selectedTool){
		if(tb.selectedTool.constructor === Tool){
		if(tb.selectedTool.farms.constructor == Array) {

			for(var i=0;i<tb.selectedTool.farms.length;i++){
				if($(this).hasClass(tb.selectedTool.farms[i])){
					$(this).removeClass(tb.selectedTool.farms[i]);



					if($(this).attr("gold")){
						$(this).addClass("gold");

                        if(!tb.isGoldInToolbar()) {
                        winSound.play();
						$("#gold").slideDown();
						setTimeout(function(){$("#gold").fadeOut()},4000);

                            tb.addTools([["diamond", "assets/tools/diamond_pickaxe.png", "assets/tools/diamond_pickaxe.png", "gold"]]);
                        }

						

					}
					else if($(this).attr("dynamite")){
						$(this).addClass("dynamite");
                        var gold =tb.returnInventoryItemByType("gold");
                        if(gold === null){
                            counter =0;
                        }
                        else {
                            var counter = gold.counter;
                        }
                        if (counter<2)
                        {
                            setTimeout(function(){$("#gameOver").slideDown()},1000);
                            setTimeout(function(){$("#gameOver").fadeOut()},4000);
                            setTimeout(function(){newGame()},5000);
                        }
                        else{
                            setTimeout(function(){$("#gameOver").text("YOU LOSE 2 GOLD").slideDown()},3000);
                            var that = this;
                            setTimeout(function(){
                                $("#gameOver").fadeOut()

                                $(that).addClass("sky");
                                $(that).removeClass("dynamite");
                            },4000);
                            setTimeout(function(){
                                $("#gameOver").text("GAME OVER");
                            },10000);
                            gold.counter-=2;
                            gold.span.text(gold.counter);
                            if(gold.counter == 0){
                                tb.removeInventoryItem("gold");
                            }

                        }

					}
					else{
					$(this).addClass("sky");
					mineSound.play();
				}

					if(tb.invClasses.indexOf(tb.selectedTool.farms[i])==-1){
						tb.addInventoryItem(tb.selectedTool.farms[i]);
					}
					else{
						var inventoryItem = tb.returnInventoryItemByType(tb.selectedTool.farms[i]);
						inventoryItem.counter++;
						inventoryItem.span.text(inventoryItem.counter);

					}
				}
			}
		}
		else{
			if($(this).hasClass(tb.selectedTool.farms)) {
				$(this).removeClass(tb.selectedTool.farms);
				$(this).addClass("sky");

				if(tb.invClasses.indexOf(tb.selectedTool.farms)==-1) {
					tb.addInventoryItem(tb.selectedTool.farms);
				}
				else{
					var inventoryItem = tb.returnInventoryItemByType(tb.selectedTool.farms);
					inventoryItem.counter++;
					inventoryItem.span.text(inventoryItem.counter);
				}
			}
		}


	}
	else{
		if($(this).hasClass("sky")){

			tb.selectedTool.counter--;

				$(this).addClass(tb.selectedTool.item.attr("class")).removeClass("sky invItem itemSelected");
				tb.selectedTool.span.text(tb.selectedTool.counter);
				placeSound.play();

			if(tb.selectedTool.counter==0) {
				tb.removeInventoryItem(tb.selectedTool);
			}
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
    (this.div).appendTo($("#toolDiv"));
    if(farms === "gold"){
        this.div.css("display","none");
        setTimeout(function() {
            that.div.fadeIn('slow');
        },2000)
    }
};

var InventoryItem = function(type,item){
	var that = this;
	this.counter = 1;
	this.type = type;
	this.item = item;
	this.span = $("<span>").text(1).addClass("invText").appendTo(item);
	this.selectItem = function(e){

		tb.removeSelected();
		$(e.target).addClass("itemSelected");
		tb.selectedTool= that;
		$("body").css("cursor",that.item.css("background-image")+",pointer");
	};
	this.item.click(this.selectItem);

};


var toolbar = function(){
    this.tools = [];
	this.selectedTool;
	this.invDiv;
	this.invItems = [];
	this.invClasses = [];
	var that = this;

	this.createToolDivs = function(){
		this.toolDiv = $("<div>").attr("id","toolDiv").appendTo("#toolbar");
        this.invDiv = $("<div>").addClass("invDiv").appendTo("#toolbar");
	};

    this.addTools = function(items){

        for(var i=0;i<items.length;i++){
            var tool = new Tool(items[i][0],items[i][1],items[i][2],items[i][3]);
            this.tools.push(tool);
        }

    };

    this.addInventoryItem = function(type){
		var item = $("<div>").addClass(type).addClass("invItem").attr("id",type);
		item.appendTo(this.invDiv);
		this.invItems.push(new InventoryItem(type,item));
		this.invClasses.push(type);
	};
	this.removeSelected = function(){
		for(var i=0;i<this.tools.length;i++){
			if(this.tools[i].div.hasClass("toolSel")){
				this.tools[i].div.removeClass("toolSel");
			}
		}
		for(var i=0;i<this.invItems.length;i++){
			if(this.invItems[i].item.hasClass("itemSelected")){
				this.invItems[i].item.removeClass("itemSelected");
			}
		}

	};

	this.returnInventoryItemByType = function(type){
		for(var i=0;i<this.invItems.length;i++){
			if (this.invItems[i].type === type){
				return this.invItems[i];
			}
		}
	};

	this.removeInventoryItem= function(item){
		this.selectedTool = null;
		$("body").css("cursor","auto");
		$("#"+item.type).remove();
        if(item.type=="gold"){
            $("#"+item.type).remove();
        }
		this.removeInvItemsByType(item.type);
		console.log(this.invItems);
	};

	this.removeInvItemsByType = function(type){
		for(var i=0;i<this.invItems.length;i++){
			if (this.invItems[i].type === type){
				this.invItems.splice(i,1);
				this.invClasses.splice(i,1);
			}
		}
	};
	this.isGoldInToolbar = function(){
        for(var i=0;i<this.tools.length;i++){
            if(this.tools[i].farms === "gold"){
                return true;
            }
        }
        return false;
    };
};







function reset(){
	noise.pause();
	audio.pause();
	enterSound.play();

	$(".landingpage").slideUp(1000);
    $("#toolbar").css("display","inline-block");
    $("#container").css("text-align", "left");
	$("body").css("text-align", "left");


	$("#game").css("border", "1px solid black");
	$("#newGame").show();
	setTimeout(function(){
		$("body").css("background", "inherit");
		$("html").css("background", "url(assets/backgroundblue.png) no-repeat center center fixed");
	},1000);

	
	groundArray = [];

}
landinpage();

function init(){
	reset();
	createDivMatrix();
	buildGroundArray();
	placeTree();
	placeRock();
	placeCloud();
	placeCloud();
	generateSky();
	placeExtra("gold",6);
	placeExtra("dynamite");
    tb = new toolbar();
    tb.createToolDivs();
    tb.addTools([["axe", "assets/tools/axe.png","assets/tools/axeCurs.png",["tree","treeBush"]],["picaxe", "assets/tools/pickaxe.png","assets/tools/pickaxeCurs.png","stone"],["shovel","assets/tools/shovel.png","assets/tools/shovelCurs.png",["dirt","dirtGrass"]]]);


}
function newGame(){
    $("#toolbar").empty();
	$("#game").html("");
	init();


}
// $(window).resize(function(){
// 	if($(window).width() < 600){
// 		containerW = 600;

// 	}
// });
