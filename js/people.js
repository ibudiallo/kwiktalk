function Person(dom,id){
	this.oldGroup = false;
	this.group = false;
	this.id = "person-"+id;
	this.domElem = null;
	this.domParent = dom;
	this.guy = null;
	this.createDOM();
	
	this.position = {x:0,y:0,deg:0};

	this.isTalking = false;
	this.talkLife = 0;
	this.talkPoint = 0;
	this.listenPoint = 0;
	this.tlRatio = 0;
	// Number of ticks since last talk. Resetted to zero
	this.timeSinceLastTalk = 0;
	// Number of times I got to talk
	this.timeTalked = 0;
	// Number of conversations I didn't get to talk
	this.missedTalk = 0;

	// time left before leaving
	this.boredom = 0;
}

Person.prototype.createDOM = function(){
	var div = document.createElement("div");
	var guy = document.createElement("div");
	var talkBox = document.createElement("div");
	div.id = this.id;
	div.className = "person";
	guy.className = "guy"
	talkBox.className = "talk-box";
	for (var i = 0,l=3;i<l;i++){
		talkBox.appendChild(document.createElement("span"));
	}
	guy.appendChild(talkBox);
	div.appendChild(guy);
	this.domElem = div;
	this.guy = guy;
	this.appendDOM();
};
Person.prototype.appendDOM = function(){
	this.domParent.appendChild(this.domElem);
};
Person.prototype.getElem = function(){
	return this.domElem;
};

Person.prototype.updatePosition = function(x,y,theta){
	this.position.x = x;
	this.position.y = y;
	this.position.deg = theta;
};

Person.prototype.talk = function(){
	this.isTalking = true;
	this.talkLife = getRandIntInclusive(3,5);
	this.timeTalked++;
};

Person.prototype.stopTalking = function(){
	this.isTalking = false;
	this.talkLife = 0;
};

Person.prototype.update = function(leaveAfter) {
	if (this.isTalking){
		this.talkPoint++;
		this.talkLife--;
		this.timeSinceLastTalk = 0;
		if (this.talkLife <= 0){
			this.stopTalking();
		}
		this.setOpacity(1);
	}else {
		this.listenPoint++;
		this.timeSinceLastTalk++;
		this.boredom = leaveAfter - this.timeSinceLastTalk;
		var opacity = Math.round((this.boredom/leaveAfter)* 100);
		opacity = opacity > 10? opacity:10;
		this.setOpacity(opacity/100);
	}
	this.tlRatio =  (this.talkPoint * 100/this.listenPoint ).toFixed(2);
};

Person.prototype.turnTo = function(position){
	var deg = getRotation(this.position.x,this.position.y,{x:position.x,y:position.y});
	//console.log(this.position.deg,deg);
	var diff = Math.abs(deg - this.position.deg)
	if (diff > 180){ // preventing that wild spin
		deg -= 360;
	}
	//this.domElem.style.transform = "rotateZ({deg}deg)".replace("{deg}",deg);
	this.position.deg = deg;
};

Person.prototype.noTalk = function(){
	this.missedTalk++;
};

Person.prototype.setOpacity = function(opacity){
	this.domElem.style.opacity = opacity;
};
Person.prototype.reset = function() {
	this.setOpacity(1);
	this.oldGroup = this.group;
	this.group = false;
	this.position = {x:0,y:0,deg:0};

	this.isTalking = false;
	this.talkLife = 0;
	this.talkPoint = 0;
	this.listenPoint = 0;
	this.tlRatio = 0;
	// Number of ticks since last talk. Resetted to zero
	this.timeSinceLastTalk = 0;
	// Number of times I got to talk
	this.timeTalked = 0;
	// Number of conversations I didn't get to talk
	this.missedTalk = 0;
	this.boredom = 0;
};



function Group(dom,id,position){
	this.id = "group-"+id;
	this.list = [];
	this.count = 0;
	this.position = position;
	this.leaveAfter = getRandIntInclusive(30,60);
	this.elem = document.createElement("div");
	this.elem.className = "group-elem";
	this.elem.id = "group-"+id+"-floater";
	this.elem.setAttribute("data-name",this.id);
	dom.appendChild(this.elem);
}

Group.prototype.addPerson = function(person){
	this.list.push(person);
	person.group = this.id;
	this.count = this.list.length;
};

Group.prototype.removePerson = function(person){
	var index;
	for(var i = 0,l = this.list.length;i<l;i++){
		if (person === this.list[i]){
			index = i;
			break;
		}
	}
	var obj = this.list.splice(index,1)[0];
	this.count = this.list.length;
	return obj;
};

Group.prototype.setPosition = function(x,y){
	this.position.x = x;
	this.position.y = y;
};

Group.prototype.updatePosition = function(){
	var id = parseInt(this.id.replace("group-",""),10),
		col = Math.floor(window.innerWidth / 288),
		x = Math.floor(id%col) * 288,
		y = Math.floor(id/col) * 288;
	this.position.x = x+96;
	this.position.y = y+96;
};

Group.prototype.update = function(){
	var i = 0, l = this.list.length,p;
	for(;i<l;i++){
		p = this.list[i];
		p.update();
	}
};