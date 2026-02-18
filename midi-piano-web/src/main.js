import * as Tone from 'tone';

console.log("Main.js started");

// --- Configuration ---
const START_NOTE = 48;
const NUM_KEYS = 37;

// --- State ---
const state = {
    activeNotes: new Set(),
    physicalKeys: new Set(),
    pedalDown: false,
    invertPedal: false,
    isAudioStarted: false,
    isLoaded: false
};

// ... (loader/Tone setup unchanged) ...

// --- DOM Elements ---
const pianoContainer = document.getElementById('piano');
const statusText = document.getElementById('status-text');
const midiIndicator = document.getElementById('midi-indicator');
const pedalIndicator = document.getElementById('pedal-indicator');
const loader = document.getElementById('loader');
const invertPedalCheckbox = document.getElementById('invert-pedal');

if (invertPedalCheckbox) {
    invertPedalCheckbox.addEventListener('change', (e) => {
        state.invertPedal = e.target.checked;
        // Reset pedal state when toggling to avoid stuck notes
        setPedal(false);
    });
}

// ... (Audio/Visual functions unchanged) ...

function getMIDIMessage(message) {
    if (!state.isLoaded) return;

    const command = message.data[0];
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;

    const cmdType = command & 0xf0;

    switch (cmdType) {
        case 144: // Note On
            if (velocity > 0) {
                triggerNoteOn(note, velocity / 127);
            } else {
                triggerNoteOff(note);
            }
            break;
        case 128: // Note Off
            triggerNoteOff(note);
            break;
        case 176: // Control Change
            if (note === 64) {
                let isPedalPressed = velocity > 64;
                if (state.invertPedal) {
                    isPedalPressed = !isPedalPressed;
                }
                setPedal(isPedalPressed);
            }
            break;
    }
}

// --- DOM Elements ---
// (Removed duplicate DOM elements)

// --- Audio Setup ---
// Optimize for lowest possible latency (Safe Mode)
Tone.context.lookAhead = 0;
// Tone.context.latencyHint = 'interactive'; // Read-only property, removed to prevent crash

// Salamander Grand Piano Samples - Local
const sampler = new Tone.Sampler({
    urls: {
        "A0": "A0.mp3",
        "C1": "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        "A1": "A1.mp3",
        "C2": "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        "A2": "A2.mp3",
        "C3": "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        "A3": "A3.mp3",
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
        "C5": "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        "A5": "A5.mp3",
        "C6": "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        "A6": "A6.mp3",
        "C7": "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        "A7": "A7.mp3",
        "C8": "C8.mp3"
    },
    release: 1,
    baseUrl: "./samples/",
    onload: () => {
        state.isLoaded = true;
        statusText.textContent = "Piano Loaded. Click anywhere to start.";
        if (loader) loader.classList.add('hidden');
        pianoContainer.classList.remove('disabled');
    }
}).toDestination();

// Apply a little reverb for "concert hall" feel
const reverb = new Tone.Reverb({
    decay: 3.5,
    preDelay: 0,
    wet: 0.3
}).toDestination();
sampler.connect(reverb);

// --- Initialization ---
function init() {
    console.log("Init called");
    generatePianoKeys();
    setupInteractions();
    setupMIDI();

    // Update UI for disabling before load
    pianoContainer.classList.add('disabled');
    statusText.textContent = "Loading High-Quality Piano Samples...";
}

