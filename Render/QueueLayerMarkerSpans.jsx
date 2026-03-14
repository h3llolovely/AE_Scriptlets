/**========================================================================
 * ?                  QueueLayerMarkerSpans.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  2.0.1
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Sends the selected layer's marker spans to the Render Queue and appends the marker comment to the filename. Useful for queueing multiple parts of a single comp, without having to rename each output.
 *========================================================================**/

(function queueLayerMarkerSpans() {

    app.beginUndoGroup("'Queue Layer Marker Spans'");

    function exit(msg) {
        if (msg) alert(msg);
        app.endUndoGroup();
    }
    
    var comp = app.project.activeItem;
    
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        return exit("Please select a composition.");
    }

    var spanLayer = comp.selectedLayers[0];
    if (!spanLayer) {
        return exit("Please select a layer.");
    }

    var layerMarkers = spanLayer.property("Marker");

    if (layerMarkers.numKeys === 0) {
        return exit("The selected layer has no markers.");
    }

    var projPath = app.project.file.path;
    var skipped  = [];

    for (var i = 1; i <= layerMarkers.numKeys; i++) {
        var marker     = layerMarkers.keyValue(i);
        var markerTime = layerMarkers.keyTime(i);
        var markerName = layerMarkers.keyValue(i).comment;

        if (marker.duration <= 0) {
            skipped.push(markerName);
            continue;
        }

        var item = app.project.renderQueue.items.add(comp);
        item.timeSpanStart    = markerTime;
        item.timeSpanDuration = marker.duration;

        var output = item.outputModules[1];
        output.file = new File(projPath + "/_Renders/" + comp.name + "_" + markerName);
    }

    if (skipped.length) {
        alert("Skipped non-span markers: " + skipped.join(", "));
    }

    app.endUndoGroup();
    
})();
