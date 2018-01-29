Document the reason for each library. Keep this in sync with `package.json`.

```js
	"dependencies": {
		// This allows us to use React components in plain ol' HTML.
		"react-habitat": "^1.0.0-beta",
		// This supplies the ReduxDomFactory for our Manifest.
		"react-habitat-redux": "",
		// This adds bindings for Redux within React (helper functions).
		"react-redux": "",
		// This is our state manager.
		"redux": ""
	},
	"devDependencies": {
		// The base babel package.
		"babel-core": "",
		// Core babel plugin for webpack.
		"babel-loader": "",
		// This fixes an incompatibility with export statements.
		// And keeps us from having to append `.default` onto
		// any `require()` statement.
		"babel-plugin-add-module-exports": "",
		// This handles import statements.
		"babel-plugin-dynamic-import-webpack": "",
		// This transpiles properties attached to classes,
		// which we need for PropTypes (component documentation),
        // and other things.
		"babel-plugin-transform-class-properties": "",
		// This adds custom element support to ES6 classes (needed for React
		// components).
		"babel-plugin-transform-custom-element-classes": "",
		// This allows us to use the rest syntax
		// within objects.
		"babel-plugin-transform-object-rest-spread": "",
		// This is the standard preset for babel.
		"babel-preset-env": "",
		// This adds support for React in babel.
		"babel-preset-react": "",
		// Adds CSS support to webpack.
		"css-loader": "",
		// Separates CSS from JS in webpack bundles.
		"extract-text-webpack-plugin": "",
		// Opens the browser when running a local server.
		"open-browser-webpack-plugin": "",
		// This allows us to document prop types for React components.
		"prop-types": "",
		// This allows us to beautify the code.
		"prettier": "",
		// This allows us to keep from duplicating code when
		// components are used inside other components/containers.
		"react-async-component": "",
		// This injects <style> tags into the DOM with webpack.
		"style-loader": "",
		// This minifies our code.
		"uglifyjs-webpack-plugin": "",
		// This allows us to bundle all dependencies together.
		"webpack": "",
		// This allows us to run a local test server.
		"webpack-dev-server": ""
	}
```
