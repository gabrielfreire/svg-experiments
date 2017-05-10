(function() {
    var svgDoc;
    var selectedPoint = 0;
    var selectedVar = -1;
    var currentX = 0;
    var currentY = 0;

    var example_shape;
    var control_point;
    var control_points;
    var equation;
    var selectElement = _selectElement;
    var text_variables;
    var variable_names = ["x", "y", "width", "height"];

    function init(evt) {
        svgDoc = document.getElementById('svgContainer');
        example_shape = svgDoc.getElementById('example_shape');
        control_points = [svgDoc.getElementById("control_point0"),
            svgDoc.getElementById("control_point1")
        ];
        control_points.forEach(function(cp) {
            var point;
            if (cp.getAttribute('id') == 'control_point0') {
                point = 1;
            } else {
                point = 2;
            }
            cp.addEventListener('mousedown', function(e) {
                _selectElement(e, point);
            });
        });
    };

    window.addEventListener('load', init);

    function _selectElement(evt, point) {
        console.log(point);
        var selectedElement = evt.target;
        selectedPoint = point;
        currentX = evt.clientX;
        currentY = evt.clientY;
        selectedElement.addEventListener('mousemove', drag);
        selectedElement.addEventListener('mouseout', deselect);
        selectedElement.addEventListener('mouseup', deselect);
    };

    function selectVariable(evt, n) {
        selectedVar = n;
        currentX = evt.clientX;
        equation.setAttributeNS(null, "class", "invisible");
        control_point = control_points[Math.floor(n / 2)];
    }

    function drag(evt) {
        if (selectedPoint != 0) {
            var dx = (evt.clientX - currentX);
            var dy = (evt.clientY - currentY);

            var x = parseInt(example_shape.getAttributeNS(null, "x")) + dx;
            var y = parseInt(example_shape.getAttributeNS(null, "y")) + dy;

            if (selectedPoint === 1) {
                var width = parseInt(example_shape.getAttributeNS(null, "width"));
                var height = parseInt(example_shape.getAttributeNS(null, "height"));

                example_shape.setAttributeNS(null, "x", x);
                example_shape.setAttributeNS(null, "y", y);
                control_points[0].setAttributeNS(null, "transform", "translate(" + x + "," + y + ")");
                // text_variables[0].firstChild.data = x;
                // text_variables[1].firstChild.data = y;

            } else {
                var width = parseInt(example_shape.getAttributeNS(null, "width")) + dx;
                var height = parseInt(example_shape.getAttributeNS(null, "height")) + dy;

                if (width < 1) { width = 1; }
                if (height < 1) { height = 1; }

                example_shape.setAttributeNS(null, "width", width);
                example_shape.setAttributeNS(null, "height", height);
                // text_variables[2].firstChild.data = width;
                // text_variables[3].firstChild.data = height;
            }

            x = x + width;
            y = y + height;
            control_points[1].setAttributeNS(null, "transform", "translate(" + x + "," + y + ")");
            currentX = evt.clientX;
            currentY = evt.clientY;
        } else if (selectedVar != -1) {
            var dx = evt.clientX - currentX;
            var v = parseInt(text_variables[selectedVar].firstChild.data) + dx;

            text_variables[selectedVar].firstChild.data = v
            example_shape.setAttributeNS(null, variable_names[selectedVar], v);

            var x1 = parseInt(example_shape.getAttributeNS(null, variable_names[0]));
            var y1 = parseInt(example_shape.getAttributeNS(null, variable_names[1]));
            var x2 = parseInt(example_shape.getAttributeNS(null, variable_names[2])) + x1;
            var y2 = parseInt(example_shape.getAttributeNS(null, variable_names[3])) + y1;

            if (selectedVar < 2) {
                control_points[0].setAttributeNS(null, "transform", "translate(" + x1 + "," + y1 + ")");
                control_points[1].setAttributeNS(null, "transform", "translate(" + x2 + "," + y2 + ")");
            } else {
                control_points[1].setAttributeNS(null, "transform", "translate(" + x2 + "," + y2 + ")");
            }

            currentX = evt.clientX;
        }
    };

    function deselect() {
        selectedPoint = 0;
        selectedVar = -1;
        equation.setAttributeNS(null, "class", "");
    };
})();