// Compose Page Controller
// KS synthesis playback, instrument presets, waveform visualization

document.addEventListener('DOMContentLoaded', () => {
    const editor = new PianoRollEditor('pianoRoll', {
        gridColor: '#2e3245',
        noteColor: '#7c5cfc',
        playheadColor: '#ff5c5c',
        backgroundColor: '#13151f',
        textColor: '#8b90a5',
        measures: 8,
        minPitch: 48,
        maxPitch: 72,
    });

    const bpmSlider = document.getElementById('bpmSlider');
    const bpmVal = document.getElementById('bpmVal');
    const decaySlider = document.getElementById('composeDecay');
    const decayVal = document.getElementById('composeDecayVal');
    const instrumentSelect = document.getElementById('instrumentSelect');
    const presetSelect = document.getElementById('presetSelect');
    const btnPlay = document.getElementById('btnPlay');
    const btnStop = document.getElementById('btnStop');
    const btnClear = document.getElementById('btnClear');
    const btnSave = document.getElementById('btnSave');
    const playbackIndicator = document.getElementById('playbackIndicator');

    // Waveform panel elements
    const waveformPanel = document.getElementById('waveformPanel');

    let currentPlayer = null;
    let isPlaying = false;
    let playheadAnimId = null;
    let audioStartTime = null; // Tone.now() at playback start

    bpmSlider.addEventListener('input', () => { bpmVal.textContent = bpmSlider.value; });
    decaySlider.addEventListener('input', () => { decayVal.textContent = parseFloat(decaySlider.value).toFixed(2); });

    // ---- Instrument Presets ----
    const instrumentPresets = {
        'guitar-classic': { pluckPosition: 0.8, stiffness: 0.01, bodyResonance: 0.6, brightness: 4000 },
        'guitar-acoustic': { pluckPosition: 0.7, stiffness: 0.02, bodyResonance: 0.7, brightness: 5000 },
        'harp': { pluckPosition: 0.5, stiffness: 0.005, bodyResonance: 0.3, brightness: 8000 },
        'bass': { pluckPosition: 0.9, stiffness: 0.03, bodyResonance: 0.8, brightness: 2000 },
        'banjo': { pluckPosition: 0.3, stiffness: 0.04, bodyResonance: 0.4, brightness: 6000 },
        'sitar': { pluckPosition: 0.15, stiffness: 0.06, bodyResonance: 0.5, brightness: 3000 },
    };

    function getInstrumentParams() {
        const val = instrumentSelect.value;
        if (val === 'basic') return null;
        return instrumentPresets[val] || null;
    }

    // ---- Waveform Visualization ----
    function showKSProcess(firstNote, decay, instrumentParams) {
        const freq = ksSynth.midiToFreq(firstNote.pitch);
        const N = Math.round(44100 / freq);

        // Stage 1: Initial noise
        const noise = ksSynth.generateNoise(N);
        const { ctx: ctx1, w: w1, h: h1 } = getCanvas('wfNoise');
        drawWaveform(ctx1, w1, h1, noise, '#7c5cfc', { dots: N < 150 });

        // Stage 2: After filtering (intermediate)
        const snapshots = ksSynth.filterMultiplePasses(noise, 10, decay);
        const { ctx: ctx2, w: w2, h: h2 } = getCanvas('wfFiltered');
        drawWaveform(ctx2, w2, h2, snapshots[5], '#ffc107', { dots: N < 150 });

        // Stage 3: Final signal
        const { ctx: ctx3, w: w3, h: h3 } = getCanvas('wfFinal');
        drawWaveform(ctx3, w3, h3, snapshots[10], '#00d4aa', { dots: N < 150 });
    }

    function showFinalMix(mixedBuffer) {
        const displayLen = 1200;
        const step = Math.max(1, Math.floor(mixedBuffer.length / displayLen));
        const display = new Float32Array(displayLen);
        for (let i = 0; i < displayLen; i++) display[i] = mixedBuffer[i * step] || 0;
        const { ctx, w, h } = getCanvas('wfMix');
        drawWaveform(ctx, w, h, display, '#00d4aa', { lineWidth: 1.5 });
    }

    function animateMixPlayhead(totalDuration) {
        const canvas = document.getElementById('wfMixPlayhead');
        const mixCanvas = document.getElementById('wfMix');
        canvas.width = mixCanvas.width;
        canvas.height = mixCanvas.height;
        canvas.style.width = mixCanvas.style.width || mixCanvas.offsetWidth + 'px';
        canvas.style.height = mixCanvas.style.height || mixCanvas.offsetHeight + 'px';
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.scale(dpr, dpr);

        function draw() {
            if (!isPlaying || audioStartTime === null) {
                ctx.clearRect(0, 0, w, h);
                return;
            }
            const elapsed = Tone.now() - audioStartTime;
            const progress = Math.min(1, Math.max(0, elapsed / totalDuration));
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = '#ff5c5c';
            ctx.lineWidth = 2;
            const x = progress * w;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();

            if (progress < 1) {
                playheadAnimId = requestAnimationFrame(draw);
            }
        }
        draw();
    }

    // ---- Play ----
    btnPlay.addEventListener('click', async () => {
        const notes = editor.notes;
        if (notes.length === 0) {
            alert(t('no_notes'));
            return;
        }

        const bpm = parseInt(bpmSlider.value);
        const decay = parseFloat(decaySlider.value);
        const secPerBeat = 60 / bpm;
        const instrumentParams = getInstrumentParams();

        // Stop any existing playback
        stopPlayback();

        // Ensure Tone.js is initialized before timing starts
        await ksSynth.init();

        // Synthesize mix using KS
        const { mixedBuffer, noteWaveforms } = ksSynth.synthesizeMix(notes, bpm, decay, instrumentParams);

        // Calculate timing based on audio buffer
        const bufferDuration = mixedBuffer.length / ksSynth.sampleRate;

        // Show waveform panel and force browser layout before drawing
        waveformPanel.style.display = '';
        waveformPanel.offsetHeight; // force reflow so canvases get dimensions
        showKSProcess(notes[0], decay, instrumentParams);
        showFinalMix(mixedBuffer);

        // Prepare audio player
        const toneBuffer = Tone.Buffer.fromArray(mixedBuffer);
        const player = new Tone.Player(toneBuffer).toDestination();

        isPlaying = true;
        playbackIndicator.classList.add('active');
        editor.isPlaying = true;
        editor.playhead = 0;

        // Start audio and capture Tone.js audio clock time (same clock as output)
        player.start();
        audioStartTime = Tone.now();
        currentPlayer = player;

        // Auto-dispose after playback
        setTimeout(() => { try { player.dispose(); } catch(e) {} }, bufferDuration * 1000 + 500);

        function animatePianoRollPlayhead() {
            if (!isPlaying) return;
            // Use Tone.now() — same clock as the audio output, always in sync
            const elapsed = Tone.now() - audioStartTime;
            editor.playhead = elapsed / secPerBeat;
            editor.render();
            if (elapsed < bufferDuration) {
                requestAnimationFrame(animatePianoRollPlayhead);
            } else {
                stopPlayback();
            }
        }
        requestAnimationFrame(animatePianoRollPlayhead);

        // Animate mix waveform playhead (uses same playStartTime)
        animateMixPlayhead(bufferDuration);
    });

    function stopPlayback() {
        isPlaying = false;
        audioStartTime = null;
        if (currentPlayer) {
            try { currentPlayer.stop(); } catch (e) {}
            currentPlayer = null;
        }
        ksSynth.stopAll();
        editor.isPlaying = false;
        editor.playhead = 0;
        editor.render();
        playbackIndicator.classList.remove('active');
        if (playheadAnimId) {
            cancelAnimationFrame(playheadAnimId);
            playheadAnimId = null;
        }
    }

    // ---- Stop ----
    btnStop.addEventListener('click', stopPlayback);

    // ---- Clear ----
    btnClear.addEventListener('click', () => {
        if (!confirm(t('confirm_clear'))) return;
        editor.notes = [];
        editor.render();
        waveformPanel.style.display = 'none';
    });

    // ---- Save ----
    btnSave.addEventListener('click', async () => {
        if (!api.isLoggedIn()) {
            alert('Please log in to save songs.');
            return;
        }
        const songData = {
            title: prompt('Song title:', 'Untitled Song') || 'Untitled Song',
            bpm: parseInt(bpmSlider.value),
            decay_factor: 0.996,
            data: { notes: editor.notes },
        };
        const result = await api.createSong(songData);
        if (result.ok) {
            alert(t('saved'));
        }
    });

    // ---- Song Presets ----
    const scalePreset = [
        { pitch: 60, startBeat: 0, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 1, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 2, duration: 1, velocity: 0.8 },
        { pitch: 65, startBeat: 3, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 4, duration: 1, velocity: 0.8 },
        { pitch: 69, startBeat: 5, duration: 1, velocity: 0.8 },
        { pitch: 71, startBeat: 6, duration: 1, velocity: 0.8 },
        { pitch: 72, startBeat: 7, duration: 1, velocity: 0.8 },
    ];

    const matlabNoteMap = {
        'DO': 60, 'RE': 62, 'MI': 64, 'FA': 65, 'SOL': 67, 'LA': 69, 'SI': 71,
        'DO2': 72, 'RE2': 74, 'MI2': 76, 'SOL2': 79, 'LA2': 81,
    };
    const matlabRaw = [
        'SOL','MI','MI','FA','RE','RE','DO','RE','MI','FA','SOL','SOL','SOL',
        'SOL','MI','MI','FA','RE','RE','DO','MI','SOL','SOL','MI','MI','MI',
        'RE','RE','MI','RE','DO','MI','SOL','SOL','MI','MI','FA','RE','RE',
        'DO','MI','SOL','SOL','MI','MI','MI','MI','FA','FA','FA','FA','FA',
        'MI','FA','SOL','SOL','MI','MI','FA','RE','RE','DO','RE','MI','FA',
        'SOL','SOL','SOL','SOL','MI','MI','FA','RE','RE','DO','MI','SOL',
        'SOL','MI','MI','MI','RE','RE','RE',
    ];
    const matlabPreset = matlabRaw.map((name, i) => ({
        pitch: matlabNoteMap[name] || 60,
        startBeat: i * 0.75,
        duration: 0.7,
        velocity: 0.8,
    }));

    // Ode to Joy (Beethoven) - C major, simplified
    const odeToJoyPreset = [
        // Line 1: E E F G | G F E D
        { pitch: 64, startBeat: 0, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 1, duration: 1, velocity: 0.8 },
        { pitch: 65, startBeat: 2, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 3, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 4, duration: 1, velocity: 0.8 },
        { pitch: 65, startBeat: 5, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 6, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 7, duration: 1, velocity: 0.8 },
        // Line 2: C C D E | E. D D
        { pitch: 60, startBeat: 8, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 9, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 10, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 11, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 12, duration: 1.5, velocity: 0.8 },
        { pitch: 62, startBeat: 13.5, duration: 0.5, velocity: 0.7 },
        { pitch: 62, startBeat: 14, duration: 2, velocity: 0.8 },
        // Line 3: E E F G | G F E D
        { pitch: 64, startBeat: 16, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 17, duration: 1, velocity: 0.8 },
        { pitch: 65, startBeat: 18, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 19, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 20, duration: 1, velocity: 0.8 },
        { pitch: 65, startBeat: 21, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 22, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 23, duration: 1, velocity: 0.8 },
        // Line 4: C C D E | D. C C
        { pitch: 60, startBeat: 24, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 25, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 26, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 27, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 28, duration: 1.5, velocity: 0.8 },
        { pitch: 60, startBeat: 29.5, duration: 0.5, velocity: 0.7 },
        { pitch: 60, startBeat: 30, duration: 2, velocity: 0.8 },
    ];

    // Twinkle Twinkle Little Star - C major
    const twinklePreset = [
        // C C G G | A A G-
        { pitch: 60, startBeat: 0, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 1, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 2, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 3, duration: 1, velocity: 0.8 },
        { pitch: 69, startBeat: 4, duration: 1, velocity: 0.8 },
        { pitch: 69, startBeat: 5, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 6, duration: 2, velocity: 0.8 },
        // F F E E | D D C-
        { pitch: 65, startBeat: 8, duration: 1, velocity: 0.8 },
        { pitch: 65, startBeat: 9, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 10, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 11, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 12, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 13, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 14, duration: 2, velocity: 0.8 },
        // G G F F | E E D-
        { pitch: 67, startBeat: 16, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 17, duration: 1, velocity: 0.8 },
        { pitch: 65, startBeat: 18, duration: 1, velocity: 0.8 },
        { pitch: 65, startBeat: 19, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 20, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 21, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 22, duration: 2, velocity: 0.8 },
        // C C G G | A A G-
        { pitch: 60, startBeat: 24, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 25, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 26, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 27, duration: 1, velocity: 0.8 },
        { pitch: 69, startBeat: 28, duration: 1, velocity: 0.8 },
        { pitch: 69, startBeat: 29, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 30, duration: 2, velocity: 0.8 },
    ];

    // Canon in D (simplified melody) - D major, transposed to fit range
    const canonPreset = [
        // D F# A G | F# D F# A
        { pitch: 62, startBeat: 0, duration: 1, velocity: 0.8 },
        { pitch: 66, startBeat: 1, duration: 1, velocity: 0.8 },
        { pitch: 69, startBeat: 2, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 3, duration: 1, velocity: 0.8 },
        { pitch: 66, startBeat: 4, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 5, duration: 1, velocity: 0.8 },
        { pitch: 66, startBeat: 6, duration: 1, velocity: 0.8 },
        { pitch: 69, startBeat: 7, duration: 1, velocity: 0.8 },
        // Bass: D A B F#
        { pitch: 50, startBeat: 0, duration: 2, velocity: 0.6 },
        { pitch: 57, startBeat: 2, duration: 2, velocity: 0.6 },
        { pitch: 59, startBeat: 4, duration: 2, velocity: 0.6 },
        { pitch: 54, startBeat: 6, duration: 2, velocity: 0.6 },
        // Melody continues: G F# E D | E F# G A
        { pitch: 67, startBeat: 8, duration: 1, velocity: 0.8 },
        { pitch: 66, startBeat: 9, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 10, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 11, duration: 1, velocity: 0.8 },
        { pitch: 64, startBeat: 12, duration: 1, velocity: 0.8 },
        { pitch: 66, startBeat: 13, duration: 1, velocity: 0.8 },
        { pitch: 67, startBeat: 14, duration: 1, velocity: 0.8 },
        { pitch: 69, startBeat: 15, duration: 1, velocity: 0.8 },
        // Bass: G D G A
        { pitch: 55, startBeat: 8, duration: 2, velocity: 0.6 },
        { pitch: 50, startBeat: 10, duration: 2, velocity: 0.6 },
        { pitch: 55, startBeat: 12, duration: 2, velocity: 0.6 },
        { pitch: 57, startBeat: 14, duration: 2, velocity: 0.6 },
        // Final phrase: D F# A D(high)
        { pitch: 62, startBeat: 16, duration: 2, velocity: 0.8 },
        { pitch: 66, startBeat: 18, duration: 2, velocity: 0.8 },
        { pitch: 69, startBeat: 20, duration: 2, velocity: 0.8 },
        { pitch: 74, startBeat: 22, duration: 2, velocity: 0.9 },
        { pitch: 50, startBeat: 16, duration: 4, velocity: 0.6 },
        { pitch: 54, startBeat: 20, duration: 4, velocity: 0.6 },
    ];

    // Happy Birthday - C major
    const happyBirthdayPreset = [
        // G G A G | C B
        { pitch: 55, startBeat: 0, duration: 0.75, velocity: 0.7 },
        { pitch: 55, startBeat: 0.75, duration: 0.25, velocity: 0.7 },
        { pitch: 57, startBeat: 1, duration: 1, velocity: 0.8 },
        { pitch: 55, startBeat: 2, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 3, duration: 1, velocity: 0.8 },
        { pitch: 59, startBeat: 4, duration: 2, velocity: 0.8 },
        // G G A G | D C
        { pitch: 55, startBeat: 6, duration: 0.75, velocity: 0.7 },
        { pitch: 55, startBeat: 6.75, duration: 0.25, velocity: 0.7 },
        { pitch: 57, startBeat: 7, duration: 1, velocity: 0.8 },
        { pitch: 55, startBeat: 8, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 9, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 10, duration: 2, velocity: 0.8 },
        // G G G(high) E | C B A
        { pitch: 55, startBeat: 12, duration: 0.75, velocity: 0.7 },
        { pitch: 55, startBeat: 12.75, duration: 0.25, velocity: 0.7 },
        { pitch: 67, startBeat: 13, duration: 1, velocity: 0.9 },
        { pitch: 64, startBeat: 14, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 15, duration: 1, velocity: 0.8 },
        { pitch: 59, startBeat: 16, duration: 1, velocity: 0.8 },
        { pitch: 57, startBeat: 17, duration: 1, velocity: 0.8 },
        // F F E C | D C
        { pitch: 65, startBeat: 18, duration: 0.75, velocity: 0.8 },
        { pitch: 65, startBeat: 18.75, duration: 0.25, velocity: 0.8 },
        { pitch: 64, startBeat: 19, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 20, duration: 1, velocity: 0.8 },
        { pitch: 62, startBeat: 21, duration: 1, velocity: 0.8 },
        { pitch: 60, startBeat: 22, duration: 2, velocity: 0.9 },
    ];

    // Für Elise (opening motif) - A minor
    const furElisePreset = [
        // E5 D#5 E5 D#5 E5 B4 D5 C5 A4
        { pitch: 76, startBeat: 0, duration: 0.5, velocity: 0.7 },
        { pitch: 75, startBeat: 0.5, duration: 0.5, velocity: 0.7 },
        { pitch: 76, startBeat: 1, duration: 0.5, velocity: 0.7 },
        { pitch: 75, startBeat: 1.5, duration: 0.5, velocity: 0.7 },
        { pitch: 76, startBeat: 2, duration: 0.5, velocity: 0.7 },
        { pitch: 71, startBeat: 2.5, duration: 0.5, velocity: 0.8 },
        { pitch: 74, startBeat: 3, duration: 0.5, velocity: 0.8 },
        { pitch: 72, startBeat: 3.5, duration: 0.5, velocity: 0.8 },
        { pitch: 69, startBeat: 4, duration: 1, velocity: 0.8 },
        // C4 E4 A4 B4
        { pitch: 60, startBeat: 5, duration: 0.5, velocity: 0.6 },
        { pitch: 64, startBeat: 5.5, duration: 0.5, velocity: 0.7 },
        { pitch: 69, startBeat: 6, duration: 0.5, velocity: 0.8 },
        { pitch: 71, startBeat: 6.5, duration: 1, velocity: 0.8 },
        // E4 G#4 B4 C5
        { pitch: 64, startBeat: 7.5, duration: 0.5, velocity: 0.6 },
        { pitch: 68, startBeat: 8, duration: 0.5, velocity: 0.7 },
        { pitch: 71, startBeat: 8.5, duration: 0.5, velocity: 0.8 },
        { pitch: 72, startBeat: 9, duration: 1, velocity: 0.8 },
        // E5 D#5 E5 D#5 E5 B4 D5 C5 A4 (repeat)
        { pitch: 76, startBeat: 10, duration: 0.5, velocity: 0.7 },
        { pitch: 75, startBeat: 10.5, duration: 0.5, velocity: 0.7 },
        { pitch: 76, startBeat: 11, duration: 0.5, velocity: 0.7 },
        { pitch: 75, startBeat: 11.5, duration: 0.5, velocity: 0.7 },
        { pitch: 76, startBeat: 12, duration: 0.5, velocity: 0.7 },
        { pitch: 71, startBeat: 12.5, duration: 0.5, velocity: 0.8 },
        { pitch: 74, startBeat: 13, duration: 0.5, velocity: 0.8 },
        { pitch: 72, startBeat: 13.5, duration: 0.5, velocity: 0.8 },
        { pitch: 69, startBeat: 14, duration: 1, velocity: 0.8 },
        // C4 E4 A4 B4 | A4 rest
        { pitch: 60, startBeat: 15, duration: 0.5, velocity: 0.6 },
        { pitch: 64, startBeat: 15.5, duration: 0.5, velocity: 0.7 },
        { pitch: 69, startBeat: 16, duration: 0.5, velocity: 0.8 },
        { pitch: 71, startBeat: 16.5, duration: 0.5, velocity: 0.8 },
        { pitch: 69, startBeat: 17, duration: 2, velocity: 0.9 },
    ];

    const localPresets = {
        scale: scalePreset,
        matlab: matlabPreset,
        'ode-to-joy': odeToJoyPreset,
        twinkle: twinklePreset,
        canon: canonPreset,
        'happy-birthday': happyBirthdayPreset,
        'fur-elise': furElisePreset,
    };

    // API preset name mapping
    const apiPresetMap = {
        scale: 'C Major Scale',
        matlab: 'MATLAB Demo Song',
    };

    // Store API presets when loaded
    let apiPresets = null;

    async function loadPresetsFromAPI() {
        try {
            const presets = await api.getPresets();
            if (Array.isArray(presets) && presets.length > 0) {
                apiPresets = {};
                presets.forEach(p => {
                    apiPresets[p.title] = p.data.notes || [];
                });
            }
        } catch (e) {
            // API unavailable, use hardcoded fallback
        }
    }
    loadPresetsFromAPI();

    presetSelect.addEventListener('change', () => {
        const val = presetSelect.value;
        if (!val) return;
        let notes = null;

        // Try API first for mapped presets
        if (apiPresets && apiPresetMap[val]) {
            notes = apiPresets[apiPresetMap[val]];
        }

        // Fallback to local presets
        if (!notes && localPresets[val]) {
            notes = localPresets[val];
        }

        if (notes) {
            editor.notes = JSON.parse(JSON.stringify(notes));
            editor.render();
        }
    });
});
