import { Node, Edge, NODE_COLORS, COMPONENT_COLORS } from '../types/Graph';

export class GraphAlgorithm {
  private n: number;
  private adjacencyMatrix: number[][];
  private nodes: Node[];
  private edges: Edge[];

  constructor(n: number) {
    this.n = n;
    this.adjacencyMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    this.nodes = [];
    this.edges = [];
    this.initializeNodes();
  }

  private initializeNodes(): void {
    const canvasWidth = 800;
    const canvasHeight = 600;
    const nodeRadius = 30;
    const margin = 80;

    this.nodes = [];

    for (let i = 0; i < this.n; i++) {
      let position: { x: number; y: number };
      let attempts = 0;
      const maxAttempts = 100;

      do {
        position = {
          x: margin + Math.random() * (canvasWidth - 2 * margin),
          y: margin + Math.random() * (canvasHeight - 2 * margin),
        };
        attempts++;
      } while (this.hasOverlap(position, nodeRadius * 2.5) && attempts < maxAttempts);

      this.nodes.push({
        id: i + 1,
        position,
        color: NODE_COLORS.UNVISITED,
        visited: false,
        component: -1,
      });
    }
  }

  private hasOverlap(position: { x: number; y: number }, minDistance: number): boolean {
    return this.nodes.some(node => {
      const dx = node.position.x - position.x;
      const dy = node.position.y - position.y;
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });
  }

  public addEdge(u: number, v: number): void {
    if (u >= 1 && u <= this.n && v >= 1 && v <= this.n && u !== v) {
      this.adjacencyMatrix[u - 1][v - 1] = 1;
      this.adjacencyMatrix[v - 1][u - 1] = 1;

      const edgeExists = this.edges.some(
        edge => (edge.from === u && edge.to === v) || (edge.from === v && edge.to === u)
      );

      if (!edgeExists) {
        this.edges.push({ from: u, to: v });
      }
    }
  }

  public generateRandom(): void {
    this.adjacencyMatrix = Array(this.n).fill(0).map(() => Array(this.n).fill(0));
    this.edges = [];

    const minEdges = this.n - 1;
    const maxEdges = Math.min(this.n * (this.n - 1) / 2, this.n * 2);
    const numEdges = Math.floor(Math.random() * (maxEdges - minEdges + 1)) + minEdges;

    const possibleEdges: [number, number][] = [];
    for (let i = 1; i <= this.n; i++) {
      for (let j = i + 1; j <= this.n; j++) {
        possibleEdges.push([i, j]);
      }
    }

    for (let i = possibleEdges.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possibleEdges[i], possibleEdges[j]] = [possibleEdges[j], possibleEdges[i]];
    }

    for (let i = 0; i < Math.min(numEdges, possibleEdges.length); i++) {
      const [u, v] = possibleEdges[i];
      this.addEdge(u, v);
    }
  }

  public getAdjacencyMatrix(): number[][] {
    return this.adjacencyMatrix;
  }

  public getNodes(): Node[] {
    return this.nodes;
  }

  public getEdges(): Edge[] {
    return this.edges;
  }

  public async findComponentsWithVisualization(
    onUpdate: (nodes: Node[], logs: string[]) => void,
    delay: number = 400
  ): Promise<{ components: number[][]; totalComponents: number }> {
    const visited = Array(this.n).fill(false);
    const components: number[][] = [];
    const logs: string[] = [];

    logs.push('=== Starting Connected Components Algorithm ===\n');
    onUpdate([...this.nodes], [...logs]);
    await this.sleep(delay);

    for (let i = 0; i < this.n; i++) {
      if (!visited[i]) {
        const component: number[] = [];
        logs.push(`\nStarting new component from node ${i + 1}:`);

        await this.dfs(i, visited, component, onUpdate, logs, delay, components.length);

        components.push(component);
        logs.push(`Component ${components.length}: [${component.join(', ')}]`);
        onUpdate([...this.nodes], [...logs]);
        await this.sleep(delay);
      }
    }

    logs.push(`\n=== Algorithm Complete ===`);
    logs.push(`Total Connected Components: ${components.length}\n`);

    components.forEach((component, index) => {
      logs.push(`Component ${index + 1}: [${component.join(', ')}]`);
    });

    onUpdate([...this.nodes], [...logs]);

    return { components, totalComponents: components.length };
  }

  private async dfs(
    nodeIndex: number,
    visited: boolean[],
    component: number[],
    onUpdate: (nodes: Node[], logs: string[]) => void,
    logs: string[],
    delay: number,
    componentIndex: number
  ): Promise<void> {
    visited[nodeIndex] = true;
    component.push(nodeIndex + 1);

    this.nodes[nodeIndex].visited = true;
    this.nodes[nodeIndex].color = NODE_COLORS.VISITING;
    logs.push(`  Visiting node ${nodeIndex + 1}`);
    onUpdate([...this.nodes], [...logs]);
    await this.sleep(delay);

    for (let i = 0; i < this.n; i++) {
      if (this.adjacencyMatrix[nodeIndex][i] === 1 && !visited[i]) {
        await this.dfs(i, visited, component, onUpdate, logs, delay, componentIndex);
      }
    }

    this.nodes[nodeIndex].color = COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length];
    this.nodes[nodeIndex].component = componentIndex;
    onUpdate([...this.nodes], [...logs]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public resetVisualization(): void {
    this.nodes.forEach(node => {
      node.visited = false;
      node.color = NODE_COLORS.UNVISITED;
      node.component = -1;
    });
  }
}
