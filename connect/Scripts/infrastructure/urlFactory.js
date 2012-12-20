function UrlFactory() {
    var baseUrl = Connect.config.apiBaseUrl;
    if (baseUrl.lastIndexOf("/") == baseUrl.length - 1)
        baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    this.session = {

        sessionServiceUrl: baseUrl + '/application',

        getCreateSessionUrl: function () {
            return String.format('{0}/session', this.sessionServiceUrl);
        },
        getdeleteSessionUrl: function () {
            return String.format('{0}/session/disable', this.sessionServiceUrl);
        }
    };

    this.user = {

        userServiceUrl: baseUrl + '/user',
        getCreateUserUrl: function () {
            return String.format("{0}/create", this.userServiceUrl);
        },
        getUpdateUserUrl: function (userId) {
            return String.format("{0}/{1}", this.userServiceUrl, userId);
        },
        getUserUrl: function (userId) {
            return String.format("{0}/{1}", this.userServiceUrl, userId);
        },
        getUserDeleteUrl: function (userId) {
            return String.format("{0}/{1}", this.userServiceUrl, userId);
        },
        getSearchAllUrl: function (queryParams, pageSize) {
            var url = '';

            url = String.format('{0}/search/user/all', new UrlFactory().article.articleServiceUrl);

            if (pageSize)
                url = url + '?psize=' + pageSize;
            else
                url = url + '?psize=10';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    if (queryParams[i].trim().length == 0) continue;
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },
        getAuthenticateUserUrl: function () {
            return String.format("{0}/authenticate", this.userServiceUrl);
        }
    };

    this.article = {
        articleServiceUrl: baseUrl + '/article',

        //create/upload operations
        getCreateUrl: function () {
            return String.format('{0}', this.articleServiceUrl);
        },
        getBlobUploadUrl: function () {
            return String.format('{0}/blob', this.articleServiceUrl);
        },

        //update operations
        getUpdateUrl: function (schemaName, articleId) {
            return String.format('{0}/{1}/{2}', this.articleServiceUrl, schemaName, articleId);
        },
        getBlobUpdateUrl: function (articledId) {
            return String.format('{0}/blob/update?&articleid={1}', this.articleServiceUrl, articledId);
        },

        //delete operations
        getDeleteUrl: function (articleId, schemaName) {
            return String.format('{0}/{1}/{2}', this.articleServiceUrl, articleId, schemaName);
        },
        getMultiDeleteUrl: function (schemaName) {
            return String.format('{0}/{1}/_bulk', this.articleServiceUrl, schemaName);
        },

        //get/search operations
        getGetUrl: function (schemaName, articleId) {
            return String.format('{0}/{1}/{2}', this.articleServiceUrl, schemaName, articleId);
        },
        getMultiGetUrl: function (schemaName, articleIds) {
            return String.format('{0}/{1}/find/byidlist?idlist={2}', this.articleServiceUrl, schemaName, articleIds);
        },
        getSearchAllUrl: function (schemaName, queryParams, pageSize) {
            var url = '';

            url = String.format('{0}/{1}/find/all', this.articleServiceUrl, schemaName);

            if (pageSize)
                url = url + '?psize=' + pageSize;
            else
                url = url + '?psize=10';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    if (queryParams[i].trim().length == 0) continue;
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },
        getPropertiesSearchUrl: function (schemaName, query) {
            var url = String.format('{0}/find/{1}/all', this.articleServiceUrl, schemaName);
            url += '?properties=' + query;
            return url;
        }

    };

    this.connection = {
        connectionServiceUrl: baseUrl + '/connection',

        getCreateUrl: function (relationName) {
            return String.format('{0}/{1}', this.connectionServiceUrl, relationName);
        },

        getUpdateUrl: function (relationName, relationId) {
            return String.format('{0}/{1}/{2}', this.connectionServiceUrl, relationName, relationId);
        },
        getDeleteUrl: function (relationName, connectionId) {
            return String.format('{0}/{1}/{2}', this.connectionServiceUrl, relationName, connectionId);
        },
        getMultiDeleteUrl: function (relationName) {
            return String.format('{0}/{1}/_bulk', this.connectionServiceUrl, relationName);
        },

        getGetUrl: function (relationName, connectionId) {
            return String.format('{0}/{1}/{2}', this.connectionServiceUrl, relationName, connectionId);
        },
        getMultiGetUrl: function (relationName, connectionIds) {
            return String.format('{0}/{1}/find/byidlist?idlist={2}', this.articleServiceUrl, relationName, connectionIds);
        },
        getSearchByArticleUrl: function (relationName, articleId, label, queryParams) {
            var url = '';

            url = String.format('{0}/{1}/find/all?label={2}&articleid={3}', this.connectionServiceUrl, relationName, label, articleId);
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },
        getConnectedArticles: function (relationName, articleId, queryParams) {
            var url = '';
            url = String.format('{0}/{1}/find/{2}', this.connectionServiceUrl, relationName, articleId);
            if (queryParams && queryParams.length && queryParams.length > 0) {
                for (var x = 0; x < queryParams.length; x += 1) {
                    if (x == 0) {
                        url += '?' + queryParams[x];
                    } else {
                        url += '&' + queryParams[x];
                    }
                }
            }
            return url;
        },
        getInterconnectsUrl: function () {
            var url = String.format('{0}/connectedarticles', this.connectionServiceUrl);
            return url;
        },
        getPropertiesSearchUrl: function (relationName, query) {
            var url = String.format('{0}/{1}/find/all', this.connectionServiceUrl, relationName);
            url += '?properties=' + query;
            return url;
        }
    };

    this.cannedList = {

        cannedListServiceUrl: baseUrl + '/list',

        getGetItemsUrl: function (cannedListId) {
            return String.format('{0}/{1}/{2}/contents', this.cannedListServiceUrl, Connect.config.blueprintId, cannedListId);
        }

    };

    this.query = {
        params: function (key) {
            var match = [];
            if (location.search == "" || location.search.indexOf("?") == -1) return match;
            if (!key) return location.search.split("?")[1].split("=");
            else {
                key = key.toLowerCase();
                var splitQuery = location.search.split("?")[1].split("&");
                $.each(splitQuery, function (i, k) {
                    var splitKey = k.split("=");
                    var value = splitKey[1];
                    if (splitKey.length > 2) {
                        $.each(splitKey, function (ii) {
                            if (ii == 0 || ii == 1) return;
                            value = value + "=" + splitKey[ii];
                        });
                    }
                    if (splitKey[0].toLowerCase() == key) match = [splitKey[0], value];
                });
                return match;
            }
        }
    };
}