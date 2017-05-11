var SVGElement = function(config) {
    this.config = config;
    this.elements = [];
    this.controlPointElements = [];
    return this;
}

var svg = SVGElement.prototype,
    prefix = "http://www.w3.org/2000/svg";

svg.createRect = function(x, y, width, height) {
    var square = document.createElementNS(prefix, 'rect'),
        inWidth = width || '40',
        inHeight = height || '40',
        inX = x || '0px',
        inY = y || '0px';

    square.isRect = true;

    var element = new Element(square);
    element.attr('class', 'svgElement')
        .attr('x', inX)
        .attr('y', inY)
        .attr('fill', this.config.color || 'yellow')
        .attr('width', inWidth)
        .attr('height', inHeight)
        .attr('stroke', this.config.stroke || 'black')
        .attr('stroke-width', this.config.strokeWidth || '.6px')
        .attr('transform', 'matrix(1 0 0 1 0 0)');

    this.elements.push(element);

    return element;
}
svg.createCircle = function(cx, cy, r) {
    var circle = document.createElementNS(prefix, 'circle'),
        inR = r || '20',
        inCx = cx || '300',
        inCy = cy || '300';

    circle.isRect = false;

    var element = new Element(circle);
    element.attr('class', 'svgElement')
        .attr('r', inR)
        .attr('fill', this.config.color || 'yellow')
        .attr('cx', inCx)
        .attr('cy', inCy)
        .attr('stroke', this.config.stroke || 'black')
        .attr('stroke-width', this.config.strokeWidth || '.6px')
        .attr('transform', 'matrix(1 0 0 1 0 0)');

    this.elements.push(element);

    // console.debug('Circle created');

    return element;
}

svg.createLine = function(x1, y1, x2, y2, stroke, strokeWidth) {
    var line = document.createElementNS(prefix, 'line'),
        stroke = stroke || 'red',
        strokeW = strokeW || '3';

    var element = new Element(line);
    element.attr('stroke', stroke)
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeW)
        .attr('d', "M 700 50 l 100 100");

    this.elements.push(element);

    return element;
}

/**
 * Creates a control point for a svg element eg. lines, paths
 * @param {String} x position X
 * @param {String} y position Y
 * @param {Element} parentElement element to be controlled by this control point
 * @returns {Element} Returns the created element
 */
svg.createControlPoint = function(x, y, parentElement) {
    var posX = x || '0',
        posY = y || '0',
        svgEl = new SVGElement({
            stroke: 'black',
            color: 'red'
        }),
        element = svgEl.createCircle(posX, posY, '10');

    element.attr('class', 'point1');


    this.controlPointElements.push(element);
    return element;
}