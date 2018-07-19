({
    changeObjectType: function(component, event, helper) {
        helper.changeObjectType(component, event);
    },
    doInit: function(component, event, helper) {
        component.set("v.searchResults", null);
        helper.getObjectTypes(component);
    },
    doSearch: function(component, event, helper) {
        component.set("v.linkObjectName", document.getElementById('text-input-' + component.get("v.linkTarget")).value);
        helper.searchFor(component, component.get("v.linkObjectName"), component.get("v.linkObjectType"));
    },
    onCategoryDropdown: function(component, event, helper) {
        var objectTypesDropdownExpanded = component.get ("v.objectTypesDropdownExpanded");
        component.set("v.objectTypesDropdownExpanded", !objectTypesDropdownExpanded);
    },
    doLink: function(component, event, helper) {
        helper.doLink(component, event);
        helper.lockIn(component);
        // Tell the parent that the value has changed
        $A.get("e.NVMContactWorld:LogACallModelUpdate").fire();
    },
    releaseAndClear: function(component, event, helper) {
        helper.unlink(component);
        helper.releaseLock(component);
        // Tell the parent that the value has changed
        $A.get("e.NVMContactWorld:LogACallModelUpdate").fire();
    },
    onLinkedObjectIdChanged: function(component, event, helper) {
        if (!component.get("v.linkObjectId")) {
            component.set("v.lockedIn", false);
            $A.util.addClass(component.find("searchBoxDiv"), "slds-input-has-icon--right");
        }
        else {
            component.set("v.lockedIn", true);
            $A.util.removeClass(component.find("searchBoxDiv"), "slds-input-has-icon--right");
        }
    }
})