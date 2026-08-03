import dagre from '@dagrejs/dagre';
import { MarkerType } from 'reactflow';

// Larger nodes for readability
const NODE_WIDTH = 290;
const NODE_HEIGHT = 90;

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
    nodesep: 80,     // more horizontal breathing room
    ranksep: 110,    // more vertical breathing room between ranks
    marginx: 40,
    marginy: 40,
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
  const rfNodes = blueprint.nodes.map((node) => {
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
      },
    };
  });

  // Build ReactFlow edges — slightly thicker, premium indigo
  const rfEdges = blueprint.edges
    .filter((edge) => edge.from && edge.to)
    .map((edge, index) => ({
      id: `edge-${edge.from}-${edge.to}-${index}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: 'rgba(99,102,241,0.7)',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(99,102,241,0.9)',
        width: 18,
        height: 18,
      },
    }));

  return { nodes: rfNodes, edges: rfEdges };
}
