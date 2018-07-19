({
    afterRender: function (component, helper) {
        this.superAfterRender();
        helper.positionPopover(component);
    }
})