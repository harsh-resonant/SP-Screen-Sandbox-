({
    fireSelectionEvent : function(component, event, helper, selectedSenderId) {
        component.find('senderIdDropDown').set('v.value', selectedSenderId);
        var selectionEvent = component.getEvent('senderidSelection');
        selectionEvent.setParams({value: selectedSenderId});
        selectionEvent.fire();
    }
})