import { MarkerType } from 'reactflow';

// ── Palette: each branch gets a unique accent colour ──────────────
export const BRANCH_COLORS = [
  { color: '#60a5fa', glow: 'rgba(96,165,250,0.3)',  bg: 'rgba(96,165,250,0.08)'  }, // blue
  { color: '#34d399', glow: 'rgba(52,211,153,0.3)',  bg: 'rgba(52,211,153,0.08)'  }, // emerald
  { color: '#f97316', glow: 'rgba(249,115,22,0.3)',  bg: 'rgba(249,115,22,0.08)'  }, // orange
  { color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', bg: 'rgba(167,139,250,0.08)' }, // violet
  { color: '#f472b6', glow: 'rgba(244,114,182,0.3)', bg: 'rgba(244,114,182,0.08)' }, // pink
  { color: '#2dd4bf', glow: 'rgba(45,212,191,0.3)',  bg: 'rgba(45,212,191,0.08)'  }, // teal
];

// ── Node dimensions ───────────────────────────────────────────────
const CENTER_W   = 160;
const CENTER_H   = 60;
const BRANCH_W   = 180;
const BRANCH_H   = 56;
const CHILD_W    = 160;
const CHILD_H    = 48;

// Radial placement helpers
const toRad = (deg) => (deg * Math.PI) / 180;

/**
 * Converts a mindmap blueprint  { center, branches[] }
 * into ReactFlow-compatible { nodes[], edges[] } using a pure radial layout.
 *
 * Layout rules:
 *  - Center node sits at (0, 0).
 *  - Branch nodes are placed in a ring at BRANCH_RADIUS from center.
 *  - Children of each branch are placed in a fan arc at CHILD_RADIUS,
 *    centred on the branch's angle, so they spread away from the center.
 */
export function buildMindMap(blueprint) {
  if (!blueprint || !blueprint.center || !Array.isArray(blueprint.branches)) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];

  const branchCount  = blueprint.branches.length;

  // Radius from center → branch node (in px)
  const BRANCH_RADIUS = branchCount <= 4 ? 350 : 420;
  // Radius from branch → child node
  const CHILD_RADIUS  = 280;
  // Gap between sibling children
  const CHILD_GAP     = 170;

  // ── Center node ───────────────────────────────────────────────
  nodes.push({
    id: 'center',
    type: 'mindMapNode',
    position: { x: -CENTER_W / 2, y: -CENTER_H / 2 },
    width: CENTER_W,
    height: CENTER_H,
    data: {
      label: blueprint.center,
      nodeKind: 'center',
      color: '#818cf8',
      glow:  'rgba(129,140,248,0.4)',
      bg:    'rgba(129,140,248,0.1)',
      description: '',
      branchIndex: -1,
    },
  });

  // ── Branch nodes ──────────────────────────────────────────────
  blueprint.branches.forEach((branch, bi) => {
    const palette   = BRANCH_COLORS[bi % BRANCH_COLORS.length];
    const angleDeg  = (360 / branchCount) * bi - 90; // start from top
    const angleRad  = toRad(angleDeg);

    const bx = Math.cos(angleRad) * BRANCH_RADIUS;
    const by = Math.sin(angleRad) * BRANCH_RADIUS;

    const branchId = `branch-${bi}`;

    nodes.push({
      id: branchId,
      type: 'mindMapNode',
      position: { x: bx - BRANCH_W / 2, y: by - BRANCH_H / 2 },
      width: BRANCH_W,
      height: BRANCH_H,
      data: {
        label: branch.title,
        nodeKind: 'branch',
        color: palette.color,
        glow:  palette.glow,
        bg:    palette.bg,
        description: branch.description || '',
        branchIndex: bi,
        childCount: (branch.children || []).length,
        isLeft: Math.cos(angleRad) < -0.1,
      },
    });

    // Center → branch edge
    edges.push({
      id: `edge-center-${branchId}`,
      source: 'center',
      target: branchId,
      type: 'straight',
      animated: false,
      style: {
        stroke: palette.color,
        strokeWidth: 2,
        opacity: 0.6,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: palette.color,
        width: 14,
        height: 14,
      },
    });

    // ── Child nodes ─────────────────────────────────────────────
    const children = branch.children || [];
    if (children.length === 0) return;

    children.forEach((child, ci) => {
      const offset = (ci - (children.length - 1) / 2) * CHILD_GAP;

      const cx = bx + Math.cos(angleRad) * CHILD_RADIUS + Math.cos(angleRad + Math.PI / 2) * offset;
      const cy = by + Math.sin(angleRad) * CHILD_RADIUS + Math.sin(angleRad + Math.PI / 2) * offset;

      const childId = `child-${bi}-${ci}`;

      nodes.push({
        id: childId,
        type: 'mindMapNode',
        position: { x: cx - CHILD_W / 2, y: cy - CHILD_H / 2 },
        width: CHILD_W,
        height: CHILD_H,
        data: {
          label: child.title,
          nodeKind: 'child',
          color: palette.color,
          glow:  palette.glow,
          bg:    palette.bg,
          description: child.description || '',
          branchIndex: bi,
          // children are hidden until parent branch is expanded
          parentId: branchId,
        },
        hidden: true, // start hidden; revealed when parent expands
      });

      // Branch → child edge
      edges.push({
        id: `edge-${branchId}-${childId}`,
        source: branchId,
        target: childId,
        type: 'straight',
        animated: false,
        hidden: true, // hidden until branch expanded
        style: {
          stroke: palette.color,
          strokeWidth: 1.5,
          opacity: 0.45,
          strokeDasharray: '4 3',
        },
      });
    });
  });

  return { nodes, edges };
}
