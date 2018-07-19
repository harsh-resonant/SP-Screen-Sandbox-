({
    setvariant : function(component) {
        var variant = component.get("v.variant");
        var variantClass;
        if(variant)	{
            variantClass = "slds-theme--" + variant;
        } else {
            variantClass = "slds-popover--tooltip";
        }
        var tooltip = component.find("tooltiptextId");
        $A.util.addClass(tooltip, variantClass);
    },
    setNubbin 	: function(component) {
        var nubbin = component.get("v.tooltipPosition");
        var tooltipClass = "slds-nubbin--" + nubbin;
        var tooltip = component.find("tooltiptextId");
        $A.util.addClass(tooltip, tooltipClass);
        var tooltipPositionClass = "tooltiptext--" + nubbin;
        $A.util.addClass(tooltip, tooltipPositionClass);
        if(nubbin === "right" || nubbin === "left") {
            var height = tooltip.getElements()[0].getBoundingClientRect().height;
            tooltip.getElements()[0].style.top = "-" + String(height/2 - 10)+"px";
        }
    }
})