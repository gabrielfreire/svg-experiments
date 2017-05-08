function Element(el) {
    this.el = el;
    return this;
}

var el = Element.prototype,
    oldX = 0;

/**
 * DRAG OBJECT EVENT METHOD
 */
el.selectToDragElement = function(e) {
    var selectedElement = e.target,
        currX = e.clientX,
        currY = e.clientY,
        moveElement = _moveElement,
        deselectElement = _deselectElement,
        currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7, -1).split(' ');

    for (var i = 0; i < currentMatrix.length; i++) {
        currentMatrix[i] = parseFloat(currentMatrix[i]);
    }

    //method that moves the selected element to the mouse position
    function _moveElement(event) {
        var dx = (event.clientX - currX) / 4,
            dy = (event.clientY - currY) / 4;
        currentMatrix[4] += dx;
        currentMatrix[5] += dy;
        var newMatrix = 'matrix(' + currentMatrix.join(" ") + ')';
        selectedElement.setAttributeNS(null, "transform", newMatrix);
        currX = event.clientX;
        currY = event.clientY;
    }

    //deselect event method used to remove events from the selected element
    function _deselectElement(event) {
        if (selectedElement != 0) {
            selectedElement.removeAttributeNS(null, 'onmousemove');
            selectedElement.removeAttributeNS(null, 'onmouseout');
            selectedElement.removeAttributeNS(null, 'onmouseup');
            selectedElement = 0;
        }
    }

    selectedElement.addEventListener('mousemove', moveElement);
    selectedElement.addEventListener('mouseout', deselectElement);
    selectedElement.addEventListener('mouseup', deselectElement);
}

/**
 * SCALE OBJECT EVENT METHOD
 */
el.selectToScaleElement = function(e) {
    var selectedElement = e.target,
        currentWidth = selectedElement.getAttributeNS(null, 'width'),
        currentHeight = selectedElement.getAttributeNS(null, 'height'),
        resize = _resize,
        rescale = _rescale,
        deselectElement = _deselectElement,
        currentRadius = selectedElement.getAttributeNS(null, 'r');

    /**
     * Scaling for Rects
     */
    //method to scale element up
    function _upsize() {
        selectedElement.setAttributeNS(null, 'width', currentWidth);
        selectedElement.setAttributeNS(null, 'height', currentHeight);
        currentWidth = Number(currentWidth) + 0.8;
        currentHeight = Number(currentHeight) + 0.8;
    }

    //method to scale element down
    function _downsize() {
        selectedElement.setAttributeNS(null, 'width', currentWidth);
        selectedElement.setAttributeNS(null, 'height', currentHeight);
        currentWidth = Number(currentWidth) - 0.8;
        currentHeight = Number(currentHeight) - 0.8;
    }
    /**
     * Scaling for Circles
     */
    function _upScale(e) {
        selectedElement.setAttributeNS(null, 'r', currentRadius);
        currentRadius = Number(currentRadius) + 0.8;
    }

    function _downScale(e) {
        selectedElement.setAttributeNS(null, 'r', currentRadius);
        currentRadius = Number(currentRadius) - 0.8;
    }

    //RECT - method to resize element depending on the direction the mouse is pursuing
    function _resize(e) {

        if (e.pageX > oldX) {
            _upsize();
        } else if (e.pageX < oldX) {
            _downsize();
        }
        oldX = e.pageX;
    }
    //CIRCLE - method to resize element depending on the direction the mouse is pursuing
    function _rescale(e) {
        if (e.pageX > oldX) {
            _upScale(e);
        } else if (e.pageX < oldX) {
            _downScale(e);
        }
        oldX = e.pageX;
    }

    //deselect event method used to remove events from the selected element
    function _deselectElement() {
        if (selectedElement != 0) {
            selectedElement.removeAttributeNS(null, 'onmousemove');
            selectedElement.removeAttributeNS(null, 'onmouseout');
            selectedElement.removeAttributeNS(null, 'onmouseup');
            selectedElement = 0;
        }
    }
    if (selectedElement.isRect) {
        selectedElement.addEventListener('mousemove', resize);
    } else {
        selectedElement.addEventListener('mousemove', rescale);
    }
    selectedElement.addEventListener('mouseout', deselectElement);
    selectedElement.addEventListener('mouseup', deselectElement);
}