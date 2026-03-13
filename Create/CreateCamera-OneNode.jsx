/**========================================================================
 * ?                  CreateCamera-OneNode.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Create a One-Node Camera.
 *========================================================================**/

(function createOneNodeCamera() {
    
    app.beginUndoGroup("Create One-Node Camera");

    // Selected Composition
    var comp = app.project.activeItem;

    var new_camera = comp.layers.addCamera("One-Node Camera", [comp.width / 2, comp.height / 2]);

    new_camera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;

    app.endUndoGroup();

})();