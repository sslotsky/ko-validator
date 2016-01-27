describe("the validateableViewModel", function() {
	var VM = function(n) {
		this.n = ko.observable(n).extend({ lt: { val: 2 } });

		return ko.validateableViewModel(this);
	};

	describe("with an invalid observable", function() {
		var vm = new VM(3);

		it("should be invalid", function() {
			expect(vm.isValid()).toBe(false);
		});
	});

	describe("with valid observables", function() {
		var vm = new VM(1);

		it("should be valid", function() {
			expect(vm.isValid()).toBe(true);
		});
	});

	describe("with a nested validateableViewModel", function() {
		var Nested = function() {
			this.arr = ko.observableArray().extend({ minCount: { val: 1 } });

			return ko.validateableViewModel(this);
		};

		var Parent = function() {
			this.nested = new Nested();

			return ko.validateableViewModel(this);
		};

		var vm = new Parent();

		it("is invalid when nested data is invalid", function() {
			vm.nested.arr.removeAll();
			expect(vm.isValid()).toBe(false);

		});

		it("is valid when nested data is valid", function() {
			vm.nested.arr([1]);
			expect(vm.isValid()).toBe(true);
		});
	});
});
