/*
 * How to determine which element should be used to scroll the viewport:
 *
 * - in Quirks mode it should be the "body"
 * - in Standard mode it should be the "documentElement"
 *
 * however, webkit based browsers, up to version AppleWebkit/600.1.17
 * (Chrome/Opera/Safari), will always use the "body",
 * disrespectful of the specifications:
 *
 *  http://dev.w3.org/csswg/cssom-view/#dom-element-scrolltop
 *
 * The feature detection allow cross-browser scroll operations on the
 * viewport, it will guess which element to use in each browser, both
 * in Quirk and Standard modes. It is a fix for possible differences
 * between browsers versions. If the Webkit bug get fixed someday,
 * it will just work if specs are followed.
 *
 * Author: Diego Perini
 * Updated: 2014/09/18
 * License: MIT
 *
 */

function getScrollingElement() {
	var d = document;
	return	d.documentElement.scrollHeight > d.body.scrollHeight &&
			d.compatMode.indexOf('CSS1') == 0 ?
			d.documentElement :
			d.body;
}
