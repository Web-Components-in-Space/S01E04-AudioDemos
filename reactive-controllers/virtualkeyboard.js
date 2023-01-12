import { Note } from '../note.js';
import { Synth } from './synth.js';

export class VirtualKeyboardController {
    static hosts = [];

    static noteListeners = [];

    static inputs = [];

    static notes = [];

    get notes() {
        return VirtualKeyboardController.notes;
    }

    constructor(host) {
        host.addController(this);
        VirtualKeyboardController.hosts.push(host);
    }

    addListener(callback) {
        VirtualKeyboardController.addListener(callback);
    }

    static addListener(callback) {
        VirtualKeyboardController.noteListeners.push(callback);
    }

    onNoteDown(notation, octave) {
        VirtualKeyboardController.onNoteDown(notation, octave);
    }

    static onNoteDown(notation, octave) {
        const indx = VirtualKeyboardController.notes.indexOf(notation + octave);
        if (indx === -1) {
            VirtualKeyboardController.notes.push(notation + octave);
            VirtualKeyboardController.notes = Note.sort(VirtualKeyboardController.notes);
            Synth.press(notation, octave);
            VirtualKeyboardController.noteListeners.forEach(cb => cb({ type: 'down', note: notation, octave }));
            VirtualKeyboardController.hosts.forEach(host => {
                host.requestUpdate();
            });
        }
    }

    onNoteUp(notation, octave) {
        VirtualKeyboardController.onNoteUp(notation, octave);
    }

    static onNoteUp(notation, octave) {
        const indx = VirtualKeyboardController.notes.indexOf(notation + octave);
        if (indx !== -1) {
            VirtualKeyboardController.notes.splice(indx, 1);
            VirtualKeyboardController.notes = Note.sort(VirtualKeyboardController.notes);
            Synth.release(notation, octave);
            VirtualKeyboardController.noteListeners.forEach(cb => cb({ type: 'up', note: notation, octave }));
            VirtualKeyboardController.hosts.forEach(host => {
                host.requestUpdate();
            });
        }
    }

    hostConnected() {
        VirtualKeyboardController.hosts.forEach(host => {
            host.requestUpdate();
        });
    }
}
