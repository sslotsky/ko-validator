# ko-validator

This plugin adds easy and extensible validation capabilities to your knockout observables and view models.

## Installation

At this time, `src/ko-validator.js` and its dependencies must be downloaded manually to your project. Packaging options may be provided in the future.

### Dependencies

This package depends on the knockout and underscore libraries. 
* knockout - https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js
* underscore - https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js

## Basic Usage

Many use cases are documented in the Jasmine tests. In a nutshell:

```javascript
	// LessThan validation on an observable
	var n = ko.observable(2).extend({ lt: { val: 2 }});
	console.log(n.errors().length); // 1

	// Also using an observable as the upper bound
	var bound = ko.observable(2);
	var n = ko.observable(3).extend({ lt: { val: bound }});
	console.log(n.errors().length); // 1
	bound(4);
	console.log(n.errors().length); // 0


	// Same example wrapped in a validateableViewModel
	var VM = function() {
		this.n = ko.observable(2).extend({ lt: { val: 2 }});
		return ko.validateableViewModel(this);
	};

	var vm = new VM();
	console.log(vm.isValid()); // false
	vm.n(1);
	console.log(vm.isValid()); // true
```

The `isValid` method will also return false if any of the view model's properties are `validateableViewModel` objects with failing validations. Example:

```javascript
	var InvalidNested = function() {
		this.arr = ko.observableArray().extend({ minCount: { val: 1 } });

		return ko.validateableViewModel(this);
	};

	var ValidParent = function() {
		this.nested = new InvalidNested();
		return ko.validateableViewModel(this);
	};

	var vm = new ValidParent();
	console.log(vm.isValid()); // false
	vm.nested.arr.push(1);
	console.log(vm.isValid()); // true
```



## Extension

New validators can be created by using the `ko.validation.register` function. The built in validations are themselves created in this fashion:

```javascript
	ko.validation.register('minCount', function(newValue, options) {
		return newValue.length < ko.unwrap(options.val);
	}, "Not enough elements");

	ko.validation.register('lt', function(newValue, options) {
		return newValue >= ko.unwrap(options.val);
	}, "Value was higher than expected");
```

## Contributing

If you wish to contribute, please create a fork and submit a pull request. Do not submit without adding tests for your changes and ensuring that the entire test suite is passing. There is currently no CI enabled.

### Tests

Open `test/test-runner.html` in your browser to run all Jasmine tests. To add a Jasmine test, create a `.js` file for it and reference it in `test-runner.html` with a `<script>`.
