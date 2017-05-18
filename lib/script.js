/**
 * @class {Script} Script class that builds the drawer component by Gabriel Freire
 */
(function(window, screen) {
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
            stroke: 'black',
            strokeWidth: '2',
            color: 'transparent'
        }),
        downloadManager = new DownloadManager(),
        //URL and DATA for XML request
        url = 'http://dub-test-sales1/MAXIMS_DEV/CNHost',
        data = '<events><gridselection selection="0" button="0" id="a1000"/></events>',
        self = this;

    console.log(self);
    // document.body.appendChild(templateNode);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttributeNS(null, 'viewBox', "0 0 " + screen.width + " " + screen.height);

    //Function to handle XML http requests
    // function _xmlHttpRequest(url, data, success, error) {
    //     jQuery.ajax({
    //         type: "POST",
    //         data: data,
    //         url: url,
    //         dataType: "xml",
    //         contentType: "text/xml; charset=utf-8",
    //         success: success,
    //         error: error
    //     });
    // }
    //TESTING XML REQUEST
    // _xmlHttpRequest(url, data, function(xml) {
    //     var parser = new DOMParser(),
    //         data = xml.getElementsByTagName('data')[0];
    //     console.log(data.childNodes[0], ' < XML DATA Response');
    // }, function(xhr, ajaxOptions, thrownError) {
    //     console.log('error');
    //     // console.log(xhr.status);          
    //     // console.log(thrownError);
    // });

    function _createLine(event) {
        var offsetTop = svgPlaceholder.offsetTop,
            offsetLeft = svgPlaceholder.offsetLeft,
            positionX = event.clientX - offsetLeft,
            positionY = event.clientY - offsetTop + window.scrollY,
            element = svgElement.createLine(positionX, positionY, positionX, positionY, 'black', '2'),
            controlPoint = svgElement.createControlPoint(positionX, positionY, '10', 'black', element);

        //event, control point and the element to be moved
        controlPoint.selectToDragControlPoint(event, element);

        //ideas
        //controlPoint.fixTo(element); << TODO

        svg.appendChild(element.el);
        svg.appendChild(controlPoint.el);

    }
    /**
     * CREATE SVG ELEMENT EVENT METHOD
     */
    function _createRectX(event) {
        var offsetTop = svgPlaceholder.offsetTop,
            positionX = event.clientX,
            positionY = event.clientY - offsetTop + window.scrollY,
            //x, y, width, height
            element = svgElement.createRect(positionX, positionY);

        svg.appendChild(element.el);
    }

    function _createCircleX(event) {
        var offsetTop = svgPlaceholder.offsetTop,
            positionX = event.clientX,
            positionY = event.clientY - offsetTop + window.scrollY,
            //x, y, width, height
            element = svgElement.createCircle(positionX, positionY);

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
}(window, screen));