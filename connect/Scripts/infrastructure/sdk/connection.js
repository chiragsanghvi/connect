(function (global) {

	global.Appacitive.Connection = function(options) {
		var base = new Appacitive.BaseObject(options);
		base.type = 'connection';
		base.getConnection = base.getArticle;

		base.__defineGetter__('connectedArticle', function() {
			if (!base.___collection.connectedArticle) {
				throw new Error('connectedArticle can be accessed only by using the getConnectedArticles call');
			}
			var articleId = base.___collection.connectedArticle.get('__id');
			if (!articleId) return null;
			var otherArticleId = base.getConnection().__endpointa.articleid;
			if (base.getConnection().__endpointa.articleid == articleId)
				otherArticleId = base.getConnection().__endpointb.articleid;
			return base.___collection.getConnectedArticle(otherArticleId);
		});

		return base;
	}

})(window || process);