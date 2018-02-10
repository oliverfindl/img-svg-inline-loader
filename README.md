

# img-svg-inline-loader

[![npm](https://img.shields.io/npm/v/img-svg-inline-loader.svg?style=flat)](https://www.npmjs.com/package/img-svg-inline-loader)
[![npm](https://img.shields.io/npm/dt/img-svg-inline-loader.svg?style=flat)](https://www.npmjs.com/package/img-svg-inline-loader)
[![npm](https://img.shields.io/npm/l/img-svg-inline-loader.svg?style=flat)](https://www.npmjs.com/package/img-svg-inline-loader)

Webpack loader used for inline replacement of SVG reference in src attribute of img tags with actual content of SVG file.

> Loader has built-in [SVGO](https://github.com/svg/svgo) support for SVG optimization.

---

## Install

`npm install img-svg-inline-loader --save-dev`

## Usage

In webpack config:
```javascript
{
	test: /\.html$/,
	use: [
		{
			loader: "img-svg-inline-loader",
			options: { /* ... */ }
		},
		// ...
	]
}
```

In code:
```html
<img svg-inline class="icon" src="./images/fa/user.svg" alt="fa-user" />
```

Which replaces into:
```xml
<svg svg-inline class="icon" alt="fa-user" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c88.366 0 160 71.634 160 160s-71.634 160-160 160S96 248.366 96 160 167.634 0 256 0zm183.283 333.821l-71.313-17.828c-74.923 53.89-165.738 41.864-223.94 0l-71.313 17.828C29.981 344.505 0 382.903 0 426.955V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48v-37.045c0-44.052-29.981-82.45-72.717-93.134z"/></svg>
```

## Configuration

Default options:
```javascript
{
	keyword: "svg-inline",
	strict: true,
	xhtml: false,
	svgo: {
		plugins: [
			{
				cleanupAttrs: true
			},
			// ...
		]
	}
}
```
Explanation:
* **keyword**  
Defines keyword, which marks img tags you want to inline replace with SVG. Keyword has to be wrapped with whitespace characters (e.g. space). 
In case of some conflicts, you can also use data version of your keyword (e.g. `data-keyword`).

* **strict**  
In strict mode loader replaces only img tags with defined keyword. If strict mode is disabled, loader replaces all img tags.

* **xhtml**  
In XHTML mode attribute minimization is forbidden. Empty attributes are filled with their names to be XHTML-compliant (e.g. `disabled="disabled"`).

* **svgo**  
[SVGO](https://github.com/svg/svgo) documentation can be found [here](https://github.com/svg/svgo). If you do not want use [SVGO](https://github.com/svg/svgo), set it to `null`.

Notes: User-defined options are not deep-merged with default options.

---

## License

[MIT](http://opensource.org/licenses/MIT)
