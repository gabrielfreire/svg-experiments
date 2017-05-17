function DownloadManager() {
    return this;
}
window.URL = (window.URL || window.webkitURL);
var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
    body = document.body,
    dm = DownloadManager.prototype;

dm.download = initialize;

function initialize() {
    console.debug('initialized');
    var documents = [window.document],
        SVGSources = [];

    documents.forEach(function(doc) {
        var styles = getStyles(doc);
        var newSources = getSources(doc, styles);
        // because of prototype on NYT pages
        for (var i = 0; i < newSources.length; i++) {
            SVGSources.push(newSources[i]);
        };
    })

    if (SVGSources.length > 0) {
        download(SVGSources[0]);
    } else {
        alert("I couldn’t find any SVG nodes.");
    }
}

function cleanup() {
    var crowbarElements = document.querySelectorAll(".svg-crowbar");

    [].forEach.call(crowbarElements, function(el) {
        el.parentNode.removeChild(el);
    });
}

function download(source) {
    var filename = "untitled",
        svgBlob = new Blob(source.source, { "type": "text\/xml" }),
        url = window.URL.createObjectURL(svgBlob),
        a = document.createElement("a");

    if (source.id) {
        filename = source.id;
    } else if (source.class) {
        filename = source.class;
    } else if (window.document.title) {
        filename = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }

    body.appendChild(a);
    a.setAttribute("class", "svg-crowbar");
    a.setAttribute("download", filename + ".svg");
    a.setAttribute("href", url);
    a.style["display"] = "none";
    a.click();

    setTimeout(function() {
        window.URL.revokeObjectURL(url);
    }, 10);
}

function getSources(doc, styles) {
    var svgInfo = [],
        svgs = doc.querySelectorAll("svg"),
        prefix = {
            xmlns: "http://www.w3.org/2000/xmlns/",
            xlink: "http://www.w3.org/1999/xlink",
            svg: "http://www.w3.org/2000/svg"
        };

    styles = (styles === undefined) ? "" : styles;

    [].forEach.call(svgs, function(svg) {
        svg.setAttribute("version", "1.1");

        var defsEl = document.createElement("defs");
        svg.insertBefore(defsEl, svg.firstChild); //TODO   .insert("defs", ":first-child")
        // defsEl.setAttribute("class", "svg-crowbar");

        var styleEl = document.createElement("style")
        defsEl.appendChild(styleEl);
        styleEl.setAttribute("type", "text/css");


        // removing attributes so they aren't doubled up
        svg.removeAttribute("xmlns");
        svg.removeAttribute("xlink");

        // These are needed for the svg
        if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
            svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
        }

        if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
            svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
        }

        var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');
        var rect = svg.getBoundingClientRect();
        svgInfo.push({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            class: svg.getAttribute("class"),
            id: svg.getAttribute("id"),
            childElementCount: svg.childElementCount,
            source: [doctype + source]
        });
    });
    return svgInfo;
}

function getStyles(doc) {
    var styles = "",
        styleSheets = doc.styleSheets;

    if (styleSheets) {
        for (var i = 0; i < styleSheets.length; i++) {
            processStyleSheet(styleSheets[i]);
        }
    }

    function processStyleSheet(ss) {
        if (ss.cssRules) {
            for (var i = 0; i < ss.cssRules.length; i++) {
                var rule = ss.cssRules[i];
                if (rule.type === 3) {
                    // Import Rule
                    processStyleSheet(rule.styleSheet);
                } else {
                    // hack for illustrator crashing on descendent selectors
                    if (rule.selectorText) {
                        if (rule.selectorText.indexOf(">") === -1) {
                            styles += "\n" + rule.cssText;
                        }
                    }
                }
            }
        }
    }
    return styles;
}