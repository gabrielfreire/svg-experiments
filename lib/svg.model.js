var SVGElement = function(config) {
    this.config = config;
    this.elements = [];
    this.controlPointElements = [];
    return this;
}

var svg = SVGElement.prototype,
    prefix = "http://www.w3.org/2000/svg";

svg.createSVGContainer = function() {
    var svgC = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

    svgC.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svgC.setAttributeNS(null, 'viewBox', "0 0 " + screen.width + " " + screen.height);
    svgC.setAttributeNS(null, 'width', '120px');
    svgC.setAttributeNS(null, 'height', '120px');
    svgC.setAttribute('class', 'svg-test');

    return svgC;
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
    // .addEvent('mousedown', function(e) {

    //     if (!element.isActive()) {
    //         element.setActive();
    //     } else {
    //         element.setUnactive();
    //     }
    // });

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
        id = 0,
        svgEl = new SVGElement({
            stroke: 'black',
            color: 'red'
        }),
        element = svgEl.createCircle(posX, posY, '3');

    element.attr('class', 'point1');
    element.attr('control_point', 'true');


    this.controlPointElements.push(element);
    return element;
}

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
        // if (vmlImages) {
        //     var images = cont.getElementsByTagName('image');
        //     for (var i = 0; i < images.length; i++) {
        //         var href = vmlImages[i].getAttribute('img');
        //         images[i].setAttribute('xlink:href', href);
        //         images[i].setAttribute('width', '100px');
        //         images[i].setAttribute('height', '100px');
        //     }
        // }
    }
    return cont;
}