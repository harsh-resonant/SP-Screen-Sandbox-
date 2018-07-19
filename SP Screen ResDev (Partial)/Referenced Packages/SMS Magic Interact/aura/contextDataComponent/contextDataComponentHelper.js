({
	getNewContext: function (context, embedContext) {
		var self = {
			context: context || {}
		};

		switch (embedContext ? embedContext.toLowerCase() : null) {
			case 'detail':
				self.context.isDetailPage = true;
				self.context.isCustomTab = false;
				self.context.isActivitySection = false;
				self.context.isHomeSection = false;
				break;
			case 'tab':
				self.context.isCustomTab = true;
				self.context.isDetailPage = false;
				self.context.isActivitySection = false;
				self.context.isHomeSection = false;
				break;
			case 'activity':
				self.context.isActivitySection = true;
				self.context.isDetailPage = false;
				self.context.isCustomTab = false;
				self.context.isHomeSection = false;
				break;
			case 'home':
				self.context.isHomeSection = true;
				self.context.isActivitySection = false;
				self.context.isDetailPage = false;
				self.context.isCustomTab = false;
				break;
			default:
				self.context.isCustomTab = true;
				self.context.isHomeSection = false;
				self.context.isActivitySection = false;
				self.context.isDetailPage = false;
				break;
		}

		return self.context;
	}
});