(function() {

	var i,
	w = window,
	d = w.document,
	r = d.documentElement,
	s = 'addEventListener',

	// determine event model
	w3c = d[s];
	pre = w3c ? '' : 'on';
	add = w3c ? s : 'attachEvent';

	// get needed prefixed API names
	MATCH = prefix(r, 'matchesSelector'),
	CANCEL = prefix(w, 'cancelAnimationFrame'),
	REQUEST = prefix(w, 'requestAnimationFrame');

	// a polyfill is our last resource
	if (typeof w[REQUEST] != 'function') {
		w[REQUEST] = function(loop) {
			setTimeout(function() {
				loop((new Date).getTime());
			}, 1000/60);
		};
	}

	// build prefixed API
	function prefix(h, f) {
		var a, p , i, n;
		if (typeof h[f] != 'function') {
			p = [ 'webkit', 'moz', 'ms' , 'o'];
			n = f.charAt(0).toUpperCase() + f.slice(1);
			for (i in p) if (p[i] + n in h) a = p[i] + n;
		}
		return a ? a : f;
	}

	// determine the element to use
	function getScrollingElement() {
		return	d.documentElement.scrollHeight > d.body.scrollHeight &&
				d.compatMode.indexOf('CSS1') == 0 ?
				d.documentElement :
				d.body;
	}

	function scrollTo(dest, ms) {
		var el = getScrollingElement(), s_time = 0,
		start = el.scrollTop, delta = dest - start;
		ms || (ms = 1000);
		w[REQUEST](loop);
		function loop(time) {
			s_time || (s_time = time);
			if (ms > (time - s_time)) {
				w[REQUEST](loop);
				el.scrollTop = delta * ((time - s_time) / ms) + start;
			} else el.scrollTop = delta + start;
		};
	}

	// add a global click event handler
	d[add](pre + 'click', function(e) {

		var attr, node, offset = 0,

		// consider older IE engines
		target = e.target || e.srcElement;

		// if the node matches our conditions engage a scroll action
		// on newer browser 'matchesSelector' could be used
		// (target[MATCH]("a[href*='#']:not([href='#'])"))
		if (target && target.nodeName.toLowerCase() == 'a' &&
			(attr = target.attributes["href"].value) &&
			/^#[\w]+/.test(attr)) {

			// get anchor node reference by it's id
			node = d.getElementById(attr.slice(1));
			if (node) {
				// get #topindex element height if any
				offset = d.getElementById('topindex');
				offset = offset && offset.clientHeight || 0;
			}

			scrollTo(node.offsetTop - offset, 1000);

			// remove the following lines to allow the
			// target anchor "#" be set/followed in the URL
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			return false;
		}
	}, true);

})();
