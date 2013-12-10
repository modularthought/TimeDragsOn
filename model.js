Time.M = {
	start: true, current: '', previous: '', currentS: '', previousS: '', xhr: '', ph: 0, json: [[]], jperiod: [], ejson: {}


	, cfn: 0, pfn: 0, dotjson: 0, jsonlen: 15, epimode: false
	
	, resX: 0, resY: 0
	, load: function(){
	
		if (++Time.M.dotjson < Time.M.jsonlen) {
			for (var i = Time.M.jperiod.eras[Time.M.dotjson-1][0]; i < Time.M.jperiod.eras[Time.M.dotjson][0]; i++) {
				Time.V.addFrame(Time.M.json[i]);
				if (Time.M.json[i].stitch_obj) {
					Time.V.addStitch(Time.M.json[i]);
				}
			};
		
			Time.M.loadJSON(Time.M.dotjson,Time.M.parseJSON);
		} else {
			for (var i = Time.M.jperiod.eras[Time.M.jperiod.eras.length-1][0]; i < Time.M.json.length; i++) {
				Time.V.addFrame(Time.M.json[i]);
				if (Time.M.json[i].stitch_obj) {
					Time.V.addStitch(Time.M.json[i]);
				}
			};
		
		
			Time.V.iterate();
			Time.M.loadJSON("epilogue",Time.M.setEpilogue);
		}
	}
	, loadJSON: function(json,fn){
		var xhr = new XMLHttpRequest();
		xhr.open('GET','json/'+json+'.json',true);
		xhr.onreadystatechange = function(){
			if (xhr.readyState === 4) {
				fn(xhr);
			}
		};
		xhr.send(null);
	}
	, parseJSON: function(xhr){
		var parsed = JSON.parse(xhr.responseText)
		if (Time.M.cfn == 0) {
			Time.M.json[0].push(parsed[0].num)
		
		}
		for (var i = 0; i < parsed.length; i++) {
		
			Time.M.json[parsed[i].num] = parsed[i];
		}
	
		Time.M.load();
	}
	, setEpilogue: function(xhr){
		var parsed = Time.M.ejson = JSON.parse(xhr.responseText)
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 24; j++) {
				Time.M.ejson["seq"+i][j] = parsed.def[parsed["seq"+i][j]];
			}
		}
		for (var k = 0; k < parsed.use.length; k++) {
			if (parsed.use[k][2]) {
				Time.M.ejson.use[k][2] = parsed.def[parsed.use[k][2]];
			}
		}
		Time.M.ejson.track = {use:0,fr:parsed.use[0][3],it:parsed.use[0][1],first:true};
	}
	, loadPeriods: function(xhr){
		var parsed = Time.M.jperiod = JSON.parse(xhr.responseText)
		Time.M.loadJSON(Time.M.dotjson,Time.M.parseJSON);
		Time.M.setPeriods(parsed);
	}
	, setPeriods: function(parsed){
		var period = document.getElementById('periods');
		var iit0 = 0, iit1 = 0, iit2 = 0;
		for (var i = 0, j = 0, k = 0, il = parsed.eons.length; i < il; i++) {
			var optN = document.createElementNS(Time.V.svg,'g')
			optN.setAttribute('class','eon eon'+i)
			optN.setAttribute('id','eon'+i)
			var optNR1 = document.createElementNS(Time.V.svg,'rect')
			optNR1.setAttribute('width',543)
			optNR1.setAttribute('height',23)
			optNR1.setAttribute('x',2)
			optNR1.setAttribute('y',2)
			optN.appendChild(optNR1)
			var optNR2 = document.createElementNS(Time.V.svg,'rect')
			optNR2.setAttribute('width',547)
			optNR2.setAttribute('class','eons')
			optN.appendChild(optNR2)
			var optNT = document.createElementNS(Time.V.svg,'text')
			optNT.setAttribute('x',275)
			optNT.setAttribute('y',17)
			optNT.appendChild(document.createTextNode(parsed.eons[i][1]))
			for (var jit = 25, jl = parsed.eras.length; j < jl; j++) {
				
				var optA = document.createElementNS(Time.V.svg,'g')
				optA.setAttribute('class','era eon'+i+' era'+j)
				optA.setAttribute('id','era'+j)
				optA.setAttribute('transform','translate('+0+','+jit+')');
				var optAR = document.createElementNS(Time.V.svg,'rect')
				optAR.setAttribute('width',543)
				optAR.setAttribute('height',20)
				optAR.setAttribute('x',2)
				optA.appendChild(optAR)
				var optAT = document.createElementNS(Time.V.svg,'text')
				optAT.setAttribute('x',5)
				optAT.setAttribute('y',14)
				optAT.appendChild(document.createTextNode(parsed.eras[j][1]))
				optA.appendChild(optAT)
				for (var kit = 20, kl = parsed.periods.length; k < kl; k++) {
					var optP = document.createElementNS(Time.V.svg,'g')
					optP.setAttribute('class','eon'+i+' era'+j+' option')
					optP.setAttribute('id','p'+k+'f'+parsed.periods[k][0])
					optP.setAttribute('transform','translate('+0+','+kit+')');
					var optPR = document.createElementNS(Time.V.svg,'rect')
					optPR.setAttribute('width',543)
					optPR.setAttribute('height',17)
					optPR.setAttribute('x',2)
					optP.appendChild(optPR)
					var optPT = document.createElementNS(Time.V.svg,'text')
					optPT.setAttribute('x',5)
					optPT.setAttribute('y',13)
					optPT.appendChild(document.createTextNode(parsed.periods[k][1]))
					optP.appendChild(optPT)
					optA.appendChild(optP)
					kit += 17;
					if (parsed.periods[(k+1 < kl ? k+1 : k)][0] ==
						parsed.eras[(j+1 < jl ? j+1 : 0)][0]) {
						k++;
						break;
					}
				};
				jit += kit;

				optN.appendChild(optA)
				if (parsed.eras[(j+1 < jl ? j+1 : j)][0] ==
					parsed.eons[(i+1 < il ? i+1 : 0)][0]) {
					j++;
					break;
				}
			};
			var pushDown = 0;
			if (i == 0) {
				iit0 += jit;
			} else if (i == 1) {
				iit1 += jit;
			} else if (i == 2) {
				iit2 += jit;
			}
			optN.appendChild(optNT)
			if (i == 0) {
				pushDown = 0;
			} else if (i == 1) {
				pushDown = iit0+6;
			} else if (i == 2) {
				pushDown = iit0 + iit1+12;
			}
			optN.setAttribute('transform','translate('+2+','+(2+pushDown)+')');
			optNR2.setAttribute('height',(jit+2))
			period.appendChild(optN)
		}
	}
	, setCurrent: function(){
		var json = Time.M.json;
		var adv = Time.M.cfn;
		var frame = json[adv]
		Time.M.current = document.getElementById('imgf'+frame.num.pad())
		Time.M.previous = document.getElementById('imgf'+Time.M.pfn.pad());
		Time.M.current.style.display = "block";
		Time.M.resX = frame.x*-1;
		Time.M.resY = frame.y*-1;
		for (var i = 0, il = Time.M.jperiod.periods.length; i < il; i++) {
			if (Time.M.jperiod.periods[i][0] - frame.num - 1 < 0) {
				document.getElementById('tperiod').firstChild.nodeValue = Time.M.jperiod.periods[i][1];
			}
			if (Time.M.jperiod.periods[i][0] - frame.num - 1 == 0) break;
		};
		if (frame.bg) document.getElementById('svg_time_drag').style.backgroundColor = frame.bg;
		if (frame.stitch) {
			Time.M.currentS = document.getElementById('imgs'+frame.stitch.pad())
			Time.M.currentS.style.display = "block";
		} else {
			Time.M.currentS = '';
		}
		
		Time.V.showFrNum(adv);
	}
	, setPrevious: function(){
		var json = Time.M.json;
		var adv = Time.M.cfn;
		var frame = json[adv]
		if (frame.stitch) {
			Time.M.previousS = Time.M.currentS;
		}
	}
	, epilogue: function() {
		var use = Time.M.ejson.use[Time.M.ejson.track.use][0], diff, fr = Time.M.ejson.track.fr;
		if (++Time.M.ejson.track.fr == 24) {
			Time.M.ejson.track.fr = 0;
			if (--Time.M.ejson.track.it == 0) {
				if (++Time.M.ejson.track.use == Time.M.ejson.use.length) {
				
					Time.M.ejson.track.use = Time.M.ejson.use.length-4;
				}
				Time.M.ejson.track.fr = Time.M.ejson.use[Time.M.ejson.track.use][3]||0;
				if (Time.M.ejson.use[Time.M.ejson.track.use][2]) {
					diff = Time.M.ejson.use[Time.M.ejson.track.use][2];
				}
				Time.M.ejson.track.it = Time.M.ejson.use[Time.M.ejson.track.use][1];
			}
		}
		if (Time.M.ejson.track.first) {
			diff = Time.M.ejson.use[Time.M.ejson.track.use][2];
			Time.M.ejson.track.first = false;
		}
		return diff || Time.M.ejson[use][fr];
	}
	, setTranslate: function(x,y) {
		var translate = 'translate('+x+','+y+')';
		Time.V.stitch.setAttribute('transform',translate);
		Time.V.frames.setAttribute('transform',translate);
	}
}
