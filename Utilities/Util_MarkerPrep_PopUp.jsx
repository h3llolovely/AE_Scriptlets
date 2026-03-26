/**========================================================================
 * ?                  Util_MarkerPrep.jsx
 * @author         :  Jason Schwarz (https://hellolovely.tv)
 * @email          :  hello@hellolovely.tv
 * @version        :  1.0.11
 * @createdFor     :  After Effects CC 2022+ (v22+)
 * @description    :  Adds/Edits a Layer/Comp marker at the Current Time Indicator (Playhead). Suitable for kBar, MoBar, AEbar.
 *
 *                    Behaviour summary:
 *                      - First selected layer          → Add/Edit Layer marker at CTI.
 *                      - No selected layer             → Add/Edit Comp marker at CTI.
 *                      - Marker does not exist         → Opens blank dialog to create one.
 *                      - Marker already exists at CTI  → Opens dialog with it's values pre-filled for editing.
 *                    Dialog inputs:
 *                      - Comment   : Free-text field.
 *                      - Duration  : HH:MM:SS:FF timecode (blank / 00:00:00:00 = 0 s).
 *                      - 1-frame   : If ticked, a marker with a duration of 0 frames is promoted to 1 frame.
 *                      - Label     : Dropdown list of AE's user preference 16 label Colors.
 *========================================================================**/

