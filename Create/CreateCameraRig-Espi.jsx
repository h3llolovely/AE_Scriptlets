/**========================================================================
 * ?                  CreateCameraRig-Espi.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.1
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Create an Espi camera rig.
 *========================================================================**/

(function createEspiCameraRig() {

    app.beginUndoGroup("Espi Camera Rig");

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

    var newCamera = comp.layers.addCamera("Camera", [w, h]);
    newCamera.position.setValue([w, h, -1500]);

    var PosNull = comp.layers.addNull();
    PosNull.source.name  = "Cam_Pos";
    PosNull.threeDLayer  = true;
    PosNull.position.setValue([w, h]);
    PosNull.enabled      = true;

    var RotNull = comp.layers.addNull();
    RotNull.source.name  = "Cam_Rot";
    RotNull.threeDLayer  = true;
    RotNull.position.setValue([w, h]);
    RotNull.enabled      = true;

    newCamera.parent = PosNull;
    PosNull.parent   = RotNull;

    var Lock3D    = '[0,0,0]';
    var Lock1D    = '[0]';
    var LockScale = '[100,100,100]';

    RotNull.anchorPoint.expression = Lock3D;
    RotNull.position.expression    = Lock3D;
    RotNull.scale.expression       = LockScale;

    PosNull.anchorPoint.expression = Lock3D;
    PosNull.scale.expression       = LockScale;
    PosNull.orientation.expression = Lock3D;
    PosNull.xRotation.expression   = Lock1D;
    PosNull.yRotation.expression   = Lock1D;
    PosNull.zRotation.expression   = Lock1D;

    app.endUndoGroup();
})();
