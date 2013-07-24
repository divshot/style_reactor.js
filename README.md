# Style Reactor

Style Reactor allows you to compile CSS preprocessor languages in the browser's background.
If you wish to offer your users the ability to add custom CSS to their application, Style
Reactor gives you an easy way to do so with support for popular JavaScript-based compilers.

Currently supported compilers:

* **LESS** (1.4.1)
* **Stylus** (0.34.1)

## Usage

The Style Reactor uses a simple JSON message-passing schema for communication.
When you want to compile something, you simply need to pass:

* **type:** the language of the source. Should be `less` or `stylus`
* **source:** the uncompiled source code in the specified language

Style Reactor will then trigger compilation of the provided source and, when
complete, post a message back to the worker. If there was a compilation error,
the message will look something like this:

```json
{"error": "The error message goes here."}
```

If the compilation succeeded, the message will look like this:

```json
{"css":".result-css { color: red; }"}
```

A quick programmatic example of Style Reactor in action:

```js
var reactor = new Worker("js/style_reactor.js");

reactor.postMessage({
  type: "less",
  source: ".parent { color: red; .child { color: blue; } }"
});

reactor.addEventListener("message", function(e) {
  var data = e.data;
  
  if (data.error) {
    alert(data.error);
  } else {
    $("head").append($("<style></style>").text(data.css));
  }
});
```

## License

Copyright (c) 2013 Divshot, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.