(function () {

    // ─────────────────────────────────────────────────────────────
    // LABEL DATA — sourced from AE preferences + getLabels()
    // ─────────────────────────────────────────────────────────────

    var CP1252_TABLE = {
        161: 161, 162: 162, 163: 163, 164: 164, 165: 165, 166: 166,
        167: 167, 168: 168, 169: 169, 170: 170, 171: 171, 172: 172,
        174: 174, 175: 175, 176: 176, 177: 177, 178: 178, 179: 179,
        180: 180, 181: 181, 182: 182, 183: 183, 184: 184, 185: 185,
        186: 186, 187: 187, 188: 188, 189: 189, 190: 190, 191: 191,
        192: 192, 193: 193, 194: 194, 195: 195, 196: 196, 197: 197,
        198: 198, 199: 199, 200: 200, 201: 201, 202: 202, 203: 203,
        204: 204, 205: 205, 206: 206, 207: 207, 208: 208, 209: 209,
        210: 210, 211: 211, 212: 212, 213: 213, 214: 214, 215: 215,
        216: 216, 217: 217, 218: 218, 219: 219, 220: 220, 221: 221,
        222: 222, 223: 223, 224: 224, 225: 225, 226: 226, 227: 227,
        228: 228, 229: 229, 230: 230, 231: 231, 232: 232, 233: 233,
        234: 234, 235: 235, 236: 236, 237: 237, 238: 238, 239: 239,
        240: 240, 241: 241, 242: 242, 243: 243, 244: 244, 245: 245,
        246: 246, 247: 247, 248: 248, 249: 249, 250: 250, 251: 251,
        252: 252, 253: 253, 254: 254, 255: 255, 338: 140, 339: 156,
        352: 138, 353: 154, 376: 159, 381: 142, 382: 158, 402: 131,
        710: 136, 732: 152, 8211: 150, 8212: 151, 8216: 145, 8217: 146,
        8218: 130, 8220: 147, 8221: 148, 8222: 132, 8224: 134, 8225: 135,
        8226: 149, 8230: 133, 8240: 137, 8249: 139, 8250: 155, 8364: 128,
        8482: 153, 65533173: 173,
    };

    function decodePrefBytes(raw, startIndex) {
        if (startIndex === undefined) { startIndex = 0; }
        var result = "";
        for (var j = startIndex; j < raw.length; j++) {
            var code = raw.charCodeAt(j);
            // Remap non-linear CP1252 code points back to byte values.
            if (CP1252_TABLE[code] !== undefined) {
                code = CP1252_TABLE[code];
            }
            var hex = code.toString(16).toUpperCase();
            if (hex.length === 1) { hex = "0" + hex; }
            result += hex;
        }
        return result;
    }

    function hexToAsciiString(hex) {
        var result = "";
        for (var i = 0; i < hex.length; i += 2) {
            result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return result;
    }

    function buildLabelData() {

        // ── Hardcoded defaults — used per-slot when a pref read fails ──
        var DEFAULTS = [
            { value: "",       name: "None"      }, // 0
            { value: "B53838", name: "Red"        }, // 1
            { value: "E4D84C", name: "Yellow"     }, // 2
            { value: "A9CBC7", name: "Aqua"       }, // 3
            { value: "E5BCC9", name: "Pink"       }, // 4
            { value: "A9A9CA", name: "Lavender"   }, // 5
            { value: "E7C19E", name: "Peach"      }, // 6
            { value: "B3C7B3", name: "Sea Foam"   }, // 7
            { value: "677DE0", name: "Blue"       }, // 8
            { value: "4AA44C", name: "Green"      }, // 9
            { value: "8E2C9A", name: "Purple"     }, // 10
            { value: "E8920D", name: "Orange"     }, // 11
            { value: "7F452A", name: "Brown"      }, // 12
            { value: "F46DD6", name: "Fuchsia"    }, // 13
            { value: "3DA2A5", name: "Cyan"       }, // 14
            { value: "A89677", name: "Sandstone"  }, // 15
            { value: "1E401E", name: "Dark Green" }  // 16
        ];

        var prevEncoding = $.appEncoding;
        try {
            $.appEncoding = 'CP1252';

            var colorSection = "Label Preference Color Section 5";
            var textSection  = "Label Preference Text Section 7";
            var prefType     = PREFType.PREF_Type_MACHINE_INDEPENDENT;

            var data = [{ value: "", name: "None" }]; // index 0

            for (var i = 1; i <= 16; i++) {
                var colorKey = "Label Color ID 2 # " + i.toString();
                var textKey  = "Label Text ID 2 # "  + i.toString();

                // ── Color value ──────────────────────────────────────
                var colorHex = DEFAULTS[i].value;
                try {
                    var rawColor = app.preferences.getPrefAsString(
                        colorSection, colorKey, prefType
                    );
                    if (rawColor && rawColor.length > 1) {
                        colorHex = decodePrefBytes(rawColor, 1); // skip AE prefix byte
                    }
                } catch (colorErr) { /* keep default */ }

                // ── Label name ────────────────────────────────────────
                var labelName = DEFAULTS[i].name;
                try {
                    var rawName = app.preferences.getPrefAsString(
                        textSection, textKey, prefType
                    );
                    if (rawName && rawName.length > 1) {
                        var nameHex = decodePrefBytes(rawName, 0); // no prefix byte for text prefs
                        var decoded = hexToAsciiString(nameHex);
                        if (decoded && decoded.length > 0) {
                            labelName = decoded;
                        }
                    }
                } catch (nameErr) { /* keep default */ }

                data.push({ value: colorHex, name: labelName });
            }

            return data;

        } catch (e) {
            return DEFAULTS;
        } finally {
            $.appEncoding = prevEncoding; // always restore
        }
    }

    var LABEL_DATA = buildLabelData();

    var LABEL_NAMES = (function () {
        var names = [];
        for (var i = 0; i < LABEL_DATA.length; i++) {
            names.push(LABEL_DATA[i].name);
        }
        return names;
    }());

    // ─────────────────────────────────────────────────────────────
    // UTILITY HELPERS
    // ─────────────────────────────────────────────────────────────

    /**
     * Zero-pad a number to a given width.
     * @param {number} n
     * @param {number} width
     * @returns {string}
     */
    function zeroPad(n, width) {
        var s = String(Math.floor(Math.abs(n)));
        while (s.length < width) { s = "0" + s; }
        return s;
    }

    /**
     * Convert a time in seconds to a HH:MM:SS:FF string.
     * @param {number} seconds
     * @param {number} fps  - frames per second (always passed from active comp)
     * @returns {string}
     */
    function secondsToTimecode(seconds, fps) {
        if (isNaN(seconds) || seconds < 0) { seconds = 0; }
        if (!fps || fps <= 0) {
            var activeComp = app.project && app.project.activeItem;
            if (!(activeComp instanceof CompItem)) {
                alert("MarkerPrep: No active composition found to determine frame rate.", "MarkerPrep – Error");
                return "00:00:00:00";
            }
            fps = activeComp.frameRate;
        }
        var totalFrames = Math.round(seconds * fps);
        var ff = totalFrames % fps;
        var totalSecs = Math.floor(totalFrames / fps);
        var ss = totalSecs % 60;
        var totalMins = Math.floor(totalSecs / 60);
        var mm = totalMins % 60;
        var hh = Math.floor(totalMins / 60);
        return zeroPad(hh, 2) + ":" +
               zeroPad(mm, 2) + ":" +
               zeroPad(ss, 2) + ":" +
               zeroPad(ff, 2);
    }

    /**
     * Parse a HH:MM:SS:FF timecode string to seconds.
     * Returns -1 if the string is not valid.
     * @param {string} tc
     * @param {number} fps
     * @returns {number}
     */
    function timecodeToSeconds(tc, fps) {
        if (!fps || fps <= 0) {
            var activeComp = app.project && app.project.activeItem;
            if (!(activeComp instanceof CompItem)) {
                alert("MarkerPrep: No active composition found to determine frame rate.", "MarkerPrep – Error");
                return -1;
            }
            fps = activeComp.frameRate;
        }
        // Accept HH:MM:SS:FF or HH:MM:SS;FF (drop-frame separator)
        var clean = String(tc).replace(/;/, ":");
        var parts = clean.split(":");
        if (parts.length !== 4) { return -1; }
        var hh = parseInt(parts[0], 10);
        var mm = parseInt(parts[1], 10);
        var ss = parseInt(parts[2], 10);
        var ff = parseInt(parts[3], 10);
        if (isNaN(hh) || isNaN(mm) || isNaN(ss) || isNaN(ff)) { return -1; }
        if (mm > 59 || ss > 59 || ff >= fps) { return -1; }
        return hh * 3600 + mm * 60 + ss + ff / fps;
    }

    /**
     * Round a time value to the nearest frame boundary.
     * @param {number} t   - time in seconds
     * @param {number} fps
     * @returns {number}
     */
    function snapToFrame(t, fps) {
        return Math.round(t * fps) / fps;
    }

    /**
     * Return the duration of one frame in seconds.
     * @param {number} fps
     * @returns {number}
     */
    function oneFrame(fps) {
        return 1 / fps;
    }

    // ─────────────────────────────────────────────────────────────
    // MARKER LOOKUP
    // ─────────────────────────────────────────────────────────────

    function findMarkerAtTime(markerProp, time, fps) {
        var count = markerProp.numKeys;
        var snapped = snapToFrame(time, fps);
        for (var i = 1; i <= count; i++) {
            var keyTime = snapToFrame(markerProp.keyTime(i), fps);
            if (Math.abs(keyTime - snapped) < (0.5 / fps)) {
                return { index: i, marker: markerProp.keyValue(i) };
            }
        }
        return null;
    }

    // ─────────────────────────────────────────────────────────────
    // DIALOG BUILDER
    // ─────────────────────────────────────────────────────────────

    function showDialog(opts) {

        var isEdit       = opts.isEdit       || false;
        var isLayer      = opts.isLayer      || false;
        var fps          = opts.fps          || 24;
        var existingData = opts.existingData || null;

        // ── window ──────────────────────────────────────────────
        var title = (isEdit ? "Edit " : "Add ") +
                    (isLayer ? "Layer" : "Comp") + " Marker";
        var win = new Window("dialog", title);
        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 10;
        win.margins = 16;

        // ── info label ──────────────────────────────────────────
        var infoText = isEdit
            ? "Editing Existing " + (isLayer ? "Layer" : "Comp") + " Marker at Current Time."
            : "Adding New "       + (isLayer ? "Layer" : "Comp") + " Marker at Current Time.";
        var infoGrp = win.add("group");
        infoGrp.add("statictext", undefined, infoText);

        // ── separator ───────────────────────────────────────────
        win.add("panel", undefined, "");

        // ── Comment ─────────────────────────────────────────────
        var commentPanel = win.add("panel", undefined, "Comment");
        commentPanel.alignChildren = ["fill", "top"];
        commentPanel.margins = [10, 15, 10, 10];
        var commentField = commentPanel.add(
            "edittext", undefined,
            (existingData && existingData.comment) ? existingData.comment : "",
            { multiline: false }
        );
        commentField.preferredSize.width = 300;

        // ── Duration ────────────────────────────────────────────
        var durPanel = win.add("panel", undefined, "Duration  (HH:MM:SS:FF)");
        durPanel.alignChildren = ["fill", "top"];
        durPanel.margins = [10, 15, 10, 10];

        var durGrp = durPanel.add("group");
        durGrp.orientation = "row";
        durGrp.alignChildren = ["left", "center"];

        var defaultDurTC = "00:00:00:00";
        if (existingData && existingData.durationSecs > 0) {
            defaultDurTC = secondsToTimecode(existingData.durationSecs, fps);
        }
        var durationField = durGrp.add("edittext", undefined, defaultDurTC);
        durationField.preferredSize.width = 120;
        durGrp.add("statictext", undefined,
            "  (blank or 00:00:00:00 = No Duration)");

        // ── 1-frame minimum tickbox ──────────────────────────────
        var oneFrameCheck = win.add(
            "checkbox", undefined,
            "Single Markers to 1-frame Span"
        );
        oneFrameCheck.value = true; // ON by default

        // ── Label color ─────────────────────────────────────────
        var labelPanel = win.add("panel", undefined, "Label Color");
        labelPanel.alignChildren = ["fill", "top"];
        labelPanel.margins = [10, 15, 10, 10];
        var labelDD = labelPanel.add("dropdownlist", undefined, LABEL_NAMES);
        labelDD.preferredSize.width =180;

        // Pre-select existing label (default 0 = None)
        var defaultLabelIdx = 0;
        if (existingData && typeof existingData.label === "number") {
            defaultLabelIdx = existingData.label;
        }
        labelDD.selection = defaultLabelIdx;

        // ── Buttons ──────────────────────────────────────────────
        win.add("panel", undefined, ""); // separator

        var btnGrp = win.add("group");
        btnGrp.orientation = "row";
        btnGrp.alignment   = "right";
        btnGrp.spacing     = 8;

        var cancelBtn = btnGrp.add("button", undefined, "Cancel",  { name: "cancel" });
        var applyBtn  = btnGrp.add("button", undefined, "Apply",   { name: "ok"     });
        applyBtn.active = true;

        // ── Result holder ────────────────────────────────────────
        var result = null;

        // ── Apply handler ────────────────────────────────────────
        applyBtn.onClick = function () {

            // Validate duration field
            var tcStr = durationField.text;
            var durationSecs = 0;

            if (tcStr === "" || tcStr === "00:00:00:00") {
                durationSecs = 0;
            } else {
                durationSecs = timecodeToSeconds(tcStr, fps);
                if (durationSecs < 0) {
                    alert(
                        "Invalid Duration Timecode.\n" +
                        "Please use the format HH:MM:SS:FF\n" +
                        "Example: 00:00:02:12",
                        "MarkerPrep – Input Error"
                    );
                    durationField.active = true;
                    return; // keep dialog open
                }
            }

            // Apply 1-frame minimum if ticked and duration is 0
            if (oneFrameCheck.value && durationSecs === 0) {
                durationSecs = oneFrame(fps);
            }

            result = {
                comment      : commentField.text,
                durationSecs : durationSecs,
                label        : labelDD.selection ? labelDD.selection.index : 0,
                oneFrameMin  : oneFrameCheck.value
            };

            win.close();
        };

        cancelBtn.onClick = function () {
            result = null;
            win.close();
        };

        win.show();
        return result;
    }

    // ─────────────────────────────────────────────────────────────
    // APPLY MARKER DATA
    // ─────────────────────────────────────────────────────────────

    /**
     * Create a new MarkerValue populated from dialogResult.
     * @param {object} dialogResult
     * @returns {MarkerValue}
     */
    function buildMarkerValue(dialogResult) {
        var mv = new MarkerValue(dialogResult.comment || "");
        mv.duration = dialogResult.durationSecs;
        mv.label    = dialogResult.label;
        return mv;
    }

    /**
     * Write marker to a MarkerValueProperty.
     * Edits in place if existingIndex is provided, otherwise adds a new key.
     *
     * @param {Property} markerProp
     * @param {number}   time           - seconds (CTI)
     * @param {object}   dialogResult
     * @param {number|null} existingIndex - 1-based key index if editing
     */
    function applyMarker(markerProp, time, dialogResult, existingIndex) {
        var mv = buildMarkerValue(dialogResult);

        if (existingIndex !== null && existingIndex !== undefined) {
            // Remove old key and re-add (AE ExtendScript has no
            // direct "set value at existing key" for markers).
            markerProp.removeKey(existingIndex);
        }
        markerProp.setValueAtTime(time, mv);
    }

    // ─────────────────────────────────────────────────────────────
    // EXTRACT EXISTING MARKER DATA
    // ─────────────────────────────────────────────────────────────

    /**
     * Pull editable fields out of an existing MarkerValue.
     * @param {MarkerValue} mv
     * @returns {{ comment: string, durationSecs: number, label: number }}
     */
    function extractMarkerData(mv) {
        return {
            comment      : mv.comment  || "",
            durationSecs : mv.duration || 0,
            label        : mv.label    || 0
        };
    }

    // ─────────────────────────────────────────────────────────────
    // MAIN ENTRY POINT
    // ─────────────────────────────────────────────────────────────

    function main() {

        // ── Guard: active project ────────────────────────────────
        if (!app.project) {
            alert("No Project is Currently Open.", "MarkerPrep");
            return;
        }

        // ── Guard: active composition ────────────────────────────
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert(
                "Please Open and Activate a Composition Before Running MarkerPrep.",
                "MarkerPrep"
            );
            return;
        }

        var fps     = comp.frameRate;
        var cti     = comp.time; // current time in seconds

        // ── Determine target: layer or comp ──────────────────────
        var useLayer  = false;
        var targetLayer = null;

        if (comp.selectedLayers.length > 0) {
            targetLayer = comp.selectedLayers[0]; // first selected layer only
            useLayer    = true;
        }

        // ── Get the appropriate marker property ──────────────────
        var markerProp;
        try {
            if (useLayer) {
                markerProp = targetLayer.property("ADBE Marker");
                if (!markerProp) { throw new Error("Layer has No Marker Property."); }
            } else {
                markerProp = comp.markerProperty;
                if (!markerProp) { throw new Error("Comp has No Marker Property."); }
            }
        } catch (e) {
            alert(
                "Could not access marker property:\n" + e.message,
                "MarkerPrep – Error"
            );
            return;
        }

        // ── Check for existing marker at CTI ─────────────────────
        var existing = findMarkerAtTime(markerProp, cti, fps);
        var isEdit   = (existing !== null);
        var existingData = isEdit ? extractMarkerData(existing.marker) : null;

        // ── Show dialog ──────────────────────────────────────────
        var dialogResult = showDialog({
            isEdit       : isEdit,
            isLayer      : useLayer,
            fps          : fps,
            existingData : existingData
        });

        if (dialogResult === null) {
            // User cancelled — do nothing
            return;
        }

        // ── Apply with undo group ────────────────────────────────
        var undoLabel = (isEdit ? "Edit " : "Add ") +
                        (useLayer ? "Layer" : "Comp") + " Marker";

        app.beginUndoGroup(undoLabel);
        try {
            applyMarker(
                markerProp,
                cti,
                dialogResult,
                isEdit ? existing.index : null
            );
        } catch (e) {
            app.endUndoGroup();
            alert(
                "Failed to " + (isEdit ? "Edit" : "Add") + " Marker:\n" + e.message,
                "MarkerPrep – Error"
            );
            return;
        }
        app.endUndoGroup();

        // ── Success feedback ─────────────────────────────────────
        var successMsg = (isEdit ? "Marker Updated." : "Marker Added.") +
            "\nTarget: " + (useLayer
                ? "Layer \"" + targetLayer.name + "\""
                : "Composition \"" + comp.name + "\"") +
            "\nTime: " + secondsToTimecode(cti, fps) +
            "\nDuration: " + secondsToTimecode(dialogResult.durationSecs, fps) +
            (dialogResult.comment ? "\nComment: " + dialogResult.comment : "");

        // Non-blocking confirmation — just a quick alert.
        // Remove these 3 lines if you prefer silent success.
        // alert(successMsg, "MarkerPrep – Done");

    }

    // ── Run ──────────────────────────────────────────────────────
    main();

}());
