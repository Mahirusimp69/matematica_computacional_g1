import { useState } from 'react';
import { Play, RotateCcw, Grid3x3 } from 'lucide-react';

interface ControlPanelProps {
  onGenerateGraph: (n: number, isRandom: boolean, edges?: [number, number][]) => void;
  onReset: () => void;
  isRunning: boolean;
  graphGenerated: boolean;
}

export function ControlPanel({
  onGenerateGraph,
  onReset,
  isRunning,
  graphGenerated,
}: ControlPanelProps) {
  const [n, setN] = useState<number>(8);
  const [mode, setMode] = useState<'random' | 'manual'>('random');
  const [edgeInput, setEdgeInput] = useState<string>('');
  const [showEdgeInput, setShowEdgeInput] = useState(false);

  const handleGenerate = () => {
    if (mode === 'random') {
      onGenerateGraph(n, true);
    } else {
      setShowEdgeInput(true);
    }
  };

  const handleManualSubmit = () => {
    const edges: [number, number][] = [];
    const lines = edgeInput.trim().split('\n');

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length === 2) {
        const u = parseInt(parts[0]);
        const v = parseInt(parts[1]);
        if (!isNaN(u) && !isNaN(v) && u >= 1 && u <= n && v >= 1 && v <= n && u !== v) {
          edges.push([u, v]);
        }
      }
    }

    onGenerateGraph(n, false, edges);
    setShowEdgeInput(false);
    setEdgeInput('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Grid3x3 className="w-6 h-6" />
        Graph Configuration
      </h2>

      {!graphGenerated && !showEdgeInput && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Nodes (n)
            </label>
            <input
              type="number"
              min="6"
              max="12"
              value={n}
              onChange={(e) => setN(Math.max(6, Math.min(12, parseInt(e.target.value) || 6)))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold"
              disabled={isRunning}
            />
            <p className="text-xs text-gray-500 mt-1">Range: 6 to 12 nodes</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Generation Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="mode"
                  value="random"
                  checked={mode === 'random'}
                  onChange={(e) => setMode(e.target.value as 'random' | 'manual')}
                  className="w-4 h-4"
                  disabled={isRunning}
                />
                <span className="font-medium">Random Edge Generation</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="mode"
                  value="manual"
                  checked={mode === 'manual'}
                  onChange={(e) => setMode(e.target.value as 'random' | 'manual')}
                  className="w-4 h-4"
                  disabled={isRunning}
                />
                <span className="font-medium">Manual Edge Input</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isRunning}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
          >
            <Grid3x3 className="w-5 h-5" />
            Generate Graph
          </button>
        </>
      )}

      {showEdgeInput && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Edges (one per line: u v)
            </label>
            <textarea
              value={edgeInput}
              onChange={(e) => setEdgeInput(e.target.value)}
              placeholder="Example:
1 2
2 3
4 5"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm h-40"
              disabled={isRunning}
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: two integers per line (node IDs from 1 to {n})
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleManualSubmit}
              disabled={isRunning}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Create Graph
            </button>
            <button
              onClick={() => {
                setShowEdgeInput(false);
                setEdgeInput('');
              }}
              disabled={isRunning}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {graphGenerated && !showEdgeInput && (
        <div className="space-y-3">
          {isRunning ? (
            <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-blue-700 font-bold">
                <Play className="w-5 h-5 animate-pulse" />
                <span>Algorithm Running...</span>
              </div>
              <p className="text-sm text-blue-600 mt-2">Processing connected components</p>
            </div>
          ) : (
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center">
              <div className="text-green-700 font-bold">Algorithm Complete!</div>
              <p className="text-sm text-green-600 mt-1">Check console output for results</p>
            </div>
          )}

          <button
            onClick={onReset}
            disabled={isRunning}
            className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
