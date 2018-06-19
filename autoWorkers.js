
var name = "";

var threadId;

var _SEC = 8; //<------second

var _nightBattle = false;
var _bossMode = true;
var _armorEnemy = false;
var _dodgeEnemy = false;


var buffer = 0.9;
var startTime;
var started = false;
var jobId = 0;

var firstCharId = null;
var $ = function(input) {
		
		if (input == ".battle_control .enemyDodge") {
			return { 
					val: function(){ return (_dodgeEnemy?"81":"10"); } 
				   }; 
		} else if (input == ".battle_control .enemyArmor") {
			return { 
					val: function(){ return (_armorEnemy?"100":"0"); } 
				   }; 
		} else if (input == ".battle_control .enemyCount") {
			return { 
					val: function(){ return "1"; } 
				   }; 
		} else if (input == '.battle_control .battleFortress') {
			return { 
					is: function(){ return false; } 
				   }; 
		} else if (input == '.battle_control .fortress_level') {
			return { 
					val: function(){ return "10"; } 
				   }; 
		} else if (input == '.battle_control .battleisNight') {
			return { 
					is: function(){ return _nightBattle; } 
				   }; 
		} else if (input == '.battle_control .enemyEliteTarget') {
			return { 
					is: function(){ return _bossMode; } 
				   }; 
		} else {
			if (input != "") {
				console.log(input);
			}
			return null;
		}
	};
