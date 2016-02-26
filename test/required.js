describe("the required validator", function() {
	var text = ko.observable().extend({ required: {} });

	describe("when the observable has no value", function() {
		it("should be invalid", function() {
			text(null);
			expect(text.errors().length).toEqual(1);
		});
	});

	describe("when the observable has a value", function() {
		it("should be valid", function() {
			text("Hello");
			expect(text.errors()).toEqual([]);
		});
	});
});
