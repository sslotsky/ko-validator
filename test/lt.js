describe("the lt validator", function() {
	describe("with an upper bound of 10", function() {
		var n = ko.observable().extend({ lt: { val: 10 } });

		it("is invalid when equal to 10", function() {
			n(10);
			expect(n.errors().length).toEqual(1);
		});

		it ("is invalid when greater than 10", function() {
			n(11);
			expect(n.errors().length).toEqual(1);
		});

		it ("is valid when less than 10", function() {
			n(9);
			expect(n.errors()).toEqual([]);
		});
	});

	describe("when the upper bound is observable", function() {
		var upperBound = ko.observable();
		var n = ko.observable().extend({ lt: { val: upperBound } });

		it("is invalid when greater than the upper bound", function() {
			upperBound(2);
			n(3);
			expect(n.errors().length).toEqual(1);
		});

		it ("is valid when upper bound is raised", function() {
			n(3);
			upperBound(4);
			expect(n.errors()).toEqual([]);
		});
	});
});
