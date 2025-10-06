import { useState } from 'react';
import { GraphAlgorithm } from './utils/GraphAlgorithm';
import { GraphVisualizer } from './components/GraphVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { ConsoleOutput } from './components/ConsoleOutput';
import { Node } from './types/Graph';
import { Network } from 'lucide-react';

function App() {
  const [graph, setGraph] = useState<GraphAlgorithm | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [graphGenerated, setGraphGenerated] = useState(false);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<number[][] | undefined>(undefined);

  const handleGenerateGraph = async (n: number, isRandom: boolean, edges?: [number, number][]) => {
    const newGraph = new GraphAlgorithm(n);

    if (isRandom) {
      newGraph.generateRandom();
    } else if (edges) {
      edges.forEach(([u, v]) => newGraph.addEdge(u, v));
    }

    setGraph(newGraph);
    setNodes(newGraph.getNodes());
    setAdjacencyMatrix(newGraph.getAdjacencyMatrix());
    setGraphGenerated(true);
    setLogs([]);

    setTimeout(async () => {
      await startVisualization(newGraph);
    }, 500);
  };

  const startVisualization = async (graphInstance: GraphAlgorithm) => {
    setIsRunning(true);
    graphInstance.resetVisualization();
    setNodes([...graphInstance.getNodes()]);
    setLogs([]);

    await graphInstance.findComponentsWithVisualization(
      (updatedNodes, updatedLogs) => {
        setNodes([...updatedNodes]);
        setLogs([...updatedLogs]);
      },
      500
    );

    setIsRunning(false);
  };

  const handleStartVisualization = async () => {
    if (!graph) return;
    await startVisualization(graph);
  };

  const handleReset = () => {
    setGraph(null);
    setNodes([]);
    setLogs([]);
    setGraphGenerated(false);
    setAdjacencyMatrix(undefined);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Network className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-800">
              Connected Components Visualizer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Interactive visualization of graph connected components using DFS algorithm
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <ControlPanel
              onGenerateGraph={handleGenerateGraph}
              onReset={handleReset}
              isRunning={isRunning}
              graphGenerated={graphGenerated}
            />
          </div>

          <div className="lg:col-span-2">
            {graphGenerated && graph ? (
              <GraphVisualizer nodes={nodes} edges={graph.getEdges()} />
            ) : (
              <div className="border-4 border-dashed border-gray-400 rounded-lg bg-white shadow-lg h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Network className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p className="text-xl font-semibold">No graph generated yet</p>
                  <p className="text-sm mt-2">Configure and generate a graph to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1">
          <ConsoleOutput logs={logs} adjacencyMatrix={adjacencyMatrix} />
        </div>

        <footer className="mt-8 text-center text-gray-600 text-sm">
          <div className="bg-white rounded-lg p-4 shadow-md inline-block">
            <p className="font-semibold mb-2">Legend:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-gray-700"></div>
                <span>Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-gray-700"></div>
                <span>Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-gray-700"></div>
                <span>Component 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-gray-700"></div>
                <span>Component 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-gray-700"></div>
                <span>Component 3</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
