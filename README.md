Introduction
============

What is it ?
------------

This is an example on how to detect which element scrolls the view (HTML or BODY). It started with a feedback request on a JSMentors question/thread about smooth scrolling.

The 'game' was transitioning the `scrollTop` property using `requestAnimationFrame` (rAF). At that point I was tempted and curious to see how many lines of code were realy necessary for that task.

__TODO:__
>* make the duration time configurable (currently fixed to 1000ms)
>* allow referencing external easing functions to improve smoothness
>* improve code and readibility, add code comments were necessary
>* Bugs ? Please report !

Is it of some use ?
-------------------

It depends on your needs, from this small code you can just take the `getScrollingElement()` if it work for you.

However, you may also look at the code and see how to profit a global capturing event (delegation). Also see how adding a few lines of code would solve one of the most frequent web problems: __perform operations when users click on selected page links.__

The advantages of the final approach are:

>* avoid using monster frameworks
>* avoid waiting for a ready/load event
>* avoid attaching listener to hundreds elements
>* 60fps smooth scroll using native `requestAnimationFrame`
>* options let the target anchor be set/followed in the URL
>* pure Javascript, no libraries, full cross-browser down to IE6
>* faster page load and faster running scripts, no memory wasted

How can I use/profit it ?
-------------------------

The `getScrollingElement()` function performs a feature detection to find which element is responsible for scrollling the current view.

Firefox, Opera and IE use the `document.documentElement` when in Standard mode and the `document.body` when in Quirks mode.

Webkit, on his side and disrespectful of current specifications, will always use the `document.body` (W3C specifications [CSSOM View Module](http://dev.w3.org/csswg/cssom-view/#dom-element-scrolltop "W3C CSSOM Module")).

The feature detection, if proven to work, could avoid DOM code to fail when Webkit will fix the known and long-standing scrolling bug.

Currently DOM libraries and frameworks use a regular expression to sniff the UA and exclude Webkit from using the `document.documentElement` but that assumption may fail soon. A correct feature detection test is needed, hope this fits for the task.

Cut & Paste the following feature detection function in your code:

        function getScrollingElement() {
            var d = document;
            return  d.documentElement.scrollHeight > d.body.scrollHeight &&
                    d.compatMode.indexOf('CSS1') == 0 ?
                    d.documentElement :
                    d.body;
        }

and invoke it without arguments:

        var scrollEl = getScrollingElement();
		

Needed info
-----------

getScrollingElement() must be invoked every time, once, just before starting a scroll (content may change).

If you do tests with it make sure there is enough content to be scrolled (vertical scrollbar should be visible) or nothing will happen.
