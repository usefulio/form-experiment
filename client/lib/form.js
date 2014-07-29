function getFormValues(form) {
	var values = {};

	$(form).find("input,select,textarea").each(function() {
		var tagName = $(this).prop("tagName").toLowerCase();
		var fieldType = $(this).attr("type");
		var fieldName = $(this).attr("name");
		var fieldValue = $(this).val();

		// multiselect - I want empty array instead of null
		if(tagName == "select" && $(this).attr("multiple") && fieldValue == null) fieldValue = [];

		if(fieldType === "checkbox") {
			var checked = $(this).is(":checked");
			if(!fieldValue) {
				// if field doesn't have value specified, result value is bool
				values[fieldName] = checked;
			} else {
				if(!values[fieldName]) {
					values[fieldName] = [];
				}
				if(checked) {
					values[fieldName].push(fieldValue);
				}
			}
		} else {
			if(fieldType === "radio") {
				if($(this).is(":checked")) {
					values[fieldName] = fieldValue;
				}
			} else {
				values[fieldName] = fieldValue;			
			}
		}
	});
	return values;
}

function validateField(field, fieldValue, values) {
	var error = null;
	var fieldName = field.name;
	var fieldValue = values[fieldName];
	var fieldTitle = field.title || field.name;

	if(field.required && !fieldValue) {
		error = {
			field: fieldName,
			message: fieldTitle + " is required."
		};
	}

	// custom validation
	if(field.onValidate) {
		var message = field.onValidate(field, fieldValue, values);
		if(message) {
			error = {
				field: fieldName,
				message: message
			};
		}
	}

	return error;
}

function validateForm(description, values) {
	var errors = [];

	_.each(description.fields, function(field) {
		var fieldValue = values[field.name];
		var error = validateField(field, fieldValue, values);
		if(error) {
			errors.push(error);
		}
	});

	return errors;
}

function showFieldError(input, error, focus) {
	if(!input.length) {
		return;
	}

	var parent = input.parent();
	if(!parent.length) {
		return;
	}


	parent.addClass("has-error");

	var helpBlock = parent.find(".help-block");
	if(helpBlock.length) {
		helpBlock.text(error.message);
	}

	if(focus) {
		input.focus();
	}
}

function clearFieldError(input) {
	var parent = input.parent();
	if(!parent.length) {
		return;
	}

	parent.removeClass("has-error");

	var helpBlock = parent.find(".help-block");
	if(helpBlock.length) {
		helpBlock.text("");
	}
}

function showFormErrors(form, errors) {
	var focus = true;
	_.each(errors, function(error) {
		var input = $(form).find('input[name="' + error.field + '"],select[name="' + error.field + '"],textarea[name="' + error.field + '"]');
		showFieldError(input, error, focus);
		focus = false;
	});
}

function clearFormErrors(form) {
	$(form).find('input,select,textarea').each(function() {
		clearFieldError($(this));
	});
}

function setFieldValue(form, fieldName, fieldValue) {
	var input = $(form).find('input[name="' + fieldName + '"],select[name="' + fieldName + '"],textarea[name="' + fieldName + '"]');
	if(!input.length) {
		return;
	}

	var tagName = input.prop("tagName").toLowerCase();
	if(tagName == "input") {
		input.val(fieldValue);
	}
	// !!! TODO: implement for all field types ...
}

Template.Form.helpers({
	"hasButtons": function() {
		return this.submitButton || this.cancelButton;
	}
});

Template.Form.events({
	"submit form": function(e, t) {
		if(t.data.description.onSubmit) {
			e.preventDefault();

			var values = getFormValues(e.currentTarget);
			var errors = validateForm(t.data.description, values);
			if(errors.length) {
				showFormErrors(e.currentTarget, errors);
			} else {
				t.data.description.onSubmit(values);
			}

			return false;
		}
		return true;
	},
	"blur input, blur select, blur textarea": function(e, t) {
		var input = $(e.currentTarget);
		var form = input.closest("form");
		var values = getFormValues(form[0]);
		var fieldName = input.attr("name");
		var fieldValue = values[fieldName];
		var field = _.find(t.data.description.fields, function(field) { return field.name == fieldName});

		var error = validateField(field, fieldValue, values);
		if(error) {
			// timeout is trick: we need to know what is next focused control.
			setTimeout(function() {
				// show error only if next focused control is not cancel button
				if(!$(document.activeElement).hasClass("cancel-button")) {
					showFieldError(input, error);
				}
			}, 10);
		} else {
			clearFieldError(input);
		}
	},

	"change select, keyup input, keyup textarea, paste input, paste textarea, cut input, cut textarea, click input[type='checkbox'], click input[type='radio']": function(e, t) {
		var input = $(e.currentTarget);
		var fieldName = input.attr("name");
		var field = _.find(t.data.description.fields, function(field) { return field.name == fieldName });
		if(field.onChange) {
			var form = input.closest("form");
			var values = getFormValues(form[0]);
			var fieldValue = values[fieldName];

			function setField(name, value) {
				setFieldValue(form, name, value);
			}

			field.onChange(fieldValue, values, field, setField);
		}
	}
});

Template.FormGroup.helpers({
	"formInput": function() {
		if(this.field.control == "input") {
			return Template.FormInput;			
		}

		if(this.field.control == "textarea") {
			return Template.FormTextArea;
		}

		if(this.field.control == "select") {
			return Template.FormSelect;
		}

		if(this.field.control == "multi") {
			return Template.FormSelectMulti;
		}

		if(this.field.control == "checkbox") {
			return Template.FormCheckbox;
		}

		if(this.field.control == "radio") {
			return Template.FormRadio;
		}

		return null;
	}
});

Template.FormInput.helpers({
	"inputType": function() {
		return this.field.type || "text";
	},
	"autofocus": function() {
		return this.field.autofocus ? "autofocus" : "";
	},
	"value": function() {
		if(!this.data || !this.field || !this.field.name) {
			return "";
		}
		return this.data[this.field.name];
	}
});

Template.FormTextArea.helpers({
	"autofocus": function() {
		return this.field.autofocus ? "autofocus" : "";
	},
	"value": function() {
		if(!this.data || !this.field || !this.field.name) {
			return "";
		}
		return this.data[this.field.name];
	}
});

Template.FormSelect.helpers({
	"autofocus": function() {
		return this.field.autofocus ? "autofocus" : "";
	},
	"selected": function(val) {
		if(!val.data || !val.field || !val.field.name) {
			return "";
		}
		return this.value == val.data[val.field.name] ? "selected" : "";
	}
});

Template.FormSelectMulti.helpers({
	"autofocus": function() {
		return this.field.autofocus ? "autofocus" : "";
	},
	"selected": function(val) {
		if(!val.data || !val.field || !val.field.name) {
			return "";
		}
		if(!_.isArray(val.data[val.field.name])) {
			return "";
		}

		return val.data[val.field.name].indexOf(this.value) >= 0 ? "selected" : "";
	}
});

Template.FormCheckbox.helpers({
	"checked": function(val) {
		if(!val.data || !val.field || !val.field.name) {
			return "";
		}
		if(!_.isArray(val.data[val.field.name])) {
			return "";
		}

		return val.data[val.field.name].indexOf(this.value) >= 0 ? "checked" : "";
	}
});

Template.FormRadio.helpers({
	"checked": function(val) {
		if(!val.data || !val.field || !val.field.name) {
			return "";
		}
		return this.value == val.data[val.field.name] ? "checked" : "";
	}
});
