


var mg = {};


mg.Game = function(){
    this.containerH = 600;
    this.containerW = 1000;
    this.cellWH = 50;
    this.groundArray = [];
    this.divArray = [];
    this.gameHeight = this.containerH/this.cellWH-1;
    this.gameWidth = this.containerW/this.cellWH-1;
    this.treePositionX;
    this.treePositionY;
    this.trunkHeight = 2;
    this.bushHeight = 3;
    this.bushWidth = 3; //have to have number divisible by 3
    this.rockPositionX;
    this.rockPositionY;
    this.rockAmount = 2;
    this.cloudPositionX;
    this.cloudPositionY;
    this.cloudWidth =3;
    this.cloudHeight =2;
    this.groundMaxHeight = 4;
    var that = this;
    this.noise = new Audio('assets/noise.mp3');
    this.audio = new Audio('assets/sound.mp3');
    this.enterSound = new Audio('assets/enter.mp3');
    this.placeSound = new Audio('assets/place.mp3');
    this.mineSound = new Audio('assets/mine.mp3');
    this.winSound = new Audio('assets/wingold.mp3');
    this.level = 1;
    this.gold = 5;
    this.goldMined = 0;
    this.dynamite = 1;
    this.plantCounter = 0;
    this.updateLevel = function updateLevel(){
        $("#level").text("Level "+this.level);
    }
    this.updateLevel();
  
    this.mineOrPlant = function mineOrPlant() {
        if(mg.tb.selectedTool){
            if(mg.tb.selectedTool.constructor === mg.Tool){
                if(mg.tb.selectedTool.farms.constructor == Array  && $(this).attr("planted")!="true") {
                    for(var i=0;i<mg.tb.selectedTool.farms.length;i++){
                        if($(this).hasClass(mg.tb.selectedTool.farms[i])){
                            $(this).removeClass(mg.tb.selectedTool.farms[i]);
                            if($(this).attr("gold")){
                                $(this).addClass("gold");

                                if(!mg.tb.isGoldInToolbar()) {
                                    that.winSound.play();
                                    $("#gold").slideDown();
                                    setTimeout(function(){$("#gold").fadeOut()},4000);

                                    mg.tb.addTools([["diamond", "assets/tools/diamond_pickaxe.png", "assets/tools/diamond_pickaxe.png", "gold"]]);
                                }
                            }
                            else if($(this).attr("dynamite")){
                                $(this).addClass("dynamite");
                                var gold =mg.tb.returnInventoryItemByType("gold");
                                if(gold === -1){
                                    counter =0;
                                }
                                else {
                                    var counter = gold.counter;
                                }
                                if (counter<2)
                                {
                                    setTimeout(function(){$("#gameOver").slideDown()},1000);
                                    setTimeout(function(){$("#gameOver").fadeOut()},4000);
                                    minecraft = new mg.Game();
                                    setTimeout(function(){minecraft.newGame()},5000);

                                }
                                else{
                                    setTimeout(function(){$("#gameOver").text("YOU LOSE 2 GOLD").slideDown()},3000);

                                    var self = this;
                                    setTimeout(function(){
                                        $("#gameOver").fadeOut()

                                        $(self).addClass("sky");
                                        $(self).removeClass("dynamite");
                                    },4000);
                                    setTimeout(function(){
                                        $("#gameOver").text("GAME OVER");

                                    },10000);
                                    gold.counter-=2;
                                    gold.span.text(gold.counter);
                                    if(gold.counter == 0){
                                        mg.tb.removeInventoryItem(gold);
                                    }
                                }
                            }
                            else{
                                $(this).addClass("sky");
                                that.mineSound.play();
                            }
                            if(mg.tb.invClasses.indexOf(mg.tb.selectedTool.farms[i])==-1){
                                mg.tb.addInventoryItem(mg.tb.selectedTool.farms[i]);
                            }
                            else{
                                var inventoryItem = mg.tb.returnInventoryItemByType(mg.tb.selectedTool.farms[i]);
                                inventoryItem.counter++;
                                inventoryItem.span.text(inventoryItem.counter);

                            }
                        }
                    }
                }
                else{
                    if($(this).hasClass(mg.tb.selectedTool.farms)  && $(this).attr("planted")!="true") {
                        $(this).removeClass(mg.tb.selectedTool.farms);
                        $(this).addClass("sky");
                        var inventoryItem = mg.tb.returnInventoryItemByType(mg.tb.selectedTool.farms);
                        if(mg.tb.invClasses.indexOf(mg.tb.selectedTool.farms)==-1) {
                            mg.tb.addInventoryItem(mg.tb.selectedTool.farms);
                            that.goldMined++;
                            $("#goldLeft").text("Gold Left To Mine: " + (that.gold-that.goldMined))
                        }
                        else{

                            inventoryItem.counter++;
                            inventoryItem.span.text(inventoryItem.counter)
                            if(inventoryItem.type == "gold"){
                                that.goldMined++;
                                $("#goldLeft").text("Gold Left To Mine: " + (that.gold-that.goldMined))

                            }

                        }


                    }
                    if(that.goldMined === that.gold){
                        setTimeout(function(){$("#gameOver").text("YOU BEAT  LEVEL "+that.level + "!!" ).slideDown()},3000);
                        setTimeout(function(){
                            $("#gameOver").fadeOut();
                            that.plantCounter = 0;
                            that.newLevel();
                        },4000);

                    }
                }
            }
            else{
                if($(this).hasClass("sky")){

                    if(mg.tb.selectedTool.counter>0) {

                        if(mg.tb.selectedTool.type == "gold"){
                            that.goldMined--;
                            $("#goldLeft").text("Gold Left To Mine: " + (that.gold-that.goldMined))
                        }
                        else{

                            that.plantCounter++;
                            $(this).attr("planted","true");
                            $(this).css("box-sizing","border-box");
                            $(this).css("opacity",.7);
                        }
                        if(that.plantCounter == 10){
                            if(mg.tb.invClasses.indexOf("gold")==-1) {
                                mg.tb.addInventoryItem("gold");
                            }
                            else {
                                var goldInventory = mg.tb.returnInventoryItemByType("gold");
                                goldInventory.counter++;
                                goldInventory.span.text(goldInventory.counter);
                                that.plantCounter = 0;
                            }
                        }


                        mg.tb.selectedTool.counter--;

                        $(this).addClass(mg.tb.selectedTool.item.attr("class")).removeClass("sky invItem itemSelected");
                        mg.tb.selectedTool.span.text(mg.tb.selectedTool.counter);
                        that.placeSound.play();
                    }
                    if(mg.tb.selectedTool.counter==0) {
                        mg.tb.removeInventoryItem(mg.tb.selectedTool);
                    }
                }
            }
        }
    };
    //




    this.loadInstructions = function loadInstructions(){
        $("#instDiv").slideDown();

    };

    this.hideInstructions = function hideInstructions(){
      $('#instDiv').slideUp();
    };


    this.landinpage = function landinpage(){
        $("#loadInst").click(this.loadInstructions);
        $("#instButt").click(this.hideInstructions);
        this.audio.play();
        $("div.glitch").click(this.init);
        // $("div.glitch").click(function(){
        // })
        $(".glitch").hover(function(){
            that.noise.play();
        },function(){that.noise.pause();});
    };

    this.createDivMatrix = function createDivMatrix(){
        //createMatrixOfDivsHere
        $("#game").css("width", this.containerW+"px");
        $("#game").css("height", this.containerH+"px");

        for(var i = 0; i<this.containerH/this.cellWH; i++){
            this.divArray[i] = Array(this.containerW/this.cellWH);
            var row = $("<div/>");
            row.appendTo($("#game"));

            for(var j = 0; j<this.containerW/this.cellWH; j++){
                var cell = this.divArray[i][j]=$("<div/>").on("click",that.mineOrPlant);
                cell.addClass("cell");
                cell.css("width", this.cellWH+"px");
                cell.css("height", this.cellWH+"px");
                cell.data("row", i);
                cell.data("column", j);
                cell.appendTo($(row));

            }
        }
    };


    this.buildGroundArray = function buildGroundArray(){
        for(var i =0;i<this.containerW/this.cellWH;i++){
            var height = Math.floor(Math.random() * this.groundMaxHeight)+1;
            this.groundArray.push(height);
            for(var j= ((this.containerH/this.cellWH)-1); j>(((this.containerH/this.cellWH)-1) -this.groundArray[i]); j--){
                this.divArray[j][i].addClass("dirt").attr("colored",true);

                if(j===(this.containerH/this.cellWH-this.groundArray[i])){
                    this.divArray[j][i].removeClass("dirt").addClass("dirtGrass").attr("colored",true);
                }
            }
        }

    };

    this.placeTree = function placeTree(){
        var goodTree = false;

        while(!goodTree){
            this.treePositionX = Math.floor(Math.random()*this.containerW/this.cellWH);
            this.treePositionY = this.gameHeight-this.groundArray[this.treePositionX];
            goodTree = this.checkTree(this.treePositionX,this.treePositionY);
        }
        this.buildTrunk();
        this.buildBush();
    };

    this.placeRock = function placeRock(){
            var goodRock = false;
            while(!goodRock){
                this.rockPositionX = Math.floor(Math.random()*this.containerW/this.cellWH);
                this.rockPositionY = this.gameHeight-this.groundArray[this.rockPositionX];
                goodRock = this.checkRock(this.rockPositionX, this.rockPositionY);
            }
            for(var i = this.rockPositionY; i>this.rockPositionY-this.rockAmount; i--){
                this.divArray[i][this.rockPositionX].addClass("stone").attr("colored",true);
            }
        };

    this.checkCloud = function checkCloud(cloudPositionX,cloudPositionY){
        if(((cloudPositionY >= (this.treePositionY-this.trunkHeight-this.bushHeight)&&!((cloudPositionX+this.cloudWidth<this.treePositionX-this.bushWidth/3) || (cloudPositionX > this.treePositionX+this.bushWidth/3))) || cloudPositionX+this.cloudWidth<=1 || cloudPositionX+this.cloudWidth+1>=this.gameWidth)){
            return false;
        }
        else{
            return true;
        }
    };

    this.placeCloud = function placeCloud(){
        var goodCloud = false;
        while(!goodCloud){
            this.cloudPositionX =  Math.floor(Math.random()*this.containerW/this.cellWH);
            this.cloudPositionY = Math.floor(Math.random()*4) +2;
            goodCloud = this.checkCloud(this.cloudPositionX,this.cloudPositionY);

        }

        this.buildCloud(this.cloudPositionX, this.cloudPositionY);
    };


    this.generateSky = function generateSky(){
        for(var i = 0; i<this.containerH/this.cellWH; i++){
            for(var j = 0; j<this.containerW/this.cellWH; j++){
                if((this.divArray[i][j].attr("colored") !=="true")){
                    this.divArray[i][j].addClass("sky");
                }
            }
        }
    };
    this.placeExtra = function placeExtra(type,amount){

        var count = amount || 1;
        for(var i = 0; i<count;i++) {
            x = Math.floor(Math.random() * this.containerW / this.cellWH);
            y = Math.floor(Math.random() * this.groundArray[x]);

            if(type==="gold"){

                if(this.divArray[this.gameHeight - y][x].attr("dynamite") != "true" && this.divArray[this.gameHeight - y][x].attr("gold") != "true"){
                    this.divArray[this.gameHeight - y][x].attr(type, "true");
                }
                else{
                    this.gold--;
                }
            }
            else {
                this.divArray[this.gameHeight - y][x].attr(type, "true");
            }

        }

    };

    this.checkTree = function checkTree(treePositionX,treePositionY){
        if(treePositionY<=(this.gameHeight-this.groundArray[this.treePositionX-1]) && this.treePositionY<=(this.gameHeight-this.groundArray[this.treePositionX+1]) ){

            return true;
        }
        else{

            return false;
        }

    };
    this.buildTrunk = function buildTrunk(){
        //first block
        this.divArray[this.treePositionY][this.treePositionX].addClass("tree").attr("colored",true);

        //rest of tree
        for(var k=this.treePositionY ; k>this.treePositionY-this.trunkHeight; k--){

            this.divArray[k][this.treePositionX].addClass("tree").attr("colored",true);
        }
        //leaf

    };
    this.buildBush = function buildBush(){
        for(var i = this.treePositionY-this.trunkHeight; i>this.treePositionY-this.trunkHeight-this.bushHeight;i--){
            for(var t = this.treePositionX; t<this.treePositionX+this.bushWidth; t++){
                this.divArray[i][t-1].addClass("treeBush").attr("colored",true);
            }
        }
    };

    this.checkRock = function checkRock(){
        if(this.rockPositionX === this.treePositionX){
            return false;
        }
        else{
            return true;
        }
    };

    this.buildCloud = function buildCloud(cloudPositionX,cloudPositionY){
        for(var i = cloudPositionY; i>cloudPositionY-this.cloudHeight; i--){
            for(var t = cloudPositionX; t<cloudPositionX+this.cloudWidth; t++){
                this.divArray[i][t].addClass("cloud").attr("colored",true);
            }
        }
    };

    this.reset = function reset(){
        this.noise.pause();
        this.audio.pause();
        this.enterSound.play();

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


        this.groundArray = [];

    };

    this.newLevel = function init(){
        $("#game").html("");
        that.level++;
        that.gold+=4;
        that.goldMined = 0;
        that.dynamite+=3;
        that.updateLevel();
        that.createDivMatrix();
        that.buildGroundArray();
        that.placeTree();
        that.placeRock();
        that.placeCloud();
        that.placeCloud();
        that.generateSky();

        that.placeExtra("dynamite",that.dynamite);
        that.placeExtra("gold",that.gold);
        $("#goldLeft").text("Gold left to mine " + that.gold);
    };

    this.init = function init(){

        that.reset();
        that.createDivMatrix();
        that.buildGroundArray();
        that.placeTree();
        that.placeRock();
        that.placeCloud();
        that.placeCloud();
        that.generateSky()


        that.placeExtra("dynamite",that.dynamite);
        that.placeExtra("gold",that.gold);
        $("#goldLeft").text("Gold Left to mine " +that.gold);
        mg.tb = new mg.toolbar();
        mg.tb.createToolDivs();
        mg.tb.addTools([["axe", "assets/tools/axe.png","assets/tools/axeCurs.png",["tree","treeBush"]],["picaxe", "assets/tools/pickaxe.png","assets/tools/pickaxeCurs.png","stone"],["shovel","assets/tools/shovel.png","assets/tools/shovelCurs.png",["dirt","dirtGrass"]]]);

    };

    this.callInit = function(){
        this.init();
    }

    this.newGame = function newGame(){
        $("#toolbar").empty();
        $("#game").html("");
        that.callInit();

    };

    $("#newGame").on("click", this.newGame);
    //

};

