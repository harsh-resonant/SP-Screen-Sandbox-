({
    previousSearchTerm : "",
    searchFor : function(component, searchTerm, objectType) {
        if (!searchTerm) {
            component.set("v.searchActive", false);
            return;
        }
        component.set("v.searchActive", true);
        if (this.previousSearchTerm !== searchTerm && objectType)
        {
            var action = component.get("c.getNamesFor");
            action.setParams({ "name" : searchTerm, "objType" : objectType.ObjectType});
            action.setCallback(this, function(response) {
                this.handleSearchResults(component, response);
            });
            $A.enqueueAction(action);
            this.previousSearchTerm = searchTerm;
        }
    },
    handleSearchResults: function(component, response) {
        if(component.isValid() && response.getState() === "SUCCESS") {
            var responseVal = response.getReturnValue();
            if (responseVal && responseVal.length > 0) {
                component.set("v.searchResults", responseVal);
            }
            else {
                component.set("v.searchResults", null);
            }
        }
    },
    doLink: function(component, event) {
        var selectedItem = event.currentTarget;
        var id = selectedItem.dataset.linkId;
        var name = selectedItem.dataset.linkName;
        component.set("v.linkObjectId", id);
        component.set("v.linkObjectName", name);
        this.lockIn(component);
    },
    getObjectTypes: function(component) {
        var linkTarget = component.get("v.linkTarget");
        var action = component.get("c.getObjectsFor");
        action.setParams({ "category" : linkTarget });
        action.setCallback(this, function(response) {
            this.handleObjectTypesResponse(component, response);
        });
        $A.enqueueAction(action);
    },
    handleObjectTypesResponse: function(component, response) {
        if(component.isValid() && response.getState() === "SUCCESS") {
            var responseVal = response.getReturnValue();
            if (responseVal && responseVal.length > 0) {
                component.set("v.objectTypes", responseVal);
            }
            else {
                component.set("v.objectTypes", null);
            }
        }
    },
    unlink: function(component) {
        component.set("v.linkObjectId", null);
    },  
    lockIn: function(component) {
        component.set("v.searchActive", false);
        component.set("v.lockedIn", true);
    },
    releaseLock: function(component) {
        component.set("v.lockedIn", false);
        component.set("v.linkObjectName", "");
    },
    changeObjectType: function(component, event) {
        component.set("v.objectTypesDropdownExpanded", false);
        var selectedItem = event.currentTarget;
        var objectType = { ObjectType: selectedItem.dataset.objectType,
                           Label: selectedItem.dataset.objectTypeLabel,
                           CssClass: selectedItem.dataset.objectTypeCss};
        component.set("v.linkObjectType", objectType);
    }
})