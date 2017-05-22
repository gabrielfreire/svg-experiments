/**
 * @class {Script} Script class that builds the drawer component by Gabriel Freire
 */
(function(window, screen) {
    'use strict';

    var svgPlaceholder = document.getElementById("svgPlaceholder"),
        svg = document.getElementById('svgContainer'),
        colorBtn = document.querySelector('.btn-color'),
        createRect = document.getElementById('create-rect'),
        createCircle = document.getElementById('create-circle'),
        createLine = document.getElementById('create-line'),
        downloadBtn = document.getElementById('download'),
        dragBtn = document.getElementById('drag'),
        scaleBtn = document.getElementById('scale'),
        rotateBtn = document.getElementById('rotate'),
        oldX = 0,
        // Configure the library
        svgElement = new SVGElement({
            stroke: 'black',
            strokeWidth: '2',
            color: colorBtn.value || 'transparent',
            container: svg
        }),
        downloadManager = new DownloadManager(),
        //URL and DATA for XML request
        url = 'http://dub-test-sales1/MAXIMS_DEV/CNHost',
        data = '<events><gridselection selection="0" button="0" id="a1000"/></events>',
        self = this;

    // document.body.appendChild(templateNode);
    if (svg) {
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.setAttributeNS(null, 'viewBox', "0 0 " + screen.width + " " + screen.height);
    }

    function _getAbsolutePosition() {
        var offsetTop = svgPlaceholder.offsetTop,
            positionX = event.clientX,
            positionY = event.clientY - offsetTop + window.scrollY;

        return {
            x: positionX,
            y: positionY
        }
    }

    function _createLine(event) {
        //calculate mouse posistion
        var absolutePos = _getAbsolutePosition(),
            element = svgElement.createLine(absolutePos.x, absolutePos.y, absolutePos.x, absolutePos.y, colorBtn.value, '2'),
            controlPointScale = svgElement.createControlPoint(absolutePos.x, absolutePos.y, '10', colorBtn.value, element, 'scale'),
            controlPointMove = svgElement.createControlPoint(absolutePos.x, absolutePos.y, '10', colorBtn.value, element, 'move');

        //event and the element to be moved
        controlPointScale.selectToDragControlPoint(event, element);
    }
    /**
     * CREATE SVG ELEMENT EVENT METHODS
     */
    function _createRectX(event) {
        //calculate mouse posistion
        var absolutePos = _getAbsolutePosition();
        //x, y, width, height
        var element = svgElement.createRect(absolutePos.x, absolutePos.y);

        function size(e) {
            var upX = e.pageX - svgPlaceholder.offsetLeft;
            var upY = e.pageY - svgPlaceholder.offsetTop;

            var width = upX - absolutePos.x;
            var height = upY - absolutePos.y;

            element.attr('width', width > 0 ? width : 0)
                .attr('height', height > 0 ? height : 0);

        }
        svg.addEventListener('mousemove', size);
        svg.addEventListener('mouseup', function(e) {
            svg.removeEventListener('mousemove', size);
        });

    }

    function _createCircleX(event) {
        //calculate mouse posistion
        var absolutePos = _getAbsolutePosition();
        //x, y, width, height
        svgElement.createCircle(absolutePos.x, absolutePos.y);
    }

    //METHOD TO CREATE A BED USING THE LIBRARY
    function _createBed() {
        var g = svgElement.createGroup(),
            paths = [
                svgElement.createPath('#5F7A7E', 'M370,370c-16.569,0-30-13.431-30-30s13.431-30,30-30s30,13.431,30,30S386.569,370,370,370z'),
                svgElement.createPath('#5F7A7E', 'M90,370c-16.569,0-30-13.431-30-30s13.431-30,30-30s30,13.431,30,30S106.569,370,90,370z'),
                svgElement.createPath('#546B6D', 'M90,310c13.061,0,24.167,8.35,28.286,20H61.714C65.833,318.35,76.939,310,90,310z'),
                svgElement.createPath('#546B6D', 'M370,310c13.061,0,24.167,8.35,28.286,20h-56.572C345.833,318.35,356.939,310,370,310z'),
                svgElement.createPath('#BCCFDE', 'M430,140H230h-57.645c4.752-5.308,7.645-12.315,7.645-20l0,0c0-16.568-13.431-30-30-30H50c-16.569,0-30,13.432-30,30l0,0c0,7.73,2.925,14.775,7.727,20.095C12.221,141.257,0,154.197,0,170l0,0c0,16.568,13.431,30,30,30h10v10v5c0,8.284,6.716,15,15,15h95v60H55c-8.284,0-15,6.716-15,15s6.716,15,15,15h350c8.284,0,15-6.716,15-15s-6.716-15-15-15h-95v-60h95c8.284,0,15-6.716,15-15v-5v-10h10c16.569,0,30-13.432,30-30l0,0C460,153.432,446.569,140,430,140z M280,290H180v-60h100V290z'),
                svgElement.createPath('#CCDBE5', 'M310,290h95c6.528,0,12.067,4.178,14.128,10H40.872c2.061-5.822,7.6-10,14.128-10h95h30h100H310z'),
                svgElement.createPath('#A3B5C1', 'M420,210H40v-20h380V210z'),
                svgElement.createPath('#89B0D3', 'M460,170L460,170c0,16.568-13.431,30-30,30H230H30c-16.569,0-30-13.432-30-30l0,0c0-15.803,12.221-28.743,27.727-29.905C22.925,134.775,20,127.73,20,120l0,0c0-16.568,13.431-30,30-30h100c16.568,0,30,13.432,30,30l0,0c0,7.685-2.893,14.692-7.645,20H230h200C446.569,140,460,153.432,460,170z'),
                svgElement.createPath('#B0D5F4', 'M180,120L180,120H20l0,0c0-16.568,13.431-30,30-30h100C166.569,90,180,103.431,180,120z'),
                svgElement.createPath('#89B0D3', 'M30,140h200v60H30c-16.569,0-30-13.431-30-30l0,0C0,153.431,13.431,140,30,140z'),
                svgElement.createPath('#98BDD8', 'M230,140v30H0l0,0c0-16.568,13.431-30,30-30H230z'),
                svgElement.createPath('#B0D5F4', 'M460,170L460,170c0,16.569-13.431,30-30,30H230v-60h200C446.569,140,460,153.431,460,170z'),
                svgElement.createPath('#C1E0F4', 'M430,140c16.569,0,30,13.431,30,30l0,0H230v-30H430z')
            ];

        for (var i = 0; i < paths.length; i++) {
            g.appendPath(paths[i]);
        }

    }

    _createBed();

    function setColor(e) {
        colorBtn.value = e.target.value;
        svgElement.setColor(colorBtn.value);
    }
    /**
     * ------------------------
     * Adding Events to buttons
     * ------------------------
     */

    //Keyboard binding as shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'r') {
            rotateBtn.click();
            e.preventDefault();
        }
        if (e.key === 's') {
            scaleBtn.click();
            e.preventDefault();
        }
        if (e.key === 'd') {
            dragBtn.click();
            e.preventDefault();
        }
    });

    // --------
    // CREATE
    // --------
    createRect.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        rotateBtn.classList.remove('active');
        createRect.classList.add('active');
        createCircle.classList.remove('active');
        createLine.classList.remove('active');
        svgPlaceholder.removeEventListener('mouseup', _createCircleX);
        svgPlaceholder.addEventListener('mousedown', _createRectX);
        svgPlaceholder.removeEventListener('mousedown', _createLine);
        svgPlaceholder.classList.add('createMode');
        svgPlaceholder.classList.remove('draggable');
        svgPlaceholder.classList.remove('scalable');
        svgPlaceholder.classList.remove('rotateable');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToScaleElement);
                element.el.removeEventListener('mousedown', element.selectToDragElement);
                element.el.removeEventListener('mousedown', element.selectToRotate);
            });
        }
    });
    createCircle.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        rotateBtn.classList.remove('active');
        createRect.classList.remove('active');
        createLine.classList.remove('active');
        createCircle.classList.add('active');
        svgPlaceholder.removeEventListener('mousedown', _createRectX);
        svgPlaceholder.addEventListener('mouseup', _createCircleX);
        svgPlaceholder.removeEventListener('mousedown', _createLine);
        svgPlaceholder.classList.add('createMode');
        svgPlaceholder.classList.remove('draggable');
        svgPlaceholder.classList.remove('scalable');
        svgPlaceholder.classList.remove('rotateable');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToScaleElement);
                element.el.removeEventListener('mousedown', element.selectToDragElement);
                element.el.removeEventListener('mousedown', element.selectToRotate);
            });
        }
    });
    createLine.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        rotateBtn.classList.remove('active');
        createRect.classList.remove('active');
        createLine.classList.add('active');
        createCircle.classList.remove('active');
        svgPlaceholder.removeEventListener('mousedown', _createRectX);
        svgPlaceholder.removeEventListener('mouseup', _createCircleX);
        svgPlaceholder.addEventListener('mousedown', _createLine);
        svgPlaceholder.classList.add('createMode');
        svgPlaceholder.classList.remove('draggable');
        svgPlaceholder.classList.remove('scalable');
        svgPlaceholder.classList.remove('rotateable');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToScaleElement);
                element.el.removeEventListener('mousedown', element.selectToDragElement);
                element.el.removeEventListener('mousedown', element.selectToRotate);
            });
        }
    });
    // --------
    // DRAG
    // --------
    dragBtn.addEventListener('click', function(e) {
        dragBtn.classList.add('active');
        scaleBtn.classList.remove('active');
        rotateBtn.classList.remove('active');
        createRect.classList.remove('active');
        createCircle.classList.remove('active');
        createLine.classList.remove('active');
        svgPlaceholder.removeEventListener('mousedown', _createRectX);
        svgPlaceholder.removeEventListener('mouseup', _createCircleX);
        svgPlaceholder.removeEventListener('mousedown', _createLine);
        svgPlaceholder.classList.remove('createMode');
        svgPlaceholder.classList.add('draggable');
        svgPlaceholder.classList.remove('scalable');
        svgPlaceholder.classList.remove('rotateable');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToScaleElement);
                element.el.addEventListener('mousedown', element.selectToDragElement);
                element.el.removeEventListener('mousedown', element.selectToRotate);
            });
        }
    });
    // --------
    // SCALE
    // --------
    scaleBtn.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.add('active');
        rotateBtn.classList.remove('active');
        createRect.classList.remove('active');
        createCircle.classList.remove('active');
        createLine.classList.remove('active');
        svgPlaceholder.removeEventListener('mousedown', _createRectX);
        svgPlaceholder.removeEventListener('mouseup', _createCircleX);
        svgPlaceholder.removeEventListener('mousedown', _createLine);
        svgPlaceholder.classList.remove('createMode');
        svgPlaceholder.classList.remove('draggable');
        svgPlaceholder.classList.add('scalable');
        svgPlaceholder.classList.remove('rotateable');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToDragElement);
                element.el.addEventListener('mousedown', element.selectToScaleElement);
                element.el.removeEventListener('mousedown', element.selectToRotate);
            });
        }
    });
    // --------
    // ROTATE
    // --------
    rotateBtn.addEventListener('click', function(e) {
        dragBtn.classList.remove('active');
        scaleBtn.classList.remove('active');
        rotateBtn.classList.add('active');
        createRect.classList.remove('active');
        createCircle.classList.remove('active');
        createLine.classList.remove('active');
        svgPlaceholder.removeEventListener('mousedown', _createRectX);
        svgPlaceholder.removeEventListener('mouseup', _createCircleX);
        svgPlaceholder.removeEventListener('mousedown', _createLine);
        svgPlaceholder.classList.remove('createMode');
        svgPlaceholder.classList.remove('draggable');
        svgPlaceholder.classList.remove('scalable');
        svgPlaceholder.classList.add('rotateable');
        if (svgElement.elements.length > 0) {
            svgElement.elements.forEach(function(element) {
                element.el.removeEventListener('mousedown', element.selectToDragElement);
                element.el.removeEventListener('mousedown', element.selectToScaleElement);
                element.el.addEventListener('mousedown', element.selectToRotate);
            });
        }
    });
    downloadBtn.addEventListener('click', function(e) {
        downloadManager.download();
    });
    colorBtn.addEventListener('change', setColor);
    /**
     * END BUTTON EVENTS
     */
}(window, screen));