mg.Tool = function(name,img,icon,farms) {
    var that = this;
    this.name = name;
    this.icon = icon;
	this.farms = farms;
    this.type = "";
    this.selectTool = function(){
		mg.tb.removeSelected();
        mg.tb.selectedTool = that;
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

mg.InventoryItem = function(type,item){
	var that = this;
	this.counter = 1;
	this.type = type;
	this.item = item;
	this.span = $("<span>").text(1).addClass("invText").appendTo(item);
	this.selectItem = function(e){

		mg.tb.removeSelected();
		$(e.target).addClass("itemSelected");
		mg.tb.selectedTool= that;
		$("body").css("cursor",that.item.css("background-image")+",pointer");
	};
	this.item.click(this.selectItem);

};


mg.toolbar = function(){
    this.level =
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
            var tool = new mg.Tool(items[i][0],items[i][1],items[i][2],items[i][3]);
            this.tools.push(tool);
        }

    };

    this.addInventoryItem = function(type){
		var item = $("<div>").addClass(type).addClass("invItem").attr("id",type);
		item.appendTo(this.invDiv);
		this.invItems.push(new mg.InventoryItem(type,item));
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
		return -1;
	};

	this.removeInventoryItem= function(item){
		// this.selectedTool = null;
		$("body").css("cursor","auto");
		$("#"+item.type).remove();
        if(item.type=="gold"){
            $("#"+item.type).remove();
        }
		this.removeInvItemsByType(item.type);
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

var minecraft = new mg.Game();
minecraft.landinpage();



