import { useEffect, useRef } from 'react';
import { Node, Edge } from '../types/Graph';

interface GraphVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  width?: number;
  height?: number;
}

export function GraphVisualizer({ nodes, edges, width = 800, height = 600 }: GraphVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);

      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.position.x, fromNode.position.y);
        ctx.lineTo(toNode.position.x, toNode.position.y);
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    nodes.forEach(node => {
      const radius = 30;

      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id.toString(), node.position.x, node.position.y);
    });
  }, [nodes, edges, width, height]);

  return (
    <div className="border-4 border-gray-800 rounded-lg bg-white shadow-2xl">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg"
      />
    </div>
  );
}
