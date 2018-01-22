/**
 * author: thomas
 * date: 2010-7-23
 */

//Waitlist
function addToWaitlist(productId, skuId, qtyId, errorUrlId) {
	var url =
		contextPath +
		"/browse/culAddClassWaitList.jsp" +
		"?productId=" +
		productId +
		"&skuId=" +
		skuId +
		"&quantity=" +
		$("#" + qtyId).val();
	var commerceItemType = "culinaryCommerceItem";
	var $form = $("#addItemToWaitlistForm");
	$form.attr("action", url);
	$form.find(".productToSubmit").val(productId);
	$form.find(".skuToSubmit").val(skuId);
	$form.find(".qtyToSubmit").val($("#" + qtyId).val());
	$form.find(".commerceItemTypeToSubmit").val(commerceItemType);
	$form.find(".addItemToWaitlistErrorURL").val($("#" + errorUrlId).val());
	$form.find(".addCulinaryToWaitlist").click();
}

function readPolicy(obj, notChecked, checked) {
	if (obj.checked) {
		$("#readPolicyError").hide();
	}
	$("#" + notChecked).toggle();
	$("#" + checked).toggle();
}

function chooseAttendee(attendeeId, count, skuId, totalAttendeeCount) {
	//ajax request for culAttendee.jsp,attendeeId,count,skuId
	$.ajax({
		url: contextPath + "/browse/include/culAttendeeAjax.jsp",
		type: "post",
		data:
			"attendeeId=" +
			attendeeId +
			"&count=" +
			count +
			"&skuId=" +
			skuId +
			"&totalAttendeeCount=" +
			totalAttendeeCount,
		beforeSend: function(XMLHttpRequest) {},
		success: function(data, textStatus) {
			$("#" + "dlattendee" + count).replaceWith(data);
		},
		complete: function(XMLHttpRequest, textStatus) {},
		error: function() {
			alert("error!");
		}
	});
}

function chooseAttendeeWaitlist(attendeeId, count, skuId, totalAttendeeCount) {
	//ajax request for culAttendee.jsp,attendeeId,count,skuId
	$.ajax({
		url: contextPath + "/browse/include/culAttendeeWaitlistAjax.jsp",
		type: "post",
		data:
			"attendeeId=" +
			attendeeId +
			"&count=" +
			count +
			"&skuId=" +
			skuId +
			"&totalAttendeeCount=" +
			totalAttendeeCount,
		beforeSend: function(XMLHttpRequest) {},
		success: function(data, textStatus) {
			$("#" + "dlattendee" + count).replaceWith(data);
		},
		complete: function(XMLHttpRequest, textStatus) {},
		error: function() {
			alert("error!");
		}
	});
}
