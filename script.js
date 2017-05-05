(function(global) {
    var svgPlaceholder = document.getElementById("svgPlaceholder"),
        svg = document.getElementById('svgContainer'),
        createBtn = document.getElementById('create'),
        dragBtn = document.getElementById('drag'),
        scaleBtn = document.getElementById('scale'),
        rects = [],
        oldX = 0;

    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    /**
     * CREATE SVG ELEMENT EVENT METHOD
     */
    function createSvg(event) {
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
            body = document.body,
            positionX = event.clientX / 4,
            positionY = event.clientY / 4;


        rect.setAttribute('x', positionX);
        rect.setAttribute('y', positionY);
        rect.setAttribute('class', 'svgRect');
        rect.setAttribute('width', '40');
        rect.setAttribute('height', '40');
        rect.setAttribute('stroke', 'black');
        rect.setAttribute('stroke-width', '1px');
        rect.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
        // if (draggable) {
        //     rect.addEventListener('mousedown', selectElement);
        // }
        svg.appendChild(rect);
        rects.push(rect);
        // global.rects = rects;
    }
    /**
     * DRAG OBJECT EVENT METHOD
     */
    function selectToDragElement(e) {
        var selectedElement = e.target,
            currX = e.clientX,
            currY = e.clientY,
            moveElement = _moveElement,
            deselectElement = _deselectElement,
            currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7, -1).split(' ');

        for (var i = 0; i < currentMatrix.length; i++) {
            currentMatrix[i] = parseFloat(currentMatrix[i]);
        }

        function _moveElement(event) {
            dx = (event.clientX - currX) / 4;
            dy = (event.clientY - currY) / 4;
            currentMatrix[4] += dx;
            currentMatrix[5] += dy;
            var newMatrix = 'matrix(' + currentMatrix.join(" ") + ')';
            selectedElement.setAttributeNS(null, "transform", newMatrix);
            currX = event.clientX;
            currY = event.clientY;
        }

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
    function selectToScaleElement(e) {
        var selectedElement = e.target,
            currentWidth = selectedElement.getAttributeNS(null, 'width'),
            resize = _resize,
            deselectElement = _deselectElement;
        currentHeight = selectedElement.getAttributeNS(null, 'height');
        console.log('selected ', selectedElement);

        function _upsize() {
            selectedElement.setAttributeNS(null, 'width', currentWidth);
            selectedElement.setAttributeNS(null, 'height', currentHeight);
            currentWidth = Number(currentWidth) + 0.8;
            currentHeight = Number(currentHeight) + 0.8;
        }

        function _downsize() {
            selectedElement.setAttributeNS(null, 'width', currentWidth);
            selectedElement.setAttributeNS(null, 'height', currentHeight);
            currentWidth = Number(currentWidth) - 0.8;
            currentHeight = Number(currentHeight) - 0.8;
        }

        function _resize(e) {

            if (e.pageX > oldX) {
                _upsize();
            } else if (e.pageX < oldX) {
                _downsize();
            }
            oldX = e.pageX;
        }

        function _deselectElement() {
            if (selectedElement != 0) {
                selectedElement.removeAttributeNS(null, 'onmousemove');
                selectedElement.removeAttributeNS(null, 'onmouseout');
                selectedElement.removeAttributeNS(null, 'onmouseup');
                selectedElement = 0;
            }
        }

        selectedElement.addEventListener('mousemove', resize);
        selectedElement.addEventListener('mouseout', deselectElement);
        selectedElement.addEventListener('mouseup', deselectElement);
    }

    /**
     * ----------------------
     * Adding Events to buttons
     * ----------------------
     */

    // --------
    // CREATE
    // --------
    createBtn.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        createBtn.classList.add('active');
        svgPlaceholder.addEventListener('mouseup', createSvg);
        svgPlaceholder.classList.add('createMode');
        if (rects.length > 0) {
            rects.forEach(function(rect) {
                rect.removeEventListener('mousedown', selectToScaleElement);
                rect.removeEventListener('mousedown', selectToDragElement);
            });
        }
    });
    // --------
    // DRAG
    // --------
    dragBtn.addEventListener('click', function(e) {
        dragBtn.classList.add('active');
        scaleBtn.classList.remove('active');
        createBtn.classList.remove('active');
        svgPlaceholder.removeEventListener('mouseup', createSvg);
        svgPlaceholder.classList.remove('createMode');
        if (rects.length > 0) {
            rects.forEach(function(rect) {
                rect.removeEventListener('mousedown', selectToScaleElement);
                rect.addEventListener('mousedown', selectToDragElement);
            });
        }
    });
    // --------
    // SCALE
    // --------
    scaleBtn.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.add('active');
        createBtn.classList.remove('active');
        svgPlaceholder.removeEventListener('mouseup', createSvg);
        svgPlaceholder.classList.remove('createMode');
        if (rects.length > 0) {
            rects.forEach(function(rect) {
                rect.removeEventListener('mousedown', selectToDragElement);
                rect.addEventListener('mousedown', selectToScaleElement);
            });
        }
    });
    /**
     * END BUTTON EVENTS
     */
})(window);