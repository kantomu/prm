import * as Tone from 'tone';

// --- Configuration ---
const START_NOTE = 36; // C2 (Lower range for 49 keys or 61 keys?) Let's do 61 keys (C2 to C7) for "Classic" feel.
const NUM_KEYS = 61;   // 61 keys is a good balance for web.

// --- State ---
const state = {
    activeNotes: new Set(),
    physicalKeys: new Set(),
    pedalDown: false,
    invertPedal: false,
    currentInstrument: 'grand', // 'grand' or 'ep'
    isAudioStarted: false,
    isLoaded: false
};

// --- DOM Elements ---
const pianoContainer = document.getElementById('piano');
const statusText = document.getElementById('status-text');
const statusLed = document.getElementById('status-led');
const loader = document.getElementById('loader');
const midiLight = document.getElementById('midi-light');
const pedalLight = document.getElementById('pedal-light');

const instrumentToggle = document.getElementById('instrument-toggle');
const pedalInvertToggle = document.getElementById('pedal-invert-toggle');

// --- Audio Setup ---
// 1. Zero Latency Configuration
Tone.context.lookAhead = 0;
// Note: latencyHint 'interactive' can cause instability on some systems, so relying on lookAhead=0.

// 2. Instruments
const instruments = {
    grand: null,
    ep: null
};

// Grand Piano (Salamander)
instruments.grand = new Tone.Sampler({
    urls: {
        "A0": "A0.mp3", "C1": "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
        "A1": "A1.mp3", "C2": "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
        "A2": "A2.mp3", "C3": "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
        "A3": "A3.mp3", "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
        "A4": "A4.mp3", "C5": "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
        "A5": "A5.mp3", "C6": "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
        "A6": "A6.mp3", "C7": "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
        "A7": "A7.mp3", "C8": "C8.mp3"
    },
    release: 1,
    baseUrl: "./samples/grand/",
    onload: onSamplesLoaded
}).toDestination();

// Electric Piano (Authentic Rhodes Mark I 1977)
// Samples from jlearman.jRhodes3c (Stereo FLAC)
// Dyno-My-Rhodes "Belly" sound.

const epSampler = new Tone.Sampler({
    urls: {
        "F1": "As_029__F1_1109-stereo.flac",
        "B1": "As_035__B1_1111-stereo.flac",
        "E2": "As_040__E2_1113-stereo.flac",
        "A2": "As_045__A2_1115-stereo.flac",
        "D3": "As_050__D3_1117-stereo.flac",
        "G3": "As_055__G3_1119-stereo.flac",
        "B3": "As_059__B3_1121-stereo.flac",
        "D4": "As_062__D4_1123-stereo.flac",
        "F4": "As_065__F4_1125-stereo.flac",
        "B4": "As_071__B4_1127-stereo.flac",
        "E5": "As_076__E5_1129-stereo.flac",
        "A5": "As_081__A5_2101-stereo.flac",
        "D6": "As_086__D6_2103-stereo.flac",
        "G6": "As_091__G6_2105-stereo.flac",
        "C7": "As_096__C7_2107-stereo.flac"
    },
    release: 1,
    baseUrl: "./samples/ep/",
    onload: () => {
        console.log("EP Samples Loaded");
        // We could track individual loading, but global 'onSamplesLoaded' handles the Grand currently.
        // Ideally we wait for both. For now, since EP loads later or faster, it's fine.
    }
}); // Do not connect to destination yet, go through FX chain.

// Dyno-Style FX Chain for Samples
// Real Rhodes samples are often dark. We use EQ to brighten them ("Dyno").
// Chorus adds the "Dimension D" width.

const epEQ = new Tone.EQ3({
    low: 6,    // Warmth
    mid: -3,   // Scoop
    high: 8    // "Bell" presence
}).toDestination();

const epChorus = new Tone.Chorus({
    frequency: 1.5, // Slower chorus
    delayTime: 3.5,
    depth: 0.7,
    type: "sine",
    spread: 180
}).toDestination().start();

const epTremolo = new Tone.Tremolo({
    frequency: 6,  // Faster tremolo for that "shimmer"
    depth: 0.5,
    spread: 180
}).toDestination().start();

// Connect: Sampler -> EQ -> Chorus -> Tremolo
epSampler.chain(epEQ, epChorus, epTremolo);

instruments.ep = epSampler;


// Reverb (Global)
const reverb = new Tone.Reverb({
    decay: 2.5,
    preDelay: 0, // Critical for low latency
    wet: 0.2
}).toDestination();

instruments.grand.connect(reverb);
// EP is already connected effectively

function onSamplesLoaded() {
    state.isLoaded = true;
    loader.classList.add('hidden');
    statusText.innerText = "Ready. Click to enable audio.";
    statusLed.style.background = "orange"; // Standby
}

function getActiveInstrument() {
    return state.currentInstrument === 'grand' ? instruments.grand : instruments.ep;
}

// --- Logic ---

