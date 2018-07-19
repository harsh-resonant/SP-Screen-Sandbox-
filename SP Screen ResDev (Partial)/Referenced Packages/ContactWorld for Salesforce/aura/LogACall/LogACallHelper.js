({
    modelUpdateTimer: null,
    disableControls: function(component) {
        component.find("noteInputTextArea").set("v.disabled", true);
        component.find("noteSaveButton").set("v.disabled", true);
        var linkToThisButton = component.find("linkToThisButton");
        if (linkToThisButton) {
            linkToThisButton.set("v.disabled", true);
        }
    },
    enableControls: function(component) {
        component.find("noteInputTextArea").set("v.disabled", false);
        component.find("noteSaveButton").set("v.disabled", false);
        var linkToThisButton = component.find("linkToThisButton");
        if (linkToThisButton) {
            linkToThisButton.set("v.disabled", false);
        }
    },
    updateLinkToThisButtonState: function(component) {
        var action = component.get("c.getLinkingInfo");
        action.setParams({"showingSObjectId" : component.get("v.recordId"),
                            "currentWhoId"   : component.get("v.logACallModel.WhoId"),
                            "currentWhatId"  : component.get("v.logACallModel.WhatId"),
                            "includeRecordName" : true});
        action.setCallback(this, function(response) {
            if(component.isValid() && response.getState() === "SUCCESS") {
                component.set("v.shouldShowLinkToThisButton", response.getReturnValue().LinkingAllowed);
                component.set("v.recordName", response.getReturnValue().RecordName);
            }
        });
        $A.enqueueAction(action);
    },
    getLogACallModel: function(component, callback) {
        var action = component.get("c.getViewModel");
        action.setCallback(this, function(response) {
            if(component.isValid() && response.getState() === "SUCCESS") {
                var returnValue = response.getReturnValue();
                if (returnValue.UserInfo.NVMContactWorld__MostRecentCall__c !== undefined) {
                    component.set("v.logACallModel", returnValue);
                    this.updateLinkToThisButtonState(component);
                    this.enableControls(component);
                    callback && callback();
                }
            }
        });
        this.disableControls(component);
        $A.enqueueAction(action);
    },
    save: function(component, event) {
        var action = component.get("c.saveLatestCallInfo");
        var logACallModel = component.get("v.logACallModel");
        action.setParams({ "note" : logACallModel.Note,
                           "whoId": logACallModel.WhoId,
                           "whatId": logACallModel.WhatId,
                           "additionalFields": JSON.stringify(logACallModel.AdditionalFields) });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid()) {
                this.showResultToast(component, response.getReturnValue());
                this.updateLinkToThisButtonState(component);
                this.enableControls(component);
                this.setDispositionCode(component);
            }
        });
        this.disableControls(component);
        $A.enqueueAction(action);
    },
    setDispositionCode: function(component) {
        var action = component.get("c.setDispositionCode");
        var logACallModel = component.get("v.logACallModel");
        action.setParams({ "additionalFields": JSON.stringify(logACallModel.AdditionalFields) });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid()) {
                var returnValue = response.getReturnValue();
                if (!returnValue.State && returnValue.Message) {
                    this.showResultToast(component, returnValue);
                }
            }
        });
        $A.enqueueAction(action);
    },
    saveNotesFromPreviousCallAndRefresh: function(component) {
        if (component.isValid()) {
            var action = component.get("c.saveLatestCallInfo");
            var logACallModel = component.get("v.logACallModel");
            action.setParams({ "note" : logACallModel.Note,
                               "user" : logACallModel.UserInfo,
                               "whoId": logACallModel.WhoId,
                               "whatId": logACallModel.WhatId,
                               "additionalFields": JSON.stringify(logACallModel.AdditionalFields)});
            action.setCallback(this, function(response){
                var state = response.getState();
                if (component.isValid()) {
                    this.showResultToast(component, response.getReturnValue());
                    this.getLogACallModel(component, () => {this.onModelUpdated(component)});
                }
            });
            this.disableControls(component);
            $A.enqueueAction(action);
        }
    },
    linkToThis : function(component, event) {
        var action = component.get("c.linkToThisId");
        var logACallModel = component.get("v.logACallModel");
        action.setParams({ "user" : logACallModel.UserInfo,
                           "whoId": logACallModel.WhoId,
                           "whatId": logACallModel.WhatId,
                           "idToLinkTo": component.get("v.recordId") });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid()) {
                var logACallModel = component.get("v.logACallModel");
                var linkingInfo = response.getReturnValue();
                var recordName = component.get("v.recordName");
                
                if (linkingInfo.Response.State) {
                    if (linkingInfo.OutputWho !== logACallModel.WhoId) {
                        if (linkingInfo.OutputWho !== undefined) {
                            logACallModel.WhoName = recordName;
                            logACallModel.WhoType = linkingInfo.OutputType;
                        }
                        else {
                            logACallModel.WhoName = "";    
                        }
                        logACallModel.WhoId = linkingInfo.OutputWho; 
                    }
                    if (linkingInfo.OutputWhat !== logACallModel.WhatId) {
                        if (linkingInfo.OutputWhat !== undefined) {
                            logACallModel.WhatName = recordName;
                            logACallModel.WhatType = linkingInfo.OutputType;
                        }
                        else {
                            logACallModel.WhatName = "";    
                        }
                        logACallModel.WhatId = linkingInfo.OutputWhat;
                    }
                    component.set("v.logACallModel", logACallModel);
                    component.set("v.shouldShowLinkToThisButton", false);
                }
                this.showResultToast(component, linkingInfo.Response);
                this.enableControls(component);
                this.onModelUpdated(component);
            }
        });
        this.disableControls(component);
        $A.enqueueAction(action);
    },
    showResultToast: function(component, response) {
        var toastEvent = $A.get("e.force:showToast");
        if (!response.State) {
            toastEvent.setParams({
                "title": "Oh no!",
                "message": response.Message,
                "type": "error"
            });
        } else {
            toastEvent.setParams({
                "title": "Relax!",
                "message": response.Message,
                "type": "success"
            });
        }
        toastEvent.fire();
    },
    saveModelToLocalStorage: function (model) {
        try {
            window.localStorage.setItem('ContactWorldLogACallModel', model);
        }
        catch (e)
        {
            console.log ('Error saving notes to local storage: ' + JSON.stringify (e));
        }
    },
    onLocalStorageUpdated: function (component, storageEvent) {
        if (storageEvent.key === 'ContactWorldLogACallModel')
        {
            var logACallModel = JSON.parse(storageEvent.newValue);
            component.set("v.logACallModel", logACallModel);
        }
    },
    onModelUpdated: function (component)
    {
        this.debounce(() => {
            var logACallModel = component.get("v.logACallModel");
            this.saveModelToLocalStorage(JSON.stringify(logACallModel));
        }, 500);
    },
    debounce: function (fn, delay) {
        clearTimeout(this.modelUpdateTimer);
        this.modelUpdateTimer = setTimeout(fn, delay);
    }
})