<script>
// Constants
var PROMO_VERSION__MODULE_ID__ = 11;
var UACCT = "UA-676947-3";

// Global variables
var prefs__MODULE_ID__ = new _IG_Prefs(__MODULE_ID__);
var mini__MODULE_ID__ = new _IG_MiniMessage(__MODULE_ID__);

// Generate dismissible promotion messages
function createPromoMessages__MODULE_ID__() {
	var prefs = prefs__MODULE_ID__;

	// Reset the promo message to show if versions differ.
	if (prefs.getInt("version") != PROMO_VERSION__MODULE_ID__) {
		prefs.set("promo0", 1,
				"promo1", 1,
				"promo2", 1,
				"version", PROMO_VERSION__MODULE_ID__);
	}

	// Create a dismissible promo message announcing new features with link to group update post.
	// User can hide promo by clicking [x].
	var html;
	if (prefs.getInt("promo0")) {
		html = [
			'<span style="font-size: 0.95em; font-weight: normal;">',
			'<span style="color: #676767; font-size: 0.8em;">2008-06-17</span>',
			' &raquo; New docs: ',
			'<a target="_blank" href="http://documents.google.com/support/spreadsheets/bin/answer.py?answer=96978&topic=14186">',
			'Spreadsheet Gadgets',
			'</a>',
			' -- Got ',
			'<a target="_blank" href="https://spreadsheets.google.com/viewform?key=prK2zS2tW4hrLxARk2pz-aw">',
			'feedback',
			'</a>?',
			'</span>'
				].join("");
		mini__MODULE_ID__.createDismissibleMessage(html, ondismissPromo__MODULE_ID__(0));
	}
}

// Event handler called when user dismisses promo message.
function ondismissPromo__MODULE_ID__(index) {
	return function() {
		_IG_Analytics(UACCT, "/developer/dismissPromo");
		prefs__MODULE_ID__.set("promo" + index, 0);
	}
}

// Called when user clicks on promotion message link.
function onclickPromo__MODULE_ID__() {
	_IG_Analytics(UACCT, "/developer/clickPromo")
}

// Highlights and UnHighlights gadgets
function Highlighter___MODULE_ID__() {
	this.origBackgroundColor = "";
	this.prefs = prefs__MODULE_ID__;
	this.highlightColor = this.prefs.getString("color")

		// i: gadget id
		this.highlight = function(i) {
			this.origBackgroundColor = _gel("m_" + i + "_h").style.backgroundColor;
			_gel("m_" + i + "_h").parentNode.style.backgroundColor = this.highlightColor;
		}

	// i: gadget id
	this.unhighlight = function(i) {
		_gel("m_" + i + "_h").parentNode.style.backgroundColor = this.origBackgroundColor;
	}
}

var Highlighter___MODULE_ID___handle = new Highlighter___MODULE_ID__();

function shouldGadgetUrlBeAnchor__MODULE_ID__(url) {
	return url.indexOf("http://") == 0 || url.indexOf(":") == -1;
}

// Generates HTML to show your current remote gadgets.  Must be called once
// the page is fully loaded, or not all gadgets will be seen.
function onload__MODULE_ID__() {
	// Track pageviews into Google Analytics
	_IG_Analytics(UACCT, "/developer");

	// Create promotion minimessages
	createPromoMessages__MODULE_ID__();

	var s = "";
	s += "<table><tr><img width=1 height=5><br></tr><tr>";
	s += "<td style='width:100%' valign=bottom><font size=-1>Gadget</font></td>";
	s += "<td valign=bottom><font size=-1>Inlined</font></td>";
	s += "<td valign=bottom><font size=-1>Cached</font></td>";
	s += "</tr>";

	for (var i = 0; i < remote_modules.length; i++) {
		var module = remote_modules[i];
		s += "<tr>";

		// Column 1: pretty name, linked to gadget spec.  Extract file name
		// from URL (everything after last "/").
		var url = module.spec_url;
		var pretty_name = module.spec_url;
		// for testing: if (i==0) { pretty_name = "123456789012345678901234567890/"; }
		var last_slash_idx = pretty_name.lastIndexOf("/");
		// internally hosted modules
		if (last_slash_idx < 0) {
			url = "/ig/modules/" + pretty_name;
		}
		// if it doesn't end in "/"
		if (last_slash_idx != pretty_name.length - 1) {
			pretty_name = pretty_name.substr(last_slash_idx + 1);
		}
		// print long names nicely
		if (pretty_name.length > 20) {
			pretty_name = pretty_name.substring(0,4) + "..." + pretty_name.substr(pretty_name.length - 10);
		}
		// Don't display links if they are not "safe" URLs.
		if (!shouldGadgetUrlBeAnchor__MODULE_ID__(url)) {
			url = "";
		}
		s += "<td><font size=-1><a href='" + _hesc(url)
			+ "' onmouseover=\"Highlighter___MODULE_ID___handle.highlight(" + module.id + ");\" "
			+ "onmouseout=\"Highlighter___MODULE_ID___handle.unhighlight(" + module.id + ");\">"
			+ _hesc(pretty_name) + "</a></td>";

		// Column 2: force inline.  Note: module.id is the id of the gadget being
		// edited.  __MODULE_ID__ is id of the developer gadget itself, to prevent
		// name conflicts.
		s += "<td align=center><font size=-1><input type=checkbox  "
			+ "onclick='inlinecallback__MODULE_ID__(" + module.id + ", checked)' "
			+ (module.is_inlined() ? "checked " : " ")
			+ ((module.render_inline == "optional") ? " " : "disabled ")
			+ "></td>";

		// Column 3: override cache.
		s += "<td align=center><font size=-1><input type=checkbox "
			+ "onclick='cachecallback__MODULE_ID__(" + module.id + ", checked)' "
			+ (module.caching_disabled ? " " : "checked ")
			+ "></td>";

		s += "</tr>";
	}
	s += "</table>";

	nerHTML = s;

	gge_disable_refresh__MODULE_ID__();
	// after all gadgets have been rendered, then call this funcLE_ID__);

	// Forces the inline of a gadget.
	// module_id: module id to change
	// value: boolean
	function inlinecallback__MODULE_ID__(module_id, checked) {
		// If user is trying to inline gadget, show confirmation box.  If they
		// srence settings for other gadgets.  Only click 'OK' "
		+ "below if you trust this gadget's author.";
		if (checked && !confirm(msg)) {
			checked = false;
		}

		_dlsetp("m_" + module_id + "_inline=" + checked);
	}

	// Disables th_ID__(module_id, checked) {
	var value = checked ? 0 : 1;
	+ module_id + "_nocache=" + value);
}

// Adds a gadget
fg__MODULE_ID__").style.display = "";

var url = _gel("text_ed
		// gadgets, and warned when the gadget doesn't exist.
		llback);
return false;
}

// _add_remote_module() actuaone";
}

// if GGE is present on the tab, disable page reon gge_disable_refresh__MODULE_ID__() {
for (var i = 0, mod.|gmodules\.)com(?::\d+)?\/ig\/modules\/(?:alpha\/)?gge\.xml$/)
