describe("multiple validation rules",function() {
	ko.validation.register('even', function(newValue, options) {
		return newValue % 2 != 0;
	}, "Value must be even");

	var n = ko.observable(5).extend({
		lt: { val: 4 },
		even: {}
	});

	it("should have multiple errors", function() {
		expect(n.errors().length).toEqual(2);
	});
});
