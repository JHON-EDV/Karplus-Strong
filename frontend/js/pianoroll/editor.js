/**
 * Piano Roll Editor
 * Canvas-based grid editor for creating note sequences
 */

class PianoRollEditor {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id "${canvasId}" not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Options with defaults
        this.options = {
            gridColor: options.gridColor || '#e2e8f0',
            noteColor: options.noteColor || '#3b82f6',
            playheadColor: options.playheadColor || '#ef4444',
            backgroundColor: options.backgroundColor || '#ffffff',
            textColor: options.textColor || '#1e293b',
            beatsPerMeasure: options.beatsPerMeasure || 4,
            beatDivisions: options.beatDivisions || 4,
            measures: options.measures || 8,
            minPitch: options.minPitch || 48, // C3
            maxPitch: options.maxPitch || 72, // C5
            cellHeight: options.cellHeight || 20,
            beatWidth: options.beatWidth || 40,
            labelWidth: options.labelWidth || 60,
            ...options
        };
        
        //State
        this.notes = []; // {pitch, startBeat, duration, velocity}
        this.playhead = 0;
        this.isPlaying = false;
        this.selectedNote = null;
        this.isDragging = false;
        this.dragStartBeat = 0;
        
        // Note name mapping
        this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.solfege = ['DO', 'DO#', 'RE', 'RE#', 'MI', 'FA', 'FA#', 'SOL', 'SOL#', 'LA', 'LA#', 'SI'];
        
