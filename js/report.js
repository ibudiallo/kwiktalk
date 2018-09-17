var Report = {
	scores:{},
	reportBox:null,
	analyticBox:null,
	canvas: null,
	init:function(){
		this.reportBox = document.getElementById("rep-sect");
		this.canvas = document.getElementById("rep-canvas");
	},
	process:function(group){
		if (group.list.length < 2){
			return ;
		}
		var id = group.list.length +"-report";
		if (!this.scores[id]){
			this.scores[id] = {
				groupNumber: group.list.length,
				total: 0
			};
		}
		this.scores[id].total++;
	},

	showReport:function(iteration){
		var key,
			allValues = [],
			hdr = document.getElementById("report-body-hdr"),
			ftr = document.getElementById("report-body-ftr"),
			total = 0;
		for(key in this.scores){
			if (!this.scores.hasOwnProperty(key)){
				continue;
			}
			allValues.push(this.scores[key]);
			total += this.scores[key].total;
		}

		this.canvas.innerHTML = "";
		if (allValues.length === 0){
			this.canvas.innerHTML = "Run the simulater a little longer then try again.";
			return ;
		}

		allValues.sort(function(a,b){
			return b.total - a.total;
		});
		
		var largest = allValues[0],
			barSize = 200;
		hdr.innerHTML = "<h4>Reporting on "+allValues.length+" group(s) after "+iteration+ " iterations</h4>";
		ftr.innerHTML = "<p>The group with "+(largest.groupNumber === 1? "1 person":largest.groupNumber+" people ")+" has the optimal conversations</p>";

		for(var i = 0,l = allValues.length;i<l;i++){
			var box = document.createElement("div"),
			percent = allValues[i].total / total,
			height = Math.round((allValues[i].total / largest.total) * barSize),
			roundedPercent = Math.floor(percent*100),
			extraClass = height > 36? "": " above" ;
			box.className = "rep-value-box"+extraClass;

			box.innerHTML = (roundedPercent?roundedPercent:'<1')+"% <span>Group "+allValues[i].groupNumber+"</span>";
			box.title = "Group "+allValues[i].groupNumber;
			box.style.height = height+"px";

			this.canvas.appendChild(box);
		}

		this.reportBox.style.display = "block";
	},
	hideReport:function(){
		this.reportBox.style.display = "none";
	}
};