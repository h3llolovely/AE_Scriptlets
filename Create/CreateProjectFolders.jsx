/**========================================================================
 * ?                  CreateProjectFolders.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Create project folder structure.
 *========================================================================**/

(function createProjectFolders() {

    app.beginUndoGroup("Setup Project");

    // Project Setup: Create Default Folders
    var_Collects = 0;
    var_Output = 0;
    var_MainComps = 0;
    var_PreComps = 0;
    var_Assets = 0;
    var_Ref = 0;
    var_Solids = 0;

    var_Sub_AEC = 0;
    var_Sub_Raster = 0;
    var_Sub_Vector = 0;
    var_Sub_Stills = 0;
    var_Sub_Footage = 0;
    var_Sub_3dRenders = 0;
    var_Sub_PreRenders = 0;
    var_Sub_Audio = 0;
    var_Sub_Misc = 0;

    for (i = 1; i <= app.project.items.length; i++) {
        current_name = app.project.item(i).name;

        if (current_name == "***Collects-MoveToTree") {
            var_Collects = 1;
        }
        if (current_name == "1.Output") {
            var_Output = 1;
        }
        if (current_name == "2.MainComps") {
            var_MainComps = 1;
        }
        if (current_name == "3.PreComps") {
            var_PreComps = 1;
        }
        if (current_name == "4.Assets") {
            var_Assets = 1;
        }
        if (current_name == "5.Reference") {
            var_Ref = 1;
        }
        if (current_name == "Solids") {
            var_Solids = 1;
        }

        if (current_name == "_misc") {
            var_Sub_Misc = 1;
        }
    }

    // Generate Folders
    if (var_Collects == 0) {
        my_collects_folder = app.project.items.addFolder("***Collects-MoveToTree");
        my_collects_folder.label = (0);
    }
    if (var_Output == 0) {
        my_output_folder = app.project.items.addFolder("1.Output");
        my_output_folder.label = (8);
    }
    if (var_MainComps == 0) {
        my_maincomp_folder = app.project.items.addFolder("2.MainComps");
        my_maincomp_folder.label = (13);
    }
    if (var_PreComps == 0) {
        my_precomp_folder = app.project.items.addFolder("3.PreComps");
        my_precomp_folder.label = (14);
    }
    if (var_Assets == 0) {
        my_assets_folder = app.project.items.addFolder("4.Assets");
        for (i = 1; i <= my_assets_folder.items.length; i++) {
            if (current_name == "0_AECs") {
                var_Sub_AEC = 1;
            }
            if (current_name == "1_Raster") {
                var_Sub_Raster = 1;
            }
            if (current_name == "2_Vector") {
                var_Sub_Vector = 1;
            }
            if (current_name == "3_Stills") {
                var_Sub_Stills = 1;
            }
            if (current_name == "4_Footage") {
                var_Sub_Footage = 1;
            }
            if (current_name == "5_3D_Renders") {
                var_Sub_3dRenders = 1;
            }
            if (current_name == "6_PreRenders") {
                var_Sub_PreRenders = 1;
            }
            if (current_name == "7_Audio") {
                var_Sub_Audio = 1;
            }
        }
        if (var_Sub_AEC == 0) {
            my_aec = my_assets_folder.items.addFolder("0_AECs");
            my_aec.label = (11);
        }
        if (var_Sub_Raster == 0) {
            my_rast = my_assets_folder.items.addFolder("1_Raster");
            my_rast.label = (11);
        }
        if (var_Sub_Vector == 0) {
            my_vec = my_assets_folder.items.addFolder("2_Vector");
            my_vec.label = (11);
        }
        if (var_Sub_Stills == 0) {
            my_stills = my_assets_folder.items.addFolder("3_Stills");
            my_stills.label = (11);
        }
        if (var_Sub_Footage == 0) {
            my_footage = my_assets_folder.items.addFolder("4_Footage");
            my_footage.label = (11);
        }
        if (var_Sub_3dRenders == 0) {
            my_3d = my_assets_folder.items.addFolder("5_3D_Renders");
            my_3d.label = (11);
        }
        if (var_Sub_PreRenders == 0) {
            my_pre = my_assets_folder.items.addFolder("6_PreRenders");
            my_pre.label = (11);
        }
        if (var_Sub_Audio == 0) {
            my_aud = my_assets_folder.items.addFolder("7_Audio");
            my_aud.label = (11);
        }

        my_assets_folder.label = (11);
        my_assets_folder.items;

    }
    if (var_Ref == 0) {
        my_ref_folder = app.project.items.addFolder("5.Reference");
        my_ref_folder.label = (10);
    }
    if (var_Solids == 0) {
        my_solids_folder = app.project.items.addFolder("Solids");
        my_solids_folder.label = (1);
        my_sub_solids_folder = my_solids_folder.items.addFolder("_misc");
        my_sub_solids_folder.label = (1);
    }

    app.endUndoGroup();

})();