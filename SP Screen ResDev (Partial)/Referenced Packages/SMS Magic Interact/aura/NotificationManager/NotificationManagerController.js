({
    showNotifier : function(component, event) {
        var params = event.getParam('arguments');
        if (params) {
            var notifierDataList = component.get("v.notifierDataList");
            var data  = {
                iconName : params.iconName,
                variant : params.variant,
                state : params.state,
                text : params.text,
                duration : params.duration,
                bodyComp : params.bodyComp
            };
            notifierDataList.push(data);
            component.set("v.notifierDataList", notifierDataList);
        }
    }
})