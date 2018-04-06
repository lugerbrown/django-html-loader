
# django-html-loader for webpack 
based on original implementation of 
[nunjucks-html-loader](https://www.npmjs.com/package/nunjucks-html-loader)

django-html-loader main goal is to ignore django tags so
html templates can be used with webpack and reused in django projects.
django tag replacements are done in dependant templates (includes and extends) 
using [string-replace-loader](https://www.npmjs.com/package/string-replace-loader) configuration.

## Installation

```dos
npm install @lugerbrown/django-html-loader
```


## Usage

```javascript

  loader: 'django-html-loader',
  options: {
      searchPaths: [
          path.resolve(__dirname, 'src/templates'),
      ],
      //Path to resolve images
      imgroot: path.resolve(__dirname, 'src/assests/img'), 
      //Page context to be rendered.
      context: {title:"title"},
      //To apply replacements done on depedent templates using 'string-replace-loader'
      applyReplaceLoader: true 
  }
```