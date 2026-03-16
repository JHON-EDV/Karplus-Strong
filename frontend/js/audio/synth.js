// Karplus-Strong synthesis using Tone.js
// Provides both custom KS implementation and Tone.PluckSynth

class KSSynth {
    constructor() {
        this.isReady = false;
        this.sampleRate = 44100;
    }

    async init() {
        if (this.isReady) return;
        await Tone.start();
        this.isReady = true;
    }

    // ---- Pure Karplus-Strong in JS (for educational demos) ----

    /**
     * Generate a noise burst buffer: N random samples in [-1, 1]
     */
    generateNoise(N) {
        const buf = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            buf[i] = Math.random() * 2 - 1;  // unbiased [-1, +1]
        }
        return buf;
    }

    /**
     * Apply one pass of the averaging filter to a buffer (in-place).
     * Y[i] = (Y[i] + Y[i+1]) / decayFactor
     * Returns the buffer for chaining.
     */
    filterPass(buf, decayFactor = 2.0) {
        const N = buf.length;
        const out = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            out[i] = (buf[i] + buf[(i + 1) % N]) / decayFactor;
        }
        return out;
    }

    /**
     * Apply multiple filter passes, returning array of snapshots
     * for animation purposes.
     */
    filterMultiplePasses(noise, passes, decayFactor = 2.0) {
        const snapshots = [new Float32Array(noise)];
        let current = new Float32Array(noise);
        for (let p = 0; p < passes; p++) {
            current = this.filterPass(current, decayFactor);
            snapshots.push(new Float32Array(current));
        }
        return snapshots;
    }

    /**
     * Generate full KS waveform with given parameters.
     * Returns Float32Array of the complete waveform.
     */
    synthesize(freq, durationSec, decayFactor = 2.0) {
        const N = Math.round(this.sampleRate / freq);
        const totalSamples = Math.round(this.sampleRate * durationSec);
        const output = new Float32Array(totalSamples);

        // Fill initial noise
        const ring = this.generateNoise(N);

        // Copy ring buffer into output, applying filter
        let readIdx = 0;
        for (let i = 0; i < totalSamples; i++) {
            output[i] = ring[readIdx];

            // Apply KS filter: average with next sample
            const nextIdx = (readIdx + 1) % N;
            ring[readIdx] = (ring[readIdx] + ring[nextIdx]) / decayFactor;

            readIdx = (readIdx + 1) % N;
        }

        // Apply fade-out envelope (last 5%) to avoid clicks
        const fadeLen = Math.floor(totalSamples * 0.05);
        for (let i = 0; i < fadeLen; i++) {
            const gain = 1 - (i / fadeLen);
            output[totalSamples - 1 - i] *= gain * gain;  // quadratic fade
        }

        return output;
    }

    /**
     * Play a synthesized waveform through Tone.js
     */
    async playBuffer(waveform) {
        await this.init();
        const toneBuffer = Tone.Buffer.fromArray(waveform);
        const player = new Tone.Player(toneBuffer).toDestination();
        player.start();
        // Auto-dispose after playback
        setTimeout(() => player.dispose(), (waveform.length / this.sampleRate) * 1000 + 500);
    }

    /**
     * Play a note at given frequency, duration, decay
     */
    async playNote(freq, durationSec = 2.0, decayFactor = 2.0) {
        const waveform = this.synthesize(freq, durationSec, decayFactor);
        await this.playBuffer(waveform);
    }

    // ---- Tone.js PluckSynth (higher quality, for the compose editor) ----

    /**
     * Create a PluckSynth instance connected to destination.
     * Good for the piano roll where we need polyphony and scheduling.
     */
    createPluckSynth(options = {}) {
        const synth = new Tone.PluckSynth({
            attackNoise: options.attackNoise || 4,
            dampening: options.dampening || 3000,
            resonance: options.resonance || 0.97,
            release: options.release || 1.2,
        }).toDestination();
        return synth;
    }

    /**
     * Play a note using Tone.PluckSynth (for compose mode)
     */
    async playPluck(noteStr, duration = '4n') {
        await this.init();
        const synth = this.createPluckSynth();
        synth.triggerAttackRelease(noteStr, duration);
        setTimeout(() => synth.dispose(), 3000);
    }

    /**
     * Schedule a sequence of notes for playback.
     * notes: [{note: "C4", time: 0, duration: 0.5}, ...]
     * Returns the Tone.Part for control.
     */
    async scheduleNotes(notes, bpm = 120, decayFactor = 2.0) {
        await this.init();
        Tone.Transport.bpm.value = bpm;
        Tone.Transport.stop();
        Tone.Transport.position = 0;

        const synth = new Tone.PluckSynth({
            attackNoise: 4,
            dampening: 2500 + (decayFactor - 1.5) * 3000,
            resonance: Math.min(0.99, 0.85 + (1 / decayFactor) * 0.12),
            release: 1.5,
        }).toDestination();

        const part = new Tone.Part((time, value) => {
            synth.triggerAttackRelease(value.note, value.duration, time);
        }, notes.map(n => ({
            time: n.time,
            note: n.note,
            duration: n.duration || 0.4,
        })));

        part.start(0);
        Tone.Transport.start();

        return { part, synth, transport: Tone.Transport };
    }

    /**
     * Stop all playback
     */
    stopAll() {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }

    /**
     * Play raw noise burst through speakers (for demo)
     * Generates fresh random samples for true white noise "shhh" sound
     */
    async playNoise(N, durationSec = 0.8) {
        await this.init();
        const totalSamples = Math.round(this.sampleRate * durationSec);
        const extended = new Float32Array(totalSamples);
        // Generate fresh random samples (not looped) for true white noise
        for (let i = 0; i < totalSamples; i++) {
            extended[i] = (Math.random() * 2 - 1) * Math.exp(-3 * i / totalSamples);
        }
        await this.playBuffer(extended);
    }

    /**
     * Play a short buffer snapshot in a loop for educational demonstration
     * Used for hearing what N samples sound like when looped
     */
    async playSnapshot(buffer, durationSec = 1.5) {
        await this.init();
        const totalSamples = Math.round(this.sampleRate * durationSec);
        const extended = new Float32Array(totalSamples);
        const N = buffer.length;
        
        // Loop the buffer to fill duration
        for (let i = 0; i < totalSamples; i++) {
            extended[i] = buffer[i % N];
        }
        
        // Apply fade-out envelope
        const fadeLen = Math.floor(totalSamples * 0.1);
        for (let i = 0; i < fadeLen; i++) {
            const gain = 1 - (i / fadeLen);
            extended[totalSamples - 1 - i] *= gain * gain;
        }
        
        await this.playBuffer(extended);
    }

    /**
     * Compute FFT (Fast Fourier Transform) using Cooley-Tukey algorithm
     * Returns magnitude spectrum (positive frequencies only)
     * Input buffer is zero-padded to next power of 2
     */
    computeFFT(buffer) {
        // Find next power of 2
        let n = 1;
        while (n < buffer.length) n *= 2;
        n = Math.min(n, 8192); // Cap at 8192 for performance
        
        // Zero-pad input
        const real = new Float32Array(n);
        const imag = new Float32Array(n);
        for (let i = 0; i < Math.min(buffer.length, n); i++) {
            real[i] = buffer[i];
        }
        
        // Cooley-Tukey FFT (radix-2, decimation-in-time)
        this._fft(real, imag);
        
        // Compute magnitudes (only positive frequencies)
        const magnitudes = new Float32Array(n / 2);
        for (let i = 0; i < n / 2; i++) {
            magnitudes[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
        }
        
        return magnitudes;
    }

    /**
     * Internal FFT implementation (Cooley-Tukey, in-place)
     */
    _fft(real, imag) {
        const n = real.length;
        if (n <= 1) return;
        
        // Bit-reversal permutation
        let j = 0;
        for (let i = 0; i < n - 1; i++) {
            if (i < j) {
                [real[i], real[j]] = [real[j], real[i]];
                [imag[i], imag[j]] = [imag[j], imag[i]];
            }
            let k = n / 2;
            while (k <= j) {
                j -= k;
                k /= 2;
            }
            j += k;
        }
        
        // Danielson-Lanczos section
        for (let len = 2; len <= n; len *= 2) {
            const angle = -2 * Math.PI / len;
            const wlen_re = Math.cos(angle);
            const wlen_im = Math.sin(angle);
            
            for (let i = 0; i < n; i += len) {
                let w_re = 1;
                let w_im = 0;
                
                for (let j = 0; j < len / 2; j++) {
                    const u_re = real[i + j];
                    const u_im = imag[i + j];
                    const t_re = w_re * real[i + j + len / 2] - w_im * imag[i + j + len / 2];
                    const t_im = w_re * imag[i + j + len / 2] + w_im * real[i + j + len / 2];
                    
                    real[i + j] = u_re + t_re;
                    imag[i + j] = u_im + t_im;
                    real[i + j + len / 2] = u_re - t_re;
                    imag[i + j + len / 2] = u_im - t_im;
                    
                    const w_re_temp = w_re * wlen_re - w_im * wlen_im;
                    w_im = w_re * wlen_im + w_im * wlen_re;
                    w_re = w_re_temp;
                }
            }
        }
    }

    /**
     * Advanced Karplus-Strong synthesis with extended parameters
     * for more realistic string sounds
     */
    synthesizeAdvanced(params) {
        const {
            freq,
            duration = 2.0,
            decay = 2.0,
            pluckPosition = 0.5,
            stiffness = 0.0,
            bodyResonance = 0.0,
            brightness = 5000
        } = params;
        
        const N = Math.round(this.sampleRate / freq);
        const totalSamples = Math.round(this.sampleRate * duration);
        const output = new Float32Array(totalSamples);
        
        // Generate initial noise burst (scaled like MATLAB: π/2 * rand - 1)
        const ring = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            ring[i] = (Math.PI / 2) * (Math.random() * 2 - 1);
        }
        
        // Apply pluck position filter (zeros out certain harmonics)
        if (pluckPosition > 0 && pluckPosition < 1) {
            const pluckIdx = Math.round(N * pluckPosition);
            if (pluckIdx > 0 && pluckIdx < N) {
                for (let k = pluckIdx; k < N; k += pluckIdx) {
                    if (k < N) ring[k] = 0;
                }
            }
        }
        
        // Prepare low-pass filter coefficients for brightness control
        const lpCutoff = Math.min(brightness, this.sampleRate / 2);
        const lpAlpha = this._computeLPAlpha(lpCutoff);
        
        // Prepare all-pass filter state for string stiffness
        let apState = 0;
        
        // Ring buffer loop with filtering
        let readIdx = 0;
        let lpPrev = 0;
        
        for (let i = 0; i < totalSamples; i++) {
            output[i] = ring[readIdx];
            
            // KS averaging filter
            const nextIdx = (readIdx + 1) % N;
            let filtered = (ring[readIdx] + ring[nextIdx]) / decay;
            
            // Low-pass filter for brightness
            filtered = lpAlpha * filtered + (1 - lpAlpha) * lpPrev;
            lpPrev = filtered;
            
            // All-pass filter for string stiffness (dispersion)
            if (stiffness > 0) {
                const apOut = -stiffness * filtered + apState;
                apState = filtered + stiffness * apOut;
                filtered = apOut;
            }
            
            ring[readIdx] = filtered;
            readIdx = (readIdx + 1) % N;
        }
        
        // Apply body resonance (formant filter) as post-processing
        if (bodyResonance > 0) {
            this._applyBodyResonance(output, bodyResonance);
        }
        
        // Apply fade-out envelope
        const fadeLen = Math.floor(totalSamples * 0.05);
        for (let i = 0; i < fadeLen; i++) {
            const gain = 1 - (i / fadeLen);
            output[totalSamples - 1 - i] *= gain * gain;
        }
        
        return output;
    }

    /**
     * Compute low-pass filter alpha coefficient
     */
    _computeLPAlpha(cutoffFreq) {
        const rc = 1.0 / (2 * Math.PI * cutoffFreq);
        const dt = 1.0 / this.sampleRate;
        return dt / (rc + dt);
    }

    /**
     * Apply body resonance using simple biquad bandpass filters
     * Simulates guitar body formants around 200Hz and 400Hz
     */
    _applyBodyResonance(buffer, wetAmount) {
        const dryAmount = 1 - wetAmount;
        
        // Two resonant peaks (simplified guitar body)
        const peaks = [
            { freq: 200, Q: 8 },
            { freq: 400, Q: 6 }
        ];
        
        const filtered = new Float32Array(buffer.length);
        
        peaks.forEach(peak => {
            const biquad = this._createBandpass(peak.freq, peak.Q);
            const temp = new Float32Array(buffer.length);
            
            for (let i = 0; i < buffer.length; i++) {
                temp[i] = this._processBiquad(buffer[i], biquad);
            }
            
            // Sum resonances
            for (let i = 0; i < buffer.length; i++) {
                filtered[i] += temp[i] * 0.5;
            }
        });
        
        // Mix wet/dry
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] = dryAmount * buffer[i] + wetAmount * filtered[i];
        }
    }

    /**
     * Create biquad bandpass filter coefficients
     */
    _createBandpass(freq, Q) {
        const omega = 2 * Math.PI * freq / this.sampleRate;
        const sn = Math.sin(omega);
        const cs = Math.cos(omega);
        const alpha = sn / (2 * Q);
        
        const b0 = alpha;
        const b1 = 0;
        const b2 = -alpha;
        const a0 = 1 + alpha;
        const a1 = -2 * cs;
        const a2 = 1 - alpha;
        
        return {
            b0: b0 / a0,
            b1: b1 / a0,
            b2: b2 / a0,
            a1: a1 / a0,
            a2: a2 / a0,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
        };
    }

    /**
     * Process one sample through biquad filter (Direct Form I)
     */
    _processBiquad(input, biquad) {
        const output = biquad.b0 * input + biquad.b1 * biquad.x1 + biquad.b2 * biquad.x2
                      - biquad.a1 * biquad.y1 - biquad.a2 * biquad.y2;
        
        biquad.x2 = biquad.x1;
        biquad.x1 = input;
        biquad.y2 = biquad.y1;
        biquad.y1 = output;
        
        return output;
    }

    /**
     * Play an advanced synthesis note
     */
    async playAdvanced(params) {
        const waveform = this.synthesizeAdvanced(params);
        await this.playBuffer(waveform);
    }

    /**
     * Play a pure sine wave tone (for educational demo in Section 3a)
     */
    async playSine(freq, durationSec = 1.5) {
        await this.init();
        const osc = new Tone.Oscillator(freq, 'sine').toDestination();
        osc.start();
        osc.stop(`+${durationSec}`);
        setTimeout(() => osc.dispose(), durationSec * 1000 + 100);
    }
}

// Global instance
const ksSynth = new KSSynth();
