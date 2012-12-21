(function(global) {
	
	global.Appacitive.queries = {};

	// basic query for contains pagination
	/** 
	* @constructor
	**/
	var _pageQuery = function(o) {
		var options = o || {};
		this.pageNumber = options.pageNumber || 1;
		this.pageSize = options.pageSize || 200;
	}
	_pageQuery.prototype.toString = function() {
		return 'psize=' + this.pageSize + '&pnum=' + this.pageNumber;
	}

	// sort query
	/** 
	* @constructor
	**/
	var _sortQuery = function(o) {
		o = o || {};
		this.orderBy = o.orderBy || '__UtcLastUpdatedDate';
		this.isAscending = typeof o.isAscending == 'undefined' ? true : o.isAscending;
	}
	_sortQuery.prototype.toString = function() {
		return 'orderBy=' + this.orderBy + '&isAsc=' + this.isAscending;
	}

	// base query
	/** 
	* @constructor
	**/
	var _baseQuery = function(o) {
		var options = o || {};

		this.pageQuery = new _pageQuery(o);
		this.sortQuery = new _sortQuery(o);
		this.type = o.type || 'article';
		this.baseType = o.schema || o.relation;

		this.extendOptions = function(changes) {
			for (var key in changes) {
				options[key] = changes[key];
			}
		};
	}
	_baseQuery.prototype.toUrl = function() {
		return global.Appacitive.config.apiBaseUrl 
			+ this.type + '.svc/' 
			+ this.baseType + '/find/all?' + this.pageQuery.toString() + '&' + this.sortQuery.toString();
	}

	// search all type query
	/** 
	* @constructor
	**/
	global.Appacitive.queries.SearchAllQuery = function(options) {
		
		options = options || {};
		var inner = new _baseQuery(options);

		// simple query
		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = inner.toUrl();
			r.method = 'get';
			return r;
		};
	};

	/** 
	* @constructor
	**/
	global.Appacitive.queries.BasicFilterQuery = function(options) {

		options = options || {};
		var inner = new _baseQuery(options);
		
		// just append the filters/properties parameter to the query string
		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = inner.toUrl() + '&properties=' + options.filter + '&filter=' + options.filter;
			r.method = 'get';
			return r;
		};
	};

	/** 
	* @constructor
	**/
	global.Appacitive.queries.GraphQuery = function(options) {

		options = options || {};
		var inner = new _baseQuery(options);
		
		// just append the filters/properties parameter to the query string
		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = global.Appacitive.config.apiBaseUrl;
			r.url += global.Appacitive.storage.urlFactory.article.getProjectionQueryUrl();
			r.method = 'post';
			r.data = options.graphQuery;
			return r;
		};
	};

	/** 
	* @constructor
	**/
	global.Appacitive.queries.ConnectedArticlesQuery = function(options) {

		options = options || {};
		var inner = new _baseQuery(options);

		this.toRequest = function() {
			var r = new global.Appacitive.HttpRequest();
			r.url = global.Appacitive.config.apiBaseUrl + 'connection/' + options.relation + '/' + options.articleId + '/find?' 
				+ inner.pageQuery.toString() 
				+ '&' + inner.sortQuery.toString();
			return r;
		};

		this.extendOptions = inner.extendOptions;
	};

})(window || process);