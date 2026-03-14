/**========================================================================
 * ?                  CreateCameraRig-Simple.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.1
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Create a simple camera rig.
 *========================================================================**/

(function createSimpleCameraRig() {

    app.beginUndoGroup("Simple Camera Rig");

    function exit(msg) {
        if (msg) alert(msg);
        app.endUndoGroup();
    }

    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        return exit("Please select an active comp to use this script.");
    }

    var w = comp.width  / 2;
    var h = comp.height / 2;

    var newCamera = comp.layers.addCamera("Rigged Camera", [w, h]);
    newCamera.position.setValue([w, h]);

    var bankNull = comp.layers.addNull();
    bankNull.source.name  = "CamBank";
    bankNull.threeDLayer  = true;
    bankNull.shy          = true;
    bankNull.enabled      = false;

    var pitchNull = comp.layers.addNull();
    pitchNull.source.name = "CamPitch";
    pitchNull.threeDLayer = true;
    pitchNull.shy         = true;
    pitchNull.enabled     = false;

    var headingNull = comp.layers.addNull();
    headingNull.source.name = "CamHeading";
    headingNull.threeDLayer = true;
    headingNull.shy         = true;
    headingNull.enabled     = false;

    var controlNull = comp.layers.addNull();
    controlNull.source.name = "Camera Control";
    controlNull.threeDLayer = true;
    controlNull.shy         = false;

    comp.hideShyLayers  = true;
    newCamera.parent    = bankNull;
    bankNull.parent     = pitchNull;
    pitchNull.parent    = headingNull;
    headingNull.parent  = controlNull;

    var fx = controlNull("Effects");

    var pitch = fx.addProperty("Angle Control");
    pitch.name = "Pitch (X)";

    var heading = fx.addProperty("Angle Control");
    heading.name = "Heading (Y)";

    var bank = fx.addProperty("Angle Control");
    bank.name = "Bank (Z)";

    var tracking = fx.addProperty("ADBE Slider Control");
    tracking.name = "Tracking Control";
    tracking.slider.setValue(0);

    var xPosition = fx.addProperty("ADBE Slider Control");
    xPosition.name = "(X) Position";
    xPosition.slider.setValue(w);

    var yPosition = fx.addProperty("ADBE Slider Control");
    yPosition.name = "(Y) Position";
    yPosition.slider.setValue(h);

    var zPosition = fx.addProperty("ADBE Slider Control");
    zPosition.name = "(Z) Position";
    zPosition.slider.setValue(0);

    controlNull.position.expression =
        'x = effect("(X) Position")("Slider");' +
        'y = effect("(Y) Position")("Slider");' +
        'z = effect("(Z) Position")("Slider");' +
        '[x, y, z];';

    bankNull.zRotation.expression =
        'value - [thisComp.layer("Camera Control").effect("Bank (Z)")("Angle")];';

    pitchNull.xRotation.expression =
        'value - [thisComp.layer("Camera Control").effect("Pitch (X)")("Angle")];';

    pitchNull.yRotation.expression =
        'value - [thisComp.layer("Camera Control").effect("Heading (Y)")("Angle")];';

    newCamera.position.expression =
        'value - [0,0,cameraOption.zoom] + ' +
        '[0,0,thisComp.layer("Camera Control").effect("Tracking Control")("Slider")];';

    app.endUndoGroup();

})();