async function startAudio() {
    if (!state.isAudioStarted && state.isLoaded) {
        await Tone.start();
        state.isAudioStarted = true;
        statusText.innerText = "Audio Engine Active";
        statusLed.classList.add('ready');
        statusLed.style.background = ""; // Use CSS class color
    }
}

function triggerNoteOn(midiNote, velocity = 0.8) {
    if (!state.isLoaded) return;
    startAudio();

    if (state.physicalKeys.has(midiNote)) return;
    state.physicalKeys.add(midiNote);
    state.activeNotes.add(midiNote);

    const freq = Tone.Frequency(midiNote, "midi");
    const inst = getActiveInstrument();

    if (inst.triggerAttack) {
        inst.triggerAttack(freq, Tone.now(), velocity);
    } else {
        // PolySynth signature matches
        inst.triggerAttack(freq, Tone.now(), velocity);
    }

    visualNoteOn(midiNote);
}

function triggerNoteOff(midiNote) {
    if (!state.physicalKeys.has(midiNote)) return;
    state.physicalKeys.delete(midiNote);
    visualNoteOff(midiNote);

    if (!state.pedalDown) {
        const freq = Tone.Frequency(midiNote, "midi");
        const inst = getActiveInstrument();
        if (inst.triggerRelease) {
            inst.triggerRelease(freq, Tone.now()); // Immediate release
        }
        state.activeNotes.delete(midiNote);
    }
}

// --- Pedal Logic ---
function setPedal(isDown) {
    state.pedalDown = isDown;
    if (isDown) {
        pedalLight.classList.add('active');
    } else {
        pedalLight.classList.remove('active');
        // Release all notes that are no longer physically held
        state.activeNotes.forEach(note => {
            if (!state.physicalKeys.has(note)) {
                const freq = Tone.Frequency(note, "midi");
                const inst = getActiveInstrument();
                inst.triggerRelease(freq, Tone.now());
                state.activeNotes.delete(note);
            }
        });
    }
}

// --- MIDI ---
function setupMIDI() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, () => {
            statusText.innerText = "MIDI Failed";
        });
    }
}

function onMIDISuccess(midiAccess) {
    midiLight.classList.add('active'); // Show ready
    const inputs = midiAccess.inputs.values();
    for (let input of inputs) {
        input.onmidimessage = handleMIDIMessage;
    }
    midiAccess.onstatechange = (e) => console.log("MIDI State", e);
}

function handleMIDIMessage(msg) {
    // Zero latency processing
    const cmd = msg.data[0] & 0xf0;
    const note = msg.data[1];
    const velocity = (msg.data.length > 2) ? msg.data[2] : 0;

    switch (cmd) {
        case 144: // Note On
            if (velocity > 0) triggerNoteOn(note, velocity / 127);
            else triggerNoteOff(note);
            break;
        case 128: // Note Off
            triggerNoteOff(note);
            break;
        case 176: // CC
            if (note === 64) {
                let pressed = velocity > 64;
                if (state.invertPedal) pressed = !pressed;
                setPedal(pressed);
            }
            break;
    }
}

// --- UI / Interaction ---
function generateKeys() {
    pianoContainer.innerHTML = '';
    let whiteCount = 0;
    for (let i = 0; i < NUM_KEYS; i++) {
        const midi = START_NOTE + i;
        const note = Tone.Frequency(midi, "midi").toNote();
        const isBlack = note.includes('#');

        const k = document.createElement('div');
        k.className = `key ${isBlack ? 'black' : 'white'}`;
        k.id = `key-${midi}`;
        k.dataset.note = midi;

        // Position black keys
        if (isBlack) {
            // Calculate left based on previous white keys
            const left = (whiteCount * 48) - 14; // 48 is white key width, 14 is ~half black width
            k.style.left = `${left}px`;
        } else {
            whiteCount++;
        }

        k.onmousedown = () => triggerNoteOn(midi);
        k.onmouseup = () => triggerNoteOff(midi);
        k.onmouseleave = () => triggerNoteOff(midi);

        pianoContainer.appendChild(k);
    }
    pianoContainer.style.width = `${whiteCount * 48}px`;
}

function visualNoteOn(midi) {
    const k = document.getElementById(`key-${midi}`);
    if (k) k.classList.add('active');
}
function visualNoteOff(midi) {
    const k = document.getElementById(`key-${midi}`);
    if (k) k.classList.remove('active');
}

// --- Toggles ---
setupToggles();
function setupToggles() {
    // Instrument
    instrumentToggle.onchange = (e) => {
        state.currentInstrument = e.target.checked ? 'ep' : 'grand';
        // statusText.innerText = state.currentInstrument === 'grand' ? 'Grand Piano Selected' : 'Electric Piano Selected';
    };

    // Pedal Invert
    pedalInvertToggle.onchange = (e) => {
        state.invertPedal = e.target.checked;
        setPedal(false); // Reset
    };

    // Click to start
    document.body.onclick = startAudio;
}

// Init
generateKeys();
setupMIDI();
console.log("Classic Piano Initialized");
