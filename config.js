var _ = require("underscore");

var config = {
  data: { },

  get: function(key, defaultValue) {
    var data = this.getData();

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

    if (value == undefined || value == null) {
      return defaultValue; 
    }

    return value;
  },

  getData: function() {
    return this.data;
  },

  setup: function(config) {
    if (config != null) {
      var str = util.b64_decode_utf8(config);
      this.data = JSON.parse(str);
    }

    return this;
  }
};

config.setup(player.get('encoded') || null);

module.exports = config;
