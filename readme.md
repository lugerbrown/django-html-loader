
# django-html-loader for webpack 
based on original implementation of 
[nunjucks-html-loader](https://www.npmjs.com/package/nunjucks-html-loader)

django-html-loader main goal is to ignore django tags so
html templates can be used with webpack and reused in django projects.
django tag replacements are done in dependant templates (includes and extends) 
using [string-replace-loader](https://www.npmjs.com/package/string-replace-loader) configuration.

## Installation

  `npm install @lugerbrown/django-html-loader`


