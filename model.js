Time.M = {
	start: true, current: '', previous: '', currentS: '', previousS: '', xhr: '', json: [[]], jperiod: []
	, cfn: 0, pfn: 0, dotjson: 0, jsonlen: 15
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
	, setPeriods: function(xhr){
		var parsed = Time.M.jperiod = JSON.parse(xhr.responseText)
		var period = document.getElementById('periods');
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
		if (frame.stitch) {
			Time.M.previousS = Time.M.currentS;
			Time.M.currentS = document.getElementById('imgs'+frame.stitch.pad())
		} else {
			Time.M.currentS = '';
		}
		Time.V.showFrNum(adv);
	}
	, setTranslate: function(x,y) {
		var translate = 'translate('+x+','+y+')';
		Time.V.stitch.setAttribute('transform',translate);
		Time.V.frames.setAttribute('transform',translate);
	}
}