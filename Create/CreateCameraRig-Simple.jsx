/**========================================================================
 * ?                  CreateCameraRig-Simple.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Create a simple camera rig.
 *========================================================================**/

(function createSimpleCameraRig() {

    app.beginUndoGroup("Simple Camera Rig");

    var myComp = app.project.activeItem;

    if (myComp != null && (myComp instanceof CompItem)) {

        var w = myComp.width / 2;
        var h = myComp.height / 2;
        var newCamera = myComp.layers.addCamera("Rigged Camera", [w, h]); //make a new camera
        newCamera.position.setValue([w, h]);
        var myLayer = myComp.selectedLayers;
        if (myLayer) {
            var bankNull = myComp.layers.addNull();
            bankNull.source.name = "CamBank";
            bankNull.threeDLayer = true;
            bankNull.shy = true;
            bankNull.enabled = false;

            var pitchNull = myComp.layers.addNull();
            pitchNull.source.name = "CamPitch";
            pitchNull.threeDLayer = true;
            pitchNull.shy = true;
            pitchNull.enabled = false;

            var headingNull = myComp.layers.addNull(myComp.duration);
            headingNull.source.name = "CamHeading";
            headingNull.threeDLayer = true;
            headingNull.shy = true;
            headingNull.enabled = false;

            var controlNull = myComp.layers.addNull();
            controlNull.source.name = "Camera Control";
            controlNull.threeDLayer = true;
            controlNull.shy = false;
            myComp.hideShyLayers = true;
            newCamera.parent = bankNull;
            bankNull.parent = pitchNull;
            pitchNull.parent = headingNull;
            headingNull.parent = controlNull;

            var pitch = controlNull("Effects").addProperty("Angle Control");
            pitch.name = 'Pitch (X)';

            var heading = controlNull("Effects").addProperty("Angle Control");
            heading.name = 'Heading (Y)';

            var bank = controlNull("Effects").addProperty("Angle Control");
            bank.name = 'Bank (Z)';

            var tracking = controlNull("Effects").addProperty("ADBE Slider Control");
            tracking.name = 'Tracking Control';
            tracking.slider.setValue(0);

            var xPosition = controlNull("Effects").addProperty("ADBE Slider Control");
            xPosition.name = '(X) Position';
            xPosition.slider.setValue([w]);

            var yPosition = controlNull("Effects").addProperty("ADBE Slider Control");
            yPosition.name = '(Y) Position';
            yPosition.slider.setValue([h]);

            var zPosition = controlNull("Effects").addProperty("ADBE Slider Control");
            zPosition.name = '(Z) Position';
            zPosition.slider.setValue(0);

            var camPositionExpression = 'x = effect("(X) Position")("Slider");y = effect("(Y) Position")("Slider");z = effect("(Z) Position")("Slider");[x, y,z];';
            controlNull.position.expression = camPositionExpression;

            var CamBankZ = 'value - [thisComp.layer("Camera Control").effect("Bank (Z)")("Angle")];';
            bankNull.zRotation.expression = CamBankZ;

            var CamPitchX = 'value - [thisComp.layer("Camera Control").effect("Pitch (X)")("Angle")];';
            pitchNull.xRotation.expression = CamPitchX;

            var CamHeadingY = 'value - [thisComp.layer("Camera Control").effect("Heading (Y)")("Angle")];';
            pitchNull.yRotation.expression = CamHeadingY;

            var positionExpression = 'value - [0,0,cameraOption.zoom] + [0,0,thisComp.layer("Camera Control").effect("Tracking Control")("Slider")];';
            newCamera.position.expression = positionExpression;
            app.endUndoGroup();

        } else {
            alert("Please select at least one layer");
        }
    } else {
        alert("Please select an active comp to use this script");
    }

    app.endUndoGroup();

})();