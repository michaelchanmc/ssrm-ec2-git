window.rdQbDocFragment = document.createDocumentFragment();
var rdQbElement = Y.one('#rowsAnalysisGrid');
window.rdQbDocFragment.innerHTML = rdQbElement.get('innerHTML');

setEventsForQbValidation();

function setEventsForQbValidation() {
	Y.all('#divQueryBuilder select').each(function (inp) {
		setOnchangeQbValidation(inp);
	});

	var btnApplyColumnSelection = Y.one('A#actQbOk');
	setOnchangeQbValidation(btnApplyColumnSelection);
}

function setOnchangeQbValidation(inp) {
	if (!inp) {
		return;
	}

	var attrName = 'onchange';
	if (inp.get('nodeName').toLowerCase() == 'a') {
		attrName = 'href';
	}

	var onchangeScript = inp.getAttribute(attrName);
	onchangeScript = onchangeScript.replace('javascript:', '');


	if (onchangeScript != '') {
		onchangeScript = "if(!QbWarnUserIfThinkspaceIsNotEmpty()) " + onchangeScript;
		if (inp.get('nodeName').toLowerCase() == 'a') {
			inp.setAttribute(attrName, 'javascript:' + onchangeScript);
		} else {
			inp.setAttribute(attrName, onchangeScript);
		}
	}
}

function QbWarnUserIfThinkspaceIsNotEmpty() {
	var thinkspaceObject, thinkspaceConf = null,
		ngpPlatform = window.Logi;
	if (ngpPlatform && ngpPlatform.Platform) {
		var thinkspaceObject = ngpPlatform.Platform.select('logi-thinkspace')
		if (thinkspaceObject && thinkspaceObject.config) {
			thinkspaceConf = thinkspaceObject.config();
		}
	}
	if (!thinkspaceConf) {
		return false;
	}
	//put ngp's validation script here
	var areaInUse = thinkSpaceIsNotEmpty(thinkspaceConf);
	if (areaInUse != "") {
		var res = confirm('Discovery will be reset, are you sure?');
		if (!res) {
			var rdQbElement = Y.one('#rowsAnalysisGrid');
			rdQbElement.set('innerHTML', window.rdQbDocFragment.innerHTML);
			LogiXML.Ajax.AjaxTarget().fire('reinitialize');
			setEventsForQbValidation();
		}
		return !res;
		
	}
	return false;
}

function thinkSpaceIsNotEmpty(config) {
	// check if it in the VB
	if (config.components.vb.zones) {
		var thinkspaceColumnsNames = _.pluck(config.components.vb.zones.x.pillContainer.columns, 'name').concat(
				_.pluck(config.components.vb.zones.y.pillContainer.columns, 'name'));
		if (thinkspaceColumnsNames.length > 0) {
			return "visualization";
		}
	}

	// check AT
	var atColumns = config.components.at.pillContainer.columns;
	var inUse = "";
	// find col in AT
	_.each(atColumns, function (col) {
		if (col.filterEnable && col.filters && col.filters.length > 0) {
			inUse = "filter";
		}
		if (col.grouped) {
			inUse = "group";
		}
		if (col.inCellGraphicEnable) {
			inUse = "incell";
		}
	});

	// In calc
    var calcs = _.pluck(atColumns,"calculation");
	var inCalc = _.any(calcs, function (calc) {
		if (calc !== undefined) {
			inUse = "calculation";
		}
	});
	return inUse;

}
