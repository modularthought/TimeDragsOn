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
		var framesizex = 553, framesizey = 395;
		var imgG = document.createElementNS(Time.V.svg,'g')
		, imgP = document.createElementNS(Time.V.svg,'path')
		, imgS;
		imgP.setAttribute('d',
		
			'M'+((framesizex-screenW)/2-frame.stitch_obj.x-4)+','+frame.stitch_obj.y1+
		
			'L0,'+frame.stitch_obj.y1+
		
			'L'+(frame.stitch_obj.width || framesizex)+','+frame.stitch_obj.y2+
		
			'L'+((frame.stitch_obj.width || framesizex)+(screenW-framesizex)/2+frame.stitch_obj.x+2)+','+frame.stitch_obj.y2+
		
			'L'+((frame.stitch_obj.width || framesizex)+(screenW-framesizex)/2+frame.stitch_obj.x+2)+','+(framesizey+(screenH-framesizey)/2+frame.stitch_obj.y*-1+2)+
		
			'L'+((framesizex-screenW)/2-frame.stitch_obj.x-4)+','+(framesizey+(screenH-framesizey)/2+frame.stitch_obj.y*-1+2))+'Z';
	
		imgP.setAttribute('class','stitch_bg');
		imgG.appendChild(imgP);
		if (frame.stitch_obj.width) {
			imgS = document.createElementNS(Time.V.svg,'image')
			imgS.setAttributeNS(Time.V.xlink, 'href', 'img/s'+frame.num.pad()+'.png');
			imgS.setAttribute('width',frame.stitch_obj.width);
			imgS.setAttribute('height',frame.stitch_obj.height);
			imgG.appendChild(imgS);
			imgG.classList.add("sdrag");
		}
		imgG.setAttribute('id','imgs'+frame.num.pad());
		imgG.setAttribute('transform','translate('+(frame.stitch_obj.x+2)+','+(frame.stitch_obj.y-2)+')')
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
			if (Time.M.json[frame.stitch].stitch_obj.width) {
				img.classList.add("sdrag");
			}
		}
		img.setAttribute('id','imgf'+frame.num.pad());
		Time.V.frames.appendChild(img);
	}
	, addImage: function(frame){
		var img = new Image();
		var image = document.getElementById('imgf'+frame.num.pad());
		image.setAttributeNS(Time.V.xlink, 'href', img.src = (frame.num === 1) ? Time.V.urlf1 :
											 Time.V.url+frame.hash+'.png');
		return img;

	
	
	
	
	
	
	}
	, togglePShow: function(show) {
		var p = document.getElementById('periods');
		if (show) {
			p.addEventListener('mouseup', Time.C.skipViaSelect, false);
			p.addEventListener('mousedown', Time.C.setMenuDrag, false);
			p.style.display = "block";
		} else {
			p.removeEventListener('mouseup', Time.C.skipViaSelect, false);
			p.removeEventListener('mousedown', Time.C.setMenuDrag, false);
			p.style.display = "none";
		}
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
		document.getElementById('tframe').removeAttribute('style');
		document.getElementById('frame_text').firstChild.nodeValue = frame.num.pad();
	
	
	}
	, showFrame: function(adv,o,prev){
		var end = prev;
		var adv = Time.M.cfn;
		var json = Time.M.json;
		if (json[adv].stitch && Time.M.currentS.style.opacity == 0) {
		
			Time.M.setTranslate(Time.M.resX,Time.M.resY);
			Time.M.currentS.style.opacity = (o >= 0 && o <= 100) ? o/100 : 1;
		}
		if (Time.M.previousS != '' &&
			Time.M.currentS != Time.M.previousS &&
			Time.M.previousS.style.opacity == 1) {
			end = true;
			if (Time.M.previousS) {
				Time.M.previousS.style.opacity = (end && (o >= 0 && o <= 100)) ? (100-o)/100 : 0;
			}
		}
		if (Time.M.currentS != Time.M.previousS){
			Time.M.setTranslate(Time.M.resX,Time.M.resY);
		}
		Time.M.current.style.opacity = (end && (o >= 0 && o <= 100)) ? (100-o)/100 : (o >= 0 && o <= 100) ? o/100 : 1;
	}
	, hideFrame: function() {
		var json = Time.M.json;
		if (Time.M.pfn) {
			
			Time.M.previous.removeAttribute('style');
		}
		if (!json[Time.M.cfn].bg) document.getElementById('svg_time_drag').removeAttribute('style');
		if (Time.M.currentS != Time.M.previousS && Time.M.previousS != '') {
			Time.M.previousS.removeAttribute('style');
		}
	}
	, delay: function() {
		var json = Time.M.json;
		var adv = Time.M.cfn;
		Time.M.pfn = adv;
		Time.M.setPrevious();
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
		if(adv!=Time.M.pfn) Time.V.hideFrame(adv);
		Time.V.delay(adv);
	}
	, oAnim: function(adv) {
		var o = 0;
		var sI = setInterval(function () {
			Time.V.showFrame(adv,o,Time.M.cfn<Time.M.pfn);
			if ((o += Time.vel + Time.C.blur) > 100) {
				if(adv!=Time.M.pfn) Time.V.hideFrame(adv);
				clearInterval(sI);
				Time.V.delay(adv);
			}
		},Time.speed)
	}

	, cacheImg: function(img){
		var cimg = Time.V.addImage(img);
		cimg.addEventListener("load", function() {
		
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
			} else {
				date2 = Date.now();
				
			}
		}, false);
	}
	, epirate: function(){
		if (Time.M.cfn < 3090 || Time.M.cfn < Time.M.json.length && Time.C.shift < 1) {
			clearInterval(Time.V.stopIterate);
			Time.M.cfn -= 1;
			Time.M.epimode = false;
			Time.V.iterate();
		} else {
			Time.M.epimode = true;
			Time.M.cfn = Time.M.epilogue();
		}
	}
	, iterate: function(){
		var json = Time.M.json;
		Time.M.cfn += Time.C.shift;
		if (Time.M.epimode || Time.M.cfn > Time.M.json.length-1) {
			if (true) {
				Time.V.epirate();
			} else {
				Time.M.cfn = Time.M.json.length-1;
				Time.M.pfn = 0;
			}
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
