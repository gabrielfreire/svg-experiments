(function(global) {
    'use strict';
    var svgPlaceholder = document.getElementById("svgPlaceholder"),
        svg = document.getElementById('svgContainer'),
        createRect = document.getElementById('create-rect'),
        createCircle = document.getElementById('create-circle'),
        createLine = document.getElementById('create-line'),
        downloadBtn = document.getElementById('download'),
        dragBtn = document.getElementById('drag'),
        scaleBtn = document.getElementById('scale'),
        oldX = 0,
        svgElement = new SVGElement({
            stroke: 'red',
            strokeWidth: '4',
            color: 'transparent'
        }),
        downloadManager = new DownloadManager(),
        //URL and DATA for XML request
        url = 'http://dub-test-sales1/MAXIMS_DEV/CNHost',
        data = '<events><gridselection selection="0" button="0" id="a1000"/></events>';

    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttributeNS(null, 'viewBox', "0 0 " + screen.width + " " + screen.height);

    console.log(window.svgDocument);
    //Function to handle XML http requests
    function _xmlHttpRequest(url, data, success, error) {
        jQuery.ajax({
            type: "POST",
            data: data,
            url: url,
            dataType: "xml",
            contentType: "text/xml; charset=utf-8",
            success: success,
            error: error
        });
    }


    //TESTING XML REQUEST
    _xmlHttpRequest(url, data, function(xml) {
        var parser = new DOMParser(),
            data = xml.getElementsByTagName('data')[0];
        console.log(data.childNodes[0], ' < XML DATA Response');
    }, function(xhr, ajaxOptions, thrownError) {
        console.log('error');
        // console.log(xhr.status);          
        // console.log(thrownError);
    });

    function element_position(e) {
        var x = 0,
            y = 0;

        var inner = true;
        do {
            x += e.offsetLeft;
            y += e.offsetTop;
        } while (e = e.offsetParent);
        return { x: Number(x), y: Number(y) };
    }

    function _createLine(event) {
        var positionX = event.clientX,
            positionY = event.clientY,
            element = svgElement.createLine(positionX, positionY - 50 + window.scrollY, positionX, positionY - 50 + window.scrollY, 'black', '2');

        var s = svgElement.createControlPoint(positionX, positionY - 50 + window.scrollY, element);
        console.log(event.target.ownerDocument);

        function scaleX(event) {
            var selectedElement = element,
                circle = s,
                dx = event.clientX - positionX,
                dy = event.clientY - positionY,
                movementX = parseInt(element.getLineX()) + dx,
                movementY = parseInt(element.getLineY()) + dy,
                translate = 'translate(' + movementX + ', ' + movementY + ')';

            // Control point to be selected and move along with the element to be moved
            circle.attr('cx', movementX)
                .attr('cy', movementY);

            // Element to be moved
            selectedElement.attr('x2', movementX)
                .attr('y2', movementY);

            positionX = event.clientX;
            positionY = event.clientY;
        }

        function deselect(e) {
            // Deselect the control point
            s.removeEvent('mousemove', scaleX);
            s.removeEvent('mouseup', deselect);
            // Deselect the parent element ( Canvas/Container )
            svgPlaceholder.removeEventListener('mousemove', scaleX);
            svgPlaceholder.removeEventListener('mouseup', deselect);
            // s.removeEvent('mouseout', deselect);
        }
        // Control point events
        s.addEvent('mousemove', scaleX);
        s.addEvent('mouseup', deselect);
        // Parent Element events ( Canvas/Container )
        svgPlaceholder.addEventListener('mousemove', scaleX);
        svgPlaceholder.addEventListener('mouseup', deselect);
        // s.addEvent('mouseout', deselect);

        svg.appendChild(element.el);
        svg.appendChild(s.el);

    }
    /**
     * CREATE SVG ELEMENT EVENT METHOD
     */
    function _createRectX(event) {
        var positionX = event.clientX,
            positionY = event.clientY - 50 + window.scrollY,
            //x, y, width, height
            element = svgElement.createRect(Math.round(positionX), Math.round(positionY));

        svg.appendChild(element.el);
    }

    function _createCircleX(event) {
        var positionX = event.clientX,
            positionY = event.clientY - 50 + window.scrollY,
            //x, y, width, height
            element = svgElement.createCircle(Math.round(positionX), Math.round(positionY));

        svg.appendChild(element.el);
    }
    /**
     * ------------------------
     * Adding Events to buttons
     * ------------------------
     */

    // --------
    // CREATE
    // --------
    createRect.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        createRect.classList.add('active');
        createCircle.classList.remove('active');
        createLine.classList.remove('active');
        svgPlaceholder.removeEventListener('mouseup', _createCircleX);
        svgPlaceholder.addEventListener('mouseup', _createRectX);
        svgPlaceholder.removeEventListener('mousedown', _createLine);
        svgPlaceholder.classList.add('createMode');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToScaleElement);
                element.el.removeEventListener('mousedown', element.selectToDragElement);
            });
        }
    });
    createCircle.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        createRect.classList.remove('active');
        createLine.classList.remove('active');
        createCircle.classList.add('active');
        svgPlaceholder.removeEventListener('mouseup', _createRectX);
        svgPlaceholder.addEventListener('mouseup', _createCircleX);
        svgPlaceholder.removeEventListener('mousedown', _createLine);
        svgPlaceholder.classList.add('createMode');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToScaleElement);
                element.el.removeEventListener('mousedown', element.selectToDragElement);
            });
        }
    });
    createLine.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        createRect.classList.remove('active');
        createLine.classList.add('active');
        createCircle.classList.remove('active');
        svgPlaceholder.removeEventListener('mouseup', _createRectX);
        svgPlaceholder.removeEventListener('mouseup', _createCircleX);
        svgPlaceholder.addEventListener('mousedown', _createLine);
        svgPlaceholder.classList.add('createMode');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToScaleElement);
                element.el.removeEventListener('mousedown', element.selectToDragElement);
            });
        }
    });
    // --------
    // DRAG
    // --------
    dragBtn.addEventListener('click', function(e) {
        dragBtn.classList.add('active');
        scaleBtn.classList.remove('active');
        createRect.classList.remove('active');
        createCircle.classList.remove('active');
        createLine.classList.remove('active');
        svgPlaceholder.removeEventListener('mouseup', _createRectX);
        svgPlaceholder.removeEventListener('mouseup', _createCircleX);
        svgPlaceholder.removeEventListener('mousedown', _createLine);
        svgPlaceholder.classList.remove('createMode');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToScaleElement);
                element.el.addEventListener('mousedown', element.selectToDragElement);
            });
        }
    });
    // --------
    // SCALE
    // --------
    scaleBtn.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.add('active');
        createRect.classList.remove('active');
        createCircle.classList.remove('active');
        createLine.classList.remove('active');
        svgPlaceholder.removeEventListener('mouseup', _createRectX);
        svgPlaceholder.removeEventListener('mouseup', _createCircleX);
        svgPlaceholder.removeEventListener('mousedown', _createLine);
        svgPlaceholder.classList.remove('createMode');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToDragElement);
                element.el.addEventListener('mousedown', element.selectToScaleElement);
            });
        }
    });
    downloadBtn.addEventListener('click', function(e) {
        downloadManager.download();
    });
    /**
     * END BUTTON EVENTS
     */
})(window);