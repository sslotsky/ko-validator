describe("the minCount validator", function() {
	describe("with a minimum count of 1", function() {
		var arr = ko.observableArray().extend({ minCount: { val: 1 } });

		it("is invalid when empty", function() {
			arr.removeAll();
			expect(arr.errors().length).toBe(1);
		});

		it("is valid with a single element", function() {
			arr([1]);
			expect(arr.errors()).toEqual([]);
		});

		it("is valid with more than one element", function() {
			arr([1,2]);
			expect(arr.errors()).toEqual([]);
		});
	});

	describe("when the minimum is observable", function() {
		var min = ko.observable();
		var arr = ko.observableArray().extend({ minCount: { val: min } });

		it("is invalid when count is lower than min", function() {
			min(1);
			arr([]);
			expect(arr.errors().length).toEqual(1);
		});

		it("is valid when the minimum is lowered to match the count", function() {
			min(0);
			arr([]);
			expect(arr.errors()).toEqual([]);
		});
	});
});

