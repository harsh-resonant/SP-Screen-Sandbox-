({
    doInit: function(component, event, helper) {
        helper.getLogACallModel(component);
    },
    save : function(component, event, helper) {
        helper.save(component, event);
    },
    linkToThis : function(component, event, helper) {
        helper.linkToThis(component, event);
    },
    onModelUpdated: function (component, event, helper) {
        helper.onModelUpdated(component);
    },
    wireUpCallbacks: function(component, event, helper) {
        ContactPad.onCallStart(function(payload) {
            helper.saveNotesFromPreviousCallAndRefresh(component);
        });
        window.addEventListener('storage', function (storageEvent) {             
            helper.onLocalStorageUpdated (component, storageEvent);         
        });
    }
})