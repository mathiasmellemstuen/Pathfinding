var map = {};
var previous_start_point_dom_id = null;
var previous_end_point_dom_id = null;
var previous_path;
var previous_structured_recordings;
var play_resume_is_play = true;
var is_paused = false;
var speeds_values = [1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8];
var speeds_text = ["<sup>1</sup>&frasl;<sub>8</sub>", "<sup>1</sup>&frasl;<sub>4</sub>", "<sup>1</sup>&frasl;<sub>2</sub>", "1", "2", "4", "8"];
var mouseDown = 0;
var current_speed = 1;
var current_speed_index = 3;
var current_animation_show_index = 0;
function get_map_info() {
    fetch("api/map_info", { method: "GET" })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var width = parseInt(data.width);
        var height = parseInt(data.height);
        create_grid(width, height);
    });
}
function create_grid(width, height) {
    var container = document.getElementById("grid_container");
    container === null || container === void 0 ? void 0 : container.style.setProperty("--grid-rows", width.toString());
    container === null || container === void 0 ? void 0 : container.style.setProperty("--grid-cols", height.toString());
    for (var i = 0; i < width; i++) {
        var _loop_1 = function (j) {
            var cell = document.createElement("div");
            cell.className = "cell";
            cell.id = "\{\"x\":" + i + ",\"y\":" + j + "}";
            cell.onmouseover = function () {
                if (!(mouseDown > 0))
                    return;
                add_type_to_cell(cell.id, get_type_radio_choice());
            };
            cell.onmousedown = function () {
                add_type_to_cell(cell.id, get_type_radio_choice());
            };
            container === null || container === void 0 ? void 0 : container.appendChild(cell);
        };
        for (var j = 0; j < height; j++) {
            _loop_1(j);
        }
    }
}
function get_type_radio_choice() {
    var start_checked = document.getElementById("start").checked;
    var goal_checked = document.getElementById("goal").checked;
    var obstacle_checked = document.getElementById("obstacle").checked;
    return obstacle_checked ? 1 : start_checked ? 2 : goal_checked ? 3 : 0;
}
function add_type_to_cell(this_id, type) {
    var positions = JSON.parse(this_id);
    var container = document.getElementById(this_id);
    if (type == 1) {
        map[this_id] = 1;
        container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "#FFFFFE");
        map[JSON.stringify(positions)] = type;
    }
    else if (type == 2) {
        if (previous_start_point_dom_id != null) {
            delete map[previous_start_point_dom_id === null || previous_start_point_dom_id === void 0 ? void 0 : previous_start_point_dom_id.id];
            previous_start_point_dom_id === null || previous_start_point_dom_id === void 0 ? void 0 : previous_start_point_dom_id.style.setProperty("background-color", "#272936");
        }
        map[this_id] = 2;
        previous_start_point_dom_id = container;
        container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "green");
    }
    else if (type == 3) {
        if (previous_end_point_dom_id != null) {
            delete map[previous_end_point_dom_id === null || previous_end_point_dom_id === void 0 ? void 0 : previous_end_point_dom_id.id];
            previous_end_point_dom_id === null || previous_end_point_dom_id === void 0 ? void 0 : previous_end_point_dom_id.style.setProperty("background-color", "#272936");
        }
        map[this_id] = 3;
        previous_end_point_dom_id = container;
        container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "red");
    }
    else {
        remove_type_of_cell(this_id);
    }
}
function show_results_without_animation(path, structured_recordings) {
    var keys = Object.keys(structured_recordings);
    for (var i = keys.length - 1; i >= 0; i--) {
        for (var j = 0; j < structured_recordings[keys[i]].length; j++) {
            var container = document.getElementById(JSON.stringify(structured_recordings[keys[i]][j]));
            if ((container === null || container === void 0 ? void 0 : container.style.getPropertyValue("background-color")) == "" || (container === null || container === void 0 ? void 0 : container.style.getPropertyValue("background-color")) == "pink" || (container === null || container === void 0 ? void 0 : container.style.getPropertyValue("background-color")) == "rgb(39, 41, 54)") {
                if (j == 0) {
                    container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "darkmagenta");
                }
                else {
                    container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "pink");
                }
            }
        }
    }
    for (var i = path.length - 2; i >= 0; i--) {
        var container = document.getElementById(JSON.stringify(path[i]));
        container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "orange");
    }
}
function show_result(path, structured_recordings) {
    var keys = Object.keys(structured_recordings);
    var n = keys.length - 1;
    function recurse_running_show_result() {
        setTimeout(function () {
            if (!is_paused) {
                for (var i = 0; i < structured_recordings[keys[current_animation_show_index]].length; i++) {
                    var container = document.getElementById(JSON.stringify(structured_recordings[keys[current_animation_show_index]][i]));
                    if ((container === null || container === void 0 ? void 0 : container.style.getPropertyValue("background-color")) == "" || (container === null || container === void 0 ? void 0 : container.style.getPropertyValue("background-color")) == "pink" || (container === null || container === void 0 ? void 0 : container.style.getPropertyValue("background-color")) == "rgb(39, 41, 54)") {
                        if (i == 0) {
                            container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "darkmagenta");
                        }
                        else {
                            container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "pink");
                        }
                    }
                }
                if (current_animation_show_index != n) {
                    recurse_running_show_result();
                    current_animation_show_index++;
                }
                else {
                    show_path(path);
                }
            }
            else {
                recurse_running_show_result();
            }
        }, 10 / current_speed);
    }
    current_animation_show_index = 0;
    recurse_running_show_result();
}
function show_path(path) {
    function recurse_running_show_path() {
        setTimeout(function () {
            if (!is_paused) {
                var container = document.getElementById(JSON.stringify(path[current_animation_show_index]));
                container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "orange");
                if (current_animation_show_index != 1) {
                    current_animation_show_index--;
                    recurse_running_show_path();
                }
            }
            else {
                recurse_running_show_path();
            }
        }, 250 / current_speed);
    }
    current_animation_show_index = path.length - 2;
    recurse_running_show_path();
}
function clear_all(path, structured_recordings) {
    var _a;
    var all_cells = document.getElementsByClassName("cell");
    if (all_cells != undefined) {
        for (var i = 0; i < all_cells.length; i++) {
            var cell = all_cells[i];
            (_a = document.getElementById(cell.id)) === null || _a === void 0 ? void 0 : _a.style.setProperty("background-color", "");
        }
    }
}
function redraw_map() {
    for (var key in map) {
        if (map[key] != 0) {
            add_type_to_cell(key, map[key]);
        }
    }
}
function send() {
    var _a, _b;
    var full_data_str = "";
    for (var key in map) {
        var value = map[key];
        if (value == 0) {
            continue;
        }
        full_data_str += "x" + ((_a = JSON.parse(key)) === null || _a === void 0 ? void 0 : _a.x) + "y" + ((_b = JSON.parse(key)) === null || _b === void 0 ? void 0 : _b.y) + "t" + value;
    }
    var algorithm_str = document.getElementById("algorithm_select").value;
    fetch("api/find_path/" + algorithm_str + "/" + full_data_str, { method: "GET" })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var all_received_data = data;
        var structured_recordings = structure_received_recording(all_received_data.recording);
        previous_path = all_received_data.path;
        previous_structured_recordings = structured_recordings;
        show_result(all_received_data.path, structured_recordings);
    });
}
function structure_received_recording(data) {
    var structured_recordings = {};
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var value = data_1[_i];
        if (!structured_recordings[JSON.stringify(value.c)]) {
            structured_recordings[JSON.stringify(value.c)] = [];
        }
        structured_recordings[JSON.stringify(value.c)].push(value.n);
    }
    return structured_recordings;
}
function remove_type_of_cell(this_id) {
    var container = document.getElementById(this_id);
    container === null || container === void 0 ? void 0 : container.style.setProperty("background-color", "#272936");
}
window.addEventListener("load", function (event) {
    var _a, _b, _c, _d, _e, _f, _g;
    get_map_info();
    document.body.onmousedown = function () {
        mouseDown++;
    };
    document.body.onmouseup = function () {
        mouseDown--;
    };
    (_a = document.getElementById("send_button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        if (previous_path != undefined && previous_structured_recordings != undefined)
            current_animation_show_index = 0;
        clear_all(previous_path, previous_structured_recordings);
        redraw_map();
        send();
    });
    (_b = document.getElementById("revert_button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        if (previous_path != undefined && previous_structured_recordings != undefined)
            current_animation_show_index = 0;
        clear_all(previous_path, previous_structured_recordings);
        redraw_map();
    });
    (_c = document.getElementById("forward_button")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
        if (previous_path != undefined && previous_structured_recordings != undefined)
            show_results_without_animation(previous_path, previous_structured_recordings);
    });
    (_d = document.getElementById("resume_pause_button")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () {
        var _a;
        var element = (_a = document.getElementById("resume_pause_button")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("img")[0];
        if (play_resume_is_play) {
            play_resume_is_play = false;
            if (element != undefined)
                element.src = "resume.svg";
        }
        else {
            if (element != undefined)
                element.src = "pause.svg";
            play_resume_is_play = true;
        }
        is_paused = !play_resume_is_play;
    });
    (_e = document.getElementById("lower_speed_button")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", function () {
        if (current_speed_index == 0) {
            return;
        }
        current_speed_index--;
        var element = document.getElementById("speed_text");
        if (element != undefined) {
            var speed_str = speeds_text[current_speed_index];
            current_speed = speeds_values[current_speed_index];
            element.innerHTML = speed_str;
        }
    });
    (_f = document.getElementById("higher_speed_button")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", function () {
        if (current_speed_index == speeds_text.length - 1) {
            return;
        }
        current_speed_index++;
        var element = document.getElementById("speed_text");
        if (element != undefined) {
            var speed_str = speeds_text[current_speed_index];
            current_speed = speeds_values[current_speed_index];
            element.innerHTML = speed_str;
        }
    });
    (_g = document.getElementById("erase_button")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", function () {
        // Resetting and deleting everything
        if (window.confirm("Sure you want to reset everything?")) {
            clear_all(previous_path, previous_structured_recordings);
            map = {};
            previous_start_point_dom_id = null;
            previous_end_point_dom_id = null;
            previous_path = Array();
            previous_structured_recordings = {};
        }
    });
});
