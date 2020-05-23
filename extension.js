/* extension.js
 *
 * Allow you to execute commands you defined in "Run a Command" dialog in GNOME Shell
 * Copyright (C) 2020 Koki Fukuda
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/* exported init */

const { GLib } = imports.gi;
const Main = imports.ui.main;
const ByteArray = imports.byteArray;
const Util = imports.misc.util;
const RunDialog = imports.ui.runDialog;

class Extension {
    constructor() {
    }

    _customRun(input, inTerminal) {
        const customCommand = this._customCommands[input];
        if (customCommand) {
            if (customCommand['type'] && customCommand['type'] === 'system') {
                if (customCommand['command']) {
                    Util.trySpawnCommandLine(customCommand['command']);
                    return;
                } else {
                    log('command is not defined');
                }
            } else {
                log('unsupported type');
            }
        }

        this._orig_run(input, inTerminal);
    }

    enable() {
        if (Main.runDialog === null) {
            Main.runDialog = new RunDialog.RunDialog();
        }
        this._orig_run = Main.runDialog._run.bind(Main.runDialog);
        Main.runDialog._run = this._customRun.bind(this);

        this._customCommands = [];

        const homeDir = GLib.getenv('HOME');
        if (!homeDir) {
            return;
        }
        const rcFile = homeDir + '/.gshell_command';
        if (!GLib.file_test(rcFile, GLib.FileTest.EXISTS | GLib.FileTest.IS_REGULAR)) {
            return;
        }

        const file_content = GLib.file_get_contents(rcFile);
        /* make sure that the file was read properly. */
        if (!file_content[0]) {
            return;
        }

        let commands;
        try {
            commands = JSON.parse(ByteArray.toString(file_content[1]));
        } catch (e) {
            log(e);
            return;
        }

        if (commands) {
            this._customCommands = commands;
        }
        log("User-defined command loaded successfully!");
    }

    disable() {
        if (Main.runDialog !== null) {
            Main.runDialog._run = this._orig_run;
        }
    }
}

function init() {
    return new Extension();
}
