var Brush = {
	group:{},
	person:{},
	analytic:{},
	abox:null,
	iterationFld:null,
	peopleCountFld:null,
	timeFormat:"{hour}:{min}:{sec}",
	init:function(){
		this.iterationFld = document.getElementById("time-fld");
		this.abox = document.getElementById("analytic-box");
		this.peopleCountFld = document.getElementById("people-count");
	},

	showPeopleCount:function(count){
		this.peopleCountFld.innerText = count;
	},

	renderGroup:function(group){
		group.elem.style.left = (group.position.x - 96) +"px";
		group.elem.style.top = (group.position.y - 96) +"px";
		for(var i =0,l = group.list.length;i<l;i++){
			var p = group.list[i];
			this.renderPerson(p);
		}


	},
	renderPerson:function(person){
		var elem = person.getElem();
		elem.style.left = person.position.x+"px";
		elem.style.top = person.position.y+"px";
		elem.style.transform = "rotateZ({deg}deg)".replace("{deg}",person.position.deg);
		if (person.isTalking){
			person.guy.className = "guy talking";
		}else {
			person.guy.className = "guy";
		}
	},

	renderAnalytics:function(person){
		this.abox.style.display = "block";
		this.abox.style.top = (person.position.y-48)+ "px";
		this.abox.style.left = (person.position.x+48) + "px";

		this.createAnalytics();
		
		var box = this.analytic["person-analytics"],
			p1 = box.para.p1,
			p2 = box.para.p2,
			p3 = box.para.p3,
			p4 = box.para.p4,
			p5 = box.para.p5,
			p6 = box.para.p6;
		p1.innerHTML = "<b>Talk Points:</b> "+person.talkPoint;
		p2.innerHTML = "<b>Listen Points:</b> "+person.listenPoint;
		p3.innerHTML = "<b>T/L Ratio:</b> "+(person.listenPoint<= 0? "N/A": person.tlRatio+ "%" );
		p4.innerHTML = "<b>Leaving In:</b> "+ person.boredom;
		p5.innerHTML = "<b>Time Talked:</b> "+person.timeTalked;
		p6.innerHTML = "<b>Missed Opp:</b> "+person.missedTalk;
		box.h.innerHTML = person.id;
		if (person.isTalking){
			box.className = "p-an-item p-an-item--talking";
		}else {
			box.className = "p-an-item";
		}
	},

	createAnalytics:function(){
		var box = document.getElementById("analytic-content");;
		var idStr = "person-analytics";
		if (document.getElementById(idStr)){
			return ;
		}

		var div = document.createElement("div"),
		h = document.createElement("h3"),
		p1 = document.createElement("p"),
		p2 = document.createElement("p"),
		p3 = document.createElement("p"),
		p4 = document.createElement("p");
		p5 = document.createElement("p");
		p6 = document.createElement("p");
		div.id = idStr;
		div.className = "p-an-item";
		p1.className = p2.className = p3.className =  p4.className = p5.className = p6.className = "p-an-item__point";
		h.className = "p-an-item__title";
		p1.innerHTML = "<b>Talk Points:</b> 0";
		p2.innerHTML = "<b>Listen Points:</b> 0";
		p3.innerHTML = "<b>T/L Ratio:</b> 0";
		p4.innerHTML = "<b>Leaving In:</b> 0";
		p5.innerHTML = "<b>Time Talked:</b> 0";
		p6.innerHTML = "<b>Missed Opp:</b> 0";
		div.appendChild(h)
		div.appendChild(p1);
		div.appendChild(p2);
		div.appendChild(p3);
		div.appendChild(p4);
		div.appendChild(p5);
		div.appendChild(p6);
		this.analytic[idStr] = div;
		div.para = {
			p1:p1,
			p2:p2,
			p3:p3,
			p4:p4,
			p5:p5,
			p6:p6
		};
		div.h = h;
		box.appendChild(div);
	},

	updateIterationView:function(i){
		"{hour}:{min}:{sec}";
		var h = i/3600,
			m = (h - Math.floor(h)) * 60,
			s = (m - Math.floor(m)) * 60;
		h = h > 10?Math.floor(h):"0"+Math.floor(h);
		m = m > 10?Math.floor(m):"0"+Math.floor(m);
		s = s > 10?Math.floor(s):"0"+Math.floor(s);
		this.iterationFld.innerText = this.timeFormat
			.replace("{hour}",h)
			.replace("{min}",m )
			.replace("{sec}",s);
		;
	}
};
