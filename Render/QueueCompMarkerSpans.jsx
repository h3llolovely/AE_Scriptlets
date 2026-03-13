/**========================================================================
 * ?                  QueueCompMarkerSpans.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  2.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Sends composition marker spans to the Render Queue and appends the marker comment to the filename. Useful for queueing multiple parts of a single comp, without having to rename each output.
 *========================================================================**/

(function queueCompMarkerSpans() {

    app.beginUndoGroup("'Queue Comp Marker Spans'");

    // Selected Composition
    var comp = app.project.activeItem;
    
    // Check if a composition is selected
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    // Composition markers
    var compMarkers = comp.markerProperty;

	// Project file path
    var projPath = app.project.file.path;

    // Check if the composition has markers
    if (compMarkers.numKeys > 0) {

        for (var i = 1; i <= compMarkers.numKeys; i++) {
            // Show markers duration (in seconds)
            // alert(compMarkers.keyValue(i).comment + " has duration of " + compMarkers.keyValue(i).duration);

            // Verify marker has a duration before adding to render queue
            if (compMarkers.keyValue(i).duration > 0) {
                var item = app.project.renderQueue.items.add(comp);
                item.timeSpanStart = compMarkers.keyTime(i);
                item.timeSpanDuration = compMarkers.keyValue(i).duration;

                var output = item.outputModules[1];
                var outputFilePath = projPath + "/_Renders/" + comp.name + "_" + compMarkers.keyValue(i).comment;
                output.file = new File(outputFilePath);
            } else {
              alert("Marker " + compMarkers.keyValue(i).comment + " is not a span.");
            }
        }

    } else {
      alert("The selected composition has no markers.");
    }

    app.endUndoGroup();

})();