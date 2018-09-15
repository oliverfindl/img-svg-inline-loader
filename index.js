/**
 * [DEPRECATED]
 * img-svg-inline-loader v1.3.3 (2018-09-15)
 * Copyright 2018 Oliver Findl
 * @license MIT
 */

"use strict";

const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");
const SVGO = require("svgo");

const DEFAULT_OPTIONS = Object.freeze({
	keyword: "svg-inline",
	strict: true,
	xhtml: false,
	svgo: { plugins: [ { cleanupattributes: true } ] }
});

const PATTERN_ATTRIBUTE_NAME = /^[a-z][a-z-]+?[a-z]$/i;
//const PATTERN_KEYWORD = /\s+(?:data-)?svg-inline\s+/;
const PATTERN_IMAGE_SVG = /<img\s+[^>]*src[\s="']+([^"']+\.svg)(?:[\?#][^"']*)?["']+[^>]*\/?>/gi;
const PATTERN_ATTRIBUTES = /\s*([^\s=]+)[\s=]+(?:"([^"]*)"|'([^']*)')?\s*/g;
const PATTERN_TAG = /^<|>$/;
const PATTERN_SVG_OPEN_TAG = /^(<svg)\s+/i;

module.exports = function(content) {

	this.cacheable && this.cacheable();

	let options = Object.assign({}, DEFAULT_OPTIONS, loaderUtils.getOptions(this) || {});
	let svgo = options.svgo ? new SVGO(options.svgo) : null;
	if(!PATTERN_ATTRIBUTE_NAME.test(options.keyword)) {
		throw new Error("Keyword " + options.keyword + " is not valid.");
	}
	const PATTERN_KEYWORD = new RegExp("\\s+(?:data-)?" + options.keyword + "\\s+", "i");

	return content.replace(PATTERN_IMAGE_SVG, (image, source) => {

		if(options.strict && !PATTERN_KEYWORD.test(image)) {
			return image;
		}

		let file = {
			path: loaderUtils.urlToRequest(path.join(this.context, source), "/")
		};
		this.addDependency(file.path);

		try {
			file.content = fs.readFileSync(file.path, { encoding: "utf-8" });
		} catch(error) {
			throw new Error("File " + file.path + " does not exist.");
		}

		if(svgo) {
			try {
				svgo.optimize(file.content, result => file.content = result.data);
			} catch(error) {
				throw new Error("SVGO for " + file.path + " failed.");
			}
		}

		let attribute, attributes = [];
		while(attribute = PATTERN_ATTRIBUTES.exec(image)) {
			if(attribute.index === PATTERN_ATTRIBUTES.lastIndex) {
				PATTERN_ATTRIBUTES.lastIndex++;
			}
			if(attribute[1] && !PATTERN_TAG.test(attribute[1]) && PATTERN_ATTRIBUTE_NAME.test(attribute[1])) {
				attributes.push({
					key: attribute[1],
					value: attribute[2] ? attribute[2] : (options.xhtml ? attribute[1] : "")
				});
			}
		}
		PATTERN_ATTRIBUTES.lastIndex = 0;

		let keys = attributes.map(attribute => attribute.key.toLowerCase());
		if(keys.indexOf("role") === -1) {
			attributes.push({
				key: "role",
				value: "presentation"
			});
		}
		if(keys.indexOf("focusable") === -1) {
			attributes.push({
				key: "focusable",
				value: "false"
			});
		}

		return file.content.replace(PATTERN_SVG_OPEN_TAG, "$1 " + attributes.map(attribute => (["alt", "src"].indexOf(attribute.key.toLowerCase()) > -1 ? "data-" : "") + attribute.key + "=\"" + attribute.value + "\"").join(" ") + " ");

	});

};
