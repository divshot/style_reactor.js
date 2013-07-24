var window = this;
var document = {getElementsByTagName: function(){ return []}};

var parsers = {}
var compilers = {
  less: function(data) {
    if (!parsers.less) {
      importScripts("//cdnjs.cloudflare.com/ajax/libs/less.js/1.4.1/less.min.js");
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
      importScripts("../bower_components/stylus.js/index.js");
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
  } else {
    self.postMessage({error: "Could not find a parser for type '" + data.type + "'."});
  }
});