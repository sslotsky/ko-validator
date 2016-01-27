// depends on:
//		knockout - https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js
//		underscore - https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js

(function() {
	ko.validation = {};


	var errorsViewModel = function(key, message) {
		this.key = ko.observable(key);
		this.message = ko.observable(message);
	};

	var initializeErrors = function(target) {
		target.errors = target.errors || ko.observableArray();
	};

	var findError = function(target, key) {
		return _.find(target.errors(), function(e) {
			return e.key() == key;
		});
	};

	var addError = function(target, error, key, message) {
		if (!error) {
			error = new errorsViewModel(key, message);
			target.errors.push(error);
		}
	};

	ko.validation.register = function(name, failsValidation, defaultMessage) {
		ko.extenders[name] = function(target, options) {
			initializeErrors(target);
			function validate(newValue) {
				var error = findError(target, name);
				if (failsValidation(newValue, options)) {
					addError(target, error, name, options.message || defaultMessage);
				} else {
					target.errors.remove(error);
				}
			}

			validate(target());
			target.subscribe(validate);
			if (ko.isObservable(options.val)) {
				options.val.subscribe(function(newVal) {
					validate(target());
				});
			}

			return target;
		};
	};

	ko.validation.register('minCount', function(newValue, options) {
		return newValue.length < ko.unwrap(options.val);
	}, "Not enough elements");

	ko.validation.register('lt', function(newValue, options) {
		return newValue >= ko.unwrap(options.val);
	}, "Value was higher than expected");


	ko.validateableViewModel = function(vm) {
		vm.isValid = ko.computed(function() {
			var hasErroredObservables = _.some(vm, function(prop) {
				return ko.isObservable(prop) && prop.errors && prop.errors().length > 0;
			});

			return hasErroredObservables || _.some(vm, function(prop) {
				return typeof(prop.isValid) == 'function' && !prop.isValid();
			});
					
		});
	};
})();

var InvalidNested = function() {
	this.arr = ko.observableArray().extend({ minCount: { val: 1 } });

	return ko.validateableViewModel(this);
};

var ValidParent = function() {
	this.nested = new InvalidNested();
	return ko.validateableViewModel(this);
};

var vm = new ValidParent();