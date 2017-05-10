var SVGElement = function(config) {
    this.config = config;
    this.elements = [];
    return this;
}

var svg = SVGElement.prototype,
    prefix = "http://www.w3.org/2000/svg";

svg.init = function() {
    var svg = document.createElementNS(null, 'svg');
    svg.setAttribute('id', 'svgContainer');
    svg.setAttribute('x', '0');
    svg.setAttribute('y', '0');
    // var svg = document.getElementById('svgContainer');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttributeNS(null, 'viewBox', "0 0 " + screen.width + " " + screen.height);

    return svg;
}
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

    console.debug('Circle created');

    return element;
}

svg.createLine = function(x1, y1, x2, y2, stroke, strokeWidth) {
    var line = document.createElementNS(prefix, 'line'),
        stroke = stroke || 'black',
        strokeW = strokeW || 'none';

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