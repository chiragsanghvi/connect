(function (global) {

	global.Appacitive.Article = function(options) {
		var base = new Appacitive.BaseObject(options);
		base.type = 'article';
		base.connectionCollections = [];

		return base;
	}

	global.Appacitive.BaseObject.prototype.getConnectedArticles = function(options) {
		if (this.type != 'article') return null;
		options = options || {};
		options.articleId = this.get('__id');

		var collection = new global.Appacitive.ConnectionCollection({ relation: options.relation });
		collection.connectedArticle = this;
		collection.otherSchema = options.otherSchema || 'other_endpoint_schema_here';
		this.connectionCollections.push(collection);
		var connectedArticlesQuery = new global.Appacitive.queries.ConnectedArticlesQuery(options);
		collection.setQuery(connectedArticlesQuery);

		return collection;
	};

})(window || process);