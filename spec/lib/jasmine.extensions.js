jasmine.Matchers.prototype.toEqualOneOf = function (expectedPossibilities) {
    for (var i = 0; i < expectedPossibilities.length; i++) {
        if (this.env.equals_(this.actual, expectedPossibilities[i])) {
            return true;
        }
    }
    return false;
};

jasmine.Matchers.prototype.toContainHtml = function (expectedHtml) {
    var cleanedHtml = this.actual.innerHTML.toLowerCase().replace(/\r\n/g, "");
    // IE < 9 strips whitespace immediately following comment nodes. Normalize by doing the same on all browsers.
    cleanedHtml = cleanedHtml.replace(/(<!--.*?-->)\s*/g, "$1");
    expectedHtml = expectedHtml.replace(/(<!--.*?-->)\s*/g, "$1");
    // Also remove __ko__ expando properties (for DOM data) - most browsers hide these anyway but IE < 9 includes them in innerHTML
    cleanedHtml = cleanedHtml.replace(/ __ko__\d+=\"(ko\d+|null)\"/g, "");
    this.actual = cleanedHtml;      // Fix explanatory message
    return cleanedHtml === expectedHtml;
};

jasmine.Matchers.prototype.toContainText = function (expectedText) {
    var actualText = 'textContent' in this.actual ? this.actual.textContent : this.actual.innerText;
    var cleanedActualText = actualText.replace(/\r\n/g, "\n");
    this.actual = cleanedActualText;    // Fix explanatory message
    return cleanedActualText === expectedText;
};

jasmine.Matchers.prototype.toHaveOwnProperties = function (expectedProperties) {
    var ownProperties = [];
    for (var prop in this.actual) {
        if (this.actual.hasOwnProperty(prop)) {
            ownProperties.push(prop);
        }
    }
    return this.env.equals_(ownProperties, expectedProperties);
};

jasmine.Matchers.prototype.toHaveSelectedValues = function (expectedValues) {
    var selectedNodes = ko.utils.arrayFilter(this.actual.childNodes, function (node) { return node.selected; }),
        selectedValues = ko.utils.arrayMap(selectedNodes, function (node) { return ko.selectExtensions.readValue(node); });
    this.actual = selectedValues;   // Fix explanatory message
    return this.env.equals_(selectedValues, expectedValues);
};

jasmine.addScriptReference = function(scriptUrl) {
    if (window.console)
        console.log("Loading " + scriptUrl + "...");
    document.write("<scr" + "ipt type='text/javascript' src='" + scriptUrl + "'></sc" + "ript>");
};

jasmine.prepareTestNode = function() {
    // The bindings specs make frequent use of this utility function to set up
    // a clean new DOM node they can execute code against
    var existingNode = document.getElementById("testNode");
    if (existingNode != null)
        existingNode.parentNode.removeChild(existingNode);
    testNode = document.createElement("div");
    testNode.id = "testNode";
    document.body.appendChild(testNode);
};

// Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
// Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
// If there is a future need to detect specific versions of IE10+, we will amend this.
jasmine.ieVersion = typeof(document) == 'undefined' ? undefined : (function() {
    var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

    // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
    while (
        div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        );
    return version > 4 ? version : undefined;
}());
