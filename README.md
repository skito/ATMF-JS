# ATMF-JS [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Build%20complex%20localized%20%23Javascript%20web%20solutions%20with%20%23ATMF%0A%0A&url=https://github.com/skito/ATMF-JS)

__Javascript support for ATMF (Advanced-Template-Markup-Format)__

![GitHub release (latest by date)](https://img.shields.io/badge/Ecosystems-gray)
![GitHub release (latest by date)](https://img.shields.io/badge/Browser-yellow)
![GitHub release (latest by date)](https://img.shields.io/badge/NodeJS-green)
![GitHub release (latest by date)](https://img.shields.io/badge/React-blue)

&nbsp;
 
# More about ATMF
Full specificaiton of the format is [available here](https://github.com/skito/ATMF)

# Ecosystems
The ATMF engine is written in pure Javascript and it executes in all JS ecosystems. There are several libraries which wrap the core engine, in order to face enviropment specifics and get the most of ATMF. Choose your ecosystem.

- [Get started with Browser](https://github.com/skito/ATMF-JS/blob/main/README-BROWSER.md)
- [Get started with NodeJS](https://github.com/skito/ATMF-JS/blob/main/README-NODEJS.md)
- [Get started with React](https://github.com/skito/ATMF-JS/blob/main/README-REACT.md)

# Prototyping
Depending on your environment or framework you might want to have custom discovery of templates and language resources. You can prototype the ATMF engine in order to face your requiremnets.

__Template Discovery__
```javascript
ATMFEngine.prototype.DiscoverTemplate = function (name) {
    // ...
    // Do the discovery
    // Return the template as STR or PROMISE
};

ATMFEngine.prototype.GetTemplate = function (name) {
    if (typeof this.templates[name] != 'undefined')
        return this.templates[name];
    else {
         // AS STR
         // return this.DiscoverTemplate(name);
         // OR AS PROMISE
         // this.DiscoverTemplate(name).then((name) => { });
    }
}

SetTemplateDiscoveryPath(path, ext = ['html', 'tpl']) {
    path = path.replace(/\/$/, "").replace(/\\$/, "");
    this._templateDiscoveryPath = path;
    this._templateDiscoveryExt = Array.isArray(ext) ? ext : [ext];
}
```

__Culture Discovery__
```javascript
ATMFEngine.prototype.ResolveCultureResource = function (keyname) {
    var translations = {};
    
    // ...
    // Do the discovery
    // Return the translations object
    // Example
    // { 'namespace/path': { 'key1': 'value1', 'key2': 'value2' }
    
    return translations;
};
```




