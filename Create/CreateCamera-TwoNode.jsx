/**========================================================================
 * ?                  CreateCamera-TwoNode.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Create a Two-Node Camera.
 *========================================================================**/

(function createTwoNodeCamera() {

    app.beginUndoGroup("Create Two-Node Camera");

    // Selected Composition
    var comp = app.project.activeItem;

    var new_camera = comp.layers.addCamera("Two-Node Camera", [comp.width / 2, comp.height / 2]);

    app.endUndoGroup();

})();