        this.setupCanvas();
        this.attachEventListeners();
        this.render();
    }
    
    setupCanvas() {
        // Calculate canvas dimensions
        const pitchRange = this.options.maxPitch - this.options.minPitch + 1;
        const totalBeats = this.options.measures * this.options.beatsPerMeasure;
        
        this.canvas.width = this.options.labelWidth + (totalBeats * this.options.beatWidth);
        this.canvas.height = pitchRange * this.options.cellHeight;
        
        // Set CSS size for retina displays
        this.canvas.style.width = this.canvas.width + 'px';
        this.canvas.style.height = this.canvas.height + 'px';
    }
    
    attachEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
    }
    
    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    coordinatesToGrid(x, y) {
        const beatDivision = this.options.beatWidth / this.options.beatDivisions;
        const beat = Math.floor((x - this.options.labelWidth) / beatDivision) / this.options.beatDivisions;
        const pitch = this.options.maxPitch - Math.floor(y / this.options.cellHeight);
        
        return { beat: Math.max(0, beat), pitch };
    }
    
    gridToCoordinates(beat, pitch) {
        const x = this.options.labelWidth + (beat * this.options.beatWidth);
        const y = (this.options.maxPitch - pitch) * this.options.cellHeight;
        return { x, y };
    }
    
    handleClick(e) {
        const coords = this.getCanvasCoordinates(e);
        const { beat, pitch } = this.coordinatesToGrid(coords.x, coords.y);
        
        if (pitch < this.options.minPitch || pitch > this.options.maxPitch) {
            return;
        }
        
        // Check if clicking on existing note
        const existingNote = this.findNoteAt(beat, pitch);
        
        if (existingNote) {
            // Remove note
            this.removeNote(existingNote);
        } else {
            // Add new note
            this.addNote({
                pitch,
                startBeat: Math.round(beat * 4) / 4, // Snap to 16th note
                duration: 1, // Default to 1 beat
                velocity: 0.8
            });
        }
        
        this.render();
    }
    
    handleMouseDown(e) {
        const coords = this.getCanvasCoordinates(e);
        const { beat, pitch } = this.coordinatesToGrid(coords.x, coords.y);
        
        const note = this.findNoteAt(beat, pitch);
        if (note) {
            this.isDragging = true;
            this.selectedNote = note;
            this.dragStartBeat = beat;
        }
    }
    
    handleMouseMove(e) {
        if (!this.isDragging || !this.selectedNote) {
            return;
        }
        
        const coords = this.getCanvasCoordinates(e);
        const { beat } = this.coordinatesToGrid(coords.x, coords.y);
        
        // Update note duration
        const newDuration = Math.max(0.25, beat - this.selectedNote.startBeat);
        this.selectedNote.duration = Math.round(newDuration * 4) / 4; // Snap to 16th
        
        this.render();
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
        this.selectedNote = null;
    }
    
    findNoteAt(beat, pitch) {
        return this.notes.find(n => 
            n.pitch === pitch && 
            beat >= n.startBeat && 
            beat < n.startBeat + n.duration
        );
    }
    
    addNote(note) {
        this.notes.push(note);
        this.sortNotes();
        this.onNotesChanged();
    }
    
    removeNote(note) {
        const index = this.notes.indexOf(note);
        if (index > -1) {
            this.notes.splice(index, 1);
            this.onNotesChanged();
        }
    }
    
    sortNotes() {
        this.notes.sort((a, b) => a.startBeat - b.startBeat);
    }
    
    clearNotes() {
        this.notes = [];
        this.render();
        this.onNotesChanged();
    }
    
    setNotes(notes) {
        this.notes = notes;
        this.sortNotes();
        this.render();
    }
    
    getNotes() {
        return this.notes;
    }
    
    onNotesChanged() {
        // Override this method to handle note changes
        const event = new CustomEvent('noteschanged', { detail: { notes: this.notes } });
        this.canvas.dispatchEvent(event);
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBackground();
        this.drawGrid();
        this.drawLabels();
        this.drawNotes();
        if (this.isPlaying) {
            this.drawPlayhead();
        }
    }
    
    drawBackground() {
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = this.options.gridColor;
        this.ctx.lineWidth = 1;
        
        const pitchRange = this.options.maxPitch - this.options.minPitch + 1;
        const totalBeats = this.options.measures * this.options.beatsPerMeasure;
        
        // Horizontal lines (pitches)
        for (let i = 0; i <= pitchRange; i++) {
            const y = i * this.options.cellHeight;
            this.ctx.beginPath();
            this.ctx.moveTo(this.options.labelWidth, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Vertical lines (beats)
        const beatDivision = this.options.beatWidth / this.options.beatDivisions;
        for (let i = 0; i <= totalBeats * this.options.beatDivisions; i++) {
            const x = this.options.labelWidth + (i * beatDivision);
            const isMeasureLine = i % (this.options.beatsPerMeasure * this.options.beatDivisions) === 0;
            const isBeatLine = i % this.options.beatDivisions === 0;
            
            this.ctx.lineWidth = isMeasureLine ? 2 : isBeatLine ? 1 : 0.5;
            this.ctx.globalAlpha = isMeasureLine ? 1 : isBeatLine ? 0.7 : 0.3;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    drawLabels() {
        this.ctx.fillStyle = this.options.textColor;
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        
        for (let pitch = this.options.minPitch; pitch <= this.options.maxPitch; pitch++) {
            const y = (this.options.maxPitch - pitch) * this.options.cellHeight;
            const octave = Math.floor(pitch / 12) - 1;
            const noteName = this.noteNames[pitch % 12];
            const solfegeName = this.solfege[pitch % 12];
            
            // Display both notations
            const currentLang = localStorage.getItem('language') || 'es';
            const displayName = currentLang === 'es' ? solfegeName : noteName;
            
            this.ctx.fillText(
                `${displayName}${octave}`,
                this.options.labelWidth - 5,
                y + this.options.cellHeight / 2
            );
        }
    }
    
    drawNotes() {
        for (const note of this.notes) {
            const { x, y } = this.gridToCoordinates(note.startBeat, note.pitch);
            const width = note.duration * this.options.beatWidth;
            const height = this.options.cellHeight;
            
            // Draw note rectangle
            this.ctx.fillStyle = this.options.noteColor;
            this.ctx.globalAlpha = note.velocity || 0.8;
            this.ctx.fillRect(x, y + 1, width - 2, height - 2);
            
            // Draw border
            this.ctx.strokeStyle = '#1e40af';
            this.ctx.lineWidth = 1;
            this.ctx.globalAlpha = 1;
            this.ctx.strokeRect(x, y + 1, width - 2, height - 2);
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    drawPlayhead() {
        const x = this.options.labelWidth + (this.playhead * this.options.beatWidth);
        
        this.ctx.strokeStyle = this.options.playheadColor;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
    }
    
    setPlayhead(beat) {
        this.playhead = beat;
        this.render();
    }
    
    startPlayback() {
        this.isPlaying = true;
        this.render();
    }
    
    stopPlayback() {
        this.isPlaying = false;
        this.playhead = 0;
        this.render();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PianoRollEditor;
}
