if(!String.prototype.trim){
    String.prototype.trim=function(){
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
    };
}
var Ajax = {
    request : function (url,method, data,success,failure){
        var xhr = window.ActiveX ? new ActiveXObject("Microsoft.XMLHTTP"): new XMLHttpRequest();
        method = method.toUpperCase();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200){
                // the request is complete, parse data and call callback
                var response = JSON.parse(xhr.responseText);
                typeof success === "undefined"? true : success(response);
            }else if (xhr.readyState === 4) { // something went wrong but complete
                typeof failure === "undefined"? true : failure(); 
            }
        };
        xhr.open(method,url,true);
        if (method === "POST"){
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			if (typeof data === "string"){
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			}
            xhr.send(data);
        }else {
            xhr.send();
        }
    }
};

function getCoord(theta,index){
	var deg = (theta * (index +1)) + Math.PI; // Added Pi to reverse
	return [Math.cos(deg),Math.sin(deg)];
}
function toDegrees(angle){
	return angle * (180 / Math.PI);
}
function toRadians(angle){
	return angle * (Math.PI / 180);
}

function getRotation(x,y,center){
	var deltaX = center.x - x,
		deltaY = center.y - y,
		thetaRad = Math.atan2(deltaY,deltaX); // angle between points
		deg = Math.round(toDegrees(thetaRad));
	deg = deg >= 0? deg: 360 + deg;
	return deg;
}

var getRandIntInclusive = (function(){
	// using safe rand
	// https://stackoverflow.com/questions/18230217/javascript-generate-a-random-number-within-a-range-using-crypto-getrandomvalues
	if (window.crypto && window.crypto.getRandomValues){
		return function(min,max){
			var randomBuffer = new Uint32Array(1);
		    window.crypto.getRandomValues(randomBuffer);
		    var randomNumber = randomBuffer[0] / (0xffffffff + 1);
		    min = Math.ceil(min);
		    max = Math.floor(max);
		    return Math.floor(randomNumber * (max - min + 1)) + min;
		};
	}
	return function(min,max){
		return Math.floor(Math.random() * (max - min +1)) +min;
	};
})();


var sdom = {
	init:function(){

	},
    byClass : (function(){
        if ("getElementsByClassName" in document){
            return function(cl,ctx){return (ctx || document).getElementsByClassName(cl);};
        }
        return function(cl,ctx){
			var d = ctx || document;
            var all = d.getElementsByTagName("*"),
            i = 0, l = all.length, elems = [];
            for(;i<l;i++){
                if (all[i].className.indexOf(cl) !== -1){
                    elems.push(all[i]);
                }
            }
            return elems;
        };
    })(),
   
    serialize: function(form) {
        var strArr = [];
        for(var i = 0,l = form.length; i<l;i++){
            if (form[i].name && form[i].type !== "submit"){
                strArr.push(encodeURIComponent(form[i].name)+"="+encodeURIComponent(form[i].value));
            }
        }
        return strArr.join("&");
    },
	query : (function(){
		var get = {
			push:function (key,value){
				var cur = this[key];
				if (cur.isArray){
					this[key].push(value);
				}else {
					this[key] = [];
					this[key].push(cur);
					this[key].push(value);
				}
			}
		},
		search = document.location.search,
		decode = function (s,boo) {
			var a = decodeURIComponent(s.split("+").join(" "));
	        return boo? a.replace(/\s+/g,''):a;
	    };
		search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function (a,b,c) {
			if (get[decode(b,true)]){
				get.push(decode(b,true),decode(c));
			}else {
				get[decode(b,true)] = decode(c);
			}
		});
		return get;
	})(),
	
	post: function(option){
		if (!option.url || !option.data){
			alert("Error in Ajax POST Call");
			return ;
		}
		Ajax.request(option.url,"POST",option.data,option.success,option.error);
		return true;
	},
	
	get: function(option){
		if (!option.url){
			alert("Error in Ajax GET Call");
			return ;
		}
		Ajax.request(option.url,"GET",option.data,option.success,option.error);
		return true;
	},
	addEvent: (function(){
		
		if (window.addEventListener){
			return function(object,event,fn){
				object.addEventListener(event,fn,false);
			};
		}
		return function(object,event,fn){
			object.attachEvent('on'+event,function(e){
				var ev = e || window.event;
				ev.target = ev.srcElement;
				ev.currentTarget = object;
				ev.preventDefault = ev.preventDefault ||function(){ev.returnValue = false;};
				ev.stopPropagation= ev.stopPropagation||function(){ev.cancelBubble = true;};
				fn.call(object,ev);
			});
		};
	})(),
	removeEvent:(function(){
		if (window.removeEventListener){
			return function(object,event,fn){
				object.removeEventListener(event,fn,false);
			};
		}
		return function(object,event,fn){
			object.detachEvent('on'+event,fn);
		};
	})(),
	
	load:function(fn){
		this.addEvent(window,"load",fn);
	}
};

sdom.namespaces = {};

sdom.register = function(namespace,fn){
	if (!this.namespaces[namespace]){
		this.namespaces[namespace] = [];
	}
	this.namespaces[namespace].push(fn);
};
sdom.trigger = function(id){
	if (this.namespaces[id]){
		for(var i = 0,l = this.namespaces[id].length;i< l;i++)
		this.namespaces[id][i].call();
		return ;
	}
	console.log(id+" trigger not defined");
};

sdom.load(function(){
	sdom.init();
});