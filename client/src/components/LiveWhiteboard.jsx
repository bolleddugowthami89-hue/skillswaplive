import React, { useRef, useState, useEffect } from 'react';
import { 
  Pen, 
  Eraser, 
  Trash2, 
  Download, 
  Undo, 
  Palette,
  Maximize2
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const COLORS = [
  '#ffffff', // White
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#ef4444', // Red
];

const STROKE_SIZES = [2, 4, 8, 14];

const LiveWhiteboard = ({ roomId }) => {
  const canvasRef = useRef(null);
  const { socket } = useSocket();

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#6366f1');
  const [currentSize, setCurrentSize] = useState(4);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize canvas size and background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas to fill parent container cleanly
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Save current canvas content
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0);

        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 550;

        // Fill dark background
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Restore content
        ctx.drawImage(tempCanvas, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Listen to remote drawing events from peers
  useEffect(() => {
    if (!socket) return;

    const handleRemoteDraw = (drawData) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const { fromX, fromY, toX, toY, color, size, isEraser } = drawData;

      ctx.beginPath();
      ctx.moveTo(fromX * canvas.width, fromY * canvas.height);
      ctx.lineTo(toX * canvas.width, toY * canvas.height);
      ctx.strokeStyle = isEraser ? '#090d16' : color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.closePath();
    };

    const handleRemoteClear = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    socket.on('whiteboard-draw', handleRemoteDraw);
    socket.on('whiteboard-clear', handleRemoteClear);

    return () => {
      socket.off('whiteboard-draw', handleRemoteDraw);
      socket.off('whiteboard-clear', handleRemoteClear);
    };
  }, [socket]);

  // Coordinate normalizer (0 to 1 relative)
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, rawX: 0, rawY: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Support mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;

    return {
      x: rawX / canvas.width,
      y: rawY / canvas.height,
      rawX,
      rawY,
    };
  };

  const startDrawing = (e) => {
    const coords = getCoordinates(e);
    setIsDrawing(true);
    setLastPos(coords);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const coords = getCoordinates(e);

    const isEraser = tool === 'eraser';
    const strokeColor = isEraser ? '#090d16' : currentColor;

    ctx.beginPath();
    ctx.moveTo(lastPos.rawX, lastPos.rawY);
    ctx.lineTo(coords.rawX, coords.rawY);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.closePath();

    // Broadcast drawing to socket peers
    if (socket && roomId) {
      socket.emit('whiteboard-draw', {
        roomId,
        drawData: {
          fromX: lastPos.x,
          fromY: lastPos.y,
          toX: coords.x,
          toY: coords.y,
          color: currentColor,
          size: currentSize,
          isEraser,
        },
      });
    }

    setLastPos(coords);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (socket && roomId) {
      socket.emit('whiteboard-clear', { roomId });
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `skillswap-whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel border border-slate-800 overflow-hidden relative">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        
        {/* Tool Selectors */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded-xl flex items-center gap-1.5 font-medium transition-all ${
              tool === 'pen'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Pen"
          >
            <Pen className="w-4 h-4" />
            <span className="hidden sm:inline">Pen</span>
          </button>

          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-xl flex items-center gap-1.5 font-medium transition-all ${
              tool === 'eraser'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>
        </div>

        {/* Color Palette */}
        {tool === 'pen' && (
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setCurrentColor(c)}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full transition-transform ${
                  currentColor === c ? 'scale-125 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900' : 'hover:scale-110'
                }`}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        )}

        {/* Brush Sizes */}
        <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60">
          {STROKE_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setCurrentSize(size)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                currentSize === size ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>

        {/* Actions (Clear, Export) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={clearCanvas}
            className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/30 transition-colors flex items-center gap-1"
            title="Clear Board"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={downloadCanvas}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
            title="Download PNG"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>

      </div>

      {/* Canvas Drawing Area */}
      <div className="flex-1 w-full h-full min-h-[460px] relative bg-[#090d16] cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block touch-none"
        />
      </div>

    </div>
  );
};

export default LiveWhiteboard;
