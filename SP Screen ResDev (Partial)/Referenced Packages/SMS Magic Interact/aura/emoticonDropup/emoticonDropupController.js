({
    doInit : function(component, event, helper) {
        var emoticons = [ '\u{1f600}', '\u{1f601}', '\u{1f602}', '\u{1f603}', '\u{1f604}', '\u{1f605}',
                         '\u{1f606}', '\u{1f607}', '\u{1f608}', '\u{1f609}', '\u{1f60A}', '\u{1f60B}', 
                         '\u{1f60C}', '\u{1f60D}', '\u{1f60E}', '\u{1f60F}', '\u{1f610}', '\u{1f611}', 
                         '\u{1f612}', '\u{1f613}','\u{1f614}' ];
        component.set('v.emoticons', emoticons);
    },
    onEmoticonSelection : function(component, event, helper) {
        var emoticonSelectionEvent;
        if (event.target.id) {
            emoticonSelectionEvent = component.getEvent('onEmoticonSelection');
            emoticonSelectionEvent.setParams({
                value : event.target.id
            });
            emoticonSelectionEvent.fire();
        }
        helper.closeEmoticonPopOver(component);
    }
})