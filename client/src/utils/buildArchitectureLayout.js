import { MarkerType } from 'reactflow';

// Groupings and styling metadata
export const ARCH_COLORS = {
  blue: { color: '#3b82f6', glow: 'rgba(59,130,246,0.3)', bg: 'rgba(59,130,246,0.1)' },
  cyan: { color: '#06b6d4', glow: 'rgba(6,182,212,0.3)', bg: 'rgba(6,182,212,0.1)' },
  slate: { color: '#64748b', glow: 'rgba(100,116,139,0.3)', bg: 'rgba(100,116,139,0.1)' },
  indigo: { color: '#6366f1', glow: 'rgba(99,102,241,0.3)', bg: 'rgba(99,102,241,0.1)' },
  purple: { color: '#a855f7', glow: 'rgba(168,85,247,0.3)', bg: 'rgba(168,85,247,0.1)' },
  emerald: { color: '#10b981', glow: 'rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.1)' },
  orange: { color: '#f97316', glow: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.1)' },
};

function categorizeComponent(title = '') {
  const t = title.toLowerCase();

  // 0: Clients
  if (t.includes('front') || t.includes('web') || t.includes('mobile') || t.includes('client') || t.includes('app') && !t.includes('service')) {
    return { layer: 0, type: 'client', palette: ARCH_COLORS.cyan };
  }
  
  // 1: Gateways & API Layer
  if (t.includes('gateway') || t.includes('load balancer') || t.includes('lb') || t.includes('ingress') || t.includes('cdn') || t.includes('api')) {
    return { layer: 1, type: 'gateway', palette: ARCH_COLORS.blue };
  }

  // 3: Databases & Storage & Queues (Data Layer)
  if (t.includes('db') || t.includes('database') || t.includes('sql') || t.includes('mongo') || t.includes('redis') || t.includes('cache')) {
    return { layer: 3, type: 'database', palette: ARCH_COLORS.indigo };
  }
  if (t.includes('storage') || t.includes('s3') || t.includes('blob') || t.includes('bucket')) {
    return { layer: 3, type: 'storage', palette: ARCH_COLORS.slate };
  }
  if (t.includes('queue') || t.includes('kafka') || t.includes('rabbitmq') || t.includes('sqs') || t.includes('event')) {
    return { layer: 3, type: 'queue', palette: ARCH_COLORS.orange };
  }

  // 4: External
  if (t.includes('external') || t.includes('stripe') || t.includes('twilio') || t.includes('3rd') || t.includes('third') || t.includes('mail')) {
    return { layer: 4, type: 'external', palette: ARCH_COLORS.slate };
  }

  // 2: Default to Services
  return { layer: 2, type: 'service', palette: ARCH_COLORS.purple };
}

const NODE_WIDTH = 260;
const NODE_HEIGHT = 70; // collapsed height approx
const LAYER_SPACING_X = 350;
const NODE_SPACING_Y = 120;

export function buildArchitectureLayout(blueprint) {
  if (!blueprint || !Array.isArray(blueprint.components) || !Array.isArray(blueprint.connections)) {
    return { nodes: [], edges: [] };
  }

  // Categorize and group into layers
  const layers = { 0: [], 1: [], 2: [], 3: [], 4: [] };
  
  blueprint.components.forEach((comp) => {
    const meta = categorizeComponent(comp.title);
    layers[meta.layer].push({ ...comp, meta });
  });

  const nodes = [];
  const edges = [];

  // Calculate layout
  Object.keys(layers).forEach((layerIndexStr) => {
    const layerIndex = parseInt(layerIndexStr, 10);
    const comps = layers[layerIndex];
    if (comps.length === 0) return;

    // Center the layer vertically around y=0
    const totalHeight = (comps.length - 1) * NODE_SPACING_Y;
    const startY = -totalHeight / 2;
    const x = layerIndex * LAYER_SPACING_X;

    comps.forEach((comp, index) => {
      const y = startY + index * NODE_SPACING_Y;

      nodes.push({
        id: comp.id,
        type: 'architectureNode',
        position: { x, y },
        data: {
          title: comp.title,
          description: comp.description || '',
          type: comp.meta.type,
          palette: comp.meta.palette,
        },
      });
    });
  });

  // Shift all x to start around 0 if layer 0 is empty, but generally ReactFlow's fitView handles it.
  
  // Build edges
  blueprint.connections.forEach((conn, index) => {
    if (!conn.from || !conn.to) return;
    
    // Determine source and target components to style the edge
    const sourceComp = blueprint.components.find(c => c.id === conn.from);
    const targetComp = blueprint.components.find(c => c.id === conn.to);
    
    let isAsync = false;
    let isExternal = false;
    
    if (sourceComp && targetComp) {
      const sourceMeta = categorizeComponent(sourceComp.title);
      const targetMeta = categorizeComponent(targetComp.title);
      if (sourceMeta.type === 'queue' || targetMeta.type === 'queue') isAsync = true;
      if (sourceMeta.type === 'external' || targetMeta.type === 'external') isExternal = true;
    }

    edges.push({
      id: `edge-${conn.from}-${conn.to}-${index}`,
      source: conn.from,
      target: conn.to,
      type: 'smoothstep',
      animated: isAsync, // animate async queues
      style: {
        stroke: isExternal ? 'rgba(100,116,139,0.7)' : 'url(#archEdgeGradient)',
        strokeWidth: 2,
        strokeDasharray: isExternal ? '5 5' : 'none',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isExternal ? 'rgba(100,116,139,0.9)' : 'rgba(6,182,212,0.9)',
        width: 15,
        height: 15,
      },
    });
  });

  return { nodes, edges };
}
