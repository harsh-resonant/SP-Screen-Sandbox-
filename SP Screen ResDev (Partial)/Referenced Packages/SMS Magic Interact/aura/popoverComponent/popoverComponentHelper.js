({
    togglePopOver: function (component, event, helper) {
        var isOpen;
        var backgroundDiv = component.find('backgroundDiv');
        $A.util.toggleClass(backgroundDiv, 'slds-hide');
        isOpen = component.get('v.isOpen');
        isOpen = !isOpen;
        component.set('v.isOpen', isOpen);
        if (isOpen) {
            helper.triggerPopover(component);
        }
    },
    positionPopover: function (component) {
        var pos;
        var width = component.get("v.width");
        var transformX;
        var transformY;
        // nubbinCalibration = 0.7071875rem or 11.315px(i.e half of height or width of nubbin)
        // where 1rem = 16px.
        var nubbinCalibration = 0.7071875;
        var popoverBody = component.find('popoverBody').getElement();
        popoverBody.style.height = component.get("v.height");
        popoverBody.style.width = width;
        var triggerRect = component.find('triggerBody').getElement().getBoundingClientRect();
        pos = component.get('v.position') || "";
        switch (pos.toLowerCase()) {
            case 'top-left':
                width = width.slice(0, width.length - 2);
                transformX = (-(parseInt(width, 10) - triggerRect.width)/16 + nubbinCalibration) + 'rem';
                popoverBody.style.top = null;
                popoverBody.style.bottom = (triggerRect.height/16 + nubbinCalibration) + 'rem';
                component.set('v.nubbinPos', 'bottom-right');
                break;
            case 'top-right':
                transformX = -nubbinCalibration + 'rem';
                popoverBody.style.top = null;
                popoverBody.style.bottom = (triggerRect.height/16 + nubbinCalibration) + 'rem';
                component.set('v.nubbinPos', 'bottom-left');
                break;
            case 'bottom-left':
                width = width.slice(0, width.length - 2);
                transformX = (-(parseInt(width, 10) - triggerRect.width)/16 + nubbinCalibration) + 'rem';
                popoverBody.style.top = (triggerRect.height/16 + nubbinCalibration) + 'rem';
                popoverBody.style.bottom = null;
                component.set('v.nubbinPos', 'top-right');
                break;
            case 'bottom-right':
                transformX = -nubbinCalibration + 'rem';
                popoverBody.style.top = (triggerRect.height/16 + nubbinCalibration) + 'rem';
                popoverBody.style.bottom = null;
                component.set('v.nubbinPos', 'top-left');
                break;
            default:
                width = width.slice(0, width.length - 2);
                transformX = (-(parseInt(width, 10) - triggerRect.width)/16 + nubbinCalibration) + 'rem';
                popoverBody.style.top = (triggerRect.height/16 + nubbinCalibration) + 'rem';
                popoverBody.style.bottom = null;
                component.set('v.nubbinPos', 'top-right');
                break;
        }
        popoverBody.style.transform = 'translateX(' + transformX + ')';
    },
    triggerPopover: function (component) {
        var onTrigger = component.get('v.onTrigger');
        $A.enqueueAction(onTrigger);
    }
})