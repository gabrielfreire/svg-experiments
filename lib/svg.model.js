var SVGElement = function(config) {
    this.config = config;
    this.elements = [];
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
svg.createCircle = function(cx, cy, width, height, r) {
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