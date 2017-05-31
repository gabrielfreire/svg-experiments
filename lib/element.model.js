    /**
     * @class {Element} Element features class by Gabriel Freire
     */

    function Element(element) {
        this.el = element;
        this.isRect = false;
        this.active = false;
        return this;
    }

    var el = Element.prototype,
        //IT IS MANDATORY TO HAVE A CONTAINER WITH ID 'svgContainer'
        svgContainer = document.getElementById('svgContainer'),
        selectedElement = 0,
        oldX = 0,
        currX = 0,
        currY = 0,
        currentMatrix = 0;

    // INTERNAL METHODS


    function _getElementTransformValues(element) {
        var transform = element.getAttributeNS(null, 'transform'),
            matrixAr,
            center = parseInt(element.getAttributeNS(null, 'width')) / 2 || 0,
            rotateAr,
            scaleAr;

        if (element.isPath) {
            var group = element.parentElement;
            transform = group.getAttributeNS(null, 'transform');
        }
        if (transform.indexOf('matrix') !== -1) {
            matrixAr = transform.slice((transform.indexOf('matrix') + 7), transform.indexOf(') r')).split(' ');
            for (var i = 0; i < matrixAr.length; i++) {
                matrixAr[i] = parseFloat(matrixAr[i]);
            }
        }
        if (transform.indexOf('rotate') !== -1) {
            rotateAr = transform.slice((transform.indexOf('rotate') + 7), transform.indexOf(') s')).split(' ');
            for (var i = 0; i < rotateAr.length; i++) {
                rotateAr[i] = parseFloat(rotateAr[i]);
            }
        }
        if (transform.indexOf('scale') !== -1) {
            scaleAr = transform.slice((transform.indexOf('scale') + 6), -1).split(' ');
            for (var i = 0; i < scaleAr.length; i++) {
                scaleAr[i] = parseFloat(scaleAr[i]);
            }
        }
        return {
            matrix: matrixAr || [1, 0, 0, 1, 0, 0], //real value or default
            rotate: rotateAr || [0, center, center],
            scale: scaleAr || 1 //real value or default
        };
    }

    function _updateTransformValues(element, newValues) {
        var newTransform = 'matrix(' + newValues.matrix.join(' ') + ') rotate(' + newValues.rotate.join(' ') + ') scale(' + newValues.scale + ')';
        if (element.isPath) {
            var group = element.parentElement;
            group.setAttributeNS(null, 'transform', newTransform);
            return;
        }
        element.setAttributeNS(null, 'transform', newTransform);
    }


    // ------  END INTERNAL METHODS  ----------

    /**
     * Event method to drag a selected element
     * @param {Event} e mouse event to capture target element and mouse position
     * @return void
     */
    el.selectToDragElement = function(e) {
        var selectedElement = e.target,
            currX = e.clientX,
            currY = e.clientY,
            moveElement = _moveElement,
            deselectElement = _deselectElement,
            parsedTransform = _getElementTransformValues(selectedElement);

        currentMatrix = parsedTransform.matrix;

        //method that moves the selected element to the mouse position
        function _moveElement(event) {
            var dx = event.clientX - currX,
                dy = event.clientY - currY;
            currentMatrix[4] += dx;
            currentMatrix[5] += dy;

            parsedTransform.matrix = currentMatrix;
            _updateTransformValues(selectedElement, parsedTransform);
            // selectedElement.setAttributeNS(null, "transform", newMatrix);

            //check if it is a controlPoint and if it is, move the simbling (line) as well
            if (selectedElement.isControlPoint) {
                if (selectedElement.type === 'scale') {
                    //here i am assuming this is a line  (WORK IN PROGRESS)
                    var line = selectedElement.previousSibling,
                        x2 = parseInt(line.getAttributeNS(null, 'x2')),
                        y2 = parseInt(line.getAttributeNS(null, 'y2')),
                        moveX = x2 + dx,
                        moveY = y2 + dy;
                    line.setAttributeNS(null, 'x2', moveX);
                    line.setAttributeNS(null, 'y2', moveY);
                } else if (selectedElement.type === 'move') {
                    //here i am assuming this is a line  (WORK IN PROGRESS)
                    var line = selectedElement.previousSibling.previousSibling,
                        x1 = parseInt(line.getAttributeNS(null, 'x1')),
                        y1 = parseInt(line.getAttributeNS(null, 'y1')),
                        moveX = x1 + dx,
                        moveY = y1 + dy;
                    line.setAttributeNS(null, 'x1', moveX);
                    line.setAttributeNS(null, 'y1', moveY);
                }
            }
            //update position
            currX = event.clientX;
            currY = event.clientY;
        }

        //deselect event method used to remove events from the selected element
        function _deselectElement(event) {
            svgContainer.removeEventListener('mousemove', moveElement);
            svgContainer.removeEventListener('mouseup', deselectElement);
        }

        svgContainer.addEventListener('mousemove', moveElement);
        svgContainer.addEventListener('mouseup', deselectElement);
    }

    /**
     * Event method to scale a selected element
     * @param {Event} e mouse event to capture target element and mouse position
     * @return void
     */
    el.selectToScaleElement = function(e) {
        //we get a reference for the selected element only to capture and change its position
        var selectedElement = e.target,
            currentWidth = selectedElement.getAttributeNS(null, 'width'),
            currentHeight = selectedElement.getAttributeNS(null, 'height'),
            resize = _resize,
            rescale = _rescale,
            resizePath = _resizePath,
            transformValues = _getElementTransformValues(selectedElement),
            currentScale = transformValues.scale,
            deselectElement = _deselectElement,
            currentRadius = selectedElement.getAttributeNS(null, 'r'),
            scale = parseFloat(currentScale);


        /**
         * Scaling for Paths
         */
        function _upSizePath() {
            scale += 0.01;
            transformValues.scale = scale;
            _updateTransformValues(selectedElement, transformValues);
        }

        function _downSizePath() {
            scale -= 0.01;
            transformValues.scale = scale;
            _updateTransformValues(selectedElement, transformValues);
        }
        /**
         * Scaling for Rects
         */
        //method to scale element up
        function _upsize() {
            selectedElement.setAttributeNS(null, 'width', currentWidth);
            selectedElement.setAttributeNS(null, 'height', currentHeight);
            currentWidth = Number(currentWidth) + 1.8;
            currentHeight = Number(currentHeight) + 1.8;
        }

        //method to scale element down
        function _downsize() {
            if (parseInt(currentWidth) < 2) {
                currentWidth = 2;
            }
            if (parseInt(currentHeight) < 2) {
                currentHeight = 2;
            }
            selectedElement.setAttributeNS(null, 'width', currentWidth);
            selectedElement.setAttributeNS(null, 'height', currentHeight);
            currentWidth = Number(currentWidth) - 1.8;
            currentHeight = Number(currentHeight) - 1.8;
        }

        /**
         * Scaling for Circles
         */
        function _upScale(e) {
            selectedElement.setAttributeNS(null, 'r', currentRadius);
            currentRadius = Number(currentRadius) + 1.8;
        }

        function _downScale(e) {
            if (parseInt(currentRadius) < 1) {
                currentRadius = 1.5;
            } else {
                currentRadius = Number(currentRadius) - 1.8;
            }
            selectedElement.setAttributeNS(null, 'r', currentRadius);
        }
        //PATH - method to resize element depending on the direction the mouse is pursuing
        function _resizePath(e) {
            if (e.pageX > oldX) {
                _upSizePath();
            } else if (e.pageX < oldX) {
                _downSizePath();
            }
            oldX = e.pageX;
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
            if (selectedElement.isRect) {
                svgContainer.removeEventListener('mousemove', resize);
            } else if (selectedElement.isPath) {
                svgContainer.removeEventListener('mousemove', resizePath);
            } else {
                svgContainer.removeEventListener('mousemove', rescale);
            }
            svgContainer.removeEventListener('mouseup', deselectElement);
        }
        if (selectedElement.isRect) {
            svgContainer.addEventListener('mousemove', resize);
        } else if (selectedElement.isPath) {
            svgContainer.addEventListener('mousemove', resizePath);
        } else {
            svgContainer.addEventListener('mousemove', rescale);
        }

        svgContainer.addEventListener('mouseup', deselectElement);
    }

    /**
     * @param {Event} event mouse event to capture target element and mouse position
     * @param {Element} elementToBeMoved the element which the control point will be moving
     * @return void
     */
    el.selectToDragControlPoint = function(event, elementToBeMoved) {
        var currX = event.clientX,
            currY = event.clientY,
            self = this;

        function scaleX(e) {
            var dx = e.clientX - currX,
                dy = e.clientY - currY,
                movementX = parseInt(elementToBeMoved.getLineX2()) + dx,
                movementY = parseInt(elementToBeMoved.getLineY2()) + dy,
                newTransform = 'matrix(1 0 0 1 ' + movementX + ' ' + movementY + ')';

            // Control point to be selected and move along with the element to be moved
            self.attr('transform', newTransform);
            // Element to be moved
            elementToBeMoved.attr('x2', movementX)
                .attr('y2', movementY);
            //update position
            currX = e.clientX;
            currY = e.clientY;
        }

        function deselect(event) {
            svgContainer.removeEventListener('mousemove', scaleX);
            svgContainer.removeEventListener('mouseup', deselect);
        }

        // Parent Element events ( Canvas/Container )
        svgContainer.addEventListener('mousemove', scaleX);
        svgContainer.addEventListener('mouseup', deselect);
    }

    el.selectToRotate = function(event, elementToRotate) {
        var selectedElement = elementToRotate ? elementToRotate : event.target,
            posX = event.clientX,
            currentTransform = _getElementTransformValues(selectedElement),
            currentRotate = currentTransform.rotate;

        function _rotateForward(event) {
            currentRotate[0]++;
            currentTransform.rotate = currentRotate;
            _updateTransformValues(selectedElement, currentTransform);
        }

        function _rotateBackward(event) {
            currentRotate[0]--;
            currentTransform.rotate = currentRotate;
            _updateTransformValues(selectedElement, currentTransform);
        }

        function rotate(event) {
            if (event.pageX > oldX) {
                _rotateForward(event);
            } else if (event.pageX < oldX) {
                _rotateBackward(event);
            }
            oldX = event.pageX;
        }

        function deselect(event) {
            svgContainer.removeEventListener('mousemove', rotate);
            svgContainer.removeEventListener('mouseup', deselect);
        }
        svgContainer.addEventListener('mousemove', rotate);
        svgContainer.addEventListener('mouseup', deselect);
    }

    /**
     * Add an attribute to a SVG Element
     * @param {String} key which attribute to add a value
     * @param {String} value value to be added
     * @return {Element} the target element
     */
    el.attr = function(key, value) {
        this.el.setAttributeNS(null, key, value);
        return this;
    }

    /**
     * append an element and return the parent element for method chaining
     * @param {Element} element the element to append
     * @return {Element} the target/parent element
     */
    el.append = function(element) {
        if (element.el) {
            this.el.appendChild(element.el);
        } else {
            this.el.appendChild(element);
        }
        return this;
    }

    /**
     * add an event to an element and return the parent element for method chaining
     * @param {Event} event the event to be added
     * @param {Function} cb the callback function which will contain an action
     * @return {Element} this the target/parent element
     */
    el.addEvent = function(event, cb) {
        this.el.addEventListener(event, cb);
        return this;
    }

    /**
     * remove an event to an element and return the parent element for method chaining
     * @param {Event} event the event to be removed
     * @param {Function} cb the callback function which will contain an action
     * @return {Element} this the target/parent element
     */
    el.removeEvent = function(event, cb) {
        this.el.removeEventListener(event, cb);
        return this;
    }

    /**
     * return the x position of an Element
     * @param {Element} element the element to be targeted
     * @return {Number} the X value 
     */
    el.getX = function(element) {
        return this.el.getAttributeNS(null, 'x');
    }

    /**
     * return the x2 position of a Line Element
     * THIS IS ONLY APPLICABLE TO SVG LINE ELEMENTS
     * @param {Element} element the element to be targeted
     * @return {Number} the x2 value 
     */
    el.getLineX2 = function(element) {
        return this.el.getAttributeNS(null, 'x2');
    }

    /**
     * return the x1 position of a Line Element
     * THIS IS ONLY APPLICABLE TO SVG LINE ELEMENTS
     * @param {Element} element the element to be targeted
     * @return {Number} the x1 value 
     */
    el.getLineX1 = function(element) {
        return this.el.getAttributeNS(null, 'x1');
    }

    /**
     * return the y position of an Element
     * @param {Element} element the element to be targeted
     * @return {Number} the Y value 
     */
    el.getY = function(element) {
        return this.el.getAttributeNS(null, 'y');
    }

    /**
     * return the y2 position of a Line Element
     * THIS IS ONLY APPLICABLE TO SVG LINE ELEMENTS
     * @param {Element} element the element to be targeted
     * @return {Number} the y2 value 
     */
    el.getLineY2 = function(element) {
        return this.el.getAttributeNS(null, 'y2');
    }

    /**
     * return the y1 position of a Line Element
     * THIS IS ONLY APPLICABLE TO SVG LINE ELEMENTS
     * @param {Element} element the element to be targeted
     * @return {Number} the y1 value 
     */
    el.getLineY1 = function(element) {
        return this.el.getAttributeNS(null, 'y1');
    }

    /**
     * add a svgElement-active class to the target element
     * @return {void} 
     */
    el.setActive = function() {
        this.el.classList.add('svgElement-active');
        this.active = true;
    }

    /**
     * remove a svgElement-active class to the target element
     * @return {void} 
     */
    el.setUnactive = function() {
        this.el.classList.remove('svgElement-active');
        this.active = false;
    }

    /**
     * check if the target element is active or not
     * @return {Boolean} true of false 
     */
    el.isActive = function() {
        return this.active;
    }

    /**
     * check if the target element is a control point or not
     * @return {Boolean} true of false 
     */
    el.isControlPoint = function() {
        if (this.el)
            return this.el.isControlPoint;
    }

    el.appendPath = function(path) {
        if (!this.el.isGroup) {
            console.error('Not a group');
            return;
        }
        this.el.appendChild(path.el);
    }

    el.setContent = function(content) {
        if (!this.el.tagName === 'text') {
            console.error('Not a text element');
            return;
        } else {
            this.el.textContent = content;
        }
    }

    el.getBoundingClientRect = function() {
        return this.el.getBoundingClientRect();
    }

    el.setContainer = function(container) {
        svgContainer = container ? container : document.getElementById('svgContainer');
    }

    el.getContainer = function() {
        if (svgContainer)
            return svgContainer;
        else
            console.log('no container to get');
    }