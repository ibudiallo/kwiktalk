
var Converser = {
	running: false,
	size:{w:480,h:480},
	addBtn:null,
	ctrlBtn:null,
	repBtn:null,
	jumpBtn:null,
	jumpCount: 1800, // 30 minutes
	box:null,
	analyticBox:null,
	analyticBoxClsBtn:null,
	groupBox:null,
	addGroupBtn:null,
	defaultCount:2,
	clockSpeed: 600, // milliseconds
	idTrack:0,
	groupIdTrack:0,
	groups:[],
	stopTick: false,
	iteration:0,
	timeID :null,
	groupAddTrack:0,
	peopleCount: 0,
	init:function(){

		this.addBtn = document.getElementById("add-btn");
		this.ctrlBtn = document.getElementById("control-btn");
		this.box = document.getElementById("canvas-box");
		this.repBtn = document.getElementById("report-btn");
		this.repClsBtn = document.getElementById("report-cls-btn");
		this.analyticBox = document.getElementById("analytic-box");
		this.analyticBoxClsBtn = document.getElementById("abox-cls-btn");
		this.jumpBtn = document.getElementById("jump-btn");
		this.groupBox = document.getElementById("add-group-box");
		this.addGroupBtn = document.getElementById("add-group-btn");

		sdom.addEvent(this.addBtn,"click",function(e){
			Converser.addPerson();
		});
		sdom.addEvent(this.ctrlBtn,"click",function(e){
			if (Converser.stopTick){
				Converser.unpause();
			}else {
				Converser.pause();
			}
		});
		var startBtn = document.getElementById("start-btn");

		this.setupDefaults();

		sdom.addEvent(startBtn,"click",function(){
			Converser.start();
		});

		sdom.addEvent(this.repBtn,"click",function(e){
			Converser.pause();
			Report.showReport(Converser.iteration);
		});
		sdom.addEvent(this.repClsBtn,"click",function(e){
			Report.hideReport();
			Converser.unpause();
		});

		sdom.addEvent(this.analyticBoxClsBtn,"click",function(){
			Converser.closePersonBox();
			Converser.unpause();
		});
		sdom.addEvent(this.jumpBtn,"click",function(){
			Converser.jump();
		});

		Brush.init();
		Report.init();
	},
	pause:function(){
		this.stopTick = true;
		this.ctrlBtn.innerText = "Play";
		clearTimeout(this.timeID);
	},
	unpause:function(){
		this.stopTick = false;
		this.ctrlBtn.innerText = "Pause";
		this.closePersonBox();
		this.tick();
	},

	start:function(){
		this.stopTick = false;
		var introBox = sdom.byClass("intro-over")[0];
		introBox.style.display = "none";
		
		var settings = sdom.byClass("group-add",this.groupBox);
		for(var i = 0;i < settings.length;i++){
			var input = settings[i].getElementsByTagName("input")[0];
			this.initPeople(parseInt(input.value,10));
		}
		this.running = true;
		this.updatePositions();
		this.startConversation(this.groups[0]);
		this.tick();
	},
	setupDefaults:function(){
		sdom.addEvent(this.addGroupBtn,"click",function(e){
			e.preventDefault();
			Converser.addGroupBox();
		});
		// /*
		var speedSlide = document.getElementById("speed-field");

		var peopleSlide = document.getElementById("intro-people-field"),
			peopleSlideRead = document.getElementById("intro-people-label");

		sdom.addEvent(speedSlide,"input",function(){
			var input = (110 - (parseInt(this.value)))*10;
			Converser.clockSpeed = input?input:100;
		});
		this.addGroupBox();
	},

	addGroupBox:function(){

		var div = document.createElement("div"),
		label = document.createElement("label"),
		input = document.createElement("input"),
		span = document.createElement("span");

		input.value = this.defaultCount;
		input.type = "range";
		input.min = 2;
		input.max = 16;
		span.innerText = this.defaultCount + " people";
		div.id = "group-add-"+ this.groupAddTrack;
		div.className = "intro-over__ctrl group-add";
		label.innerText = "Group "+ (this.groupAddTrack+1);
		sdom.addEvent(input,"input",function(){
			span.innerText = this.value + " people";
		});

		div.appendChild(label);
		div.appendChild(input);
		div.appendChild(span);
		this.groupBox.appendChild(div);
		this.groupAddTrack++;
	},

	tick:function(){
		if (this.stopTick){
			return;
		}
		this.update();
		this.draw();
		
		this.timeID = setTimeout(function(){
			requestAnimationFrame(function(){
				if (Converser.stopTick){
					return;
				}
				Converser.tick();
			});
		},this.clockSpeed);
	},

	update: function(){
		this.iteration++;
		var remove = [],
		peopleCount = 0;

		for (var j = 0,k = this.groups.length;j<k;j++) {
			var group = this.groups[j];
			if (group.list.length === 1){
				group.list[0].stopTalking();
				continue;
			}
			for (var i = 0,l = group.list.length;i<l;i++){
				var person = group.list[i];
				person.update(group.leaveAfter);
				if (person.boredom < 0){
					remove.push(person);
				}
			}
		}

		for (var i = 0;i < remove.length;i++){
			this.kickOut(remove[i]);
		}

		for (var j = 0,k = this.groups.length;j<k;j++) {
			var group = this.groups[j];
			var talker = this.isAnyoneTalking(group);
			peopleCount+= group.list.length;
			if (!talker){
				this.startConversation(group);
			}else {
				for (var i = 0,l = group.list.length;i<l;i++){
					var position = talker.position;
					if (talker.id === group.list[i].id){
						position = group.position;
					}
					group.list[i].turnTo(position);
				}
			}
			group.updatePosition();
			Report.process(group);
		}
		this.peopleCount = peopleCount;
		Brush.showPeopleCount(peopleCount);
	},
	draw:function(){
		// update ui
		var i = 0, l = this.groups.length;
		for(;i<l;i++){
			var group = this.groups[i];
			Brush.renderGroup(group);
		}
		Brush.updateIterationView(this.iteration);
	},

	jump:function(){
		this.pause();
		var i = 0;
		for(;i<Converser.jumpCount;i++){
			this.update();
		} 
		this.unpause();
	},

	initPeople:function(count){
		var position = this.findEmptyArea(),
		group = this.createGroup(position),
		i = 0,l = count,
		p=null;
		for (;i<l;i++){
			this.addPerson(group);
		}

	},

	createGroup:function(position){
		var people = new Group(this.box,this.groupIdTrack,position);
		this.groupIdTrack++;
		this.groups.push(people);

		return people;
	},

	isAnyoneTalking:function(group){
		for(var i = 0,l = group.list.length;i<l;i++){
			if(group.list[i].isTalking){
				return group.list[i];
			}
		}
		return false;
	},

	startConversation:function(group){
		if(group.list.length <= 1){
			// Wait for a second person to join
			return ;
		}

		var index = -1,
		temp;
		var count = 0;
		while(true){
			index = getRandIntInclusive(0,group.list.length -1);
			temp = group.list[index];
			if (temp && temp.boredom > -1){
				break;
			}
			count++;
			if (count > 100){
				console.log("Something Went wrong",group);
				Converser.stop();
				return;
			}
		}
		for(var i = 0,l = group.list.length;i<l;i++){
			var person = group.list[i];
			if (i === index){
				person.talk();
			}else {
				person.noTalk();
			}
		}
	},

	updatePositions:function(){
		for(var j = 0,k = this.groups.length;j<k;j++){
			var group = this.groups[j];
			var i = 0,l = group.list.length,
			p=null,
			center = {x:group.position.x,y:group.position.y},
			pSize = {w:48,h:48},
			slice = 360 / l,
			thetaRad =  toRadians(slice);

			for (;i<l;i++){
				p = group.list[i];
				var coord = getCoord(thetaRad,i);
				var x = Math.round((coord[0] * 96) + center.x),
					y = Math.round((coord[1] * 96) + center.y),
					deg = getRotation(x,y,center);
				p.updatePosition(x,y,deg);
			}
		}
	},


	addPerson:function(group,person){
		if (!group){
			var index = getRandIntInclusive(0,this.groups.length -1);
			group = this.groups[index];
		}
		if (!person){
			person = new Person(this.box,this.idTrack);
		}
		group.addPerson(person);
		this.idTrack++;
		this.updatePositions();
		var elem = person.getElem();
		sdom.addEvent(elem,"click",function(){
			Converser.pause();
			Converser.onPersonClick(person);
		});
	},
	removePerson:function(p){
		var group = this.getGroup(p.group),
		index = -1;
		if (!group){
			console.log("Can't find group for person", p);
			return ;
		}

		for(var i = 0,l = group.list.length;i<l;i++){
			if (p.id === group.list[i].id){
				index = i;
				break;
			}
		}
		if (index < 0){
			console.log("Can't remove person",p);
			return;
		}
		var obj = group.list.splice(index,1)[0];
		p.reset();
		this.updatePositions();
		this.findNewGroup(obj);
	},
	onPersonClick:function(p){
		Brush.renderAnalytics(p);
		//this.pause();
	},
	closePersonBox:function(){
		this.analyticBox.style.display = "none";
	},

	kickOut:function(p){
		this.removePerson(p);
	},
	getGroup:function(id){
		for(var i = 0,l = this.groups.length;i<l;i++){
			if (this.groups[i].id === id){
				return this.groups[i]; 
			}
		}
		return false;
	},

	findNewGroup:function(p){
		var position = this.findEmptyArea();
		if (this.groups.length === 1) {
			var group = this.createGroup(position);
			this.addPerson(group,p);
			return ;
		}

		var rand = getRandIntInclusive(0,99);
		if (rand < (15 - this.groups.length)){
			var group = this.createGroup(position);
			this.addPerson(group,p);
			return ;
		}

		var index = -1;
		var counter = 0;
		while(true){
			index = getRandIntInclusive(0,this.groups.length -1);
			if (this.groups[index].id !== p.oldGroup){
				break;
			}
			counter++;
			if (counter> 1000){
				index = this.groups.length -1;
				break;
			}
		}

		this.addPerson(this.groups[index],p);
	},

	findEmptyArea:function(){
		var col = Math.floor(window.innerWidth / 288);
		var x = Math.floor(this.groups.length%col)*288 ;
		var y = Math.floor(this.groups.length/col)* 288 ;

		var position = {
			x: x + 96 ,
			y: y + 96 ,
		}
		return position;
	}
};

sdom.load(function(){
	Converser.init();
});