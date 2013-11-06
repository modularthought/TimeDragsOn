Time.V = {
	svg: 'http://www.w3.org/2000/svg', xlink: 'http://www.w3.org/1999/xlink'
	, html: 'http://www.w3.org/1999/xhtml'
	, url:
		location.protocol === 'https:' ? 'https://imgs.xkcd.com/comics/time/' :
			location.protocol === 'http:' ? 'http://imgs.xkcd.com/comics/time/' :
				'../../Pictures/Time/hash/'
	, urlf1: 'img/0001.png'
	, ready: false, blackflag: false, stopIterate: ''
	, img: document.getElementById('images_group')
	, stitch: document.getElementById('stitch_group')
	, frames: document.getElementById('frames_group')
	, addStitch: function(frame){
		var screenW = screen.width, screenH = screen.height;
		var imgS = document.createElementNS(Time.V.svg,'image')
		, imgP = document.createElementNS(Time.V.svg,'polygon')
		, imgG = document.createElementNS(Time.V.svg,'g');
		imgP.setAttribute('points',
			((533-screenW)/2)+','+frame.stitch_obj.y1+
			' 0,'+frame.stitch_obj.y1+
			' '+frame.stitch_obj.width+','+frame.stitch_obj.y2+
			' '+(frame.stitch_obj.width+(screenW-533)/2)+','+frame.stitch_obj.y2+
			' '+(frame.stitch_obj.width+(screenW-533)/2)+','+(frame.stitch_obj.height-(screenH-395)/2)+
			' '+((533-screenW)/2)+','+(frame.stitch_obj.height-(screenH-395)/2));
		imgP.setAttribute('class','stitch_bg');
		imgG.appendChild(imgP);
		imgS.setAttributeNS(Time.V.xlink, 'href', 'img/'+frame.num.pad()+'_stitch.png');
		imgS.setAttribute('x',frame.stitch_obj.x);
		imgS.setAttribute('y',frame.stitch_obj.y);
		imgS.setAttribute('width',frame.stitch_obj.width);
		imgS.setAttribute('height',frame.stitch_obj.height);
		imgG.appendChild(imgS);
		imgG.setAttribute('id','imgs'+frame.num.pad());
		imgG.setAttribute('transform','translate(0,0)')
		Time.V.stitch.appendChild(imgG);
	}
	, addFrame: function(frame){
		var img = document.createElementNS(Time.V.svg,'image')
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
		Time.V.frames.appendChild(img);
	}
	, addImage: function(frame){
		var img = document.getElementById('imgf'+frame.num.pad());
		img.setAttributeNS(Time.V.xlink, 'href', (frame.num === 1) ? Time.V.urlf1 :
											 Time.V.url+frame.hash+'.png');
		return img;
	}
	, displayPStat: function(paused) {
		document.getElementById('pauseStatus').firstChild.nodeValue = (paused) ? 'Paused' : 'Playing';
	}
	, displayCStat: function() {
		document.getElementById('pauseStatus').firstChild.nodeValue = 'Caching';
	}
	, centerText: function(id,y){
		var t = document.getElementById(id);
		var tl = t.getComputedTextLength();
		t.setAttribute('x',window.innerWidth/2-tl/2)
		if (y) {
			t.setAttribute('y',window.innerHeight-6)
		}
	}
	, showFrNum: function(adv){
		var json = Time.M.json;
		var frame = json[adv]
		document.getElementById('frame_text').firstChild.nodeValue = frame.num.pad();
		Time.V.centerText('tframe')
	}
	, showFrame: function(adv,o,prev){
		var end = prev;
		var adv = Time.M.cfn;
		var json = Time.M.json;
		if (json[adv].stitch && Time.M.currentS.style.opacity == 0) {
			Time.M.setTranslate(Time.M.resX,Time.M.resY);
			Time.M.currentS.style.opacity = (o >= 0 && o <= 100) ? o/100 : 1;
		}
		if (Time.M.currentS != Time.M.previousS && Time.M.previousS != ''
			&& Time.M.previousS.style.opacity == 1) {
			end = true;
			Time.M.setTranslate(Time.M.resX,Time.M.resY);
			if (Time.M.currentS || Time.M.previousS) (Time.M.currentS || Time.M.previousS).style.opacity = (end && (o >= 0 && o <= 100)) ? (100-o)/100 : 0;
		}
		Time.M.current.style.opacity = (end) ? (100-o)/100 : (o >= 0 && o <= 100) ? o/100 : 1;
	}
	, hideFrame: function() {
		var json = Time.M.json;
		if (Time.M.pfn) {
			Time.M.previous.removeAttribute('style');
		}
	}
	, delay: function() {
		var json = Time.M.json;
		var adv = Time.M.cfn;
		Time.M.pfn = adv;
		Time.C.shift = 1;
		Time.V.blackflag = false;
		Time.V.stopIterate = setTimeout(function(){
			if (!Time.C.pause) Time.V.iterate()
		}, Time.anim ? Time.delay : (100/Time.vel*Time.speed)+Time.delay);
		if (json[adv+Time.C.shift] && !json[adv+Time.C.shift].load) {
			clearInterval(Time.V.stopIterate);
			Time.V.ready = false;
			Time.V.blackflag = false;
			Time.V.cacheImg(json[adv+Time.C.shift])
		}
	}
	, next: function(adv) {
		Time.V.showFrame(adv);
		Time.V.hideFrame(adv);
		Time.V.delay(adv);
	}
	, oAnim: function(adv) {
		var o = 0;
		var sI = setInterval(function () {
			Time.V.showFrame(adv,o,Time.M.cfn<Time.M.pfn);
			if ((o += Time.vel + Time.C.blur) > 100) {
				Time.V.hideFrame(adv);
				clearInterval(sI);
				Time.V.delay(adv);
			}
		},Time.speed)
	}
	, cacheImg: function(img){
		var limg = Time.V.addImage(img);
		limg.onload = function() {
			delete limg.onload;
			var json = Time.M.json;
			img.load = true;
			if (!Time.V.ready && !Time.C.pause) {
				Time.V.ready = true;
				Time.V.displayPStat(false);
				setTimeout(function(){
					clearInterval(Time.V.stopIterate);
					Time.M.cfn -= 1;
					Time.V.iterate();
				},500)
			}
			if (json[img.num+1] && !json[img.num+1].load) {
				Time.V.cacheImg(json[img.num+1])
			}
		}
	}
	, iterate: function(){
		var json = Time.M.json;
		Time.M.cfn += Time.C.shift;
		if (Time.M.cfn > Time.M.json.length-1) {
			Time.M.cfn = Time.M.json.length-1;
			Time.M.pfn = 0;
		} else if (Time.M.cfn < 1) {
			Time.M.cfn = 1;
			Time.M.pfn = 0;
		}
		var adv = Time.M.cfn;
		if (json[adv] && !json[adv].load) {
			Time.V.displayCStat();
			Time.V.cacheImg(json[adv]);
		} else {
			Time.M.setCurrent();
			Time.V.blackflag = true;
			if (Time.anim){
				Time.V.oAnim(adv);
			} else {
				Time.V.next(adv);
			}
		}
	}
}