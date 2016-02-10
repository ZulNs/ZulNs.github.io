
var mp, txtExpr, txtResult, cmbFuncList, cmbVarList, cmbDispMode;
init();
		
function clearExpr() {
	txtExpr.value = "";
	clearResult();
	txtExpr.focus();
}

function clearResult() {
	if (txtExpr.value === "") {
		txtResult.value = "";
		txtResult.disabled = true;
	}
}

function clearVars() {
	mp.clearVars();
	btnInsertVar.disabled = true;
}

function init() {
	document.querySelector('#title span').innerHTML = document.title;
	if (document.location.search.toLowerCase() === '?3d')
		document.querySelector('#title a').href = '../cuboid3d.html?2';
	mp = new Parser;
	txtExpr      = document.getElementById("txtExpr");
	txtResult    = document.getElementById("txtResult");
	cmbFuncList  = document.getElementById("cmbFuncList");
	cmbVarList   = document.getElementById("cmbVarList");
	cmbDispMode  = document.getElementById("cmbDispMode");
	btnInsertVar = document.getElementById("btnInsertVar");
	btnInsertVar.disabled = true;
	setDispMode();
	mp.setExternalFunctionList(cmbFuncList);
	mp.setExternalVarList(cmbVarList);
}

function insertFunc() {
	txtExpr.value += cmbFuncList.value;
	txtExpr.focus();
}

function insertVar() {
	txtExpr.value += cmbVarList.value;
	txtExpr.focus();
}

function setDispMode() {
	if (cmbDispMode.selectedIndex === 0)
		mp.setDisplayMode(Parser.normalDisplayMode);
	else if (cmbDispMode.selectedIndex === 1)
		mp.setDisplayMode(Parser.dmsDisplayMode);
	if (txtResult.value !== "" && !mp.isError) {
		txtResult.value = mp.getResult();
	}
}

function startEval() {
	var exp = txtExpr.value, disp = "";
	mp.eval(exp);
	disp = (mp.isError) ? mp.message : mp.getResult();
	txtResult.disabled = false;
	txtResult.value = disp;
	if (cmbVarList.options.length > 0)
		btnInsertVar.disabled = false;
}
