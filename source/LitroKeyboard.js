/**
 * Litro Sound Library
 * Since 2013-11-19 07:43:37
 * @author しふたろう
 */
var litroKeyboardInstance = null;
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
	this.iWHITE_KEYS = {};
	this.iBLACK_KEYS = {};
	this.BLACK_KEY_SKIP = {};
	this.BLACK_KEY_SKIP_I = [];
	this.BLACK_KEY_SKIP_SUM = 4;
	this.BLACK_KEY_SKIP_OV = {'2': 0, '3': 0, '5': 1, '6': 1, '7': 1, '9': 2, '0': 2, 's': 2, 'd': 2, 'g': 3, 'h': 3, 'j': 3, 'l': 4, ';': 4,};
	this.BLACK_KEY_SKIP_ST = {'2': 0, '3': 0, '5': 1, '6': 1, '7': 1, '9': 2, '0': 2, 's': 3, 'd': 3, 'f': 3, 'h': 4, 'j': 4};
	this.octaveLevel = 2;
	this.octaveRange = 3; //octave level range
	this.octaveInKeys = 12; //1オクターブ中のキー数
	this.octaveInWhiteKeys = 7; //1オクターブ中の白鍵キー数
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
	
	// this.paramKeys = ['VOLUME', 'TYPE', 'LENGTH', 'DELAY', 'DETUNE', 'SWEEP', 'ATTACK', 'DECAY', 'SUSTAIN', 'RELEASE' ];
	this.paramKeys = ['TYPE', 'ATTACK', 'DECAY', 'VOLUME', 'LENGTH', 'SUSTAIN', 'RELEASE' , 'DELAY', 'DETUNE', 'SWEEP', ];
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
		'DETUNE': 'detune',
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
	
	this.editMode = 'tune';
	// this.modeNames = ['tune', 'note', 'file', 'play'];
	// this.modeNames = {0:'tune', 1:'note', 2:'play', 3:'catch'};
	this.modeNames = ['tune', 'note', 'play', 'catch'];
	// this.modeNames = ['tune', 'note'];
	
	this.selectNoteTime = -1;
	this.catchNotes = {note:{}, ch:-1};
	this.catchNoteBlinkCycle = 0;
	
	
	this.noteSprite = 176;
	
	this.noteScrollCmargin = {x: 3, y: 3};
	this.noteCmargin = {x: 0, y: 11.5};
	// this.noteCmargin = {x: 3, y: 11.5};
	this.noteScrollPos = {x: 0, y: 0};
	this.noteScrollPage = 0;
	
	this.noteRange = 1; // position multiple
	this.noteRangeCells = 40; // 8px * 32cells
	this.noteRangeScale = 4000; // msec per page
	
	this.seekLineCount= 0; //note をセットする位置アニメ

	this.seekSprite = 242; //ノートカーソル
	this.arrowSprite = 240; //左右カーソル
	this.seekCmargin = {x: 2, y: 0};

	this.menuDispCmargin = {x: 24, y: 17};
	this.ocsWaveCmargin = {x: 26, y: 17};
	this.menuCsize = {w: 12, h: 6};
	this.menuCindent = 2;

	this.catchMenuList = ['KEEP'];
	// this.noteMenuList = ['CATCH', 'PASTE', 'REMOVE'];
	this.noteMenuList = ['CATCH', 'PASTE', 'REMOVE'];
	this.noteMenuCursor = {x:0, y:0};
	
	this.fileMenuList = ['LOAD', 'SAVE', 'CLEAR'];
	this.fileTypeList = ['COOKIE', 'STRINGS', 'SERVER'];
	this.clearMenuList = ['FILE', 'CURRENT'];
	this.finalConf = ["OK", "NO"];
	this.fileMenuMap = {};
	this.commandPath = [];
	this.fileMenuCursor = {x:0, y:0};
	
	this.modeRect = {tune: [0, 13, 2, 2], note: [2, 13, 2, 2], file: [4, 13, 2, 2], play: [6, 13, 2, 2], 'catch': [8, 13, 2, 2]};
	this.modeCmargin = {x: 32, y: 19};
	this.word = null;
	
	// this.playSound = false;
	this.bg2x = {t: 0, b: 0};
	
	this.chOscWidth = 64;
	this.analyseRate = 4; // perFrame
	this.analyseCount = 0;
	// this.analysedData = new Uint8Array(this.chOscWidth);
	// this.analysedData_b = new Uint8Array(this.chOscWidth);
	this.analysedData = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
	this.analysedData_b = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
	
	return;
}

