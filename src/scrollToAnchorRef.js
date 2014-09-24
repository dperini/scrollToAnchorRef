(function(window, options) {

	var i,
	w = window,
	d = w.document,
	r = d.documentElement,
	s = 'addEventListener',

	// determine event model
	w3c = d[s],
	pre = w3c ? '' : 'on',
	add = w3c ? s : 'attachEvent',

	// needed if 'matchesSelector' used
	//MATCH = prefix(r, 'matchesSelector'),

	// get needed prefixed API names
	CANCEL = prefix(w, 'cancelAnimationFrame'),
	REQUEST = prefix(w, 'requestAnimationFrame');

	// set default options values
	options.callback || (options.callback = null);
	options.duration || (options.duration = 1000);
	options.easingFunc || (options.easingFunc = null);
	options.fixedHeader || (options.fixedHeader = '');
	options.followTarget || (options.followTarget = false);

	// a polyfill as last resource for IE
	if (typeof w[REQUEST] != 'function') {
		w[REQUEST] = function(loop) {
			setTimeout(function() {
				loop(+new Date);
			}, options.duration/60);
		};
	}

	// get vendor prefixed API name
	function prefix(h, f) {
		var a, p, i, n;
		if (typeof h[f] != 'function') {
			p = ['webkit', 'moz', 'ms', 'o'];
			n = f.charAt(0).toUpperCase() + f.slice(1);
			for (i in p) { if (p[i] + n in h) a = p[i] + n; }
		}
		return a ? a : f;
	}

	// get fixed header height if any
	function getHeaderOffset(name) {
		var node = d.getElementById(name);
		return node && node.clientHeight || 0;
	}

	// get reference node from anchor target
	function getReferenceFrom(target) {
		// use 'attributes' collection for IE < 9
		var attr = target.attributes['href'].value;
		return attr ? d.getElementById(attr.slice(1)) : null;
	}

	// determine the element to use
	function getScrollingElement() {
		return d.documentElement.scrollHeight > d.body.scrollHeight &&
			d.compatMode.indexOf('CSS1') === 0 ?
			d.documentElement :
			d.body;
	}

	// check if node match
	function match(node) {
		// new browsers could use 'matchesSelector/getAttribute'
		// however there are no benefits in this specific case
		// return node[MATCH]("a[href*='#']:not([href='#'])") ?
		// 	node.getAttribute('href').value : null;
		var attr = node.attributes['href'].value;
		return node.nodeName.toLowerCase() == 'a' &&
			(/^#[\w]+/).test(attr) ?
			attr : null;
	}

	// default easing function
	function easingFunc(t, b, c, d) {
		// in-out cubic easing from:
		// http://gizma.com/easing/
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t + b;
		t -= 2; return c / 2 * (t * t * t + 2) + b;
	}

	if (typeof options.easingFunc == 'function') {
		easingFunc = options.easingFunc;
	}

	// scroll to anchor reference
	function scrollToAnchorRef(dest, msecs, callback) {

		var el = getScrollingElement(), start_time = 0,
		start = el.scrollTop, delta = dest - start;
		msecs || (msecs = options.duration);
		w[REQUEST](loop);

		function loop(time) {
			var run_time;
			start_time || (start_time = time);
			run_time = time - start_time;
			if (msecs > run_time) {
				w[REQUEST](loop);
				el.scrollTop = easingFunc(run_time, start, delta, msecs);
			} else {
				// double check to avoid a repaint ?
				if (dest != delta + start) el.scrollTop = delta + start;
				if (typeof callback == 'function') callback(+new Date);
			}
		}

	}

	// add a global click event handler
	d[add](pre + 'click', function(e) {

		var node, offset,

		// consider older IE engines
		target = e.target || e.srcElement;

		// if the target node matches our conditions
		// engage a scroll to the referenced node id
		if (target && match(target)) {

			node = getReferenceFrom(target);
			offset = getHeaderOffset(options.fixedHeader || '');
			scrollToAnchorRef(node.offsetTop - offset, options.duration, options.callback);

			// remove the following lines to allow the
			// target anchor "#" be set/followed in the URL
			if (!options.followTarget) {
				if (e.preventDefault) e.preventDefault();
				else e.returnValue = false;
				return false;
			}

			return true;

		}
	}, true);

})(window, {
	callback: null,
	duration: '1000',
	easingFunc: null,
	followTarget: false,
	fixedHeader: 'topindex'
});
