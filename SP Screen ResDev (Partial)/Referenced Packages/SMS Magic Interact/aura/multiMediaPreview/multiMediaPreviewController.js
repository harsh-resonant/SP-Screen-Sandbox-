({
    openPreview: function (component, event, helper) {
        var modal = component.find("multimediaModal");
        modal.openModal();
    },
    onPreviewClose: function (component, event, helper) {
        var params = event.getParams();
        if (params.eventType === 'dismiss') {
            component.set('v.multimedia', null);
        }

    }
})