/**
 * Get URL parameter
 * https://www.netlobo.com/url_query_string_javascript.html
 * - [vis-timeline example](https://visjs.github.io/vis-timeline/examples/timeline/)
 * - [vis-timeline io](https://visjs.github.io/vis-timeline/examples/timeline/other/groupsPerformance.html)
 * - [vis-timeline example: a lot of group data](https://visjs.github.io/vis-timeline/examples/timeline-generated/jsfiddle.cd241505bf80e03e6b96c4b8aa197e6b07591e7162df44cd75e72362318f3e0f.html)
 * - [example use](https://jsfiddle.net/api/post/library/pure/)
 */
function getUrlParameter(name: string) {
    // Escaping Special Characters:
    name = name.replace(/[\\[]/, '\\[').replace(/[\]]/, '\\]');
    // Building the Regular Expression:
    var regexS = '[\\?&]' + name + '=([^&#]*)';
    // Creating the Regular Expression Object:
    var regex = new RegExp(regexS);
    // Executing the Regular Expression:
    var results = regex.exec(window.location.href);
    // Returning the Result:
    if (results == null) return '';
    else return results[1];
}

/**
 * optimize (Improvements) by ai
 * @param name
 * @returns
 */
function getUrlParameter2(name: string): string | null {
    name = name.replace(/[[\]]/g, '\\$&'); // Improved escaping
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(window.location.href);
    if (!results) return null;
    const value = results[2] ?? '';
    return decodeURIComponent(value);
}
