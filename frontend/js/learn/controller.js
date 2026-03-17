// Interactive demos for the Learn page
// Extracted from learn/index.html inline script
// getCanvas() and drawWaveform() are loaded from js/utils/waveform-draw.js

// Map frequency to note name
function freqToNote(freq) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const midi = Math.round(12 * Math.log2(freq / 440) + 69);
    const name = noteNames[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return name + octave;
}

// ========== DEMO: Sine Wave (Section 3a) ==========
function initSineDemo() {
    const slider = document.getElementById('sineFreq');
    const valSpan = document.getElementById('sineFreqVal');
    const btnPlay = document.getElementById('btnPlaySine');
    let animId = null;
    let phase = 0;

    function drawSineWave() {
        const freq = parseInt(slider.value);
        const { ctx, w, h } = getCanvas('sineCanvas');
        const points = 300;
        const data = new Float32Array(points);
        const cyclesShown = Math.max(1, freq / 110);
        for (let i = 0; i < points; i++) {
            const t = (i / points) * cyclesShown * Math.PI * 2;
            data[i] = Math.sin(t + phase);
        }
        drawWaveform(ctx, w, h, data, '#7c5cfc', { lineWidth: 2.5 });
        phase += 0.05;
        animId = requestAnimationFrame(drawSineWave);
    }

    slider.addEventListener('input', () => {
        valSpan.textContent = slider.value + ' Hz';
    });

    btnPlay.addEventListener('click', async () => {
        const freq = parseInt(slider.value);
        await ksSynth.playSine(freq, 1.5);
    });

    drawSineWave();
}

// ========== DEMO: Sampling Visualization (Section 3b) ==========
function initSamplingDemo() {
    const slider = document.getElementById('samplingRate');
    const valSpan = document.getElementById('samplingRateVal');
    const zoomSlider = document.getElementById('samplingZoom');
    const zoomVal = document.getElementById('samplingZoomVal');
    const cyclesLabels = { es: ['3 ciclos', '2 ciclos', '1 ciclo', '\u00bd ciclo', '\u00bc ciclo', '\u215b ciclo'], en: ['3 cycles', '2 cycles', '1 cycle', '\u00bd cycle', '\u00bc cycle', '\u215b cycle'] };
    const cyclesValues = [3, 2, 1, 0.5, 0.25, 0.125];

    function drawSampling() {
        const sampleRate = parseInt(slider.value);
        valSpan.textContent = sampleRate.toLocaleString() + ' Hz';
        const zoomIdx = parseInt(zoomSlider.value) - 1;
        const labels = cyclesLabels[currentLang] || cyclesLabels.es;
        zoomVal.textContent = labels[zoomIdx];
        const { ctx, w, h } = getCanvas('samplingCanvas');
        const freq = 220;
        const mid = h / 2;
        const amp = mid * 0.85;

        // Number of cycles based on zoom
        const timeWindow = cyclesValues[zoomIdx] / freq;
        const totalSamples = Math.floor(timeWindow * sampleRate);
        const dotRadius = totalSamples < 40 ? 5 : totalSamples < 100 ? 3.5 : 2;

        // Background
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let y = 0; y <= 4; y++) {
            ctx.beginPath();
            ctx.moveTo(0, h * y / 4);
            ctx.lineTo(w, h * y / 4);
            ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        ctx.moveTo(0, mid);
        ctx.lineTo(w, mid);
        ctx.stroke();

        // 1) Smooth continuous sine wave (the "real" analog signal)
        ctx.strokeStyle = 'rgba(124, 92, 252, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 600; i++) {
            const t = (i / 600) * timeWindow;
            const x = (i / 600) * w;
            const y = mid - Math.sin(2 * Math.PI * freq * t) * amp;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 2) Connect the sample dots with lines (the "digital" reconstruction)
        ctx.strokeStyle = '#ff9500';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= totalSamples; i++) {
            const t = i / sampleRate;
            const x = (t / timeWindow) * w;
            if (x > w) break;
            const y = mid - Math.sin(2 * Math.PI * freq * t) * amp;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 3) Vertical stems from zero line to each sample
        ctx.strokeStyle = 'rgba(255, 149, 0, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= totalSamples; i++) {
            const t = i / sampleRate;
            const x = (t / timeWindow) * w;
            if (x > w) break;
            const y = mid - Math.sin(2 * Math.PI * freq * t) * amp;
            ctx.beginPath();
            ctx.moveTo(x, mid);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // 4) Orange sample dots on top
        ctx.fillStyle = '#ff9500';
        for (let i = 0; i <= totalSamples; i++) {
            const t = i / sampleRate;
            const x = (t / timeWindow) * w;
            if (x > w) break;
            const y = mid - Math.sin(2 * Math.PI * freq * t) * amp;
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 5) Show sample count
        ctx.fillStyle = '#8b90a5';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(totalSamples + ' samples', w - 10, 15);
    }

    slider.addEventListener('input', drawSampling);
    zoomSlider.addEventListener('input', drawSampling);
    drawSampling();
}

