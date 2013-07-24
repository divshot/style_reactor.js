window = this;
document = {getElementsByTagName: function(){ return []}};

var parsers = {}
var config = {}

var compilers = {
  less: function(data) {
    if (!parsers.less) {
      importScripts(config.less || "//cdnjs.cloudflare.com/ajax/libs/less.js/1.4.1/less.min.js");
      parsers.less = new(less.Parser);
    }
    
    parsers.less.parse(data.source, function(err, tree) {
      if (err) {
        self.postMessage({error: err.message});
      } else {
        self.postMessage({css: tree.toCSS()});
      }
    });
  },
  
  stylus: function(data) {
    if (!parsers.stylus) {
      importScripts(config.stylus || "//learnboost.github.io/stylus/stylus.js");
      parsers.stylus = stylus;
    }
    
    parsers.stylus(data.source).render(function(err, result) {
      if (err) {
        self.postMessage({error: err.message});
      } else {
        self.postMessage({css: result});
      }
    });
  }
}

self.addEventListener("message",function(e) {  
  var data = e.data;
  
  if (compilers[data.type]) {
    self.postMessage(compilers[data.type](data));
  } else if (data.config) {
    config = data.config;
  } else {
    self.postMessage({error: "Could not find a parser for type '" + data.type + "'."});
  }
});