$.grep = function (a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e};
$.each = function (a,b){var c,d=0;if(Array.isArray(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a};
$.isNumeric = function (n){ return !isNaN(parseFloat(n)) && isFinite(n); }
	
var jQuery = {
	isEmptyObject: function (a){var b;for(b in a)return!1;return!0},
	fn:{}
};

var draggable = {
		swap: function (){}
	};
	
onmessage = function(e) {
	//console.log('Message received from main script');
	var recieved = e.data;
	
	if (recieved[0] == "highestDps") {
		highestDps = recieved[1];
		return;
	}
	
	if (!started) {
		name = "Thread" + recieved[0];
		threadId = recieved[0];
		importScripts("lib/random.min.js");
		importScripts("formation.js");
		
		mGridOrder.push(["7", "8", "9"]);
		mGridOrder.push(["4", "5", "6"]);
		mGridOrder.push(["1", "2", "3"]);
		for (var i in mGridOrder) {
			for (var j in mGridOrder[i]) {
				var order = mGridOrder[i][j];
				mGridToUI[order] = "grid_container_" + order;
				mGridToChar[order] = "";
			}
		}

		
		_nightBattle = recieved[19];
		_bossMode = recieved[20];
		_armorEnemy  = recieved[21];
		_dodgeEnemy  = recieved[22];
		
		gridToUi = _gridToUi;
		
	
		started = true;
		
	}
	
	RESULTLIST = new Array();
	charList = new Array();
	
	mCharData = recieved[11];
	mAttackFrameData = recieved[12];
	mEquipmentData = recieved[13];
	mStringData = recieved[14];
	mUpdate = recieved[15];
	mFairyData = recieved[16];
	
	_SEC = recieved[17];
	
	jobId = recieved[18];
	
	if ((recieved[7] == null) || (recieved[6][0].id == recieved[7][0].id)) {
		//DONE
		postMessage(["done",threadId,jobId]);	
		return;
	}
	
	firstCharId = recieved[8][0].id;
	//console.log(recieved[8][0]);
	loopCore(
				recieved[1], //LOC1,
				recieved[2], //LOC2,
				recieved[3], //LOC3,
				recieved[4], //LOC4,
				recieved[5], //LOC5,
				recieved[6], //ARR1, 
				0,
				recieved[7], //ARR2, 
				0,
				recieved[8], //ARR3, 
				0,
				recieved[9], //ARR4, 
				0,
				recieved[10], //ARR5, 
				0, 
				false,
				function(){}
				)
  
}






function _gridToUi(grid, elementName) {
    if (elementName == FRIENDSHIP) {
        return { 
				attr: function(){ return FRIENDLY; } 
			   };
    } else if (elementName == EQUIPMENT_CONTAINER) {
        return { 
				find: function(item){
						if ((item == ".equipment_1") || (item == ".equipment_2") || (item == ".equipment_3")) {
							return { 
									html: function(){ 
														return { 
																click: function(){ return null },
																off: function(){ return null }
																};  
													} 
								   }; 
						}

						if ((item == ".equipment_strengthen_1") || (item == ".equipment_strengthen_2") || (item == ".equipment_strengthen_3")) {
							return { 
									val: function(){ return "10" } 
								   }; 
						}

					} 
			   };
    } else if (elementName == CONTROL_CONTAINER) {
        return { 
				find: function(attr){
					if (attr == ".level") { 
						return { 
								val: function(){ return "100" } 
							   }; 
					}
					if (attr == ".skill_control") { 
						return { 
								is: function(){ return getCharObjByGrid(grid).isUseSkill; } 
							   }; 
					}
					if (attr == ".skill_stack") { 
						return { 
								val: function(){ return "0"; } 
							   };  
					}
					if (attr == ".skill_effect") {
						return { 
								val: function(){ return "1";  } 
							   };  
					}
					if (attr == ".skill_level") { 
						return { 
								val: function(){ return "10" } 
							   }; 
					}
					if (attr == ".modLevel") { 
						return { 
								val: function(){ return (getCharObjByGrid(grid).mod ? "3" : "0"); } 
							   }; 
					}
					if (attr == ".mod_skill_level") { 
						return {  
								val: function(){ return "10" } 
							   }; 
					}
				}
			};
				
    } 
}





function addChar2(grid, id) {
 
   var t = getChar(id);

   mGridToChar[grid] = t;


    var g = grid+"";
    if (mGridHasChar.indexOf(g) >= 0) {

    } else {
        mGridHasChar.push(g);
    }


    setEquipment(grid)
    updateCharObs();

}


function updatePerformance3() {

	var SEC = _SEC; 

	var ally = copyList(getAlly());
	allyInit(ally);
	var enemy = copyObject(ally[0]);
	enemyInit(enemy);

	//Nsdmg
	var dpsSum = 0;
	var sim = battleSimulation(SEC*FRAME_PER_SECOND, 0, copyList(ally), copyObject(enemy), false);
	for (var i =0; i < sim.y.length; i++) {
		dpsSum+= sim.y[i].data[SEC*FRAME_PER_SECOND];
	}
	return parseInt(dpsSum);
}


function dmgNs(SEC) {

	if (SEC == null) { SEC = _SEC; }

	var ally = copyList(getAlly());
	allyInit(ally);
	var enemy = copyObject(ally[0]);
	enemyInit(enemy);

	//Nsdmg
	var dpsSum = 0;
	var sim = battleSimulation(SEC*FRAME_PER_SECOND, 0, copyList(ally), copyObject(enemy), false);
	for (var i =0; i < sim.y.length; i++) {
		dpsSum+= sim.y[i].data[SEC*FRAME_PER_SECOND];
	}
	return parseInt(dpsSum);
}


var RESULTLIST = new Array();
var highestDps = 0;
var charList = new Array();

var highestDNs = 0;
var url = [location.protocol, '//', location.host, location.pathname].join('').replace("autoWorkers.js","main2.html");
function insertResult(dps, team, charList) { 

	if (dps > highestDps *buffer) {	

		if (
				!_nightBattle ||
				(_nightBattle && charList.filter(v => v.type == "hg").length > 0)
			) {
					
		
		
			var preLoadCode = {};
			var formation = [];
			var fairy = {};
			for (var i in mGridHasChar) {
				var grid = getGridByUIValue(mGridHasChar[i]);
				if (mGridToChar[grid] != "") {
					var charObj = mGridToChar[grid];

					var charRow = {};
					charRow.g = grid;
					charRow.id = charObj.id;
					if (charObj.c.modLevel > 0) {
						charRow.modlv = charObj.c.modLevel;
					} else {
						charRow.lv = charObj.c.level;
					}
					if (charObj.c.modLevel >= 2) {
						charRow.mod2slv = charObj.c.mod2SkillLevel;
					}
					charRow.slv = charObj.c.skillLevel;
					charRow.eq = charObj.equipment_code;
					formation.push(charRow);
				}
			}

			if (mFairy != null) {
				fairy.id = mFairy.id;
				fairy.lv = mFairy.level;
				fairy.r = mFairy.rarity;
				fairy.slv = mFairy.skillLevel;
				fairy.m = mFairy.mastery.id;
			}
			preLoadCode["char"] = formation;
			preLoadCode["fairy"] = fairy;
		
			team += " <a href='" + url + "?pre=" + JSON.stringify(preLoadCode) + "' target='_blank'>顯示陣型</a>";
			var obj = { dps: dps , team: team , charList:charList};


			RESULTLIST[RESULTLIST.length] = obj;
		
			if (highestDps < obj.dps) {
				highestDps = obj.dps;
			}
		
			//console.log(obj.dps, obj["d"+ _SEC + "s"], obj.team);

			var resultHtml = 
						"<tr>"+
							"<th>"+obj.dps+"</th>"+
							"<th>"+obj.team+"</th>"+
						"</tr>";
			//$$("body > table").prepend(resultHtml);
			postMessage([resultHtml, obj.dps, obj.team, [charList[0].id, charList[1].id, charList[2].id, charList[3].id, charList[4].id]]);

		}
		
	}
}


function getDateDiff(t1, t2) {

  var diffMS = t1 - t2;    

  var diffS = diffMS / 1000;    

  var diffM = diffS / 60;
  console.log(name, diffM + ' minutes');
 
}



function loopCore(
				LOC1,LOC2,LOC3,LOC4,LOC5,
				ARR1, I1,
				ARR2, I2,
				ARR3, I3,
				ARR4, I4,
				ARR5, I5, isBreak,
				returnFunction
				) {
	
	

	var I4Changed = false;
	var I3Changed = false;
	var I2Changed = false;
	var I1Changed = false;
	
	if (I1 + I2 + I3 + I4 + I5 == 0) {
		I4Changed = true;
		I3Changed = true;
		I2Changed = true;
		I1Changed = true;
	}
	
	
	if (!isBreak) {
		//I5++; 
	} else {
		I4Changed = true;
		I3Changed = true;
		I2Changed = true;
	} 
	var toBreak = false;

	if (I5 == ARR5.length) { I5 = 0; I4++; I4Changed = true; }
	if (I4 == ARR4.length) { 
		I4 = 0; I3++; I3Changed = true; 
	
		//CLEAN UP ARR
		RESULTLIST.sort(function(a, b){return b.dps-a.dps});


		for (var t = 0; t <  RESULTLIST.length;t++) {


			if ((RESULTLIST[t].dps > highestDps *buffer) || (RESULTLIST.length < 12)) {

				/*for (var r = 3; r < RESULTLIST[t].charList.length;r++) {
					RESULTLIST[t].charList[r].used += Math.pow(10, r-3);
				}*/
				for (var x = 0; x < ARR4.length;x++) {
					if ((ARR4[x].id == RESULTLIST[t].charList[3].id) || (ARR4[x].id == firstCharId)) {
						ARR4[x].used4++;
					}
				}
				for (var x = 0; x < ARR5.length;x++) {
					if ((ARR5[x].id == RESULTLIST[t].charList[4].id) || (ARR5[x].id == firstCharId)) {
						ARR5[x].used5++;
					}
				}
			
			} else {
				RESULTLIST.pop();
			}
		}

		ARR4.sort(function(a, b){return b.used4-a.used4});
		ARR5.sort(function(a, b){return b.used5-a.used5});

		if ((RESULTLIST.length > 10) && (RESULTLIST[9].dps > highestDps *0.7)) {
			while (ARR4.length-1 > 0 && ARR4[ARR4.length-1].used4 < 0.0000001 && ARR4[ARR4.length-1].id != firstCharId) {
				//console.log("		4 "+ARR4[ARR4.length-1].name); 
				ARR4.pop();
			}
			while (ARR5.length-1 > 0 && ARR5[ARR5.length-1].used5 < 0.0000001 && ARR5[ARR5.length-1].id != firstCharId) {
				//console.log("		5 "+ARR5[ARR5.length-1].name); 
				ARR5.pop();
			}
		}
		
		for (var i = 0; i < ARR4.length;i++) {
			ARR4[i].used4 /= 1000;

		}
		for (var i = 0; i < ARR5.length;i++) {
			ARR5[i].used5 /= 1000;

		}
		
	}
	
	if (I4Changed) {
		postMessage(["percent", threadId, (I1 *ARR2.length*ARR3.length*ARR4.length*ARR5.length + I2 *ARR3.length*ARR4.length*ARR5.length + I3 *ARR4.length*ARR5.length + I4 * ARR5.length + I5) / 
			(ARR1.length * ARR2.length * ARR3.length * ARR4.length * ARR5.length), highestDps,jobId]);
	}
	
	if ((I3 >= ARR3.length) || (I2 >= ARR2.length) || (I1 >= ARR1.length)) {

		//console.log(I1,I2,I3,I4,I5);
		I3 = 0;
		//DONE
		postMessage(["done",threadId,jobId]);
				
		returnFunction();
		return;

	} else { 

		

		if (I1Changed) { addChar2(LOC1,ARR1[I1].id); }
		if (I2Changed) { addChar2(LOC2,ARR2[I2].id); }
		if (I3Changed) { addChar2(LOC3,ARR3[I3].id); }
		if (I4Changed) { addChar2(LOC4,ARR4[I4].id); }

		addChar2(LOC5,ARR5[I5].id); 
		
		
		var checkRepeat = [
							ARR1[I1].name,
							ARR2[I2].name,
							ARR3[I3].name,
							ARR4[I4].name,
							ARR5[I5].name
						];
		if ((new Set(checkRepeat)).size === checkRepeat.length) {
			//no repeat

			var dps = updatePerformance3();

			if (dps < highestDps *0.6) {
				I4++;
				I5 = 0;
				toBreak = true;
			} else {

				
				insertResult(dps, 
				//I1 + " " + I2 + " " + I3 + " " + I4 + " " + I5 + " " +
					ARR1[I1].name + " " +
					ARR2[I2].name + " " +
					ARR3[I3].name + " | " +

					ARR4[I4].name + " " +
					ARR5[I5].name,
					
					[ARR1[I1],ARR2[I2],ARR3[I3],ARR4[I4],ARR5[I5]]
				);			
				
			}

		} else {
			checkRepeat = [
							ARR1[I1].name,
							ARR2[I2].name
						];
			if ((new Set(checkRepeat)).size === checkRepeat.length) {
				//no repeat
				
				checkRepeat = [
								ARR1[I1].name,
								ARR2[I2].name,
								ARR3[I3].name
							];
				if ((new Set(checkRepeat)).size === checkRepeat.length) {
					//no repeat
					
					checkRepeat = [
									ARR1[I1].name,
									ARR2[I2].name,
									ARR3[I3].name,
									ARR4[I4].name
								];
					if ((new Set(checkRepeat)).size === checkRepeat.length) {
						//no repeat
						I5++;
						toBreak = true;
					
					} else {
						// I4 repeat
						I4++;
						I5 = 0;
						toBreak = true;
					}
		
				
				} else {
					// I3 repeat
					I3++;
					I4 = 0;
					I5 = 0;
					toBreak = true;
				}
				
			} else {
				// I2 repeat
				I2++;
				I3 = 0;
				I4 = 0;
				I5 = 0;
				toBreak = true;
			}
			
		}
	
	
		if (!toBreak) {
			I5++; 
		} 
		setTimeout(
			function() {
					loopCore(
						LOC1,LOC2,LOC3,LOC4,LOC5,
						ARR1, I1,
						ARR2, I2,
						ARR3, I3,
						ARR4, I4,
						ARR5, I5, toBreak,
						returnFunction
					);
			},
			10
		);
						





				
		
		
		
	}


	
	
}
