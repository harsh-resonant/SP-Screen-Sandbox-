({
    afterRender: function(component) {
        var dropdownButton = component.find('dropdownButton');
        $A.util.removeClass(dropdownButton, 'slds-button--neutral');
    }
})