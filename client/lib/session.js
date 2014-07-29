Template.session.helpers({
	item: function () {
		var dict = this.dict || (this.dict = new ReactiveDict());
		var result = {};
		var item = this.item || {};
		var keys = _.union(_.keys(dict.keys), _.keys(item));
		_.each(keys, function (key) {
			result[key] = dict.get(key) || item[key];
		});
		return result;
	}
});
