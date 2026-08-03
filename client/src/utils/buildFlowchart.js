import dagre from '@dagrejs/dagre';
import { MarkerType } from 'reactflow';

// Node dimensions — wide enough for icon + title + description
const NODE_WIDTH = 300;
const NODE_HEIGHT = 80;

/**
 * Takes a raw blueprint ({ nodes, edges }) from the backend
 * and returns ReactFlow-compatible nodes and edges with dagre layout applied.
 */
export function buildFlowchart(blueprint) {
  if (!blueprint || !Array.isArray(blueprint.nodes) || !Array.isArray(blueprint.edges)) {
    return { nodes: [], edges: [] };
  }

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',   // top-to-bottom
    nodesep: 60,     // horizontal breathing room between sibling nodes
    ranksep: 90,     // vertical space between ranks
    marginx: 60,
    marginy: 60,
  });

  // Register nodes in dagre
  blueprint.nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Register edges in dagre
  blueprint.edges.forEach((edge) => {
    if (edge.from && edge.to) {
      g.setEdge(edge.from, edge.to);
    }
  });

  dagre.layout(g);

  // Build ReactFlow nodes with computed positions
  const rfNodes = blueprint.nodes.map((node, index) => {
    const { x, y } = g.node(node.id);
    return {
      id: node.id,
      type: 'flowNode',
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
      data: {
        title: node.title,
        description: node.description,
        details: node.details || [],
        nodeIndex: index,
      },
    };
  });

  // Build ReactFlow edges — premium indigo with animated flow
  const rfEdges = blueprint.edges
    .filter((edge) => edge.from && edge.to)
    .map((edge, index) => ({
      id: `edge-${edge.from}-${edge.to}-${index}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: 'url(#edgeGradient)',
        strokeWidth: 2.5,
        strokeDasharray: '6 3',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(129,140,248,0.9)',
        width: 16,
        height: 16,
      },
    }));

  return { nodes: rfNodes, edges: rfEdges };
}
