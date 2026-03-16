// Compose Page Controller
// Extracted from editor.html inline script + API integration

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
    const presetSelect = document.getElementById('presetSelect');
    const btnPlay = document.getElementById('btnPlay');
    const btnStop = document.getElementById('btnStop');
    const btnClear = document.getElementById('btnClear');
    const btnSave = document.getElementById('btnSave');

    let playbackHandle = null;

    bpmSlider.addEventListener('input', () => { bpmVal.textContent = bpmSlider.value; });
    decaySlider.addEventListener('input', () => { decayVal.textContent = parseFloat(decaySlider.value).toFixed(2); });

    function midiToNoteName(midi) {
        const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return names[midi % 12] + (Math.floor(midi / 12) - 1);
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

        const toneNotes = notes.map(n => ({
            time: n.startBeat * secPerBeat,
            note: midiToNoteName(n.pitch),
            duration: Math.max(0.1, n.duration * secPerBeat),
        }));

        toneNotes.sort((a, b) => a.time - b.time);

        if (playbackHandle) ksSynth.stopAll();
        playbackHandle = await ksSynth.scheduleNotes(toneNotes, bpm, decay);

        const totalBeats = editor.options.measures * editor.options.beatsPerMeasure;
        const totalTime = totalBeats * secPerBeat;
        editor.isPlaying = true;
        editor.playhead = 0;
        const startTime = performance.now();
        function animatePlayhead() {
            if (!editor.isPlaying) return;
            const elapsed = (performance.now() - startTime) / 1000;
            editor.playhead = elapsed / secPerBeat;
            editor.render();
            if (elapsed < totalTime) {
                requestAnimationFrame(animatePlayhead);
            } else {
                editor.isPlaying = false;
                editor.playhead = 0;
                editor.render();
            }
        }
        requestAnimationFrame(animatePlayhead);
    });

    // ---- Stop ----
    btnStop.addEventListener('click', () => {
        ksSynth.stopAll();
        editor.isPlaying = false;
        editor.playhead = 0;
        editor.render();
        playbackHandle = null;
    });

    // ---- Clear ----
    btnClear.addEventListener('click', () => {
        if (!confirm(t('confirm_clear'))) return;
        editor.notes = [];
        editor.render();
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

    // ---- Hardcoded Presets (fallback) ----
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

    // Store API presets when loaded
    let apiPresets = null;

    // Try to load presets from API
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
        let notes = null;

        if (apiPresets) {
            if (val === 'scale') notes = apiPresets['C Major Scale'];
            else if (val === 'matlab') notes = apiPresets['MATLAB Demo Song'];
        }

        // Fallback to hardcoded
        if (!notes) {
            if (val === 'scale') notes = scalePreset;
            else if (val === 'matlab') notes = matlabPreset;
        }

        if (notes) {
            editor.notes = JSON.parse(JSON.stringify(notes));
            editor.render();
        }
    });
});
