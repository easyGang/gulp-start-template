function elementInViewport(el) {
	if (el !== undefined && el !== null) {
		var top = el.offsetTop;
		var left = el.offsetLeft;
		var width = el.offsetWidth;
		var height = el.offsetHeight;

		while(el.offsetParent) {
			el = el.offsetParent;
			top += el.offsetTop;
			left += el.offsetLeft;
		}

		return (
			top >= window.pageYOffset &&
			left >= window.pageXOffset &&
			(top + height - 100) <= (window.pageYOffset + window.innerHeight) &&
			(left + width - 100) <= (window.pageXOffset + window.innerWidth)
		);
	}
}
