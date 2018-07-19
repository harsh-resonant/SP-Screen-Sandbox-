({
    doInit : function(component, event, helper) {
        var list = component.get("v.options");
        if(!list || !list[0]) return;
        component.set('v.dataOptions', list);
        helper.selectDefaultOptions(component, helper);
        helper.hideDropDown(component, helper);
    },
    onQueryChange : function(component, event, helper) {
        clearTimeout(component.get("v.timer"));
        component.set("v.timer", setTimeout($A.getCallback(function() {
            helper.doneTyping(component);
        }), 500));
    },
    selectOption : function(component, event, helper) {
        var ind = parseInt(event.currentTarget.id, 10);
        var dataOptions = component.get('v.dataOptions');
        if(dataOptions[ind].defaultSelected) {
            helper.removeDataItem(component, helper, dataOptions[ind].name, false);
        }
        else {
            helper.addDataItem(component, helper, dataOptions[ind]);
        }
        component.set('v.dataOptions', dataOptions);
        var isMultiSelect = component.get("v.isMultiSelect");
        if(!isMultiSelect) helper.hideDropDown(component, helper);
    },
    removeDataItem : function(component, event, helper) {
        var value = event.currentTarget.id;
        helper.removeDataItem(component, helper, value, true);
    },
    showDropDown : function(component, event, helper) {
        var list = component.get("v.options");
        if(!list || !list[0]) return;
        helper.showDropDown(component);
    },
    hideDropDown : function(component, event, helper) {
        helper.hideDropDown(component, helper);
    },
    resetSelectedOptionData : function(component, event, helper) {
        var list = component.get("v.options");
        if(!list || !list[0]) return;
            var selectedDataList = component.get('v.selectedDataList');
            if(selectedDataList && selectedDataList[0]) {
                for(var i=0; i<selectedDataList.length; i++) {
                    selectedDataList[i].defaultSelected = false;
                }
            
            component.set('v.query', '');
            component.set('v.selectedDataList', []);
            component.set('v.placeholder', $A.get('$Label.smagicinteract.zero_options_selected'));
            helper.hideDropDown(component, helper);
    }
    }
})