function generatePianoKeys() {
    pianoContainer.innerHTML = '';

    let currentWhiteKeyIndex = 0;

    for (let i = 0; i < NUM_KEYS; i++) {
        const midiNote = START_NOTE + i;
        const freq = Tone.Frequency(midiNote, "midi");
        const noteName = freq.toNote();
        const isSharp = noteName.includes('#');

        const key = document.createElement('div');
        key.classList.add('key');
        key.dataset.note = midiNote;
        key.id = `key-${midiNote}`;

        if (isSharp) {
            key.classList.add('black');
            const leftPos = (currentWhiteKeyIndex * 42) - 12;
            key.style.left = `${leftPos}px`;
        } else {
            key.classList.add('white');
            currentWhiteKeyIndex++;
        }

        key.addEventListener('mousedown', () => triggerNoteOn(midiNote));
        key.addEventListener('mouseup', () => triggerNoteOff(midiNote));
        key.addEventListener('mouseleave', () => triggerNoteOff(midiNote));

        pianoContainer.appendChild(key);
    }

    pianoContainer.style.width = `${currentWhiteKeyIndex * 42}px`;
}

// --- Audio Engine Logic ---

async function startAudioParams() {
    if (!state.isAudioStarted && state.isLoaded) {
        await Tone.start();
        state.isAudioStarted = true;
        statusText.textContent = "Audio Engine Active. Play!";
        statusText.style.color = "#bb86fc"; // Primary color
    }
}

function triggerNoteOn(midiNote, velocity = 0.8) {
    if (!state.isLoaded) return;
    startAudioParams();

    if (state.physicalKeys.has(midiNote)) return;

    state.physicalKeys.add(midiNote);
    state.activeNotes.add(midiNote);

    const freq = Tone.Frequency(midiNote, "midi");
    // Tone.Sampler handles velocity mapping to volume nicely
    sampler.triggerAttack(freq, Tone.now(), velocity);

    visualNoteOn(midiNote);
}

function triggerNoteOff(midiNote) {
    if (!state.physicalKeys.has(midiNote)) return;

    state.physicalKeys.delete(midiNote);
    visualNoteOff(midiNote);

    if (!state.pedalDown) {
        const freq = Tone.Frequency(midiNote, "midi");
        sampler.triggerRelease(freq);
        state.activeNotes.delete(midiNote);
    }
}

function setPedal(isDown) {
    state.pedalDown = isDown;

    if (isDown) {
        pedalIndicator.classList.add('active');
    } else {
        pedalIndicator.classList.remove('active');
        state.activeNotes.forEach(note => {
            if (!state.physicalKeys.has(note)) {
                const freq = Tone.Frequency(note, "midi");
                sampler.triggerRelease(freq);
                state.activeNotes.delete(note);
            }
        });
    }
}

// --- Visual Logic ---
function visualNoteOn(midiNote) {
    const key = document.getElementById(`key-${midiNote}`);
    if (key) key.classList.add('active');
}

function visualNoteOff(midiNote) {
    const key = document.getElementById(`key-${midiNote}`);
    if (key) key.classList.remove('active');
}

// --- Setup Interactions ---
function setupInteractions() {
    document.body.addEventListener('click', startAudioParams);
}

// --- MIDI Setup ---
function setupMIDI() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        statusText.textContent = "Web MIDI API not supported.";
    }
}

function onMIDISuccess(midiAccess) {
    midiIndicator.textContent = "MIDI Ready";
    midiIndicator.classList.add('connected');

    const inputs = midiAccess.inputs.values();
    for (let input of inputs) {
        input.onmidimessage = getMIDIMessage;
    }

    midiAccess.onstatechange = function (e) {
        console.log("MIDI State Change", e);
    };
}


function getMIDIMessage(message) {
    if (!state.isLoaded) return;

    const command = message.data[0];
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;

    const cmdType = command & 0xf0;

    switch (cmdType) {
        case 144: // Note On
            if (velocity > 0) {
                triggerNoteOn(note, velocity / 127);
            } else {
                triggerNoteOff(note);
            }
            break;
        case 128: // Note Off
            triggerNoteOff(note);
            break;
        case 176: // Control Change
            if (note === 64) {
                let isPedalPressed = velocity > 64;
                if (state.invertPedal) {
                    isPedalPressed = !isPedalPressed;
                }
                setPedal(isPedalPressed);
            }
            break;
    }
}


init();
