import * as Tone from 'tone';

export class Synth {
    static synth = new Tone.Synth().toDestination();

    static synthTimingDict = {};

    static metronomeLoaded = false;

    static metronomeTimerID = undefined;

    static metronomePlayer = new Tone.Player("./woodblock.wav").toDestination();

    static _BPM = 60;

    static _metronomeInterval = '4n';

    static _metronomeRunning = false;

    static _metronomeSilent = false;

    static listeners = [];

    static addListener(callback) {
        Synth.listeners.push(callback);
    }

    static removeListener(callback) {
        Synth.listeners.splice(Synth.listeners.indexOf(callback), 1);
    }

    static get now() {
        return Tone.now();
    }

    static set BPM(bpm) {
        Synth._BPM = bpm;
        Tone.Transport.bpm.value = Synth._BPM;
    }

    static get BPM() {
        return Synth._BPM;
    }

    static toggleMetronome() {
        if (Synth._metronomeRunning) {
            Synth.stopMetronome();
        } else {
            Synth.startMetronome();
        }
    }

    static stopMetronome() {
        Synth._metronomeRunning = false;
        Tone.Transport.stop();
        Tone.Transport.clear(Synth.metronomeTimerID);
    }

    static startMetronome() {
        if (Synth._metronomeRunning) {
            return;
        }
        Tone.start();
        Synth.metronomeTimerID = Tone.Transport.scheduleRepeat((time) => {
            if (!Synth._metronomeSilent) {
                Synth.metronomePlayer.start(time);
            }
            Synth.listeners.forEach(cb => cb({ type: 'tick' }));
        }, Synth._metronomeInterval);
        Tone.Transport.start();

        Synth._metronomeRunning = true;
    }

    static press(notation, octave) {
        const toneTime = Tone.now();
        Synth.synthTimingDict[notation + octave] = toneTime;
        Synth.synth.triggerAttack(`${notation}${octave}`, toneTime);
    }

    static release(notation, octave) {
        Synth.synth.triggerRelease(Synth.synthTimingDict[notation + octave] + .25);
        delete Synth.synthTimingDict[notation + octave];
    }

    static pressAndRelease(notation, octave, duration, time) {
        Synth.synth.triggerAttackRelease(notation + octave, duration, time);
    }
}

Tone.Transport.bpm.value = Synth._BPM;
Tone.Buffer.onload = function() {
    Synth.metronomeLoaded = true;
};