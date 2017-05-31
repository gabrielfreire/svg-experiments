/**
 * @class {SVGElement} Element creator class by Gabriel Freire
 */
'use strict';

function SVGElement(config) {
    this.config = config;
    this.elements = [];
    this.controlPointElements = [];
    return this;
}
var svg = SVGElement.prototype,
    self = SVGElement,
    prefix = "http://www.w3.org/2000/svg";

svg.createSVGContainer = function(w, h) {
    var svgC = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

    svgC.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svgC.setAttributeNS(null, 'id', "svgContainer");
    svgC.setAttributeNS(null, 'viewBox', "0 0 " + (w || 1700) + " " + (h || 710) + "");
    svgC.setAttributeNS(null, 'width', (w || 1700));
    svgC.setAttributeNS(null, 'height', (h || 710));
    svgC.setAttribute('class', 'svg-test');

    return svgC;
}

svg.createRect = function(x, y, width, height) {
    var square = document.createElementNS(prefix, 'rect'),
        inWidth = width || '0',
        inHeight = height || '0',
        inX = x || '0px',
        inY = y || '0px';

    square.isRect = true;

    var element = new Element(square);
    element.attr('class', 'svgElement')
        .attr('fill', this.config.color || 'yellow')
        .attr('width', inWidth)
        .attr('height', inHeight)
        .attr('stroke', this.config.stroke || 'black')
        .attr('stroke-width', this.config.strokeWidth || '.6px')
        .attr('transform', 'matrix(1 0 0 1 ' + x + ' ' + y + ')');

    this.elements.push(element);
    //append to the informed container
    this.config.container.appendChild(element.el);

    return element;
}
svg.createCircle = function(cx, cy, r, isControlPoint, type) {
    var circle = document.createElementNS(prefix, 'circle'),
        inR = r || '20',
        inCx = cx || '300',
        inCy = cy || '300';

    circle.isRect = false;
    circle.isControlPoint = isControlPoint;
    if (circle.isControlPoint) {
        circle.type = type;
    }

    var element = new Element(circle);
    element.attr('class', 'svgElement')
        .attr('r', inR)
        .attr('fill', this.config.color || 'yellow')
        .attr('stroke', this.config.stroke || 'black')
        .attr('stroke-width', this.config.strokeWidth || '.6px')
        .attr('transform', 'matrix(1 0 0 1 ' + inCx + ' ' + inCy + ')');

    //add the element to the array of elements
    this.elements.push(element);
    //append to the informed container
    this.config.container.appendChild(element.el);

    return element;
}

svg.createLine = function(x1, y1, x2, y2, stroke, strokeWidth) {
    var line = document.createElementNS(prefix, 'line'),
        stroke = stroke || 'red',
        strokeW = strokeWidth || '3';

    var element = new Element(line);
    element.attr('stroke', stroke)
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeW)
        .attr('d', "M 700 50 l 100 100");


    //add the element to the array of elements
    this.elements.push(element);
    //append to the informed container
    this.config.container.appendChild(element.el);

    return element;
}
svg.createGroup = function(x, y) {
    var group = document.createElementNS(prefix, 'g');

    group.isGroup = true;

    var element = new Element(group);
    element.attr('transform', 'matrix(1 0 0 1 ' + (x || 0) + ' ' + (y || 0) + ')');

    this.elements.push(element);
    if (this.config && this.config.container)
        this.config.container.appendChild(element.el);

    return element;
}

svg.createPath = function(color, d) {
    var path = document.createElementNS(prefix, 'path');

    path.isPath = true;

    var element = new Element(path);


    element.attr('d', d || '').attr('fill', color || 'black').attr('transform', 'matrix(1 0 0 1 0 0)');

    return element;
}


/**
 * Creates a control point for a svg element eg. lines, paths
 * @param {String} x position X
 * @param {String} y position Y
 * @param {Element} parentElement element to be controlled by this control point
 * @returns {Element} Returns the created element
 */
svg.createControlPoint = function(x, y, r, color, parentElement, type) {
    var posX = x || '0',
        posY = y || '0',
        ray = r || '3',
        id = 0,
        svgEl = new SVGElement(this.config),
        element = svgEl.createCircle(posX, posY, ray, true, type);

    element.attr('class', 'c-point');
    element.attr('control_point', 'true');

    //add the element to the array of elements
    this.elements.push(element);
    //add the control point to the array of control points
    this.controlPointElements.push(element);

    return element;
}

svg.createText = function(content, color, x, y, rotation) {
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text.isText = true;
    var element = new Element(text);

    element.attr('fill', color || 'black')
        .attr('transform', 'matrix(1 0 0 1 ' + (x || 0) + ' ' + (y || 0) + ') rotate(' + (rotation || 0) + ')')
        .setContent((content || ''));

    this.elements.push(element);

    if (this.config && this.config.container) {
        this.config.container.appendChild(element.el);
    }

    return element;
}


svg.setContainer = function(container) {
    this.config.container = container;
}

svg.getContainer = function() {
    if (this.config && this.config.container)
        return this.config.container;
    else {
        console.log('no container');
        return;
    }
}

svg.setColor = function(color) {
    this.config.color = color;
}

// -- DEPRECATED --
// might be useful in the future
svg.xmlToSVG = function(node, cont) {
    var self = this;
    var group;
    if (node.textContent.length > 0) {
        //insideGroup flag to keep track of the element state, either inside or outside a group tag
        var insideGroup = false;
        var vmlNode = node.getElementsByTagName('vml')[0] ? node.getElementsByTagName('vml')[0] : '';
        var vmlImage = node.getElementsByTagName('image')[0] ? node.getElementsByTagName('image')[0] : '';
        var vmlContent = vmlNode.textContent;

        //check the existence of vml content so we avoid errors
        if (vmlContent) {
            //we need to use the replace method to traverse the whole string and perform actions to each string combination passed as first parameter
            vmlContent.replace(/<vml|<v:group|<v:image|<v:rect/gi, function(x) {
                //if there is a v:group tag, create a svg group element and append to the svg container
                if (x === '<v:group') {
                    group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    cont.appendChild(group);
                    //set insideGroup to true so you always know if you are inside or outside a group element
                    //this helps to build the svg element correctly
                    insideGroup = true;
                }
                //If you find the v:image tag, add a svg image element
                if (x === '<v:image') {
                    var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    //if this tag has an img attribute with a link to an image, create a href for the svg image element
                    if (vmlImage && vmlImage.hasAttribute('img')) {
                        var href = vmlImage.getAttribute('img');
                        image.setAttribute('xlink:href', href);
                        image.setAttribute('width', '450px');
                        image.setAttribute('height', '450px');
                    }
                    // if this image tag is inside a group tag, append the element to the svg group
                    if (insideGroup) {
                        group.appendChild(image);
                    } else {
                        //else append the element to the svg container
                        cont.appendChild(image);
                    }
                    insideGroup = false;
                }
                if (x === '<v:rect') {
                    var rect = self.createRect();
                    if (insideGroup) {
                        group.appendChild(rect);
                    } else {
                        cont.appendChild(rect);
                    }
                    insideGroup = false;
                }
                return x;
            });
        }
    }
    return cont;
}