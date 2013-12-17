/**
 * Litro Sound Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */

var LitroKeyboardInstance = null;
var VIEWMULTI = 2;
var DISPLAY_WIDTH = 320;
var DISPLAY_HEIGHT = 240;
var CHIPCELL_SIZE = 16;
var layerScroll = null;
var COLOR_NOTEPRINT = [0, 168, 0, 255];
var COLOR_NOTEFACE = [184, 248, 184, 255];
var COLOR_NOTEPRINT = [0, 168, 0, 255];
var COLOR_PARAMKEY = [188, 188, 188, 255];
var COLOR_ARRAY = [[248, 120, 88, 255], [252, 168, 68, 255], [248, 184, 0, 255], [88, 216, 84, 255], [60, 188, 252, 255], [152, 120, 248, 255], [248, 120, 248, 255], [248, 88, 152, 255], ];

function LitroKeyboard() {
	this.CODE_NAME = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	this.CODE_NAME_INDEX = {};
	this.CHARS_INDEX = [];
	
	this.CONTROLL_CHARS = {};
	this.CHARS_CODE_NAME = {};
	this.ROW_CHARS = {
		top:['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', ],
		bottom:[],
	};
	this.ROW_CHARS_BOTTOM_OV = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', ',', 'l', '.', ';', '/', ];
	this.ROW_CHARS_BOTTOM_ST = ['z', 's', 'x', 'd', 'c', 'f', 'v', 'b', 'h', 'n', 'j', 'm',];
	
	this.OCTAVE_KEYCODE = {
		'-' : 189, '^' : 222, '+' : 187,
	},
	this.ZOOM_KEYCODE = {
		'[' : 219, ']' : 221,
	},
	
	this.KEY_REPLACE_FIREFOX = {
		187 : 59, 189 : 173, 222 : 160,
	};
	this.ROW_KEYCODE = {
		top:[81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85, 73, 57, 79, 48, 80],
		bottom:[],
	};
	this.ROW_KEYCODE_BOTTOM_OV = [90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 74, 77, 188, 76, 190, 187, 191];
	this.ROW_KEYCODE_BOTTOM_ST = [90, 83, 88, 68, 67, 70, 86, 66, 72, 78, 74, 77, ];
	this.keyBottomType = 'straight';
	// this.keyBottomType = 'overlap';
	
	//初期化でcharが入る
	this.BLACK_KEY = {};
	this.BLACK_KEY_OV = {'2':0, '3':0, '5':0, '6':0, '7':0, '9':0, '0':0, 's':0, 'd':0, 'g':0, 'h':0, 'j':0, 'l':0, ';':0, ':': 0};
	this.BLACK_KEY_ST = {'2':0, '3':0, '5':0, '6':0, '7':0, '9':0, '0':0, 's':0, 'd':0, 'f':0, 'h':0, 'j':0};
	this.iWHITE_KEYS = [];
	this.iBLACK_KEYS = [];
	this.BLACK_KEY_SKIP = {};
	this.BLACK_KEY_SKIP_I = [];
	this.BLACK_KEY_SKIP_SUM = 4;
	this.BLACK_KEY_SKIP_OV = {'2': 0, '3': 0, '5': 1, '6': 1, '7': 1, '9': 2, '0': 2, 's': 2, 'd': 2, 'g': 3, 'h': 3, 'j': 3, 'l': 4, ';': 4,};
	this.BLACK_KEY_SKIP_ST = {'2': 0, '3': 0, '5': 1, '6': 1, '7': 1, '9': 2, '0': 2, 's': 3, 'd': 3, 'f': 3, 'h': 4, 'j': 4};
	this.octaveLevel = 2;
	this.octaveRange = 3; //octave level range
	this.octaveInKeys = 12; //1オクターブ中のキー数
	this.octaveRangeCells = 21; //4px * 21cells
	this.octaveRangeScale = 63; //per page
	this.fingers = 6;
	this.status_on = []; //set chars
	this.onkeyEvent = null;
	this.offkeyEvent = null;
	this.octaveEvent = null;
	this.isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? true : false;
	this.imageLoaded = false;
	this.loader = imageResource;
	this.uiImageName = 'ui_16p';
	
	this.octaveSeparateCount = [12, 12, 5]; //オクターブが切り替わる鍵盤数
	
	this.noteKeysSpriteKeys = {};
	this.noteKeysSpriteKeys_ov = {'q': 0, '2': 0 , 'w': 1, '3': 0, 'e': 5, 'r': 3, '5': 0, 't': 1, '6': 0, 'y': 1, '7': 0, 'u': 2, 'i': 0, '9': 0, 'o': 1, '0': 0, 'p': 2
											, 'z': 0, 's': 0, 'x': 1, 'd': 0, 'c': 2, 'v': 3, 'g': 0, 'b': 4, 'h': 0, 'n': 1, 'j': 0, 'm': 5, ',': 0, 'l': 0, '.': 1, ';': 0, '/': 2,};
	this.noteKeysSpriteKeys_st = {'q': 0, '2': 0 , 'w': 1, '3': 0, 'e': 5, 'r': 3, '5': 0, 't': 1, '6': 0, 'y': 1, '7': 0, 'u': 2, 'i': 0, '9': 0, 'o': 1, '0': 0, 'p': 2
											, 'z': 3, 's': 0, 'x': 4, 'd': 0, 'c': 1, 'f': 0,'v': 5, 'b': 0, 'h': 0, 'n': 1, 'j': 0, 'm': 2,};
											
	this.whiteKeysSprite = [[9, 7, 1, 2], [10, 7, 1, 2], [11, 7, 1, 2], [12, 7, 1, 2], [13, 7, 1, 2], [14, 7, 1, 2], ];
	this.blackKeysSprite = [[9, 5, 1, 2], ];
	this.whiteKeysCmargin = {x: 2, y: 24};
	this.blackKeysCmargin = {x: 3, y: 24};
	
	this.paramKeys = ['VOLUME', 'TYPE', 'LENGTH', 'DELAY', 'SWEEP', 'ATTACK', 'DECAY', 'SUSTAIN', 'RELEASE' ];
	this.paramKeysStrLen = 5;
	this.paramPage = 0;
	this.paramOffset = 0;
	this.paramLimit = 6;
	this.paramsScrollOffset = 0;
	
	this.ltSoundChParamKeys = {
		'VOLUME': 'volumeLevel',
		'TYPE': 'waveType',
		'LENGTH': 'length' ,
		'DELAY': 'delay',
		'SWEEP': 'sweep',
		'ATTACK': 'attack',
		'DECAY': 'decay',
		'SUSTAIN': 'sustain',
		'RELEASE': 'release',
	};
	
	this.corsolKeys = ['up', 'down', 'left', 'right'];
	this.baseKeys = ['<', '>', 'select', 'space'];
	
	this.paramCursor = {x: 0, y: 0};
	this.paramCursorCurrent = {x: 0, y: 0};
	
	this.editMode = 0;
	this.modeNames = ['channel', 'note', 'file', 'play'];
	
	this.noteSprite = 176;
	
	this.noteScrollCmargin = {x: 4, y: 3};
	this.noteCmargin = {x: 4, y: 11.5};
	this.noteScrollPos = {x: 0, y: 0};
	
	this.noteRange = 1; // position multiple
	this.noteRangeCells = 32; // 8px * 32cells
	this.noteRangeScale = 4000; // msec per page
	
	this.noteData = []; //note data
	
	this.notePutPos= 0; //note をセットする位置

	this.seekSprite = 242; //ノートカーソル
	this.seekCmargin = {x: 2, y: 0};
	// this.octaveRange = 3; //octave level multiple
	// this.octaveRangeCells = 21; //4px * 21cells
	// this.octaveRangeScale = 63; //per page

	this.word = null;
	return;
}