// ========== DEMO: Noise Burst (Section 2) ==========
let noiseData = null;

function initNoiseDemo() {
    const slider = document.getElementById('noiseSamples');
    const valSpan = document.getElementById('noiseSamplesVal');
    const durSlider = document.getElementById('noiseDuration');
    const durSpan = document.getElementById('noiseDurationVal');
    const btnGen = document.getElementById('btnGenNoise');
    const btnListen = document.getElementById('btnListenNoise');

    function generateAndDraw() {
        const N = parseInt(slider.value);
        valSpan.textContent = N;
        noiseData = ksSynth.generateNoise(N);
        const { ctx, w, h } = getCanvas('noiseCanvas');
        drawWaveform(ctx, w, h, noiseData, '#7c5cfc', { dots: N < 150 });
    }

    slider.addEventListener('input', () => { valSpan.textContent = slider.value; });
    durSlider.addEventListener('input', () => { durSpan.textContent = parseFloat(durSlider.value).toFixed(1) + 's'; });

    btnGen.addEventListener('click', generateAndDraw);
    btnListen.addEventListener('click', async () => {
        if (!noiseData) generateAndDraw();
        const duration = parseFloat(durSlider.value);
        await ksSynth.playNoise(noiseData.length, duration);
    });

    generateAndDraw();
}

// ========== DEMO: Frequency (Section 3c) ==========
function initFreqDemo() {
    const slider = document.getElementById('freqSlider');
    const valSpan = document.getElementById('freqVal');
    const samplesSpan = document.getElementById('freqSamples');
    const noteSpan = document.getElementById('noteDisplay');
    const btnPlay = document.getElementById('btnPlayFreq');

    function updateDisplay() {
        const freq = parseInt(slider.value);
        valSpan.textContent = freq + ' Hz';
        const N = Math.round(44100 / freq);
        samplesSpan.textContent = N;
        noteSpan.textContent = freqToNote(freq);
        const noise = ksSynth.generateNoise(N);
        const snaps = ksSynth.filterMultiplePasses(noise, 8, 2.0);
        const { ctx, w, h } = getCanvas('freqCanvas');
        drawWaveform(ctx, w, h, snaps[snaps.length - 1], '#00d4aa', { lineWidth: 2 });
    }

    slider.addEventListener('input', updateDisplay);
    btnPlay.addEventListener('click', async () => {
        const freq = parseInt(slider.value);
        await ksSynth.playNote(freq, 2.0, 2.0);
    });

    updateDisplay();
}

// ========== DEMO: Filter Animation (Section 4b) ==========
let filterSnapshots = null;
let filterBaseNoise = null;
let filterAnimId = null;

