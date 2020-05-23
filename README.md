# Run Custom Command

This is a GNOME Shell extension to execute user-defined
commands with <kbd>Alt</kbd>+<kbd>F2</kbd>.

## Setup

1. Copy this project in `~/.local/gnome-shell/extensions/runcustomcommand@kofuk.org`.
1. Define your command in `~/.gshell_command`. Example configuration is below.

```json
{
    "logout": {
        "type": "system",
        "command": "gnome-session-quit --logout --no-prompt"
    }
}
```

This allow you to logout by <kbd>Alt</kbd>+<kbd>F2</kbd>->"logout"-><kbd>Return</kbd>.

## TODO

- Support completion

## License

GNU General Public License version 3 or later. See [LICENSE](LICENSE) for license text.
