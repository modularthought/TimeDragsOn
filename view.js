Time.View = {
	svg: 'http://www.w3.org/2000/svg', xlink: 'http://www.w3.org/1999/xlink'
	, html: 'http://www.w3.org/1999/xhtml'
	, url:
		location.protocol === 'https:' ? 'https://imgs.xkcd.com/comics/time/' :
			location.protocol === 'http:' ? 'http://imgs.xkcd.com/comics/time/' :
				'../../Pictures/Time/hash/'
	, urlf1: 'img/0001.png'
	, ready: false, blackflag: false
	, img: document.getElementById('images_group')
	, stitch: document.getElementById('stitch_group')
	, frames: document.getElementById('frames_group')
	, addStitch: function(frame){
		var screenW = screen.width, screenH = screen.height;
		var imgS = document.createElementNS(Time.View.svg,'image')
		, imgP = document.createElementNS(Time.View.svg,'polygon')
		, imgG = document.createElementNS(Time.View.svg,'g');
		imgP.setAttribute('points',
			((533-screenW)/2)+','+frame.stitch_obj.y1+
			' 0,'+frame.stitch_obj.y1+
			' '+frame.stitch_obj.width+','+frame.stitch_obj.y2+
			' '+(frame.stitch_obj.width+(screenW-533)/2)+','+frame.stitch_obj.y2+
			' '+(frame.stitch_obj.width+(screenW-533)/2)+','+(frame.stitch_obj.height-(screenH-395)/2)+
			' '+((533-screenW)/2)+','+(frame.stitch_obj.height-(screenH-395)/2));
		imgP.setAttribute('class','stitch_bg');
		imgG.appendChild(imgP);
		imgS.setAttributeNS(Time.View.xlink, 'href', 'img/'+frame.num.pad()+'_stitch.png');
		imgS.setAttribute('x',frame.stitch_obj.x);
		imgS.setAttribute('y',frame.stitch_obj.y);
		imgS.setAttribute('width',frame.stitch_obj.width);
		imgS.setAttribute('height',frame.stitch_obj.height);
		imgG.appendChild(imgS);

		imgG.setAttribute('id','imgs'+frame.num.pad());
		imgG.setAttribute('transform','translate(0,0)')
		Time.View.stitch.appendChild(imgG);
	}
	, addFrame: function(frame){
		var img = document.createElementNS(Time.View.svg,'image')
		img.setAttribute('transform','translate('+frame.x+','+frame.y+')');
		img.setAttribute('width',553);
		img.setAttribute('height',395);
		img.setAttribute('title',
			(frame.num >= 3089) ? "The end." :
			(frame.num > 3067) ? "..." :
			(frame.num > 2921) ? "RUN." :
			(frame.num == 2920) ? "..." :
			"Wait for it."
			);
		if (frame.stitch) {
			img.setAttribute('class','s'+frame.stitch);
		}
		img.setAttribute('id','imgf'+frame.num.pad());
		Time.View.frames.appendChild(img);
	}
	, addImage: function(frame){
		var img = document.getElementById('imgf'+frame.num.pad());
		img.setAttributeNS(Time.View.xlink, 'href', (frame.num === 1) ? Time.View.urlf1 :
											 Time.View.url+frame.hash+'.png');
		return img;
	}
	, displayPStat: function(paused) {
		var pauseStat = (paused) ? 'Paused' : 'Playing';
		document.getElementById('pauseStatus').firstChild.nodeValue = pauseStat;
	}
	, centerText: function(id,y){
		var t = document.getElementById(id);
		var tl = t.getComputedTextLength();
		t.setAttribute('x',window.innerWidth/2-tl/2)
		if (y) {
			t.setAttribute('y',window.innerHeight-6)
		}
	}
	, showFrNum: function(frame){
		document.getElementById('frame_text').firstChild.nodeValue = frame.num.pad();
		Time.View.centerText('tframe')
	}
	, showFrame: function(frame,o,prev){
		var end = prev;
		var adv = Time.Model.cfn;
		var json = Time.Model.json;
		if (frame.stitch && Time.Model.currentS.style.opacity == 0) {
			document.getElementById('imgs'+frame.stitch.pad()).style.opacity = (o >= 0 && o <= 100) ? o/100 : 1;
		}
		if (json[adv] && json[adv].end && json[adv].stitch ||
			Time.Model.currentS != Time.Model.previousS && Time.Model.previousS != ''
			&& Time.Model.previousS.style.opacity == 1) {
			end = true;
			if (Time.Model.currentS || Time.Model.previousS) (Time.Model.currentS || Time.Model.previousS).style.opacity = (end && (o >= 0 && o <= 100)) ? (100-o)/100 : 0;
		}
		document.getElementById('imgf'+frame.num.pad()).style.opacity = (end) ? (100-o)/100 : (o >= 0 && o <= 100) ? o/100 : 1;
	}
	, hideFrame: function(frame) {
		var adv = Time.Model.cfn;
		var json = Time.Model.json;
		if (Time.Model.start) {
			Time.Model.start = false;
		} else {
			if (!json[adv+1]) {
				Time.Model.start = true;
			}
			document.getElementById('imgf'+Time.Model.pfn.pad()).style.display = 'none';
			Time.Model.cfn += Time.Controller.shift;
		}
	}
	, delay: function() {
		var adv = Time.Model.cfn;
		var json = Time.Model.json;
		Time.Model.pfn = adv;
		Time.View.blackflag = false;
		Time.Controller.shift = 1;
		if (!json[adv+1]) return false;
		var wait = setTimeout(function(){
			if (!Time.Controller.pause) Time.View.iterate()
		}, Time.anim ? Time.delay : (100/Time.vel*Time.speed)+Time.delay)
		if (json[adv+1] && !json[adv+1].load) {
			clearInterval(wait);
			Time.View.ready = false;
			Time.View.cacheImg(json[adv+1])
		}
	}
	, next: function(frame) {
		var json = Time.Model.json;
		Time.Model.current.style.display = "block";
		Time.View.showFrame(frame);
		Time.View.hideFrame(json[Time.Model.cfn]);
		Time.View.delay();
	}
	, oAnim: function(frame,end) {
		var o = 0;
		Time.Model.current.style.display = "block";
		var sI = setInterval(function () {
			var json = Time.Model.json;
			Time.View.showFrame(frame,o,end);
			if ((o += Time.vel + Time.Controller.blur) > 100) {
				Time.View.hideFrame(json[Time.Model.cfn]);
				clearInterval(sI);
				Time.View.delay();
			}
		},Time.speed)
	}
	, cacheImg: function(img){
		if (img.load) return false;
		var limg = Time.View.addImage(img);
		limg.onload = function() {
			var json = Time.Model.json;
			delete limg.onload;
			img.load = true;
			if (!Time.View.ready && !Time.Controller.pause) {
				Time.View.ready = true;
				setTimeout(function(){Time.View.iterate()},500)
			}
			if (json[img.num+1]) {
				Time.View.cacheImg(json[img.num+1])
			} else {
				date2 = Date.now();
			}
		}
	}
	, iterate: function(){
		var adv = (Time.Model.cfn < 1) ? 1 : Time.Model.cfn;
		var json = Time.Model.json;
		Time.View.cacheImg(json[adv]);
		Time.View.blackflag = true;
		if (!json[adv-1 == 0 ? adv-2 : adv-1] && Time.Model.start) {
			Time.Model.setCurrent(json[adv]);
			Time.View.showFrNum(json[adv]);
			if (Time.anim){
				Time.View.oAnim(json[adv]);
			} else {
				Time.View.next(json[adv]);
			}
		} else if (json[adv+1]) {
			Time.Model.setCurrent(json[adv+1]);
			Time.View.showFrNum(json[adv+1]);
			if (Time.anim){
				Time.View.oAnim(json[adv+1]);
			} else {
				Time.View.next(json[adv+1]);
			}
		}
	}
}