function initFilterDemo() {
    const slider = document.getElementById('filterPasses');
    const valSpan = document.getElementById('filterPassVal');
    const btnAnimate = document.getElementById('btnAnimate');
    const btnReset = document.getElementById('btnResetFilter');
    const btnListen = document.getElementById('btnListenPass');

    function generateFilterData() {
        filterBaseNoise = ksSynth.generateNoise(100);
        filterSnapshots = ksSynth.filterMultiplePasses(filterBaseNoise, 60, 2.0);
    }

    function drawPass(passIdx) {
        const { ctx, w, h } = getCanvas('filterCanvas');
        const data = filterSnapshots[passIdx];
        const alpha = Math.min(1, passIdx / 15);
        const color = `hsl(${160 + passIdx * 2}, ${70 + alpha * 20}%, ${55 + alpha * 15}%)`;
        drawWaveform(ctx, w, h, data, color, { dots: true, lineWidth: 2 });
    }

    slider.addEventListener('input', () => {
        const p = parseInt(slider.value);
        valSpan.textContent = p;
        if (filterSnapshots) drawPass(p);
    });

    btnAnimate.addEventListener('click', () => {
        if (filterAnimId) { cancelAnimationFrame(filterAnimId); filterAnimId = null; }
        generateFilterData();
        slider.value = 0;
        valSpan.textContent = '0';
        let pass = 0;
        function step() {
            if (pass > 60) { filterAnimId = null; return; }
            slider.value = pass;
            valSpan.textContent = pass;
            drawPass(pass);
            pass++;
            filterAnimId = requestAnimationFrame(() => setTimeout(() => step(), 80));
        }
        step();
    });

    btnReset.addEventListener('click', () => {
        if (filterAnimId) { cancelAnimationFrame(filterAnimId); filterAnimId = null; }
        generateFilterData();
        slider.value = 0;
        valSpan.textContent = '0';
        drawPass(0);
    });

    btnListen.addEventListener('click', async () => {
        const p = parseInt(slider.value);
        if (filterSnapshots && filterSnapshots[p]) {
            await ksSynth.playSnapshot(filterSnapshots[p], 1.5);
        }
    });

    generateFilterData();
    drawPass(0);
}

// ========== DEMO: Ring Buffer Visualization (Section 4a) ==========
function initRingBufferDemo() {
    const btnPlay = document.getElementById('btnPlayRing');
    const btnStop = document.getElementById('btnStopRing');
    const speedSlider = document.getElementById('ringSpeed');
    const speedVal = document.getElementById('ringSpeedVal');
    let animId = null;
    let bufferIdx = 0;
    const bufferSize = 50;
    const buffer = ksSynth.generateNoise(bufferSize);

    function drawRingBuffer() {
        const { ctx, w, h } = getCanvas('ringBufferCanvas');
        ctx.clearRect(0, 0, w, h);
        const centerX = w / 2;
        const centerY = h / 2;
        const radius = Math.min(w, h) * 0.35;

        ctx.strokeStyle = 'rgba(124,92,252,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < bufferSize; i++) {
            const angle = (i / bufferSize) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            ctx.fillStyle = i === bufferIdx ? '#ff5c5c' : '#7c5cfc';
            ctx.beginPath();
            ctx.arc(x, y, i === bufferIdx ? 6 : 3, 0, Math.PI * 2);
            ctx.fill();
            const val = buffer[i];
            const barLen = val * 40;
            ctx.strokeStyle = i === bufferIdx ? '#ff5c5c' : 'rgba(124,92,252,0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + barLen * Math.cos(angle), y + barLen * Math.sin(angle));
            ctx.stroke();
        }

        ctx.fillStyle = '#ff5c5c';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Cabezal', centerX, centerY - 10);
        ctx.fillText(`Sample ${bufferIdx}`, centerX, centerY + 10);
    }

    speedSlider.addEventListener('input', () => { speedVal.textContent = speedSlider.value + 'x'; });

    btnPlay.addEventListener('click', () => {
        if (animId) return;
        const speed = parseInt(speedSlider.value);
        let frameCount = 0;
        function animate() {
            frameCount++;
            if (frameCount >= Math.max(1, 10 - speed)) {
                bufferIdx = (bufferIdx + 1) % bufferSize;
                drawRingBuffer();
                frameCount = 0;
            }
            animId = requestAnimationFrame(animate);
        }
        animate();
    });

    btnStop.addEventListener('click', () => {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
    });

    drawRingBuffer();
}

