/**
Depends on  Gossamer.utils.ajax
Gossamer.utils.cookies
**/

function GossamerStorage() {
    if (!this instanceof GossamerStorage) return new GossamerStorage();
    this.urlFactory = new UrlFactory();
}

if (!window.Connect) window.Connect = {};
if (!Connect.storage) Connect.storage = new GossamerStorage();