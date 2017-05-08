(function(global) {
    'use strict';
    var svgPlaceholder = document.getElementById("svgPlaceholder"),
        svg = document.getElementById('svgContainer'),
        createRect = document.getElementById('create-rect'),
        createCircle = document.getElementById('create-circle'),
        dragBtn = document.getElementById('drag'),
        scaleBtn = document.getElementById('scale'),
        rects = [],
        oldX = 0,
        svgElement = new SVGElement({
            stroke: 'black',
            color: 'white'
        }),
        //URL and DATA for XML request
        url = 'http://dub-test-sales1/MAXIMS_DEV/CNHost',
        data = '<events><gridselection selection="0" button="0" id="a1000"/></events>';


    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");


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
        console.log(xml, ' < XML Response');
        console.log(data.childNodes[0], ' < XML DATA Response');
    }, function(xhr, ajaxOptions, thrownError) {
        console.log('error');
        // console.log(xhr.status);          
        // console.log(thrownError);
    });


    /**
     * CREATE SVG ELEMENT EVENT METHOD
     */
    function createRectX(event) {
        var positionX = event.clientX / 4,
            positionY = event.clientY / 4,
            //x, y, width, height
            element = svgElement.createRect(positionX, positionY, '40', '40');

        svg.appendChild(element.el);
        rects.push(element);
    }

    function createCircleX(event) {
        var positionX = event.clientX / 4,
            positionY = event.clientY / 4,
            //x, y, width, height
            cir = svgElement.createCircle(positionX, positionY);

        svg.appendChild(cir.el);
        rects.push(cir);
    }
    /**
     * ----------------------
     * Adding Events to buttons
     * ----------------------
     */

    // --------
    // CREATE
    // --------
    createRect.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        createRect.classList.add('active');
        createCircle.classList.remove('active');
        svgPlaceholder.removeEventListener('mouseup', createCircleX);
        svgPlaceholder.addEventListener('mouseup', createRectX);
        svgPlaceholder.classList.add('createMode');
        if (rects.length > 0) {
            rects.forEach(function(rect) {
                rect.el.removeEventListener('mousedown', rect.selectToScaleElement);
                rect.el.removeEventListener('mousedown', rect.selectToDragElement);
            });
        }
    });
    createCircle.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        createRect.classList.remove('active');
        createCircle.classList.add('active');
        svgPlaceholder.removeEventListener('mouseup', createRectX);
        svgPlaceholder.addEventListener('mouseup', createCircleX);
        svgPlaceholder.classList.add('createMode');
        if (rects.length > 0) {
            rects.forEach(function(rect) {
                rect.el.removeEventListener('mousedown', rect.selectToScaleElement);
                rect.el.removeEventListener('mousedown', rect.selectToDragElement);
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
        svgPlaceholder.removeEventListener('mouseup', createRectX);
        svgPlaceholder.removeEventListener('mouseup', createCircleX);
        svgPlaceholder.classList.remove('createMode');
        if (rects.length > 0) {
            rects.forEach(function(rect) {
                rect.el.removeEventListener('mousedown', rect.selectToScaleElement);
                rect.el.addEventListener('mousedown', rect.selectToDragElement);
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
        svgPlaceholder.removeEventListener('mouseup', createRectX);
        svgPlaceholder.removeEventListener('mouseup', createCircleX);
        svgPlaceholder.classList.remove('createMode');
        if (rects.length > 0) {
            rects.forEach(function(rect) {
                rect.el.removeEventListener('mousedown', rect.selectToDragElement);
                rect.el.addEventListener('mousedown', rect.selectToScaleElement);
            });
        }
    });
    /**
     * END BUTTON EVENTS
     */
})(window);