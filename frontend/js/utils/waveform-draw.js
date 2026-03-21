// Shared waveform drawing utilities
// Used by both learn/controller.js and compose/controller.js

function getCanvas(id) {
    const c = document.getElementById(id);
    c.width = c.offsetWidth * (window.devicePixelRatio || 1);
    c.height = c.offsetHeight * (window.devicePixelRatio || 1);
    const ctx = c.getContext('2d');
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    return { canvas: c, ctx, w: c.offsetWidth, h: c.offsetHeight };
}

function drawWaveform(ctx, w, h, data, color = '#7c5cfc', options = {}) {
    const { dots = false, lineWidth = 2, yScale = 0.85 } = options;
    ctx.clearRect(0, 0, w, h);

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let y = 0; y <= 4; y++) {
        ctx.beginPath();
        ctx.moveTo(0, h * y / 4);
        ctx.lineTo(w, h * y / 4);
        ctx.stroke();
    }
    // Zero line
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    if (!data || data.length === 0) return;

    const N = data.length;
    const step = w / (N - 1 || 1);
    const mid = h / 2;
    const amp = mid * yScale;

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
        const x = i * step;
        const y = mid - data[i] * amp;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw dots if requested
    if (dots && N < 200) {
        ctx.fillStyle = color;
        for (let i = 0; i < N; i++) {
            const x = i * step;
            const y = mid - data[i] * amp;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