// ========== DEMO: Decay Comparison (Section 4c) ==========
function initDecayDemo() {
    const slider = document.getElementById('decaySlider');
    const valSpan = document.getElementById('decayVal');
    const btnPlay = document.getElementById('btnPlayDecay');

    function drawComparison(canvasId, decay) {
        const waveform = ksSynth.synthesize(220, 1.5, decay);
        const displayLen = 400;
        const step = Math.floor(waveform.length / displayLen);
        const display = new Float32Array(displayLen);
        for (let i = 0; i < displayLen; i++) display[i] = waveform[i * step] || 0;
        const { ctx, w, h } = getCanvas(canvasId);
        drawWaveform(ctx, w, h, display, '#ffc107', { lineWidth: 1.5 });
    }

    drawComparison('decayCanvas1', 2.00);
    drawComparison('decayCanvas2', 2.10);
    drawComparison('decayCanvas3', 2.20);

    function update() {
        const decay = parseFloat(slider.value);
        valSpan.textContent = decay.toFixed(2);
        const waveform = ksSynth.synthesize(220, 1.5, decay);
        const displayLen = 800;
        const step = Math.floor(waveform.length / displayLen);
        const display = new Float32Array(displayLen);
        for (let i = 0; i < displayLen; i++) display[i] = waveform[i * step] || 0;
        const { ctx, w, h } = getCanvas('decayCanvas');
        drawWaveform(ctx, w, h, display, '#ffc107', { lineWidth: 1.5 });
    }

    slider.addEventListener('input', update);
    btnPlay.addEventListener('click', async () => {
        const decay = parseFloat(slider.value);
        await ksSynth.playNote(220, 1.5, decay);
    });

    update();
}

// ========== DEMO: Spectrum Visualization (Section 5) ==========
function initSpectrumDemo() {
    const slider = document.getElementById('spectrumPasses');
    const valSpan = document.getElementById('spectrumPassesVal');
    const btnUpdate = document.getElementById('btnUpdateSpectrum');
    const baseNoise = ksSynth.generateNoise(200);

    function drawSpectrumDual() {
        const passes = parseInt(slider.value);
        valSpan.textContent = passes;
        const snapshots = ksSynth.filterMultiplePasses(baseNoise, passes, 2.0);
        const currentSnapshot = snapshots[passes];
        const { ctx, w, h } = getCanvas('spectrumCanvas');
        ctx.clearRect(0, 0, w, h);
        const halfH = h / 2;

        // Top half: waveform
        const waveColor = passes === 0 ? '#7c5cfc' : '#00d4aa';
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, halfH);
        ctx.clip();
        const step = w / (currentSnapshot.length - 1 || 1);
        const mid = halfH / 2;
        const amp = mid * 0.8;
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < currentSnapshot.length; i++) {
            const x = i * step;
            const y = mid - currentSnapshot[i] * amp;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Bottom half: spectrum
        const fft = ksSynth.computeFFT(currentSnapshot);
        const maxMag = Math.max(...fft) || 1;
        ctx.save();
        ctx.translate(0, halfH);
        ctx.fillStyle = passes === 0 ? 'rgba(124,92,252,0.6)' : 'rgba(0,212,170,0.6)';
        const barWidth = w / fft.length;
        for (let i = 0; i < fft.length * 0.4; i++) {
            const magnitude = fft[i] / maxMag;
            const barHeight = magnitude * halfH * 0.9;
            ctx.fillRect(i * barWidth, halfH - barHeight, barWidth * 0.8, barHeight);
        }
        ctx.restore();

        ctx.fillStyle = '#8b90a5';
        ctx.font = '11px Inter';
        ctx.fillText('Waveform', 10, 15);
        ctx.fillText('Spectrum', 10, halfH + 15);
    }

    slider.addEventListener('input', () => { valSpan.textContent = slider.value; });
    btnUpdate.addEventListener('click', drawSpectrumDual);
    drawSpectrumDual();
}

