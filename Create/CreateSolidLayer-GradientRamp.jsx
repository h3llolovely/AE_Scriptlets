/**========================================================================
 * ?                  CreateSolidLayer-GradientRamp.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Create a new Solid layer with effects (Gradient Ramp).
 *========================================================================**/

(function createSolidLayer_GradientRamp() {

    app.beginUndoGroup("Create Gradient Ramp Layer");

    // Selected Composition
    var comp = app.project.activeItem;
    // Selected Layers
    var slctd_layer = comp.selectedLayers;

    // Create new Solid and apply Ramp Effect
    var new_solid = comp.layers.addSolid([0, 0, 0], "Gradient Ramp", comp.width, comp.height, comp.pixelAspect, comp.duration);
    new_solid.Effects.addProperty("Gradient Ramp");

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
        new_solid.moveBefore(top_layer);
    }

    app.endUndoGroup();

})();