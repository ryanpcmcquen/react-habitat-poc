var proxyFunctions = {
	/* Update this form's fields with data and submit */
	handlePostForm: function(data, submitId) {
		var form = document.getElementById(data.form),
			$form,
			$submitBtn;
		if (form) {
			js2form(form, data);
			if (submitId) {
				$(submitId).click();
			} else {
				$form = $(form);
				$submitBtn = $form.find("input[type=submit]");
				if ($submitBtn.length > 0) {
					$submitBtn.click();
				} else {
					$form.submit();
				}
			}
		}
	},
	postForm: function(form) {
		/* send form data to iframe */
		var formData = form2js(form),
			pmData = { form: form.id };
		pmData = $.extend(pmData, formData);
		pm({
			target: window.frames["sltIframeProxy"],
			type: "postForm",
			data: pmData
		});
	},
	sendContent: function(modalId) {
		var pmData = {
			content: document.getElementById("proxyContent").innerHTML,
			modalId: modalId
		};
		pm({
			target: window.parent,
			type: "setModalContent",
			data: pmData
		});
	},
	sendErrorContent: function(modalId, formId) {
		var pmData = {
			content:
				'<p class="message haserror">There were problems completing your request.</p>',
			modalId: modalId,
			formId: formId
		};
		pm({
			target: window.parent,
			type: "showErrorMessage",
			data: pmData
		});
	}
};
