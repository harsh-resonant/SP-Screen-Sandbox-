({
	doInit: function (component, event, helper) {
		var uiContext = component.get('v.uiContext');
		var embedContext = component.get('v.embedContext');
		var context = component.get('v.context');
		if (!context) {
			var newContext = helper.getNewContext(context, embedContext);
			component.set('v.context', newContext);
			var onContextChange = component.get('v.onContextChange');
			$A.enqueueAction(onContextChange);
		}
	},
	setUIContextFromTheme: function setUIContextFromTheme(component, event, helper) {
		var context;
		var params = event.getParam('arguments');
		if (params && params.theme) {
			context = component.get('v.context');
			switch (params.theme) {
				case 'Theme4t':
					component.set('v.context', Object.assign(context, {
						isLightning: false,
						isClassic: false,
						isSf1: true
					}));
					break;
				case 'Theme4d':
					component.set('v.context', Object.assign(context, {
						isLightning: true,
						isClassic: false,
						isSf1: false
					}));
					break;
				case 'Theme3':
					component.set('v.context', Object.assign(context, {
						isLightning: false,
						isClassic: true,
						isSf1: false
					}));
					break;
				case 'Theme2':
					component.set('v.context', Object.assign(context, {
						isLightning: false,
						isClassic: true,
						isSf1: false
					}));
					break;

				default:
					component.set('v.context', Object.assign(context, {
						isLightning: true,
						isClassic: false,
						isSf1: false
					}));
					break;
			}
		}
	}
})