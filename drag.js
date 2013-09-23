"use strict";
var tj, http=new XMLHttpRequest();

/* Time object, holds all data/fn */
var Time = {
	start: true, pause: false, adv: 0, stitch: false
	, svg: 'http://www.w3.org/2000/svg', xlink: 'http://www.w3.org/1999/xlink'
	, furl:
	location.protocol == 'https:' ? 'https://imgs.xkcd.com/comics/time/' :
		location.protocol == 'http:' ? 'http://imgs.xkcd.com/comics/time/' :
			'../../Pictures/Time/hash/'
	, f1url: 'img/0001.png'
	/* vel=opacity steps, speed=interval speed, delay=time between frames */
	, vel: 5, speed: 10, delay: 2000
	/* reset x,y to current frame orientation; set x,y when new orientation occurs */
	, resX: 0, resY: 0
	, json: function(json){
		loadJSON('json/'+json+'.json',function(json){
				return JSON.parse(json);
			}
		);
	}
	, load: function(json){
		var addTo = document.getElementById('frames_group');
		if (json[0].stitch) {
			Time.stitch=true
			var imgS = document.createElementNS(this.svg,'image');
			imgS.setAttributeNS(this.xlink, 'href', 'img/'+json[0].stitch.use+'_stitch.png');
			imgS.setAttribute('x',json[0].stitch.x);
			imgS.setAttribute('y',json[0].stitch.y);
			imgS.setAttribute('width',json[0].stitch.width);
			imgS.setAttribute('height',json[0].stitch.height);
			imgS.setAttribute('id','imgs'+json[0].stitch.use);
			document.getElementById('stitch_group').appendChild(imgS);
		} else {Time.stitch=false}
		for (var i = 0; i < json.length; i++) {
			var img = document.createElementNS(this.svg,'image')
			img.setAttributeNS(this.xlink, 'href', ((json[i].num == "0001") ? f1url :
												 this.furl+json[i].hash+'.png'))
			var x = Time.stitch ? json[i].x : 0;
			var y = Time.stitch ? json[i].y : 0;
			img.setAttribute('transform','translate('+x+','+y+')');
			img.setAttribute('width',553);
			img.setAttribute('height',395);
			img.setAttribute('id','imgf'+json[i].num);
			addTo.appendChild(img);
		};
	}
	, recur: function(a){
		var o = 0;
		if (this.start) {
			this.start=false;
			var sIs = setInterval(function () {
				document.getElementById('imgf'+tj[Time.adv].num).style.opacity = (o)/100;
				if ((o+=Time.vel)>100) {
					clearInterval(sIs);
					setTimeout(function(){Time.recur(tj)},Time.delay)
				}
			},this.speed)
		} else if (!a[this.adv+1]){ // end
			this.start=true;
			if (false) {
				var sIe = setInterval(function () {
					document.getElementById('imgf'+tj[Time.adv].num).style.opacity = (100-o)/100;
					if ((o+=Time.vel)>100) clearInterval(sIe);
				},this.speed)
			}
		} else {
			var sI = setInterval(function () {
				var cur = document.getElementById('imgf'+tj[Time.adv+1].num)
				if (Time.stitch) {
					Time.resX = cur.getAttribute('transform').match(/([\d.-]+),/)[1]*-1+1;
					Time.resY = cur.getAttribute('transform').match(/,([\d.-]+)/)[1]*-1-2;
				}
				cur.style.opacity = (o)/100;
				if ((o+=Time.vel)>100) {
					document.getElementById('imgf'+tj[Time.adv].num).style.display = 'none';
					clearInterval(sI);
					var sT = setTimeout(function(){++Time.adv;Time.recur(tj)},Time.delay)
					if (Time.pause) clearTimeout(sT);
				}
			},this.speed)
		}
	}
	, startdrag: function(e,t) {
		t = document.getElementById('stitch_group');
		if (!e) e = event;
		if (e.preventDefault) e.preventDefault();
		e.cancelBubble = false;
		window.document.dragged = t;
		if (t.getElementsByTagName('image')[0]) {
			t.width = t.getElementsByTagName('image')[0].width.baseVal.value;
			t.height = t.getElementsByTagName('image')[0].height.baseVal.value;
		} else {
			t.width = 553;
			t.height = 395;
		}
		t.dragX = e.clientX || 0;
		t.dragY = e.clientY || 0;
		if (t.dragX == 0) {
			Time.dodrag(e);
		} else {
			window.document.addEventListener('mousemove', Time.dodrag, false);
			window.document.addEventListener('mouseup', Time.stopdrag, false);
		}
		return false;
	}

	, dodrag: function(e) {
		var t, d;
		if (!e) e = event;
		t = window.document.dragged;
		d = document.getElementById('frames_group');
		var x = ((+t.getAttribute('transform').match(/\(([-\d.]+)/)[1]||0)+
				(e.clientX || e.x || 0) - t.dragX)
		, y = ((+t.getAttribute('transform').match(/,([-\d.]+)/)[1]||0)+
					(e.clientY || e.y || 0) - t.dragY)
/* translate x =
			check right limit
						  check left limit
						  					else leave alone */
		x = (x > 0) ? 0 : (x < -t.width+553-2) ? -t.width+553-2 : x
/* translate y =
			check bottom limit
						  					check top limit
						  									else leave alone */
		y = (y > t.height-395+2) ? t.height-395+2 :  (y < 0) ? 0 : y
		if (!Time.stitch) {
			x=y=0;
		}
		t.setAttribute('transform','translate('+x+','+y+')');
		d.setAttribute('transform','translate('+x+','+y+')');
		t.dragX = e.clientX;
		t.dragY = e.clientY;
		return false;
	}

	//remove event-handlers
	, stopdrag: function(e) {
		window.document.removeEventListener('mousemove', Time.dodrag, false);
		window.document.removeEventListener('mouseup', Time.stopdrag, false);
		if (!e) e = event;
	   var yo = e.target, targetEl = yo;
	}
	, keyFn: function(e) {
		if (!e) e = event;
		if (!e.altKey && (e.keyCode <= 40 && e.keyCode >= 37)) {
			e.cancelBubble = false;
			e.x=e.y=0;
			if (e.ctrlKey) {

			} else {
				switch (e.keyCode) {
					case 37: e.x = -1;
					break;
					case 38: e.y = -1;
					break;
					case 39: e.x = 1;
					break;
					case 40: e.y = 1;
					break;
				}
				if (e.shiftKey) e.x*=10,e.y*=10;
				Time.startdrag(e);
			}
		} else if (!e.altKey && !e.shiftKey && !e.ctrlKey && (e.keyCode == 32)) {
			// insert pause/play /use space bar
		} else if (!e.altKey && !e.shiftKey && e.ctrlKey && (e.keyCode == 90)) {
			// reset with ctrl+z
			document.getElementById('stitch_group').setAttribute('transform','translate('+Time.resX+','+Time.resY+')');
			document.getElementById('frames_group').setAttribute('transform','translate('+Time.resX+','+Time.resY+')');
		}
		return false;
	}
}
function loadJSON(file,fn){
	if(!http)return false;
	http.open('GET',file,true);
	http.onreadystatechange=function(){
		// readyState needs investigated, to find console "syntax error" in json file
		if(http.readyState==4&&fn){
			tj = fn(http.responseText);
			Time.load(tj);
			document.getElementById('images_group').addEventListener('mousedown', Time.startdrag, false);

			setTimeout(function(){Time.recur(tj)},500)

			window.document.addEventListener('keydown', Time.keyFn, false);
		}
	};
	http.send(null);
}
Time.json('2552');