// ========== DEMO: Advanced Parameters (Section 6) ==========
function initAdvancedDemo() {
    const pluckPos = document.getElementById('pluckPos');
    const pluckPosVal = document.getElementById('pluckPosVal');
    const stiffness = document.getElementById('stiffness');
    const stiffnessVal = document.getElementById('stiffnessVal');
    const bodyRes = document.getElementById('bodyRes');
    const bodyResVal = document.getElementById('bodyResVal');
    const brightness = document.getElementById('brightness');
    const brightnessVal = document.getElementById('brightnessVal');
    const btnPlay = document.getElementById('btnPlayAdvanced');
    const btnReset = document.getElementById('btnResetParams');

    function updateLabels() {
        pluckPosVal.textContent = parseFloat(pluckPos.value).toFixed(2);
        stiffnessVal.textContent = parseFloat(stiffness.value).toFixed(3);
        bodyResVal.textContent = parseFloat(bodyRes.value).toFixed(1);
        brightnessVal.textContent = parseInt(brightness.value) + ' Hz';
    }

    function drawAdvanced() {
        const params = {
            freq: 220, duration: 2.0, decay: 2.005,
            pluckPosition: parseFloat(pluckPos.value),
            stiffness: parseFloat(stiffness.value),
            bodyResonance: parseFloat(bodyRes.value),
            brightness: parseInt(brightness.value)
        };
        const waveform = ksSynth.synthesizeAdvanced(params);
        const displayLen = 1000;
        const step = Math.max(1, Math.floor(waveform.length / displayLen));
        const display = new Float32Array(Math.min(displayLen, waveform.length));
        for (let i = 0; i < display.length; i++) display[i] = waveform[i * step] || 0;
        const { ctx, w, h } = getCanvas('advancedCanvas');
        drawWaveform(ctx, w, h, display, '#00d4aa', { lineWidth: 1.5 });
    }

    [pluckPos, stiffness, bodyRes, brightness].forEach(el => {
        el.addEventListener('input', () => { updateLabels(); drawAdvanced(); });
    });

    btnPlay.addEventListener('click', async () => {
        const params = {
            freq: 220, duration: 2.5, decay: 2.005,
            pluckPosition: parseFloat(pluckPos.value),
            stiffness: parseFloat(stiffness.value),
            bodyResonance: parseFloat(bodyRes.value),
            brightness: parseInt(brightness.value)
        };
        await ksSynth.playAdvanced(params);
    });

    btnReset.addEventListener('click', () => {
        pluckPos.value = 0.5;
        stiffness.value = 0;
        bodyRes.value = 0;
        brightness.value = 5000;
        updateLabels();
        drawAdvanced();
    });

    // A/B toggle buttons
    document.querySelectorAll('.ab-toggle button').forEach(btn => {
        btn.addEventListener('click', async function() {
            const parent = this.closest('.ab-toggle');
            const mode = this.getAttribute('data-mode');
            parent.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const card = this.closest('.param-card');
            const cardTitle = card.querySelector('h4').getAttribute('data-i18n');

            if (cardTitle.includes('pluck')) pluckPos.value = mode === 'A' ? 0.5 : 0.1;
            else if (cardTitle.includes('stiff')) stiffness.value = mode === 'A' ? 0 : 0.04;
            else if (cardTitle.includes('body')) bodyRes.value = mode === 'A' ? 0 : 0.7;
            else if (cardTitle.includes('bright')) brightness.value = mode === 'A' ? 2000 : 8000;

            updateLabels();
            drawAdvanced();

            const params = {
                freq: 220, duration: 1.5, decay: 2.005,
                pluckPosition: parseFloat(pluckPos.value),
                stiffness: parseFloat(stiffness.value),
                bodyResonance: parseFloat(bodyRes.value),
                brightness: parseInt(brightness.value)
            };
            await ksSynth.playAdvanced(params);
        });
    });

    updateLabels();
    drawAdvanced();
}

