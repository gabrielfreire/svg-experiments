var SVGElement = function(config) {
    this.config = config;
    this.elements = [];
    // if (this.config.type === 'rect') {
    //     return svg.createRect.bind(this);
    // } else if (this.config.type === 'circle') {
    //     return svg.createCircle.bind(this);
    // }
    return this;
}

var svg = SVGElement.prototype;

svg.createRect = function(x, y, width, height) {
    var square = document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
        inWidth = width || '40',
        inHeight = height || '40',
        inX = x || '0px',
        inY = y || '0px';


    square.setAttribute('x', inX);
    square.setAttribute('y', inY);
    square.setAttribute('class', 'svgRect');
    square.setAttribute('fill', this.config.color || '');
    square.setAttribute('width', inWidth);
    square.setAttribute('height', inHeight);
    square.setAttribute('stroke', this.config.stroke || 'black');
    square.setAttribute('stroke-width', this.config.strokeWidth || '.6px');
    square.setAttribute('transform', 'matrix(1 0 0 1 0 0)');

    square.isRect = true;
    this.elements.push(square);

    console.debug('Rect created');

    return square;
}
svg.createCircle = function(cx, cy, width, height, r) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
        inR = r || '40',
        inCx = cx || '300',
        inCy = cy || '300';

    circle.setAttribute('r', inR);
    // circle.setAttribute('ry', inRy);
    circle.setAttribute('class', 'svgCircle');
    circle.setAttribute('fill', this.config.color || '');
    circle.setAttribute('cx', inCx);
    circle.setAttribute('cy', inCy);
    circle.setAttribute('stroke', this.config.stroke || 'black');
    circle.setAttribute('stroke-width', this.config.strokeWidth || '.6px');
    circle.setAttribute('transform', 'matrix(1 0 0 1 0 0)');

    circle.isRect = false;
    this.elements.push(circle);

    console.debug('Circle created: ', circle);

    return circle;
}