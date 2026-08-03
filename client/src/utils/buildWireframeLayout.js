import { MarkerType } from 'reactflow';

/**
 * Builds a React Flow layout for UI Designer Wireframes.
 * Arranges screens in a staggered grid resembling a Figma workspace
 * and generates sequential prototype links.
 */
export function buildWireframeLayout(blueprint) {
  if (!blueprint || !Array.isArray(blueprint.screens)) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];

  // Figma-like spacing
  const COLS = 3;
  const X_SPACING = 460;
  const Y_SPACING = 420;

  blueprint.screens.forEach((screen, index) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    
    // Stagger odd columns downwards for an organic workspace feel
    const yOffset = (col % 2 !== 0) ? 120 : 0;
    
    nodes.push({
      id: screen.id,
      type: 'wireframeNode',
      position: { x: col * X_SPACING, y: row * Y_SPACING + yOffset },
      data: {
        title: screen.title,
        description: screen.description,
        components: screen.components || [],
        screenIndex: index,
        totalScreens: blueprint.screens.length,
      },
    });

    // Generate prototype flow connections (sequential)
    if (index < blueprint.screens.length - 1) {
      const nextId = blueprint.screens[index + 1].id;
      edges.push({
        id: `proto-${screen.id}-${nextId}`,
        source: screen.id,
        target: nextId,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: 'rgba(244,114,182,0.6)', // Pink-400
          strokeWidth: 2,
          strokeDasharray: '6 4',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'rgba(236,72,153,0.8)', // Pink-500
          width: 14,
          height: 14,
        },
      });
    }
    
    // Occasional cross-links to make it look like a web of prototypes
    // For example, connect screen 0 to screen 2 if it exists
    if (index === 0 && blueprint.screens.length > 2) {
      const crossId = blueprint.screens[2].id;
      edges.push({
        id: `proto-cross-${screen.id}-${crossId}`,
        source: screen.id,
        target: crossId,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: 'rgba(244,114,182,0.4)',
          strokeWidth: 2,
          strokeDasharray: '6 4',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'rgba(236,72,153,0.6)',
          width: 14,
          height: 14,
        },
      });
    }
  });

  return { nodes, edges };
}