LitroKeyboard.prototype = {
	init : function(litroSound) {
		var code, row, chars, i
		, whiteCount = 0
		, blackCount = 0
		, codeNameCount = 0
		, repkeys_ff = this.KEY_REPLACE_FIREFOX;
		this.litroSound = litroSound;
		litroKeyboardInstance = this;
		this.keyControll = new KeyControll();
		this.player = litroPlayerInstance;
		
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
		// console.log(this.iWHITE_KEYS);
		
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
		// for(i = 0; i < this.litroSound.channel.length; i++){
			// this.noteData.push({});
		// }
		
		//ファイルメニュー設定
		this.fileMenuMap = {
			LOAD: this.fileTypeList,
			SAVE: this.fileTypeList,
			CLEAR: this.clearMenuList,
			COOKIE: this.finalConf,
			STRINGS: this.finalConf,
			SERVER: this.finalConf,
			FILE: this.finalConf,
			CURRENT: this.finalConf,
		};
		//
		
		this.loadImages();
		this.initFingerState(this.fingers);
		this.initCanvas();
		this.initWords();
		this.setBg2Position(this.noteScrollPos.x);
		this.drawNoteScroll(0);
		this.drawNoteScroll(1);
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
	
	initCatchNotes: function()
	{
		this.catchNotes.note = {};
		this.catchNotes.ch = -1;
		this.selectNoteTime = -1;
	},
	
	loadImages: function()
	{
		// this.loader.init();
		var resorce = loadResource([this.uiImageName]);
		resorce.onload = function(){
			var ltkb = litroKeyboardInstance;
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
	
	noteCurrentHeight: function(key)
	{
		var start = this.octaveLevel * this.octaveInKeys
			, append = 0;
		;
		key = key - start;
		while(this.octaveInKeys < key){
			key = key - this.octaveInKeys;
			append++;
		}
		return this.iWHITE_KEYS[this.CHARS_INDEX[key]] + (append * this.octaveInWhiteKeys);
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

	getKeysDefine: function(){
		return this.CONTROLL_CHARS;
	},
	
	getLastCommand: function()
	{
		return this.commandPath[this.commandPath.length - 1];
	},
	
	getNoteMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.noteMenuList;
		}
		return null;
	},
	
	getFileMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.fileMenuList;
		}
		return  this.fileMenuMap[this.commandPath[this.commandPath.length - 1]] == null ? 
		null :  this.fileMenuMap[this.commandPath[this.commandPath.length - 1]];
	},
	
	getCatchMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.catchMenuList;
		}
		return null;
		// return  this.fileMenuMap[this.commandPath[this.commandPath.length - 1]] == null ? 
		// null :  this.fileMenuMap[this.commandPath[this.commandPath.length - 1]];
		
	},
	
	getActiveModeMenuList: function()
	{
		switch(this.getMode())
		{
			case 'tune': return [];
			case 'note': return this.getNoteMenuList();
			case 'play': return this.getFileMenuList();
			case 'catch': return this.getCatchMenuList();
			default: return [];
		}
	},
	
	getActiveModeCursor: function()
	{
		switch(this.getMode())
		{
			case 'tune': return this.paramCursor;
			case 'note': return this.noteMenuCursor;
			case 'play': return this.fileMenuCursor;
			case 'catch': return {};
			default: return {};
		}
	},
	
	/**
	 * 位置調整系
	 * @param {Object} pos
	 */
	getNoteDispPos: function(pos)
	{
		pos = pos == null ? this.player.noteSeekTime : pos;
		return (pos % this.noteRangeScale) * (DISPLAY_WIDTH / this.noteRangeScale);
	},
	
	getNoteSeekPage: function(putpos)
	{
		putpos = putpos == null ? this.player.noteSeekTime : putpos;
		return (putpos / this.noteRangeScale) | 0;
	},
	
	resolutedTime: function(time)
	{
		var cellTime = (this.noteRangeScale / this.noteRangeCells) | 0
			, abTime = time % cellTime
		;
		return cellTime - abTime > abTime ? time - abTime : time - abTime + cellTime ;
	},
	
	playLitro: function()
	{
		if(!this.player.isPlay()){
			return;
		}
		this.updateForwardSeek();
	},
	
	makeNote: function(code, octave, time)
	{
		// time = time == null ? this.noteScrollPos : time;
		time = time == null ? this.player.noteSeekTime: time;
		var note = {time: this.resolutedTime(time), key: code + (octave * this.octaveInKeys)}
			;
		// console.log(note);
		return note;
	},
	
	setNote: function(ch, note)
	{
		var setTime = note.time;
		
		this.player.noteData[ch][setTime] = note;
		// console.log(this.noteData, ch, note);
	},
	
	pasteNote: function(ch, time, notes)
	{
		var note, t, noteArray = [], reverseTime, startTime, endTime, moveTime;
		notes = notes == null ? this.catchNotes.note : notes;
		for(t in notes){
			noteArray.push(notes[t]);
		}
		if(noteArray.length == 0){
			return;
		}
		moveTime = noteArray[0].time <= this.selectNoteTime ? time - noteArray[0].time : time - noteArray[noteArray.length - 1].time;
		for(t in notes){
			if((t | 0) + moveTime < 0){
				continue;
			}
			note = this.makeNote(notes[t].key, 0, (t | 0) + moveTime);
			this.setNote(ch, note);
		}
	},
	
	deleteNote: function(ch, notes)
	{
		if(this.player.noteData[ch] == null){
			return;
		}
		for(var t in notes){
			if(this.player.noteData[ch][t] == null){
				continue;
			}
			delete this.player.noteData[ch][t];
		};
	},
	
	onCode: function(chr)
	{
			// console.log(chr);

		var channel, chars, row, octave, code, i
			, pos = this.getNoteDispPos()
			, seekPage = this.getNoteSeekPage();
		;
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
		
		// console.log(this.noteSeekTime);
		this.setNote(channel, this.makeNote(code, octave));
		this.drawNoteScroll(seekPage);
		if(pos < cellhto(2) ){
			this.drawNoteScroll(seekPage - 1);
		}else if(pos > cellhto(this.noteRangeCells) - cellhto(2) ){
			this.drawNoteScroll(seekPage + 1);
		}

	},
	
	offCode: function(chr)
	{
		var channel = this.searchState(chr);

		if(chr == null || channel < 0){
			// this.offkeyEvent();
			// this.initFingerState(this.fingers);
			// this.litroSound.offNoteFromCode();
			// console.log('chr: ' + chr);
			return;
		}
		if(this.offkeyEvent != null){
			this.offkeyEvent(chr);
		}
		this.status_on[channel] = null;
		// this.litroSound.offNoteFromCode(channel);
		this.litroSound.fadeOutNote(channel);
	},
	
	incOctave: function()
	{
		if(this.octaveLevel < this.litroSound.OCTAVE_MAX){
			this.octaveLevel++;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
		}
	},
	
	decOctave: function()
	{
		if(this.octaveLevel > 0){
			this.octaveLevel--;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
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
	
	changeEditMode: function(mode)
	{
		if(typeof mode == 'string'){
			this.editMode = mode;
		}else if(mode == parseInt(mode, 10)){
			this.editMode = this.modeNames[mode];
		}
		this.commandPath = [];
		return;
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
	
	updateScrollPage: function(scrollPos)
	{
		var page
		;
		scrollPos = scrollPos == null ? this.noteScrollPos.x : scrollPos;
		page = (scrollPos / DISPLAY_WIDTH) | 0;
		if(this.noteScrollPage != page){
			this.noteScrollPage = page;
			return true;
		}else{
			return false;
		}
	},
	
	seekTime: function(seekPos)
	{
		seekPos = seekPos == null ? this.noteScrollPos.x : seekPos;
		return seekPos * (this.noteRangeScale * this.noteRange / DISPLAY_WIDTH);
	},	
	seekPosition: function(seekTime)
	{
		seekTime = seekTime == null ? this.player.noteSeekTime : seekTime;
		// console.log(seekTime *DISPLAY_WIDTH / (this.noteRangeScale * this.noteRange));
		return  seekTime * DISPLAY_WIDTH / (this.noteRangeScale * this.noteRange);
	},
	//スクロール合わせ
	setBg2Position: function(scrollPos)
	{
		var pos = scrollPos | 0
			// , pos = ((DISPLAY_WIDTH * (scrollPos / this.noteRangeScale)) | 0)
			, pre = (this.bg2x.t / DISPLAY_WIDTH) | 0
		;
		this.bg2x.t = - (((pos + DISPLAY_WIDTH) % (DISPLAY_WIDTH * 2)) - DISPLAY_WIDTH);
		
		if(this.bg2x.t >= 0){
			this.bg2x.b = this.bg2x.t - DISPLAY_WIDTH;
		}else{
			this.bg2x.b = this.bg2x.t + DISPLAY_WIDTH;
		}
	},
	
	updateForwardSeek: function(pos)
	{
		var centerPos = this.seekPosition(this.noteRangeScale * this.noteRange / 2)
			, setPos = this.seekPosition()
			, player = this.player
			;
		this.noteScrollPos.x = setPos > centerPos ? setPos - centerPos: 0;
		this.setBg2Position(this.noteScrollPos.x);
		if(this.updateScrollPage()){
			this.drawNoteScroll(this.noteScrollPage + 1);
		}
	},

	updateBackSeek: function()
	{
		var centerPos = this.seekPosition(this.noteRangeScale * this.noteRange / 2)
			, setPos = this.seekPosition()
			, player = this.player
			;
		this.noteScrollPos.x = setPos < centerPos ? 0 : setPos - centerPos;
		this.noteScrollPos.x = this.noteScrollPos.x < 0 ? 0 : this.noteScrollPos.x;
		this.setBg2Position(this.noteScrollPos.x);
		if(setPos == 0){
			this.updateScrollPage();
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
		}else if(this.updateScrollPage()){
			this.drawNoteScroll(this.noteScrollPage);
		}		
	},
	
	/**
	 * キーチェック
	 */
	moveMenuCursorCommon: function(cur, dir, list)
	{
		var limit = list.length
			, moveTime = this.seekTime(cellhto(1));
			// , moveTime = this.noteRange * this.noteRangeScale / this.noteRangeCells
		;
		// console.log(moveTime);
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit;
					this.drawNoteMenu();
					this.drawNoteCursor();
					break;
			case 'down': cur.y = (cur.y + 1) % limit;
					this.drawNoteMenu();
					this.drawNoteCursor();
					break;
			case 'left': this.player.seekMoveBack(moveTime); this.updateBackSeek(); break;
			case 'right': this.player.seekMoveForward(moveTime); this.updateForwardSeek(); break;
		}
	},
	
	moveChannelParamCursor: function(dir)
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
	
	moveCatchCursor: function(dir)
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, limit = this.paramLimit
			, offset = this.paramOffset
			, serchTime = -1
			, ch = cur.x
		;
		// this.drawParamCursor(curr.x, curr.y, true);
		
		switch(dir){
			case 'up':
							break;
			case 'down': 
							break;
			case 'left': searchTime = this.player.searchNearBack(ch, this.player.noteSeekTime, 0, {type: 'note', time: this.selectNoteTime}); break;
			case 'right': searchTime = this.player.searchNearForward(ch, this.player.noteSeekTime, -1, {type: 'note', time: this.selectNoteTime}); break;
		}
		
		if(searchTime >= 0){
			if(this.catchNotes.ch != ch){
				//違うチャンネルをキャッチした
				this.catchNotes.note = {};
			}
			
			if(searchTime in this.catchNotes.note){
				//もどった
				delete this.catchNotes.note[this.selectNoteTime];
			}
			
			this.selectNoteTime = searchTime;
			if(searchTime > this.player.noteSeekTime){
				//前へキャッチ
				this.player.noteSeekTime = searchTime;
				this.updateForwardSeek();
			}else{
				//後ろへキャッチ
				this.player.noteSeekTime = searchTime;
				this.updateBackSeek();
			}
			
			this.catchNotes.note[searchTime] = this.player.noteData[ch][searchTime];
			this.catchNotes.ch = ch;
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
		}
		// this.drawParamKeys(offset, limit);
		// this.drawChannelParams(offset, limit);
		// this.drawParamCursor(curr.x, curr.y, false);
	},
	
	movefileMenuCursor: function(dir)
	{
		var cur = this.fileMenuCursor
			, curr = this.paramCursorCurrent
			, limit
			, offset = this.paramOffset
			, chLength = this.litroSound.channel.length
			, paramsLength = this.paramKeys.length
			, list = this.getFileMenuList()
			, currentLength
		;
		if(list == null){
			 return;
		}
		limit = list.length;
		currentLength = paramsLength - (limit - 1);
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit; break;
			case 'down': cur.y = (cur.y + 1) % limit; break;
			case 'left': cur.y = 0; break;
			case 'right': cur.y = limit - 1; break;
		}
		this.paramOffset = offset;
		
		this.drawFileMenu();
		this.drawFileCursor();
	},
	
	moveNoteMenuCursor: function(dir)
	{
		var cur = this.noteMenuCursor
			, list = this.noteMenuList
		;
		this.moveMenuCursorCommon(cur, dir, list);
	},
	
	selectMenu: function()
	{
		var list = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			;
		if(list == null){
			return this.getLastCommand();
		}
		this.commandPath.push(list[cur.y]);
		return list[cur.y];
	},
	
	backMenu: function()
	{
		var list = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			, p
			;
		if(this.commandPath.length == 0){
			return []; //??
			// return list[cur.y];
		}
		p = this.commandPath.pop();
		return list == null ? p : list[cur.y];
	},
	
	baseKeyOnChannel: function(key)
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, param = this.ltSoundChParamKeys[this.paramKeys[cur.y]]
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
				this.editMode = this.editMode == 'tune' ? 'note' : 'tune';
				this.drawMenu();
				this.commandPath = [];
				break;
			case 'space': 
				this.playKeyOn();
				break;
		}
	},
	
	baseKeyOnCatch: function(key)
	{
		var cur = this.noteMenuCursor
		;
		switch(key){
			case '<': 
				this.editMode = this.selectNoteTime < 0 ? 'note' : this.editMode;
				this.initCatchNotes();
				this.drawMenu();
				break;
			case '>': 
				this.changeEditMode('note');
				cur.y = 1;
				this.drawMenu();
				break;
			case 'select': 
				this.changeEditMode('note');
				this.drawMenu();
				break;
			case 'space': 
				this.playKeyOn();
				break;
		}
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
	},
	
	baseKeyMenuCommon: function(cursor, key)
	{
		var com = ''
			, player = this.player
			;
		switch(key){
			case '<': 
				com = this.backMenu();
				cursor.y = 0;
				this.drawMenu();
				break;
			case '>': 
				com = this.selectMenu();
				this.drawMenu();
				break;
			case 'select': 
				this.editMode = this.editMode == 'tune' ? 'note' : 'tune';
				this.commandPath = [];
				this.drawMenu();
				break;
			case 'space': 
				this.playStartLitro();
				com = 'space';
			break;
		}
		return com;
	},
	
	baseKeyOnNote: function(key)
	{
		var cur = this.noteMenuCursor
			, com = '';
		;
		com = this.baseKeyMenuCommon(cur, key);
		if(com == 'CATCH'){
			this.changeEditMode('catch');
			cur.y = 0;
			this.initCatchNotes();
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
			this.drawMenu('catch');
		}else if(com == 'PASTE'){
			this.pasteNote(cur.x, this.player.noteSeekTime, this.catchNotes.note);
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
			this.commandPath = [];
		}else if(com == 'REMOVE'){
			this.deleteNote(this.catchNotes.ch, this.catchNotes.note);
			this.initCatchNotes();
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
			this.commandPath = [];
		}
		else{
			cur.y = 0;
		}
		if(com == 'space'){
		}
		
	},	
	baseKeyOnFile: function(key)
	{
		var fcur = this.fileMenuCursor
		;
		this.baseKeyMenuCommon(fcur, key);
		
	},	
	playKeyOn: function()
	{
		var  player = this.player
			;
			
		if(!player.isPlay()){
			player.seekMoveBack(-1);
			this.updateBackSeek();
			this.editMode = 'play';
			this.drawMenu('play');
			this.drawOscillo();
		}else{
			this.editMode = 'tune';
			this.drawMenu();
		}
		player.isPlay() == true ? player.stop() : player.play();
	},
	
	baseKeyOn: function(key)
	{
		if(key == 'space'){
			this.playKeyOn();
			return;
		}
		
		switch(this.editMode){
			case 'tune': this.baseKeyOnChannel(key);break;
			case 'note': this.baseKeyOnNote(key);break;
			case 'play': this.baseKeyOnChannel(key);break;
			// case 2: this.baseKeyOnFile(key);break;
			case 'catch': this.baseKeyOnCatch(key);break;
			// case 3: this.baseKeyOnFile(key);break;
		}
	},
	
	holdKeyCommon: function(key)
	{
		this.baseKeyOn(key);
		// switch(this.editMode){
			// case 0: this.baseKeyOn(key);break;
			// case 1: this.baseKeyOnChannel(key);break;
			// case 2: this.baseKeyOnFile(key);break;
			// case 3: this.baseKeyOnChannel(key);break;
		// }
	},
	
	moveCursor: function(dir)
	{
		switch(this.editMode){
			case 'tune': this.moveChannelParamCursor(dir);break;
			case 'note': this.moveNoteMenuCursor(dir);break;
			case 'play': this.moveChannelParamCursor(dir);break;
			case 'catch': this.moveCatchCursor(dir);break;
			// case 2: this.movefileMenuCursor(dir);break;
			// case 2: this.movefileMenuCursor(dir);break;
			// case 3: this.baseKeyOnChannel(dir);break;
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
		hold = cont.getHold(this.corsolKeys);
		for(key in trigs){
			if(trigs[key] || hold[key]){
				this.moveCursor(key);
			}
		}
		
		//操作キー
		trigs = cont.getTrig(this.baseKeys);
		hold = cont.getHold(this.baseKeys);
		for(key in trigs){
			if(trigs[key] || hold[key]){
				this.holdKeyCommon(key);
			}
		}
	},
	
	openFrame: function()
	{
		var i, j
			, noteRollLeft = [1, 0, 2, 1]
			, noteRollRight = [3, 0, 2, 1]
			, eventRollLeft = [11, 0, 2, 1]
			, eventRollRight = [11, 0, 2, 1]
			, eventFaceLine = [14, 0, 1, 1]
			, eventFaceSpace = [14, 0, 1, 1]
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
		;
		
		scrollByName('bg1').clear(null, makeRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT / 2));

		//上半分
		this.drawFrameLine(noteRollLeft, 0, 1, 1, 6);
		
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
		
		//初期メニュー表示
		this.drawMenu();

		// オクターブ
		this.drawOctaveMeter(this.octaveLevel);
		
		this.drawChannelTab_on();
		
		this.drawParamKeys();
		
		this.drawChannelParams();
		
		this.drawParamCursor();
		
		this.drawNoteScroll(this.noteScrollPage);
		this.drawNoteScroll(this.noteScrollPage + 1);
		// scrollByName('bg1').spriteLine({x:50, y:20},{x:50, y:0}, this.waveSprite);

	},
	
	drawSeek: function()
	{
		var sprite = makeSprite(this.uiImageName, this.seekSprite)
			, arrow = makeSprite(this.uiImageName, this.arrowSprite)
			, scr = scrollByName('sprite')
			, mc = this.seekCmargin
			, i
			, from, to
			, min_y, max_y
			, centerPos = (cellhto(this.noteRangeCells) * this.noteRange / 2)
			// , x = (this.player.noteSeekTime) * this.noteRange * (cellhto(this.noteRangeCells) / this.noteRangeScale)
			, x = this.seekPosition()
			, px = Math.sin(this.seekLineCount / 20) * 4;
		;
		// printDebug(cellhto(mc.x) + x, 1);
		
		// console.log(centerTime, x);
		x = x < centerPos? x : centerPos;
		scr.drawSprite(sprite, cellhto(mc.x) + x, mc.y);
		if(this.getMode() == 'note'){
			scr.drawSprite(arrow, cellhto(mc.x + 2) + x + px, mc.y);
			arrow.hflip(true);
			scr.drawSprite(arrow, cellhto(mc.x - 2) + x - px, mc.y);
			arrow.hflip(false);
		}
		
		from = {x: cellhto(mc.x + 2) + x - 1, y: mc.y + this.seekLineCount + cellhto(2)};
		to = {x: from.x, y: mc.y + this.seekLineCount + cellhto(3)};
		
		min_y = cellhto(2);
		max_y = (cellhto(this.octaveRangeCells + 2) / 2) + min_y;
		for(i = -5; i < 0; i++){
			from.y = this.seekLineCount + cellhto(i * 2);
			to.y = this.seekLineCount + cellhto(1 + (i * 2));
			from.y = from.y < min_y ? min_y : from.y;
			to.y = to.y < min_y ? min_y : to.y;
			from.y = from.y > max_y ? max_y : from.y;
			to.y = to.y > max_y ? max_y : to.y;
			if(from.y == to.y){continue;}
			
			scr.spriteLine(from, to, this.waveSprite);
		}
		
		this.seekLineCount = (this.seekLineCount + 4) % DISPLAY_HEIGHT;
	},
	
	drawScoreBoard: function(bottom)
	{
		var scr = scrollByName('bg2')
			, i, xc, yc, s
			, xCells = (DISPLAY_WIDTH / cellhto(1)) | 0
			, noteStart = makeSprite(this.uiImageName, 5)
			, notePeriod = makeSprite(this.uiImageName, 6)
			, noteLine = makeSprite(this.uiImageName, 7)
			, noteSpaceStart = makeSprite(this.uiImageName, 8)
			, noteSpacePeriod = makeSprite(this.uiImageName, 9)
			, noteSpace = makeSprite(this.uiImageName, 10)
			, line5 = [1, 3, 7, 9, 10]
			, spaces = [4, 5, 12]
			, btmOffset
			;
			
		bottom == bottom == null ? false : bottom;
		btmOffset = bottom ? (DISPLAY_HEIGHT / 2) | 0 : 0;
		
		for(yc = 0; yc < line5.length; yc++){
			for(xc = 0; xc < xCells; xc += 2){
				s = xc % 5 == 0 ? notePeriod : noteLine;
				if(xc == 0){s = noteStart;}
				scr.drawSprite(s, cellhto(xc), cellhto(line5[yc]) + btmOffset);
			}
		}
		for(yc = 0; yc < spaces.length; yc++){
			for(xc = 0; xc < xCells; xc += 2){
				s = xc % 5 == 0 ? noteSpacePeriod : noteSpace;
				if(xc == 0){s = noteSpaceStart;}
				scr.drawSprite(s, cellhto(xc), cellhto(spaces[yc]) + btmOffset);
			}
		}
		
	},
	
	drawNoteTest: function()
	{
		var i;
		for(i = 0; i < this.octaveRangeCells; i++){
			this.drawNoteRaster(0, 2, i, 0, false, false);
		}
	},

	//bg2の上下分割描画
	drawNoteRaster: function(ch, cx, cy, rot, bottom, catchMode, divofs)
	{
		var spriteId = this.noteSprite
			, noteCm = this.noteCmargin
			, sprite
			, x, y
		;
		divofs = divofs == null ? 0 : divofs;
		if(cx < -1 || cy < 0){return;}
		if(cx >= this.noteRangeCells + 1 || cy >= this.octaveRangeCells){return;}
		x = cellhto(noteCm.x + cx);
		y = cellhto(noteCm.y - (cy / 2));
		y += rot == 3 ? cellhto(1) / 2 : 0;
		x -= rot == 3 ? cellhto(1) / 2 : 0;
		sprite = makeSprite(this.uiImageName, spriteId + ch);
		sprite.rot(rot);
		if(!catchMode){
			y += (bottom ? DISPLAY_HEIGHT / 2 : 0);
			scrollByName('bg2').drawSprite(sprite, x, y);
		}else{
			x += cellhto(this.noteScrollCmargin.x) - divofs;
			scrollByName('sprite').drawSprite(sprite, x, y);
		}
	},
		
	drawNoteScroll: function(page , catchMode)
	{
		page = page == null ? this.noteScrollPage | 0 : page;
		var data, t, x, y, note, drawCnt = 0
			, bottom = (page % 2 == 0) ? false : true
			, scrollTop = !bottom ? 0 : (DISPLAY_HEIGHT / 2)
			, testcolor = !bottom ? COLOR_ADD : COLOR_PARAMKEY
			, cellTime = this.noteRangeScale / this.noteRangeCells
			, divofsTime = 0;
		;
		if(this.litroSound.channel == null){
			return;
		}
		keyStart = this.octaveLevel * this.octaveInKeys;
		keyEnd = keyStart + (this.octaveInKeys * this.octaveRange);
		catchMode = catchMode == null ? false : catchMode;
		if(!catchMode){
			timeStart = this.noteRangeScale * page;
			timeEnd = timeStart + this.noteRangeScale;
			this.drawScoreBoard(bottom);
		}else{
			timeStart = this.seekTime(this.noteScrollPos.x);
			divofsTime = timeStart % (cellTime | 0); //スクロール考慮時間
			timeStart -= divofsTime;
			divofsTime = divofsTime * (DISPLAY_WIDTH / this.noteRangeScale) | 0;//スクロール考慮ピクセル変換
			timeEnd = timeStart + this.noteRangeScale;
			this.catchNoteBlinkCycle++;
		}
		
		for(ch = 0; ch < this.litroSound.channel.length; ch++){
			if(!catchMode){
				data = this.player.noteData[ch];
			}else{
				if(ch != (this.catchNotes.ch | 0)){
					continue;
				}
				data = this.catchNotes.note;
				// printDebug(this.catchNotes.ch, 11);
			}
			for(t = timeStart - cellTime; t < timeEnd + cellTime; t += cellTime){
				if(data[t] == null){
					continue;
				}else if(!catchMode && t in this.catchNotes.note && this.catchNotes.ch == ch){
					continue;
				}
				drawCnt = (drawCnt + 1) % 8;
				if(catchMode && (this.catchNoteBlinkCycle % 8 == drawCnt)){
					continue;
				}
				note = data[t];
				
				if(note.key > keyEnd || note.key < keyStart){
					continue;
				}
				chr = this.CHARS_INDEX[note.key - keyStart];
				x = ((note.time - timeStart) * this.noteRangeCells / this.noteRangeScale) | 0;
				y = this.noteCurrentHeight(note.key);
				rot = this.isBlackKey(chr) ? 3 : 0;
				this.drawNoteRaster(ch, x, y, rot, bottom, catchMode, divofsTime);
			}
		}
		
	},
	
	//共通メニュー表示
	drawMenuList: function(list)
	{
		var cm = this.menuDispCmargin
			, indent = this.menuCindent
			, word = this.word
			, i
		;
		if(list == null){
			list = ['？？？'];
		}
		word.setScroll(scrollByName("bg1"));
		for(i = 0; i < list.length; i++){
			word.print(list[i].substr(0, 10), cellhto(cm.x + indent), cellhto(cm.y + i), COLOR_PARAMKEY, COLOR_BLACK);
		}		
	},
	
	drawCatchMenu: function()
	{
		menu = this.catchMenuList;
		this.drawMenuList(menu);
	},
	
	drawNoteMenu: function()
	{
		menu = this.noteMenuList;
		this.drawMenuList(menu);
	},	
	drawNoteCursor: function()
	{
		this.drawMenuListCursor(this.noteMenuList, this.noteMenuCursor.y);
	},
	
	//共通メニューカーソル表示
	drawMenuListCursor: function(list, y)
	{
		var keyCm = this.menuDispCmargin
			, indent = this.menuCindent
			, word = this.word
			, key = list[y]
			;
		
		if(list == null){
			list = ['？？？'];
		}
		word.setScroll(scrollByName('bg1'));
		word.print(list[y], cellhto(indent + keyCm.x), cellhto(keyCm.y + y), COLOR_BLACK, COLOR_PARAMKEY);
		
	},
	
	drawFileCursor: function()
	{
		var menu = this.getFileMenuList()
			, cur = this.fileMenuCursor
			;
		if(menu == null){
			menu = ['？？？'];
		}
		this.drawMenuListCursor(menu, cur.y);
	},
		
	drawFileMenu: function()
	{
		var menu = this.getFileMenuList()
		;
		if(menu == null){
			menu = ['？？？'];
		}
		this.drawMenuList(menu);
	},
		
	drawParamCursor: function()
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

		word.setScroll(scrollByName('bg1'));
		color = COLOR_BLACK;
		bgcolor = COLOR_PARAMKEY;
		word.print(key.substr(0, this.paramKeysStrLen), cellhto(keyCm.x), cellhto(keyCm.y + curr.y), color, bgcolor);
		
		color = COLOR_BLACK;
		bgcolor = COLOR_ARRAY[cur.x];
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
			, sublen = 5
			;
		word.setScroll(scrollByName('bg1'));
		
		for(i = 0; i < limit; i++){
			index = (i + offset) % keys.length;
			word.print(str_pad(keys[index], sublen, "　", "STR_PAD_RIGHT") , cellhto(mc.x), cellhto(mc.y + i), COLOR_PARAMKEY, COLOR_BLACK);
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
		word.setScroll(scrollByName('bg1'));
		
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
	
	drawMenuCommon: function(mode)
	{
		var modeName = mode == null ? this.editMode : mode
			, sprite
			, cm = this.modeCmargin
			;
		if(modeName == null){
			return;
		}
		sprite = makeSpriteChunk(this.uiImageName, makeRect(this.modeRect[modeName]));
		scrollByName('bg1').drawSpriteChunk(sprite, cellhto(cm.x), cellhto(cm.y));
	},
	
	clearMenu: function()
	{
		var scr = scrollByName('bg1')
			, cm = this.menuDispCmargin
			, size = this.menuCsize
		;
		scr.clear(COLOR_BLACK, makeRect(cellhto(cm.x), cellhto(cm.y), cellhto(size.w), cellhto(size.h)));
	},
	
	repeatDrawMenu : function()
	{
		//channel note file play
		switch(this.editMode){
			case 'tune': this.player.isPlay() ? this.drawOutputWave() : this.drawChannelWave(); break;
			case 'note': ; break;
			case 'play': this.drawOutputWave(); break;
			case 'catch': ; break;
			
		}
		this.drawSeek();
		this.drawNoteScroll(null, true);
	},
	drawMenu: function(mode)
	{
		mode = mode == null ? null : mode;
		this.clearMenu();
		//channel note file play
		this.drawMenuCommon(mode);
		switch(this.editMode){
			case 'tune': this.drawOscillo(); break;
			case 'note': this.drawNoteMenu(); this.drawNoteCursor(); this.drawNoteScroll(); break;
			case 'play': this.drawOscillo(); break;
			// case 2: this.drawFileMenu(); this.drawFileCursor();  break;
			case 'catch': this.drawCatchMenu(); this.drawMenuListCursor(this.catchMenuList, this.noteMenuCursor.y); break;
			
		}
	},

	
	drawOscillo: function()
	{
		var ocsLineV = [5, 4, 1, 1]
			, ocsLineH = [6, 4, 1, 1]
		;

		// オシロ
		this.drawFrameLine(ocsLineV, 12, 8.5, 1, 3);
		this.drawFrameLine(ocsLineH, 13, 10, 4, 1);
	},
	
	drawOutputWave: function()
	{
		var chOscWidth = 64
			, chOscHeight = cellhto(6) - 2
			, chOscHeight_h = (chOscHeight / 2) | 0
			, data
			, size = (PROCESS_BUFFER_SIZE / this.analyseRate) | 0
			, cm = this.ocsWaveCmargin
			, px, py, i, dindex, ofsx, ofsy = 128, pre_y
			, from, to
			, spr = scrollByName('sprite')
			, sprite = this.waveSprite
			;

		pre_y = null;
		// data = ltkb.litroSound.getAnalyseData(chOscWidth / this.analyseRate);
		// this.analysedData_b.set(data, this.analyseCount * (chOscWidth / this.analyseRate));
		// this.analysedData_b.set(data, this.analyseCount * PROCESS_BUFFER_SIZE);
		this.analyseCount = (this.analyseCount + 1) % this.analyseRate;
			// // console.dir(data);
		if(this.analyseCount == 0){
			// this.analysedData = this.analysedData_b;
			// this.analysedData_b = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
			data = this.litroSound.getAnalyseData(size);
			this.analysedData = data;
		}
		data = this.analysedData;
		for(i = 0; i < chOscWidth; i++){
			dindex = (i * (size / (chOscWidth ) ) | 0);
			px = i + cellhto(cm.x);
			py = data[dindex] != null ? data[dindex] : ofsy;
			py = ((py * (chOscHeight_h / ofsy))  + cellhto(cm.y)) | 0;
			from = {x: px, y: py};
			to = {x: px, y: pre_y == null ? py : pre_y};
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
			, chOscWidth = 64
			, chOscHeight = cellhto(6) - 2
			, chOscHeight_h = (chOscHeight / 2) | 0
			, cm = this.ocsWaveCmargin
			;
		;
		
		if(this.editMode == "file"){
			return;
		}

		for(c = 0; c < channel.length; c++){
		// for(c  in channel){
			data = channel[c].data;
			if(this.status_on[c] == null){
				continue;
			}
			for(i = 0; i < chOscWidth; i++){
				dindex = (i * (data.length / chOscWidth)) | 0;
				px = i + cellhto(cm.x);
				py = (-data[dindex] * chOscHeight) | 0;
				if(py > chOscHeight_h){continue;}
				if(py < -chOscHeight_h){continue;}
				py += chOscHeight_h + cellhto(cm.y);

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
	
};

function LitroSoundFile()
{
	return;
};
LitroSoundFile.prototype = {
	init: function()
	{
		this.fileVersion = 0.01;
		this.fileList = [];
		
	},
	
	loadFromPath: function(path)
	{
	},
	loadFromURL: function(url)
	{
	},
	loadFromCookie: function()
	{
	},
	saveToPath: function(path, data)
	{
	},
	saveToURL: function(url, data)
	{
	},
	saveToCookie: function(data)
	{
	},
	
	decode: function(audioParams)
	{
		
	},
	
	encode: function(str)
	{
		
	}
};


function printDebug(val, row){
		var scr = scrollByName('sprite'), ltkb = litroKeyboardInstance
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
	, ltkb = litroKeyboardInstance
	, spr = scrollByName('sprite')
	, bg1 = scrollByName('bg1')
	, bg2 = scrollByName('bg2')
	, view = scrollByName('view')
	, scr = scrollByName('screen')
	;
	// printDebug(ltkb.litroSound.channel[0].isRefreshClock(), 1);
	if(ltkb.imageLoaded === false){
		return;
	}
	
	// ltkb.drawNoteTest();
	ltkb.repeatDrawMenu();
	ltkb.drawOnkey();
	ltkb.drawOctaveButton();
	bg2.rasterto(view, 0, 0, null, DISPLAY_HEIGHT / 2, ltkb.bg2x.t + cellhto(ltkb.noteScrollCmargin.x), 0);
	bg2.rasterto(view, 0, DISPLAY_HEIGHT / 2, null, DISPLAY_HEIGHT / 2, ltkb.bg2x.b + cellhto(ltkb.noteScrollCmargin.x), 0);
	// bg2.drawto(view);
	bg1.drawto(view);
	spr.drawto(view);
	spr.clear();
	// view.drawto(view);
	screenView(scr, view, VIEWMULTI);
	return;

}


//call at 60fps
function litroKeyboardMain()
{
	var i
	, ltkb = litroKeyboardInstance
	;
	// ltkb.test();
	ltkb.keycheck();
	ltkb.playLitro();
	drawLitroScreen();
};


