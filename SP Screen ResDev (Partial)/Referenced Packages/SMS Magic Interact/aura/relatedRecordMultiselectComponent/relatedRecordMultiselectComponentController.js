({
    init : function(component, event, helper) {
        helper.init(component);
    },
    getValues : function(component, event, helper) {
        var comboBox = component.find("comboBox");
        if(comboBox) {
            var relatedRecordList = comboBox.get("v.values");
            var cmpEvt = component.getEvent("getRelatedRecordList");
            cmpEvt.setParams({responseList : relatedRecordList});
            cmpEvt.fire();
            component.set("v.selectedOptions", relatedRecordList);
        }
    },
    resetData : function(component, event, helper) {
        var comboBox = component.find("comboBox");
        var source = event.getParam("source");
        if(comboBox && source === 'filterPanelComponent') {
            comboBox.resetDataList();
        }
    },
    reloadDataWithState : function(component, event, helper) {
        var refresh = event.getParam("refresh");
        var source = event.getParam("source");
        if(source === 'incoming' && refresh) {
            helper.init(component);
        }
    }
})