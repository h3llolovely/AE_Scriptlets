/**========================================================================
 * ?                  CreateAdjustmentLayer-MBLooks.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Create a new adjustment layer with effects (Magic Bullet Looks).
 *========================================================================**/

(function createAdjustmentLayer_MBLooks() {

    app.beginUndoGroup("Create MB Looks Layer");
    
    // Selected Composition
    var comp = app.project.activeItem;
    // Selected Layers
    var slctd_layer = comp.selectedLayers;

    var new_adjustment = comp.layers.addSolid([1, 1, 1], "MB Looks", comp.width, comp.height, comp.pixelAspect, comp.duration);
    new_adjustment.adjustmentLayer = true;

    // Try to apply the selected Effect, if an error occurs the new layer will be deleted
    try {

        var theEffect = new_adjustment.Effects.addProperty("Magic Bullet Looks");
    } catch (e) {
        new_adjustment.remove();
        alert("Magic Bullet Looks is not available!");
        app.endUndoGroup();
    }

    // Position of the new Layer
    // Check if at least one Layer is Selected
    // if so move the new Layer on top of the selected one
    if (slctd_layer[0] != null) {

        // Search for the Layer with the lowest index
        i = 0; // Set Counter
        lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
        top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

        // Go through the array of the selected layers
        while (i < slctd_layer.length) {

            // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
            if (lowest_index > slctd_layer[i].index) {
                lowest_index = slctd_layer[i].index;
                top_layer = slctd_layer[i];
            }
            i++;
        }
        // Move the new Layer on top of the layer with the lowest index
        new_adjustment.moveBefore(top_layer);
    }

    app.endUndoGroup();

})();