/**
 * img-svg-inline-loader v1.0.0 (2018-01-18)
 * Copyright 2018 Oliver Findl
 * @license MIT
 */

"use strict";

const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");
const SVGO = require("svgo");

const PATTERN_IMG_SVG = /<img([^>]*?)src[\s="']+([^"']+?\.svg)(?:[\?#][^"']*?)?["']+([^>]*?)\/?>/gi;
const PATTERN_KEYWORD = /\s+(?:data-)?svg-inline\s*/;
const DEFAULT_OPTIONS = {
	strict: true,
	svgo: { plugins: [ { cleanupAttrs: true } ] }
};

module.exports = function(content) {

	this.cacheable && this.cacheable();

	const options = Object.assign({}, DEFAULT_OPTIONS, loaderUtils.getOptions(this));
	const svgo = new SVGO(options.svgo);

	return content.replace(PATTERN_IMG_SVG, (match, attributesBefore, fileName, attributesAfter) => {

		if(options.strict && !PATTERN_KEYWORD.test(attributesBefore) && !PATTERN_KEYWORD.test(attributesAfter)) {
			return match;
		}

		const filePath = loaderUtils.urlToRequest(path.join(this.context, fileName), "/");
		this.addDependency(filePath);

		let fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
		svgo.optimize(fileContent, result => {
			fileContent = result.data;
		});

		return fileContent.replace(/^(<svg)\s+/, "$1 " + [attributesBefore, attributesAfter].join(" ").replace(/\s+/g, " ").trim());

	});

};
