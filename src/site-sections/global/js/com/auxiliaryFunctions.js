/**********************************begin checkout *********************************************/
function checkoutWithOmniture() {
	try {
		OmnitureCenter.sccheckOutEvent();
	} catch (e) {
		//alert(e);
	}

	setExpressVar("no", "beginCheckoutForm");
}

function checkoutWithOmnitureExpress() {
	try {
		OmnitureCenter.sccheckOutEvent();
	} catch (e) {
		//alert(e);
	}
	setExpressVar("no", "expressCheckoutForm");
}

function checkoutWithOmniturePPExpress() {
	setExpressVar("yes", "beginCheckoutFormPPExpress");
}

function checkoutWithOmniturePPExpressEasy() {
	setExpressVar("yes", "beginCheckoutFormPPExpressEasy");
}

function loginWithOmniture() {
	try {
		OmnitureCenter.loginSuccess();
	} catch (e) {
		//alert(e);
	}
	$("#loginForm").submit();
}

function setExpressVar(val, formId) {
	//console.log("setExpressVar");
	var url = "/cart/checkoutLoginPPExpress.jsp";
	//var noSteps = $('input#noStepsTest') ? $('input#noStepsTest').val() : false;
	var noSteps = sessionStorage.getItem("checkoutTest")
		? sessionStorage.getItem("checkoutTest")
		: false;

	$.ajax({
		type: "POST",
		url: url,
		cache: false,
		data: "setVar=" + val + "&noSteps=" + noSteps,
		dataType: "json",
		success: function(data) {
			//console.log('setexpress success');
			if (typeof formId != "undefined" && formId.length > 0) {
				$("#" + formId).submit();
			}
		},
		error: function(data) {
			// console.log('error');
		}
	});
}
