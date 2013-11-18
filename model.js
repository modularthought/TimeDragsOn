Time.M = {
	start: true, current: '', previous: '', currentS: '', previousS: '', xhr: '', json: [[]], jperiod: [], ejson: {}
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
	, setPeriods: function(xhr){
		var parsed = Time.M.jperiod = JSON.parse(xhr.responseText)
		var period = document.getElementById('periods');
		Time.M.loadJSON(Time.M.dotjson,Time.M.parseJSON);
		for (var i = 0, j = 0, k = 0, il = parsed.eons.length; i < il; i++) {
			var optN = document.createElementNS(Time.V.html,'option')
			optN.setAttribute('class','eon eon'+i)
			optN.setAttribute('disabled','disabled');
			optN.appendChild(document.createTextNode(parsed.eons[i][1]))
			period.appendChild(optN)
			for (var jl = parsed.eras.length; j < jl; j++) {
				var optA = document.createElementNS(Time.V.html,'option')
				optA.setAttribute('class','era eon'+i+' era'+j)
				optA.setAttribute('disabled','disabled')
				optA.appendChild(document.createTextNode(parsed.eras[j][1]))
				period.appendChild(optA)
				for (var kl = parsed.periods.length; k < kl; k++) {
					var optP = document.createElementNS(Time.V.html,'option')
					optP.setAttribute('class','eon'+i+' era'+j)
					optP.setAttribute('label', parsed.periods[k][0])
					optP.appendChild(document.createTextNode(parsed.periods[k][1]))
					period.appendChild(optP)
					if (parsed.periods[(k+1 < kl ? k+1 : k)][0] ==
						parsed.eras[(j+1 < jl ? j+1 : 0)][0]) {
						k++;
						break;
					}
				};
				if (j+1 == jl) {
					optP.setAttribute('class',optP.getAttribute('class')+' end')
				}
				if (parsed.eras[(j+1 < jl ? j+1 : j)][0] ==
					parsed.eons[(i+1 < il ? i+1 : 0)][0]) {
					optP.setAttribute('class',optP.getAttribute('class')+' end')
					j++;
					break;
				}
			};
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
		var opts = document.getElementById('periods').getElementsByTagName('option');
		for (var i = 0; i < opts.length; i++) {
			if (!+opts[i].label) continue;
			opts[i].selected = false;
			if (+opts[i].label - frame.num <= 0) {
				opts[i].selected = true;
				document.getElementById('tperiod').firstChild.nodeValue = opts[i].value;
				Time.V.centerText('tperiod',true)
			}
		};
		if (frame.bg) document.getElementById('svg_time_drag').style.backgroundColor = frame.bg;
		if (frame.stitch) {
			Time.M.previousS = Time.M.currentS;
			Time.M.currentS = document.getElementById('imgs'+frame.stitch.pad())
			Time.M.currentS.style.display = "block";
		} else {
			Time.M.currentS = '';
		}
		console.log('current: '+(Time.M.cfn))
		Time.V.showFrNum(adv);
	}
	, epilogue: function() {
	
		var use = Time.M.ejson.track.use, diff, fr = Time.M.ejson.track.fr;
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
		return diff || Time.M.ejson["seq"+use][fr];
	}
	, setTranslate: function(x,y) {
		var translate = 'translate('+x+','+y+')';
		Time.V.stitch.setAttribute('transform',translate);
		Time.V.frames.setAttribute('transform',translate);
	}
}
