var _ = require("underscore");

var configurator = {
  data: { },

  defaultData: null,
  presentationData: null,

  url: null,
  
  mergeWithCallback: null,

  get: function(key, defaultValue) {
    var data = this.getConfiguration();

    if (defaultValue == undefined) {
      defaultValue = null;
    }

    var value = null;

    if (key.indexOf('.') > -1) {
      var keys = key.split('.');
      var parent = data;

      for (var i = 0; i < keys.length; ++i) {
        if (parent == undefined) {
          break;
        }

        parent = parent[keys[i]];
      }

      value = parent;
    } else {
      value = data[key];
    }

    return (value || player.get(key) || defaultValue);
  },

  getConfiguration: function() {
    if (this.defaultData == null && this.presentationData == null) {
      this.update();
    }

    return this.data;
  },

  setMergeWith: function(callback) {
    this.mergeWithCallback = callback;

    return this;
  },

  setUrl: function(url) {
    this.url = url;

    return this;
  },

  update: function() {
    this.defaultData = this.fetchDefaultData();
    this.presentationData = this.fetchPresentationData();

    if (this.callback) {
      this.data = this.callback(this.defaultData, this.presentationData);
    } else {
      this.data = _.extend(this.defaultData, this.presentationData);
    }

    return this;
  },

  getJSONUrlFor: function(name) {
    //return 'http://addon-configs.s3.videojuicer.com/' + player.presentation.seedName + '/o/' + name + '.json';
    var url = this.url;

    if (url == undefined || url == null) {
      if (player.presentation.env == 'staging') {
        url = 'http://addon-configs-staging.s3.amazonaws.com/';
      } else {
        url = 'http://addon-configs.s3.amazonaws.com/';
      }

      url += player.presentation.seedName + '/' + player.uuid + '/';
    }

    return url + name + '.json';
  },

  fetchDefaultData: function() {
    var response = net.http.getSync(this.getJSONUrlFor('defaults'), { });
    var data = { };

    if (response != null && response.status == 200) {
      data = JSON.parse(response.body);
    }

    return data;
  },

  fetchPresentationData: function() {
    var response = net.http.getSync(this.getJSONUrlFor(player.presentation.id), { });
    var data = { };
      player.log(JSON.stringify(response))

    if (response != null && response.status == 200) {
      data = JSON.parse(response.body);
    }

    player.log(JSON.stringify(data))

    return data;
  }
};

configurator.setUrl(player.get('endpoint') || null);

module.exports = configurator;
