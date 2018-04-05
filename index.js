var utils = require('loader-utils');
var fs = require('fs');
var path = require('path');
var nunjucks = require('nunjucks');

var NunjucksLoader = nunjucks.Loader.extend({
    //Based off of the Nunjucks 'FileSystemLoader' 

    init: function (searchPaths, sourceFoundCallback) {
        this.sourceFoundCallback = sourceFoundCallback;
        if (searchPaths) {
            searchPaths = Array.isArray(searchPaths) ? searchPaths : [searchPaths];
            // For windows, convert to forward slashes
            this.searchPaths = searchPaths.map(path.normalize);
        } else {
            this.searchPaths = ['.'];
        }
    },

    makeReplace: function (content, search, flags, replace) {
        return content.replace(new RegExp(search, flags), replace);
    },

    getSource: function (name) {
        var fullpath = null;
        var paths = this.searchPaths;

        for (var i = 0; i < paths.length; i++) {
            var basePath = path.resolve(paths[i]);
            var p = path.resolve(paths[i], name);

            // Only allow the current directory and anything
            // underneath it to be searched
            if (p.indexOf(basePath) === 0 && fs.existsSync(p)) {
                fullpath = p;
                break;
            }
        }

        if (!fullpath) {
            return null;
        }

        var stringReplaceLoaderOptions = this.sourceFoundCallback(fullpath);
        var fileContent = fs.readFileSync(fullpath, 'utf-8');

        if (typeof stringReplaceLoaderOptions !== 'undefined') {
            if (typeof stringReplaceLoaderOptions.multiple !== 'undefined') {
                for (let i = 0; i < stringReplaceLoaderOptions.multiple.length; i++) {
                    const element = stringReplaceLoaderOptions.multiple[i];
                    fileContent = this.makeReplace(fileContent, element.search, element.flags, element.replace);
                }
            } else {
                const element = stringReplaceLoaderOptions;
                fileContent = this.makeReplace(fileContent, element.search, element.flags, element.replace);
            }
        }

        return {
            src: fileContent,
            path: fullpath,
            noCache: this.noCache
        };
    }
});

module.exports = function (content) {
    this.cacheable();

    var callback = this.async();
    var opt = utils.parseQuery(this.query);

    var nunjucksSearchPaths = opt.searchPaths;
    var nunjucksContext = opt.context;
    var applyReplaceLoader = opt.applyReplaceLoader;

    var loader = new NunjucksLoader(nunjucksSearchPaths, function (path) {
        this.addDependency(path);

        if (typeof applyReplaceLoader !== 'undefined' && applyReplaceLoader) {
            for (let i = 0; i < this.loaders.length; i++) {
                const element = this.loaders[i];
                if (element.path.includes('string-replace-loader')) {
                    return element.options;
                }
            }
        }

    }.bind(this));

    var nunjEnv = new nunjucks.Environment(loader);
    nunjucks.configure(null, {
        watch: false
    });

    var template = nunjucks.compile(content, nunjEnv);
    html = template.render(nunjucksContext);

    callback(null, html);
};
