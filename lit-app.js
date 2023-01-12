import { html, css, LitElement } from 'lit';
import 'piano-keys-webcomponent-v0';
import { VirtualKeyboardController } from './reactive-controllers/virtualkeyboard.js';
import { VoxController} from './reactive-controllers/vox.js';
import { MidiController} from './reactive-controllers/midi.js';
import { InputsController } from './reactive-controllers/index.js';

class LitApp extends LitElement {
    static get styles() { return css`
      :host {
        display: inline-block;
        width: 100%;
        height: 100%;
      } 
       
      * {
        display: flex;
        border-style: solid;
        border-width: 2px;
        border-color: black;
        margin: 5px;
        padding: 5px;
      }
    `}

    render() {
        return html`
            <dash-board></dash-board>
            <virtual-keyboard></virtual-keyboard>
            <micro-phone></micro-phone>
            <mi-di></mi-di>`;
    }
}

class Dashboard extends LitElement {
    static get styles() { return css`
      :host {
        flex-direction: column;
      }`;
    }

    constructor() {
        super();
        this.virtualkeyboard = new VirtualKeyboardController(this);
        this.vox = new VoxController(this);
        this.midi = new MidiController(this);
        this.all = new InputsController(this);
    }

    render() {
        return html`
            <h1>All Inputs</h1>
            <p>
                The current note is: ${this.all.notes.join(', ')}
            </p>
            <ul>
                <li>Microphone: ${this.vox.note}</li>
                <li>Midi: ${this.midi.notes.join(', ')}</li>
                <li>Virtual Keyboard: ${this.virtualkeyboard.notes.join(', ')}</li>
            </ul>`;
    }
}

class Microphone extends LitElement {
    static get styles() { return css`
      canvas {
        border-style: solid;
        border-color: #9a9a9a;
        border-width: 1px;
        margin-left: auto;
      }`;
    }

    constructor() {
        super();
        this.reactivecontroller = new VoxController(this);
    }

    render() {
        return html`
            <h2>Microphone</h2>
            <button @click=${() => {
                this.reactivecontroller.toggleMicrophone();
                const canvas = this.shadowRoot.querySelector('canvas');
                const ctx = canvas.getContext('2d');
                const viz = () => {
                    this.reactivecontroller.visualize(ctx, canvas.width, canvas.height);
                    requestAnimationFrame(() => {
                        viz();
                    });
                }
                viz();
            }}>Toggle Microphone</button>
            <ul>
                <li>Active: ${this.reactivecontroller.active}</li>
                <li>Note: ${this.reactivecontroller.note}</li>
            </ul>
            <canvas></canvas>`;
    }
}

class Midi extends LitElement {
    constructor() {
        super();
        this.reactivecontroller = new MidiController(this);
    }

    render() {
        return html`
            <h2>MIDI</h2>
            <button @click=${() => {
                this.reactivecontroller.refreshConnection();
            }}>Connect MIDI Device</button>
            <ul>
                <li>Active: ${this.reactivecontroller.inputs.length > 0}</li>
                <li>Note: ${this.reactivecontroller.notes.join(', ')}</li>
            </ul>`;
    }
}

class VirtualKeyboard extends LitElement {
    static get styles() { return css`
        piano-keys {
          display: inline-block;
          width: 100%;
          height: 100%;
        }`;
    }

    constructor() {
        super();
        this.reactivecontroller = new VirtualKeyboardController(this);
    }


    render() {
        return html`<piano-keys layout="C" keys=20 
                        @note-down=${(e) => this.reactivecontroller.onNoteDown(e.detail.note, e.detail.octave)}
                        @note-up=${(e) => this.reactivecontroller.onNoteUp(e.detail.note, e.detail.octave)}></piano-keys>`;
    }
}


customElements.define('lit-app', LitApp);
customElements.define('dash-board', Dashboard);
customElements.define('micro-phone', Microphone);
customElements.define('mi-di', Midi);
customElements.define('virtual-keyboard', VirtualKeyboard);