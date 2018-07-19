({
	openEmoticonPopOver : function() {

	},
	closeEmoticonPopOver : function(component) {
		var popover = component.find('dropdownCmp');
		if(popover) {
			popover.closeDropdown();
		}
	}
});