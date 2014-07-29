
Template.Home.helpers({

	"coolForm": function() {
/*
		return {
			data: null,

			fields: [
				{ 
					name: "someText", 
					title: "Text", 
					control: "input", 
					type: "text", 
					autofocus: "true", 
					required: true,
					onChange: function(value, values, field, setField) {
						setField("multiline", value);						
					}
				},
				{ name: "multiline", title: "Multiline text", control: "input", type: "text" }
			],

			submitButton: "Save",
			cancelButton: "Cancel",

			onSubmit: function(values) {
				console.log(values);
			}
		}

	}
});
*/

		// data that we will edit in our form (default values).
		// usually that will be data context set by controller.
		var customer = {
			customerName: "Petar",
			listPrice: 0,
			discount: 0,
			price: 0,
			note: "Multiline text input",
			fruit: "banana",
			languages: ["javascript", "perl"],
			continents: ["europe", "asia", "africa"],
			planet: "mars"
		};

		// here we create form description - form fields list
		return {
			id: "cool-form",
			data: customer,

			fields: [
				{ name: "customerName", title: "Name", control: "input", type: "text", autofocus: true, required: true, onChange: function(value, values, field) { console.log(value, values, field); } },

				{ 
					name: "listPrice", 
					title: "List price", 
					control: "input", 
					type: "text", 
					required: true,
					onChange: function(value, values, field, setField) { 
						var discount = values["discount"];
						var price = value - (discount * (value / 100));
						setField("price", price);
					}
				},
				{
					name: "discount", 
					title: "Discount %", 
					control: "input", 
					type: "text", 
					required: true, 
					onChange: function(value, values, field, setField) {
						var listPrice = values["listPrice"];
						var price = listPrice - (value * (listPrice / 100));
						setField("price", price);
					} 
				},
				{ 
					name: "price", 
					title: "Price", 
					control: "input", 
					type: "text", 
					required: true
				},

				{ name: "note", title: "Note", control: "textarea" },
				{ 
					name: "fruit", 
					title: "Choose fruit", 
					control: "select", 
					items: [
						{ "value": "apple", title: "Apple" },
						{ "value": "banana", title: "Banana" },
						{ "value": "coconut", title: "Coconut" }
					]
				},
				{ 
					name: "languages", 
					title: "Select at least two languages:",
					control: "multi",
					items: [
						{ "value": "javascript", title: "JavaScript" },
						{ "value": "cpp", title: "C++" },
						{ "value": "perl", title: "Perl" }
					],
					onValidate: function(field, value, values) {
						// custom validation
						if(!value || !value.length || value.length < 2) {
							return "Please select at least two languages.";
						}
					}
				},

				{ 
					name: "continents",
					title: "Continents you visited:",
					control: "checkbox",
					items: [
						{ "value": "europe", title: "Europe" },
						{ "value": "asia", title: "Asia" },
						{ "value": "australia", title: "Australia" },
						{ "value": "africa", title: "Africa" }
					]
				},

				{ 
					name: "planet",
					title: "You are from...",
					control: "radio",
					items: [
						{ "value": "earth", title: "Earth" },
						{ "value": "mars", title: "Mars" },
						{ "value": "venus", title: "Venus" }
					]
				}
			],
			submitButton: "Save",
			cancelButton: "Cancel",

			onSubmit: function(values) {
				console.log(values);
			}
		}
	}
});
