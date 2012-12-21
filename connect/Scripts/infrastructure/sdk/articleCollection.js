(function(global) {

	/** 
	* @constructor
	**/
	var _ArticleCollection = function(options) {
		
		var _schema = null;
		var _query = null;
		var _articles = [];
		var _options = options;

		this.collectionType = 'article';

		if (!options || !options.schema) {
			throw new Error('Must provide schema while initializing ArticleCollection.');
		}

		var _parseOptions = function(options) {
			_schema = options.schema;
			options.type = 'article';
			_query = new global.Appacitive.queries.SearchAllQuery(options);
			_options = options;
		}

		this.setFilter = function(filterString) {
			_options.filter = filterString;
			_options.type = 'article';
			_options.schema = _schema;
			_query = new global.Appacitive.queries.BasicFilterQuery(options);
		}

		this.reset = function() {
			_options = null;
			_schema = null;
			_articles.length = 0;
			_query = null;
		}

		this.getQuery = function() {
			return _query;
		}

		this.setOptions = _parseOptions;
		_parseOptions(options);

		// getters
		this.get = function(index) {
			if (index != parseInt(index)) return null;
			index = parseInt(index);
			if (typeof index != 'number') return null;
			if (index >= _articles.length)  return null;
			return _articles.slice(index, index + 1)[0];
		}

		var fetchArticleById = function(id, onSuccess, onError) {

		};

		this.addToCollection = function(article) {
			if (!article || article.get('__schematype') != _schema)
				throw new Error('Null article passed or schema type mismatch');
			var index =  null;
			_articles.forEach(function(a, i) {
				if (a.get('__id') == article.get('__id')) {
					index = i;
				}
			});
			if (index != null) {
				_articles.splice(index, 1);
			} else {
				_articles.push(article);
			}
		}

		this.getArticle = function(id, onSuccess, onError) {
			onSuccess = onSuccess || function() {};
			onError = onError || function() {};
			var existingArticle = _articles.filter(function (article) {
				return article.get('__id') == id;
			});
			if (existingArticle.length == 1) {
				onSuccess(Array.prototype.slice.call(existingArticle)[0]);
			} else {
				onError();
			}
		}

		this.getAll = function() { return Array.prototype.slice.call(_articles); }

		this.removeById = function(id) {
			if (!id) return false;
			var index = null;
			_articles.forEach(function(article, i) {
				if (article.getArticle().__id && article.getArticle().__id == id) {
					index = i;
				}
			});
			if (index != null) {
				_articles.splice(index, 1);
				return true;
			} else { return false; }
		}

		this.removeByCId = function(id) {
			if (!id) return false;
			var index = null;
			_articles.forEach(function(article, i) {
				if (article.__cid && article.__cid == id) {
					index = i;
				}
			});
			if (index != null) {
				_articles.splice(index, 1);
				return true;
			} else { return false; }
		}

		var that = this;
		var parseArticles = function (data, onSuccess, onError) {
			var articles = data.articles;
			if (!articles) {
				onError();
				return;
			}
			if (!articles.length || articles.length == 0) articles = [];
			articles.forEach(function (article) {
				var _a = new global.Appacitive.Article(article);
				_a.___collection = that;
				_articles.push(_a);
			});
			onSuccess();
		};

		this.fetch = function(onSuccess, onError) {
			onSuccess = onSuccess || function() {};
			onError = onError || function() {};
			_articles.length = 0;
			var _queryRequest = _query.toRequest();
			_queryRequest.onSuccess = function(data) {
				parseArticles(data, onSuccess, onError);
			}
			global.Appacitive.http.send(_queryRequest);
		};

		this.createNewArticle = function() {
			var _a = new global.Appacitive.Article({ __schematype: _schema });
			_a.___collection = that;
			_a.__cid = parseInt(Math.random() * 1000000);
			_articles.push(_a);
			return _a;
		};

		this.map = function() { return _articles.map.apply(this, arguments); }
		this.forEach = function() { return _articles.forEach.apply(this, arguments); }
		this.filter = function() { return _articles.filter.apply(this, arguments); }

	}

	global.Appacitive.ArticleCollection = _ArticleCollection;

})(window || process);