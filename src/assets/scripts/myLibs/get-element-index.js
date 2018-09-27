function getElementIndex(elem) {

    elem = elem.tagName ? elem : document.querySelector(elem); // можно добавить еще проверок

    return [].indexOf.call(elem.parentNode.children, elem)
}