// ========== DEMO: Full Synthesis (Section 7) ==========
function initSynthDemo() {
    const freqSlider = document.getElementById('synthFreq');
    const decaySlider = document.getElementById('synthDecay');
    const durSlider = document.getElementById('synthDuration');
    const freqVal = document.getElementById('synthFreqVal');
    const decayVal = document.getElementById('synthDecayVal');
    const durVal = document.getElementById('synthDurVal');
    const btnPlay = document.getElementById('btnSynth');

    function updateLabels() {
        freqVal.textContent = freqSlider.value + ' Hz';
        decayVal.textContent = parseFloat(decaySlider.value).toFixed(2);
        durVal.textContent = parseFloat(durSlider.value).toFixed(1) + 's';
    }

    function drawSynthWaveform() {
        const freq = parseInt(freqSlider.value);
        const decay = parseFloat(decaySlider.value);
        const dur = parseFloat(durSlider.value);
        const waveform = ksSynth.synthesize(freq, dur, decay);
        const displayLen = 1000;
        const step = Math.max(1, Math.floor(waveform.length / displayLen));
        const display = new Float32Array(Math.min(displayLen, waveform.length));
        for (let i = 0; i < display.length; i++) display[i] = waveform[i * step] || 0;
        const { ctx, w, h } = getCanvas('synthCanvas');
        drawWaveform(ctx, w, h, display, '#00d4aa', { lineWidth: 1.5 });
    }

    freqSlider.addEventListener('input', () => { updateLabels(); drawSynthWaveform(); });
    decaySlider.addEventListener('input', () => { updateLabels(); drawSynthWaveform(); });
    durSlider.addEventListener('input', () => { updateLabels(); drawSynthWaveform(); });

    btnPlay.addEventListener('click', async () => {
        const freq = parseInt(freqSlider.value);
        const decay = parseFloat(decaySlider.value);
        const dur = parseFloat(durSlider.value);
        drawSynthWaveform();
        await ksSynth.playNote(freq, dur, decay);
    });

    // Preset cards
    const presets = {
        'guitar-classic': { freq: 220, decay: 2.005, duration: 4.0, pluckPosition: 0.8, stiffness: 0.01, bodyResonance: 0.6, brightness: 4000 },
        'guitar-acoustic': { freq: 330, decay: 2.01, duration: 3.0, pluckPosition: 0.7, stiffness: 0.02, bodyResonance: 0.7, brightness: 5000 },
        'harp': { freq: 660, decay: 2.03, duration: 2.5, pluckPosition: 0.5, stiffness: 0.005, bodyResonance: 0.3, brightness: 8000 },
        'bass': { freq: 82, decay: 2.003, duration: 5.0, pluckPosition: 0.9, stiffness: 0.03, bodyResonance: 0.8, brightness: 2000 },
        'banjo': { freq: 440, decay: 2.08, duration: 1.5, pluckPosition: 0.3, stiffness: 0.04, bodyResonance: 0.4, brightness: 6000 },
        'sitar': { freq: 196, decay: 2.01, duration: 4.0, pluckPosition: 0.15, stiffness: 0.06, bodyResonance: 0.5, brightness: 3000 }
    };

    document.querySelectorAll('.preset-card').forEach(card => {
        card.addEventListener('click', async () => {
            const presetName = card.getAttribute('data-preset');
            const preset = presets[presetName];
            if (!preset) return;
            freqSlider.value = preset.freq;
            decaySlider.value = preset.decay;
            durSlider.value = preset.duration;
            updateLabels();
            drawSynthWaveform();
            await ksSynth.playAdvanced(preset);
        });
    });

    updateLabels();
    drawSynthWaveform();
}

// Initialize all demos when page loads
document.addEventListener('DOMContentLoaded', () => {
    initSineDemo();
    initSamplingDemo();
    initNoiseDemo();
    initFreqDemo();
    initRingBufferDemo();
    initFilterDemo();
    initDecayDemo();
    initSpectrumDemo();
    initAdvancedDemo();
    initSynthDemo();
});
