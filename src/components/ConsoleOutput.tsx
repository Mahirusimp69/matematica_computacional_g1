import { useEffect, useRef, useState } from 'react';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface ConsoleOutputProps {
  logs: string[];
  adjacencyMatrix?: number[][];
}

export function ConsoleOutput({ logs, adjacencyMatrix }: ConsoleOutputProps) {
  const consoleRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (adjacencyMatrix) {
      setIsOpen(true);
    }
  }, [adjacencyMatrix]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800 px-4 py-3 flex items-center justify-between gap-2 border-b border-gray-700 hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <h3 className="text-white font-bold">Console Output</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-white" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white" />
        )}
      </button>

      {isOpen && (
        <div
          ref={consoleRef}
          className="p-4 h-96 overflow-y-auto font-mono text-sm text-green-400 space-y-1"
        >
        {adjacencyMatrix && (
          <div className="mb-4">
            <div className="text-yellow-400 font-bold mb-2">Adjacency Matrix:</div>
            <div className="text-gray-300">
              <div className="flex gap-2 mb-1">
                <span className="w-8"></span>
                {adjacencyMatrix.map((_, i) => (
                  <span key={i} className="w-8 text-center text-cyan-400 font-bold">
                    {i + 1}
                  </span>
                ))}
              </div>
              {adjacencyMatrix.map((row, i) => (
                <div key={i} className="flex gap-2">
                  <span className="w-8 text-cyan-400 font-bold">{i + 1}</span>
                  {row.map((val, j) => (
                    <span
                      key={j}
                      className={`w-8 text-center ${val === 1 ? 'text-white font-bold' : 'text-gray-600'}`}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 my-3"></div>
          </div>
        )}

        {logs.length === 0 ? (
          <div className="text-gray-500 italic">Waiting for algorithm to start...</div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`${
                log.includes('===')
                  ? 'text-yellow-400 font-bold'
                  : log.includes('Component')
                  ? 'text-cyan-400 font-bold'
                  : log.includes('Starting new')
                  ? 'text-magenta-400 font-bold'
                  : log.includes('Total')
                  ? 'text-green-300 font-bold text-lg'
                  : 'text-green-400'
              }`}
            >
              {log}
            </div>
          ))
        )}
        </div>
      )}
    </div>
  );
}