LitroKeyboard.prototype = {
	init : function(litrosoundInstance) {
		var code, row, chars, i
		, whiteCount = 0
		, blackCount = 0
		, codeNameCount = 0
		, repkeys_ff = this.KEY_REPLACE_FIREFOX;
		this.litroSound = litrosoundInstance;
		LitroKeyboardInstance = this;
		this.keyControll = new KeyControll();
		
		//基本キー
		this.keyControll.initCommonKey();
		
		
		if(this.keyBottomType == 'straight'){
			this.ROW_KEYCODE.bottom = this.ROW_KEYCODE_BOTTOM_ST;
			this.BLACK_KEY = this.BLACK_KEY_ST;
			this.BLACK_KEY_SKIP = this.BLACK_KEY_SKIP_ST;
			this.ROW_CHARS.bottom = this.ROW_CHARS_BOTTOM_ST;
			this.noteKeysSpriteKeys = this.noteKeysSpriteKeys_st;
		}else{
			this.ROW_KEYCODE.bottom = this.ROW_KEYCODE_BOTTOM_OV;
			this.BLACK_KEY = this.BLACK_KEY_OV;
			this.BLACK_KEY_SKIP = this.BLACK_KEY_SKIP_OV;
			this.ROW_CHARS.bottom = this.ROW_CHARS_BOTTOM_OV;
			this.noteKeysSpriteKeys = this.noteKeysSpriteKeys_ov;
		}

		
		
		//キーボード設定
		for(row in this.ROW_CHARS){
			chars = this.ROW_CHARS[row];
			code = this.ROW_KEYCODE[row];
			for(i = 0; i < chars.length; i++){
				if(this.isFirefox){
					code[i] = repkeys_ff[code[i]] == null ? code[i] : repkeys_ff[code[i]];
				}
				this.CONTROLL_CHARS[chars[i]] = code[i];
				this.keyControll.setKey(chars[i], code[i]);

				this.CHARS_CODE_NAME[chars[i]] = this.CODE_NAME[codeNameCount % this.CODE_NAME.length];
				this.CHARS_INDEX[codeNameCount] = chars[i];
				codeNameCount++;
				// if(row == 'top'){
					// this.CHARS_CODE_NAME[chars[i]] = this.CODE_NAME[i % this.CODE_NAME.length];
				// }else{
					// this.CHARS_CODE_NAME[chars[i]] = this.CODE_NAME[(i + 5) % this.CODE_NAME.length];
				// }
				
				
				//補完
				if(chars[i] in this.BLACK_KEY){
					this.BLACK_KEY[chars[i]] = code[i];
					this.iBLACK_KEYS[chars[i]] = blackCount++;
				}else{
					this.iWHITE_KEYS[chars[i]] = whiteCount++;
				}
			}
			//重複分戻すキー
			if(this.keyBottomType == 'overlap'){
				blackCount -= 2;
				whiteCount -= 3;
			}
		}
		
		//オクターブ設定
		for(i in this.OCTAVE_KEYCODE){ 
			code = this.OCTAVE_KEYCODE[i];
			if(this.isFirefox){
				code = repkeys_ff[code] == null ? code : repkeys_ff[code];
			}
			this.keyControll.setKey(i, code);
		}
		
		for(i = 0; i < this.CODE_NAME.length; i++){
			this.CODE_NAME_INDEX[this.CODE_NAME[i]] = i;
		}
		
		//チャンネルデータ初期
		for(i = 0; i < this.litroSound.channel.length; i++){
			this.noteData.push({});
		}
		
		this.loadImages();
		this.initFingerState(this.fingers);
		this.initCanvas();
		this.initWords();
		
	},
	
	initWords: function()
	{
		var word, WordPrint = wordPrint;
		word = new WordPrint();
		word.setFontSize('8px');
		this.word = word;
	},
	
	initCanvas: function()
	{
		makeScroll('screen', true);
		makeScroll('view', false);
		makeScroll('bg1', false);
		makeScroll('bg2', false);
		makeScroll('sprite', false);
		makeScroll('tmp', false);
		
		var bg1 = scrollByName('bg1')
			, bg2 = scrollByName('bg2')
			, spr = scrollByName('sprite')
			;
		bg1.clear(COLOR_BLACK);
		bg2.clear();
		spr.clear();
	},
	
	initFingerState: function(num)
	{
		var i;
		this.status_on = [];
		for(i = 0; i < num; i++){
			this.status_on.push(null);
		}
	},
	
	initSprite: function()
	{
		var i
		;
		this.waveSprite = makePoint(this.uiImageName, 1);
		for(i = 0; i < this.whiteKeysSprite.length; i++){
			this.whiteKeysSprite[i] = makeSpriteChunk(this.uiImageName, makeRect(this.whiteKeysSprite[i]));
		}
		this.blackKeysSprite[0] = makeSpriteChunk(this.uiImageName, makeRect(this.blackKeysSprite[0]));
		
	},
	
	loadImages: function()
	{
		// this.loader.init();
		var resorce = loadResource([this.uiImageName]);
		resorce.onload = function(){
			ltkb.imageLoaded = true;
			ltkb.initSprite();
			ltkb.openFrame();
		};
	},
	
	isBlackKey: function(name){
		if(this.BLACK_KEY[name] == null){
			return false;
		}else{
			return true;
		}
	},
	
	whiteKeyCount: function(chr)
	{
		var i
			, count = 0
		;
		for(i = 0; i < this.CHARS_INDEX.length; i++){
			count = this.iWHITE_KEYS[this.CHARS_INDEX[i]] == null ? count : this.iWHITE_KEYS[this.CHARS_INDEX[i]];
			if(this.CHARS_INDEX[i] == chr){
				break;
			}
		}
		
		// console.log(chr , count);
		return count;
	},
	
	getOctaveFromKeyChar: function(chr)
	{
		var chars, i, ocnt, oct;
		
		chars = this.ROW_CHARS.top.concat(this.ROW_CHARS.bottom);
		// console.log(this.ROW_CHARS.bottom);
		// code = this.ROW_KEYCODE.top.join(this.ROW_KEYCODE.bottom);
		for(i = 0; i < chars.length; i++){
			if(chars[i] == chr){
				ocnt = this.octaveSeparateCount;
				if(i < ocnt[0]){
					return this.octaveLevel;
				}else if(i < ocnt[0] + ocnt[1]){
					oct = this.octaveLevel + 1;
					return (oct > this.litroSound.OCTAVE_MAX) ? this.litroSound.OCTAVE_MAX : oct;
				}else{
					oct = this.octaveLevel + 2;
					return (oct > this.litroSound.OCTAVE_MAX) ? this.litroSound.OCTAVE_MAX : oct;
				}
			}
		}
	},
	
	getCodeNameFromKeyChar: function(chr){
		var chars, row, i;
		for(row in this.ROW_CHARS){
			chars = this.ROW_CHARS[row];
			for(i = 0; i < chars.length; i++){
				if(chars[i] == chr){
					return ;
				}
			}
		}	
	},
	
	key2chr: function(key)
	{
		for(var ch in this.ROW_CHARS){
			// if(this.ROW_CHARS[key])
		}
	},
	
	getKeysDefine: function(){
		return this.CONTROLL_CHARS;
	},
	
	makeNote: function(code, octave, time)
	{
		// time = time == null ? this.noteScrollPos : time;
		time = time == null ? this.notePutPos: time;
		var note = {time: time, key: code + (octave * this.octaveInKeys)}
			;
		// console.log(note);
		return note;
	},
	
	setNote: function(ch, note)
	{
		this.noteData[ch][note.time] = note;
		// console.log(this.noteData, ch, note);
	},
	
	onCode: function(chr)
	{
			// console.log(chr);

		var channel, chars, row, octave, code, i;
		// console.log(chr);
		octave = this.getOctaveFromKeyChar(chr);
		code = this.CODE_NAME_INDEX[this.CHARS_CODE_NAME[chr]];
		channel = this.searchReadySlot();
		
		if(channel < 0){
			return;
		}else{
			this.status_on[channel] = chr;
		}
		this.litroSound.onNoteFromCode(channel, code, octave);
		
		if(this.onkeyEvent != null){
			this.onkeyEvent(chr);
		}
		
		//仮使用
		this.notePutPos= ((this.notePutPos+ (this.noteRangeScale / this.noteRangeCells)) | 0) % this.noteRangeScale;
		this.setNote(channel, this.makeNote(code, octave));
		this.drawNoteScroll();
		// console.log(this.setNotePos);

	},
	
	offCode: function(chr)
	{
		var channel = this.searchState(chr);

		if(chr == null || channel < 0){
			this.offkeyEvent();
			this.initFingerState(this.fingers);
			this.litroSound.offNoteFromCode();
			// console.log('chr: ' + chr);
			return;
		}
		if(this.offkeyEvent != null){
			this.offkeyEvent(chr);
			this.status_on[channel] = null;
			// this.litroSound.offNoteFromCode(channel);
			this.litroSound.fadeOutNote(channel);
		}
	},
	
	incOctave: function()
	{
		if(this.octaveLevel < this.litroSound.OCTAVE_MAX){
			this.octaveLevel++;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawNoteScroll();
		}
	},
	
	decOctave: function()
	{
		if(this.octaveLevel > 0){
			this.octaveLevel--;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawNoteScroll();
		}
	},
	
	searchReadySlot: function()
	{
		var i, key
		;
		for(i = 0; i < this.fingers; i++){
			key = (i + this.paramCursor.x) % this.litroSound.channel.length;
			// key = i;
			if(this.status_on[key] == null){
				return key;
			}
		}

		return -1;
	},
	
	searchState: function(chr)
	{
		var i, key;
		for(i = 0; i < this.fingers; i++){
			key = (i + this.paramCursor.x) % this.litroSound.channel.length;
			// key = i;
			if(this.status_on[key] == chr){
				return key;
			}
		}

		return -1;
	},
	
	getMode: function()
	{
		return this.editMode;
	},
	
	getTimeNoteByRange: function(ch, startTime, endTime)
	{
		var noteData = this.noteData[ch]
			, i
			, trimData = {}
			, note
		;
		
		for(i = 0; i < noteData.length; i++){
			note = noteData[i];
			if(startTime > note.time){
				continue;
			}else if(endTime <= note.time){
				break;
			}
			trimData[note.time] = note;
		}

		return trimData;
	},
	
	indexAtWhite: function(chr)
	{
		return this.iWHITE_KEYS[chr] != null ? this.iWHITE_KEYS[chr] : -1;
	},
		
	indexAtBlack: function(chr)
	{
		return this.iBLACK_KEYS[chr] != null ? this.iBLACK_KEYS[chr] : -1;
	},
		
	appendOctaveEvent: function(e)
	{
		this.octaveEvent = e;
	},
	appendOnkeyEvent: function(e)
	{
		this.onkeyEvent = e;
	},
	appendOffkeyEvent: function(e)
	{
		this.offkeyEvent = e;
	},
	
	moveParamCursor: function(dir)
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, limit = this.paramLimit
			, offset = this.paramOffset
			, chLength = this.litroSound.channel.length
			, paramsLength = this.paramKeys.length
			, currentLength = paramsLength - (limit - 1)
		;
		// this.drawParamCursor(curr.x, curr.y, true);
		
		switch(dir){
			case 'up': cur.y = (cur.y + paramsLength - 1) % paramsLength;
							if(--curr.y < 0){
								curr.y = offset == 0 ? limit - 1 : 0;
								offset = (offset + currentLength - 1) % currentLength; //4
							}
							break;
			case 'down': cur.y = (cur.y + 1) % paramsLength;
							if(++curr.y > limit - 1){
								curr.y = offset + limit - 1 >= paramsLength - 1 ? 0 : limit - 1;
								offset = (offset + 1) % currentLength;
							}
							break;
			case 'left': cur.x = (cur.x + chLength - 1) % chLength; break;
			case 'right': cur.x = (cur.x + 1) % chLength; break;
		}
		this.paramOffset = offset;
		
		this.drawParamKeys(offset, limit);
		this.drawChannelParams(offset, limit);
		this.drawParamCursor(curr.x, curr.y, false);
	},
	
	baseKeyOn: function(key)
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, param = this.ltSoundChParamKeys[this.paramKeys[cur.y]];
		;
		
		switch(key){
			case '<': 
				this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param) - 1);
				this.drawParamCursor(curr.x, curr.y, false);
				break;
			case '>': 
				this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param) + 1);
				this.drawParamCursor(curr.x, curr.y, false);
				break;
			case 'select': 
				this.editMode = (this.editMode + 1) % this.modeNames.length;
				printDebug(this.modeNames[this.editMode], 10);
				// this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param) + 1);
				// this.drawParamCursor(curr.x, curr.y, false);
				break;
			case 'space': 
				// this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param) + 1);
				// this.drawParamCursor(curr.x, curr.y, false);
				break;
		}
		
	},
	
	openFrame: function()
	{
		var i, j
			, noteRollLeft = [1, 0, 2, 1]
			, noteRollRight = [3, 0, 2, 1]
			, eventRollLeft = [7, 0, 2, 1]
			, eventRollRight = [7, 0, 2, 1]
			, noteFaceLine = [5, 0, 1, 1]
			, noteFaceSpace = [6, 0, 1, 1]
			, eventFaceLine = [9, 0, 1, 1]
			, eventFaceSpace = [9, 0, 1, 1]
			, leftFrame = [0, 1, 1, 8]
			, rightFrame = [7, 1, 2, 8]
			, topFrameLeft = [1, 1, 2, 2]
			, topFrameCenter_1 = [3, 1, 1, 2]
			, topFrameCenter_2 = [4, 1, 1, 2]
			, topFrameRight = [5, 1, 2, 2]
			, boardFrameLeft_1 = [1, 5, 1, 4]
			, boardFrameCenter_1 = [2, 5, 1, 4]
			, boardFrameRight_1 = [3, 5, 1, 4]
			, boardFrameLeft_2 = [4, 5, 1,4]
			, boardFrameCenter_2 = [5, 5, 1, 4]
			, boardFrameRight_2 = [6, 5, 1, 4]
			, ocsLineV = [5, 4, 1, 1]
			, ocsLineH = [6, 4, 1, 1]
		;
		//上半分
		this.drawFrameLine(noteRollLeft, 0, 1, 1, 6);
		this.drawFrameLine(noteFaceLine, 2, 0.5, 16, 2);
		this.drawFrameLine(noteFaceSpace, 2, 2.5, 16, 1);
		this.drawFrameLine(noteFaceLine, 2, 3.5, 16, 3);
		this.drawFrameLine(noteFaceSpace, 2, 6, 16, 1);
		
		this.drawFrameLine(noteRollLeft, 18, 1, 1, 6);
		
		this.drawFrameLine(eventRollLeft, 0, 0, 1, 1);
		this.drawFrameLine(eventFaceLine, 2, 0, 16, 1);
		this.drawFrameLine(eventRollRight, 18, 0, 1, 1);
		
		//下半分
		this.drawFrameLine(leftFrame, 0, 7, 1, 1);
		this.drawFrameLine(rightFrame, 18, 7, 1, 1);
		this.drawFrameLine(topFrameLeft, 1, 7, 1, 1);
		this.drawFrameLine(topFrameRight, 16, 7, 1, 1);
		
		this.drawFrameLine(topFrameCenter_2, 3, 7, 2, 1);
		this.drawFrameLine(topFrameCenter_1, 5, 7, 6, 1);
		this.drawFrameLine(topFrameCenter_2, 11, 7, 2, 1);
		this.drawFrameLine(topFrameCenter_1, 13, 7, 1, 1);
		this.drawFrameLine(topFrameCenter_2, 14, 7, 1, 1);
		this.drawFrameLine(topFrameCenter_1, 15, 7, 1, 1);
		
		//鍵盤
		this.drawFrameLine(boardFrameLeft_1, 1, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 2, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_2, 3, 11, 1, 1);
		
		this.drawFrameLine(boardFrameLeft_2, 4, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 5, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 6, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_1, 7, 11, 1, 1);
		
		this.drawFrameLine(boardFrameLeft_1, 8, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 9, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_1, 10, 11, 1, 1);
		
		this.drawFrameLine(boardFrameLeft_2, 11, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_2, 12, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 13, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_2, 14, 11, 1, 1);
		
		this.drawFrameLine(boardFrameLeft_1, 15, 11, 1, 1);
		this.drawFrameLine(boardFrameCenter_1, 16, 11, 1, 1);
		this.drawFrameLine(boardFrameRight_1, 17, 11, 1, 1);
		
		// オシロ
		this.drawFrameLine(ocsLineV, 12, 8.5, 1, 3);
		this.drawFrameLine(ocsLineH, 13, 10, 4, 1);
		
		// オクターブ
		this.drawOctaveMeter(this.octaveLevel);
		
		this.drawChannelTab_on();
		
		this.drawParamKeys();
		
		this.drawChannelParams();
		
		this.drawParamCursor();
		
		this.drawNoteScroll();
		// scrollByName('bg1').spriteLine({x:50, y:20},{x:50, y:0}, this.waveSprite);

	},
	
	drawSeek: function()
	{
		var sprite = makeSprite(this.uiImageName, this.seekSprite)
			, scr = scrollByName('sprite')
			, mc = this.seekCmargin
			, x = this.notePutPos * this.noteRange * (cellhto(this.noteRangeCells) / this.noteRangeScale)
		;
		printDebug(x);
		scr.drawSprite(sprite, cellhto(mc.x) + x, mc.y);
	},
	
	// drawNote: function(time, key)
	drawNote: function(ch, x, y)
	{
		var spriteId = this.noteSprite
			, scr = scrollByName('bg2')
			, scrPos = this.noteScrollPos
			, noteCm = this.noteCmargin
		;
		x = cellhto(noteCm.x + x);
		y = cellhto(noteCm.y - (y / 2));

		scr.drawSprite(makeSprite(this.uiImageName, spriteId + ch), x + scrPos.x, y + scrPos.y);
		
	},
	
	drawNoteScroll: function(ch, timeStart, timeEnd, keyStart, keyEnd)
	{
		var noteData = this.noteData
			, i
			, t
			, x, y
			, note
			, code
			, whiteCount
			, cm =  this.noteScrollCmargin
		;
		if(this.litroSound.channel == null){
			return;
		}
		timeStart = this.noteScrollPos.x * this.noteRange;
		timeEnd = timeStart + this.noteRangeScale;
		
		keyStart = this.octaveLevel * this.octaveInKeys;
		keyEnd = keyStart + this.octaveRangeScale;
		
		scrollByName('bg2').clear(null, makeRect(cellhto(cm.x), cellhto(cm.y), cellhto(this.noteRangeCells), cellhto(this.octaveRangeCells / 2)));
		// this.noteData[0] = [{time: 0, key:24}, {time: 300, key:26}, {time: 600, key:40}];
		for(ch = 0; ch < this.litroSound.channel.length; ch++){
			// noteData = this.getTimeNoteByRange(ch, timeStart, timeEnd);
			noteData = this.noteData[ch];
			for(t in noteData){
				note = noteData[t];
				// code = this.CODE_NAME_INDEX[this.CODE_NAME[note.key % this.CODE_NAME.length]];	
				chr = this.CHARS_INDEX[note.key - (this.octaveLevel * this.octaveInKeys)];
				whiteCount = this.whiteKeyCount(chr) + (this.iWHITE_KEYS.length * this.octaveLevel);
				x = (((note.time - timeStart) / this.noteRangeScale) * this.noteRangeCells) | 0;
				y = whiteCount;
				this.drawNote(ch, x, y);
				// console.log(chr,  this.CHARS_INDEX.length, whiteCount, y, this.BLACK_KEY_SKIP_SUM);
				// this.drawNote(t, noteData.key);
			}
		}
		
	},
	
	drawParamCursor: function(x, y, unselect)
	{
		var keyCm = {x:3, y: 17}
			, paramCm = {x:8, y: 17}
			, word = this.word
			, cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, key = this.paramKeys[cur.y]
			, color
			, bgcolor
			, param = this.litroSound.getChannel(cur.x, this.ltSoundChParamKeys[key]) | 0
			;
			x = x == null ? 0 : x;
			y = y == null ? 0 : y;
			word.setScroll(scrollByName('bg2'));
			unselect = unselect == null ? false : unselect;
			color = unselect ? COLOR_PARAMKEY : COLOR_BLACK;
			bgcolor = unselect ? COLOR_BLACK : COLOR_PARAMKEY;
			word.print(key.substr(0, this.paramKeysStrLen), cellhto(keyCm.x), cellhto(keyCm.y + curr.y), color, bgcolor);
			
			color = unselect ? COLOR_ARRAY[cur.x] : COLOR_BLACK;
			bgcolor = unselect ? COLOR_BLACK : COLOR_ARRAY[cur.x];
			word.print(formatNum(param.toString(16), 2), cellhto(paramCm.x + (cur.x * 2)), cellhto(paramCm.y + curr.y), color, bgcolor);
			
	},
	
	drawParamKeys: function(offset, limit)
	{
		// page = page == null ? this.paramPage : page;
		offset = offset == null ? this.paramOffset : offset;
		limit = limit == null ? this.paramLimit : limit;
		var i
			, index
			, keys = this.paramKeys
			// , scr = scrollByName('bg1')
			, word = this.word
			, mc = {x:3, y: 17}
			;
		word.setScroll(scrollByName('bg2'));
		
		for(i = 0; i < limit; i++){
			index = (i + offset) % keys.length;
			word.print(keys[index], cellhto(mc.x), cellhto(mc.y + i), COLOR_PARAMKEY, COLOR_BLACK);
		}
	},
	
	drawChannelParams: function(offset, limit)
	{
		// page = page == null ? this.paramPage : page;
		offset = offset == null ? this.paramOffset : offset;
		limit = limit == null ? this.paramLimit : limit;
		var i
			, keys = this.paramKeys
			// , scr = scrollByName('bg1')
			, word = this.word
			, mc = {x:8, y: 17}
			, key
			, color
			, chLength = this.litroSound.channel.length
			, numLength = 2
			, num
			;
		word.setScroll(scrollByName('bg2'));
		
		for(i = 0; i < limit; i++){
			for(j = 0; j < chLength; j++){
				index = (i +offset) % keys.length;
				key = this.ltSoundChParamKeys[keys[index]];
				color = COLOR_ARRAY[j];
				num = (this.litroSound.getChannel(j, key) | 0).toString(16);
				word.print(formatNum(num, 2), cellhto(mc.x + (j * numLength)), cellhto(mc.y + i), color, COLOR_BLACK);
			}
		}
		
	},
	
	drawOctaveMeter: function(level)
	{
		var i
			, cm = {x: 37.5, y: 12.25}
			, cDistance = 3.5
			, scr = scrollByName('bg1')
			, noteRollRight = [3, 0, 2, 1]
		;
		// this.drawFrameLine(noteRollRight, 18, 0.75, 1, 1);
		this.drawFrameLine(noteRollRight, 18, 2.5, 1, 1);
		this.drawFrameLine(noteRollRight, 18, 4.25, 1, 1);
		this.drawFrameLine(noteRollRight, 18, 6, 1, 1);
		
		this.word.setScroll(scr);
		// this.word.swapColor(COLOR_FONT8, COLOR_NOTEPRINT);
		for(i = 0; i < 3; i++){
			this.word.print((level + i), cellhto(cm.x), cellhto(cm.y - (i * cDistance)), COLOR_NOTEPRINT, COLOR_NOTEFACE);
			// this.word.print('tes', 0, 0, COLOR_NOTEPRINT);
		}
		this.word.print('Oct', cellhto(cm.x - 1), cellhto(cm.y - (i * cDistance) + 1), COLOR_NOTEPRINT, COLOR_NOTEFACE);
	},
	
	drawOctaveButton: function()
	{
		var scr = scrollByName('sprite')
			, sprite_u = makeSpriteChunk(this.uiImageName, makeRect([9, 3, 2, 1]))
			, sprite_d = makeSpriteChunk(this.uiImageName, makeRect([9, 4, 2, 1]))
			, cm_u = {x: 36, y: 24}
			, cm_d = {x: 36, y: 26}
			, cnt = this.keyControll
		;
		
		if(cnt.getState('^')){
			scr.drawSpriteChunk(sprite_u, cellhto(cm_u.x), cellhto(cm_u.y));
		}
		if(cnt.getState('-')){
			scr.drawSpriteChunk(sprite_d, cellhto(cm_d.x), cellhto(cm_d.y));
		}
	},
	
	drawChannelTab_on: function(ch)
	{
		var i
			, scr = scrollByName('bg1')
			, tabsprite = makeSpriteChunk(this.uiImageName, makeRect([0, 9, 1, 1]))
			, draws = makeSpriteChunk(this.uiImageName, makeRect([0, 9, 1, 1]))
			, cm = {x: 8, y: 14}
		;
		if(ch == null){
			ch = [0, 1, 2, 3, 4, 5, 6, 7];
		}
		if(ch.length == null){
			ch = [ch];
		}
		for(i = 0; i < ch.length; i++){
			//xだけ変更してchannelスプライト変更
			draws[0][0].x = tabsprite[0][0].x + (ch[i] * cellhto(2)); //よくない
			scr.drawSpriteChunk(draws, cellhto(cm.x + (ch[i] * 2)), cellhto(cm.y));
		}
		
	},
	
	drawFrameLine: function(frameline, cx, cy, rep_x, rep_y, size)
	{
		var x, y, sHeight, sWidth
			, scr = scrollByName('bg1')
			, sprite = makeSpriteChunk(this.uiImageName, makeRect(frameline))
		;
		size = size == null ? CHIPCELL_SIZE : size;
		rep_y = (rep_y == null ? 1 : rep_y);
		rep_x = (rep_x == null ? 1 : rep_x);
		for(y = 0; y < rep_y; y++){
			sHeight = sprite.length;
			for(x = 0; x < rep_x; x++){
				sWidth = sprite[0].length;
				scr.drawSpriteChunk(sprite, ((x * sWidth) + cx) * size, ((y * sHeight) + cy) * size);
			}
		}
	},
	
	drawOutputWave: function()
	{
		pre_y = null;
// console.log(ltkb.litroSound);
		data = ltkb.litroSound.outputBuffer;
		for(px = 0; px < chOscWidth; px++){
				i = (px * (data.length / chOscWidth)) | 0;
				py = (-data[i] * chOscHeight) + chOscHeight_h;
				from = {x: px + ofsx + chOscWidth + 24, y: py + ofsy};
				to = {x: px + ofsx + chOscWidth + 24, y: pre_y == null ? py + ofsy : pre_y + ofsy};
				spr.spriteLine(from, to, sprite);
				
				pre_y = py;
			
		}
	},
	
	drawChannelWave: function(ch)
	{
		var channel = ch == null ? this.litroSound.channel : [ch]
			, data, c, i, dindex
			, layerScale
			, px, py
			, pre_y
			, from, to
			, spr = scrollByName('sprite')
			, sprite = this.waveSprite
			, chOscWidth = 60
			, chOscHeight = cellhto(6) - 2
			, chOscHeight_h = (chOscHeight / 2) | 0
			, cm = {x: 26, y: 17}
			;
		;
		

		for(c = 0; c < channel.length; c++){
		// for(c  in channel){
			data = channel[c].data;
			if(this.status_on[c] == null){
				continue;
			}
			for(i = 0; i < chOscWidth; i++){
				dindex = (i * (data.length / chOscWidth)) | 0;
				px = i + cellhto(cm.x);
				py = ((-data[dindex] * (chOscHeight / ltkb.litroSound.WAVE_VOLUME_RESOLUTION)) + chOscHeight_h + cellhto(cm.y)) | 0;
				from = {x: px, y: py};
				to = {x: px, y: pre_y == null ? py : pre_y};
				spr.spriteLine(from, to, sprite);
				
				pre_y = py;
				// console.log(py);
				// break;
			}
			break;
		}

		// console.log(data.length);
	},
	
	drawOnkey: function()
	{
		var i
			, cm_w = this.whiteKeysCmargin
			, cm_b = this.blackKeysCmargin
			, spritekeys = this.noteKeysSpriteKeys
			, wSprite = this.whiteKeysSprite
			, bSprite = this.blackKeysSprite
			, sprite = null
			, scr = scrollByName('sprite')
			, chr
			, keyIndex
			;
			
		for(i = 0; i < this.status_on.length; i++){
			chr = this.status_on[i];
			if(chr == null){
				continue;
			}
			if(this.isBlackKey(chr)){
				keyIndex = this.indexAtBlack(chr);
				sprite = this.blackKeysSprite[spritekeys[chr]];
				scr.drawSpriteChunk(sprite, cellhto(cm_b.x + ((this.BLACK_KEY_SKIP[chr] + keyIndex) * 2)), cellhto(cm_b.y));
			}else{
				keyIndex = this.indexAtWhite(chr);
				sprite = this.whiteKeysSprite[spritekeys[chr]];
				// console.log(spritekeys);
				scr.drawSpriteChunk(sprite, cellhto(cm_w.x + (keyIndex * 2)), cellhto(cm_w.y));
			}
			
			
		}
	},
	
	keycheck: function(){
		var hold, trigs, untrigs, row, chars, name, cont = this.keyControll
		;
		chars = this.ROW_CHARS;
		// console.log(chars);
		for(row in chars){
			trigs = cont.getTrig(chars[row]);
			untrigs = cont.getUntrig(chars[row]);
			for(name in trigs){
				if(trigs[name]){
					this.onCode(name);
				}
			}
			for(name in untrigs){
				if(untrigs[name]){
					this.offCode(name);
				}
			}
		}
		
		chars = this.OCTAVE_KEYCODE;
		// console.log(trigs);
		for(name in chars){
			trigs = cont.getTrig(name);
			// untrigs = cont.getUntrig(name);
			if(trigs){
				if(name == '^' || name == '+' ){
					this.incOctave();
				}
				if(name == '-'){
					this.decOctave();
				}
				if(this.octaveEvent != null){
					this.octaveEvent();
				}
			}
		}
		
		//カーソル移動
		trigs = cont.getTrig(this.corsolKeys);
		for(key in trigs){
			if(trigs[key]){
				this.moveParamCursor(key);
			}
		}
		
		//操作キー
		trigs = cont.getTrig(this.baseKeys);
		hold = cont.getHold(this.baseKeys);
		for(key in trigs){
			if(trigs[key] || hold[key]){
				this.baseKeyOn(key);
			}
		}
	}
	

};
function printDebug(val, row){
		var scr = scrollByName('sprite')
			, word = ltkb.word
			, mc = {x: 0, y: 29};
		;
		if(row == null){
			row = 0;
		}
		if(word == null){
			return;
		}
		word.setScroll(scr);
		word.setColor(COLOR_WHITE);
		word.print(val, cellhto(mc.x), cellhto(mc.y - row));
};
	
function drawLitroScreen()
{
	var i
	, ltkb = LitroKeyboardInstance
	, spr = scrollByName('sprite')
	, bg1 = scrollByName('bg1')
	, bg2 = scrollByName('bg2')
	, view = scrollByName('view')
	, scr = scrollByName('screen')
	;
	
	if(ltkb.imageLoaded === false){
		return;
	}
	ltkb.drawChannelWave();
	ltkb.drawOnkey();
	ltkb.drawOctaveButton();
	ltkb.drawSeek();
	bg1.drawto(view);
	bg2.drawto(view);
	// bg2.drawto(view, ltkb.paramsScrollOffset.y);
	spr.drawto(view);
	spr.clear();
	// view.drawto(view);
	screenView(scr, view, VIEWMULTI);

}


//call at 60fps
function litroKeyboardMain()
{
	var i
	, ltkb = LitroKeyboardInstance
	;
	// ltkb.test();
	ltkb.keycheck();
	drawLitroScreen();
};


