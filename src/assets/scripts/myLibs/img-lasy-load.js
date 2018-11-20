function loadBgImage(queryCls, attrName, type ) {
	const bgElems = $('html').find(queryCls);
	document.addEventListener("DOMContentLoaded", function() {
		setTimeout(()=> {
			bgElems.each(function () {
				const imageUrl = $(this).attr(attrName);

				switch(type) {
					case 'bg':
						$(this).css('background-image', `url(${imageUrl})`)
						break;

					case 'src':
						$(this).attr('src', `${imageUrl}`)
						break;

				}
			})
		}, 500)

	});
}
