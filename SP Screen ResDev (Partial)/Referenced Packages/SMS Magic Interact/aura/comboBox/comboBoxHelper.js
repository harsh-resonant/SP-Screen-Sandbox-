({
    doneTyping : function(component) {
        var query = component.get("v.query");
        var list = component.get("v.options");
        var dataOptions = component.get("v.dataOptions");
        if(!query || !query.trim()) {
            if(dataOptions.length !== list.length) {
                component.set("v.dataOptions", list);
            }
            return;
        }
        var getRightIndex = function(array, leftInd, rightInd, key) {
            var mid;
            var leftIndex = leftInd;
            var rightIndex = rightInd;
            while( rightIndex - leftIndex > 1 ) {
                mid = leftIndex + Math.floor((rightIndex - leftIndex)/2);
                if(array[mid].label.slice(0, key.length).toLowerCase().trim() <= key) {
                    leftIndex = mid;
                } else {
                    rightIndex = mid;
                }
            }
            return leftIndex;
        };
        var getLeftIndex = function(array, leftInd, rightInd, key) {
            var mid;
            var leftIndex = leftInd;
            var rightIndex = rightInd;
            while( rightIndex - leftIndex > 1 ) {
                mid = leftIndex + Math.floor((rightIndex - leftIndex)/2);
                if(array[mid].label.slice(0, key.length).toLowerCase().trim() >= key) {
                    rightIndex = mid;
                } else {
                    leftIndex = mid;
                }
            }
            return rightIndex;
        };
        query = query.toLowerCase().trim();
        var left = getLeftIndex(list, -1, list.length -1, query);
        var right = getRightIndex(list, 0, list.length, query);

        if(left === -1 || right === list.length) {
            component.set("v.dataOptions", []);
        } else if(left === right && list[left].label.slice(0, query.length).toLowerCase().trim() !== query) {
            component.set("v.dataOptions", []);
        } else {
            component.set("v.dataOptions", list.slice(left, right+1));
        }
    },
    addDataItem : function(component, helper, data) {
        var selectedDataList = component.get('v.selectedDataList');
        var isMultiSelect = component.get("v.isMultiSelect");
        var placeholder;

        data.defaultSelected = true;
        if(!selectedDataList) {
            selectedDataList = [];
        }
        if(isMultiSelect) {
            placeholder = (selectedDataList.length + 1) + ' ' +$A.get('$Label.smagicinteract.options_selected');
        } else {
            if(selectedDataList.length) {
                selectedDataList[0].defaultSelected = false;
            }
            placeholder = data.label;
            selectedDataList = [];
        }
        selectedDataList.push(data);
        component.set('v.placeholder', placeholder);
        component.set('v.selectedDataList', selectedDataList);
    },
    removeDataItem : function(component, helper, value, isPillClicked) {
        var selectedDataList = component.get('v.selectedDataList');
        if(!selectedDataList || !selectedDataList.length) {
            component.set('v.placeholder', $A.get('$Label.smagicinteract.zero_options_selected'));
            return;
        }
        for(var i=0; i< selectedDataList.length; i+=1) {
            if(selectedDataList[i].name === value) {
                selectedDataList[i].defaultSelected = false;
                selectedDataList.splice(i, 1);
                break;
            }
        }
        var placeholder = selectedDataList.length + ' ' +$A.get('$Label.smagicinteract.options_selected');
        component.set('v.placeholder', placeholder);
        component.set('v.selectedDataList', selectedDataList);
        if(isPillClicked) {
            helper.putValues(component, helper, selectedDataList);
        }
    },
    showDropDown : function(component) {
        component.set("v.isInputTextSelected", true);
        var closeComboBoxDropDown = component.find("closeComboBoxDropDown");
        var comboBoxDropDown = component.find("comboBoxDropDown");
        var dropdownLength = component.get("v.dropdownLength");
        $A.util.removeClass(closeComboBoxDropDown, 'hide');
        $A.util.addClass(closeComboBoxDropDown, 'show');
        $A.util.removeClass(comboBoxDropDown, 'hide');
        $A.util.addClass(comboBoxDropDown, 'show slds-dropdown--length-' + dropdownLength);
    },
    hideDropDown : function(component, helper) {
        component.set("v.isInputTextSelected", false);
        var closeComboBoxDropDown = component.find("closeComboBoxDropDown");
        var comboBoxDropDown = component.find("comboBoxDropDown");
        $A.util.removeClass(closeComboBoxDropDown, 'show');
        $A.util.addClass(closeComboBoxDropDown, 'hide');
        $A.util.removeClass(comboBoxDropDown, 'show');
        $A.util.addClass(comboBoxDropDown, 'hide');
        helper.putValues(component, helper, component.get('v.selectedDataList'));
    },
    putValues : function(component, helper, selectedDataList) {
        var initialValues = [].concat(component.get("v.values"));
        component.set("v.values", [].concat(selectedDataList));
        var onChange = component.get("v.onChange");
        if(onChange && !helper.isEquals(initialValues, selectedDataList)) {
            $A.enqueueAction(onChange);
        }
    },
    isEquals : function(list1, list2) {
        if(!list1 && !list2) {
            return true;
        }
        if(!list1 || !list2) {
            return false;
        }
        if(list1.length !== list2.length) {
            return false;
        }
        if(list1.length === 0 && list2.length === 0) {
            return true;
        }
        for(var i=0 ; i< list1.length ; i+=1) {
            if(list1[i].name !== list2[i].name) {
                return false;
            }
        }
        return true;
    },
    selectDefaultOptions : function(component, helper) {
        component.set("v.selectedDataList", []);
        var defaultOptions = component.get("v.defaultOptions") || [];
        var list = component.get('v.dataOptions') || [];

        for(var j=0; j < list.length; j += 1) {
            if(list[j].defaultSelected) {
                helper.addDataItem(component, helper, list[j]);
                continue;
            }
            for(var i=0; i < defaultOptions.length; i += 1) {
                if(list[j].name === defaultOptions[i].name) {
                    helper.addDataItem(component, helper, list[j]);
                }
            }
        }
        helper.hideDropDown(component, helper);
    }
});