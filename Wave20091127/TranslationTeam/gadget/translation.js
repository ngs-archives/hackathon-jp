/**
 * @author maripo
 */

var DUMMY_PO_EN = [
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","Please enter.....", "mails"],
		msgstr: ["Google Wave Bug Report","HOGEHOGE","FUGA"]
	},
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} 
];
var DUMMY_PO_JA = [
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","Please enter.....", "mails"],
		msgstr: ["Google Wave のバグ報告","ほげほげ","ふが"]
	},
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["ふがふが"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ,
	{
		flags: ["fuzzy", "python-format"],
		locations: [["main.py", 1]],
		msgid: ["","HOGEHOGE"],
		msgstr: ["FUGAFUGA"]
	} ];

var Translation = function (options) {
	this.originalLanguage = 'en';
	this.targetLanguage = options.language;
	this.originalFile = options.file;
	this.targetFile = options.file.replace(new RegExp('\\\.'),'_'+this.targetLanguage + '.');
	this.originalDocument = new TranslationDocument(
		{
			language: this.originalLanguage,
			file: this.originalFile,
			editor: $('originalTextContainer'),
			column: $('originalLanguageColumn'),
			foldIcon: $('originalFoldIcon'),
			titleBar: $('originalLanguageTitle'),
		});
	this.targetDocument = new TranslationDocument(
		{
			language: this.targetLanguage,
			file: this.targetFile,
			column: $('targetLanguageColumn'),
			foldIcon: $('targetFoldIcon'),
			editor: $('targetTextContainer'),
			titleBar: $('targetLanguageTitle'),
            
		});
    this.targetDocument.pair = this.originalDocument;
    this.originalDocument.pair = this.targetDocument;
}
Translation.prototype = {
	prepare: function() {
		$('originalLanguageTitle').innerHTML = this.originalFile;
		$('targetLanguageTitle').innerHTML = this.targetFile;
		this.load();
	},
	load: function () {
		//TODO Robot に合わせる
		$('documentEditor').style.display = 'block';
		this.originalDocument.loadPoContent(DUMMY_PO_EN);
		this.targetDocument.loadPoContent(DUMMY_PO_JA);
	},
	toggleFoldOriginal: function () {
		this.originalDocument.toggleFold();
		this._renderFold();
	},
	toggleFoldTarget: function () {
		this.targetDocument.toggleFold();
		this._renderFold();
	},
	_renderFold: function () {
		if (!this.originalDocument.fold && !this.targetDocument.fold) {
			this.originalDocument.showHalf();
			this.targetDocument.showHalf();
		} else if (!this.originalDocument.fold && this.targetDocument.fold) {
			this.originalDocument.showFull();
			this.targetDocument.showFold();
		} else if (this.originalDocument.fold && !this.targetDocument.fold) {
			this.originalDocument.showFold();
			this.targetDocument.showFull();
		} else {
			this.originalDocument.showFold();
			this.targetDocument.showFold();
		}
		
	},
    selectSentence: function (index) {
            this.originalDocument.selectSentence(index);
            this.targetDocument.selectSentence(index);
    }
}
var TranslationDocument = function (options) {
	this.language = options.language;
	this.file = options.language;
	this.editor = options.editor;
	this.column = options.column;
	this.foldIcon = options.foldIcon;
	this.titleBar = options.titleBar;
	this.fold = false;
}
var FOLD_ICON_TO_CLOSE = '[-]';
var FOLD_ICON_TO_OPEN = '[+]';
var PoSentence = function (poObj, index) {
	this.htmlObj = document.createElement('DIV');
    this.htmlObj.onclick = function () {
        translation.selectSentence(index);
    }
	this.topBar = document.createElement('DIV');
	this.topBar.className = 'sentenceTop';
	this.topBar.innerHTML = poObj.msgid.join('');
	this.htmlObj.appendChild(this.topBar);
	for (var i=0;i<poObj.msgstr.length;i++) {
		var msg = poObj.msgstr[i];
		var textarea = document.createElement('TEXTAREA');
		textarea.value = msg;
		textarea.rows = 1;
        this.htmlObj.className = 'sentence';
		this.htmlObj.appendChild(textarea);
	}
}
PoSentence.prototype = {
	getHtmlObj : function () {
		return this.htmlObj;
	}
}
TranslationDocument.prototype = {
	loadPoContent: function (po) {
        this.sentences = new Array();
		for (var i=0, l=po.length; i<l; i++) {
			var sentence = new PoSentence(po[i],i);
			this.editor.appendChild(sentence.getHtmlObj());
            this.sentences[i] = sentence;
		}
	},
    selectSentence: function (index) {
        for (var i=0; i<this.sentences.length; i++) {
            var sentence = this.sentences[i];
            sentence.getHtmlObj().className = (i==index)?'sentence selected':'sentence';
            
        }
    },
	showHalf: function () {
		this.column.style.width = "50%";
		this.editor.style.display = 'block';
		this.titleBar.style.display = 'inline';
		this.foldIcon.innerHTML = FOLD_ICON_TO_CLOSE;
	},
	showFull: function () {
		this.column.style.width = "90%";
		this.editor.style.display = 'block';
		this.titleBar.style.display = 'inline';
		this.foldIcon.innerHTML = FOLD_ICON_CLOSE;
		
	},
	showFold: function () {
		this.column.style.width = "10%";
		this.editor.style.display = 'none';
		this.titleBar.style.display = 'none';
		this.foldIcon.innerHTML = FOLD_ICON_TO_OPEN;
	},
	_parsePo: function (string) {
	},
	toggleFold: function () {
		this.fold = !this.fold;
	}
};

var translation;
function toggleFoldTarget () {
	translation.toggleFoldTarget();
}
function toggleFoldOriginal () {
	translation.toggleFoldOriginal();
}
function startTranslation () {
	var select = $('languageSelect');
	var language = select.options[select.selectedIndex].value;
	var file = $('languageInput').value;
	translation = new Translation (
		{
			language:language,
			file: file
		}
	);
	translation.prepare();
}
function commitTranslation () {
	alert("finishTfanslation")
}
function $ (id) {
	return document.getElementById(id);
}

