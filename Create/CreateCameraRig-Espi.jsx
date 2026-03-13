/**========================================================================
 * ?                  CreateCameraRig-Espi.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Create an Espi camera rig.
 *========================================================================**/

(function createEspiCameraRig() {

    app.beginUndoGroup("Espi Camera Rig");

    var myComp = app.project.activeItem;

    if (myComp != null && (myComp instanceof CompItem)) {

        var w = myComp.width / 2;
        var h = myComp.height / 2;
        var newCamera = myComp.layers.addCamera("Camera", [w, h]); //make a new camera
        newCamera.position.setValue([w, h, -1500]);
        var myLayer = myComp.selectedLayers;

        if (myLayer) {
            var PosNull = myComp.layers.addNull();
            PosNull.source.name = "Cam_Pos";
            PosNull.threeDLayer = true;
            PosNull.position.setValue([w, h]);
            PosNull.enabled = true;

            var RotNull = myComp.layers.addNull();
            RotNull.source.name = "Cam_Rot";
            RotNull.threeDLayer = true;
            RotNull.position.setValue([w, h]);
            RotNull.enabled = true;

            newCamera.parent = PosNull;
            PosNull.parent = RotNull;

            var Lock3D = '[0,0,0]'; //lock unwanted properties
            var Lock1D = '[0]';
            var LockScale = '[100,100,100]';

            RotNull.anchorPoint.expression = Lock3D;
            RotNull.position.expression = Lock3D;
            RotNull.scale.expression = LockScale;

            PosNull.anchorPoint.expression = Lock3D;
            PosNull.scale.expression = LockScale;
            PosNull.orientation.expression = Lock3D;
            PosNull.xRotation.expression = Lock1D;
            PosNull.yRotation.expression = Lock1D;
            PosNull.zRotation.expression = Lock1D;

        } else {
            alert("Please select at least one layer");
        }
    } else {
        alert("Please select an active comp to use this script");
    }

    app.endUndoGroup();

})();