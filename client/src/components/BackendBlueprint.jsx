import { useCallback, useMemo, useState, useRef } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { buildFlowchart } from '../utils/buildFlowchart';
import FlowNode from './FlowNode';
import { Maximize2, GitBranch } from 'lucide-react';

const nodeTypes = { flowNode: FlowNode };

/* ─────────────────────────────────────────────────────────────
   SVG Defs injected into the ReactFlow canvas for gradient edges
   ───────────────────────────────────────────────────────────── */
const EdgeGradientDefs = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(99,102,241,0.4)" />
        <stop offset="50%" stopColor="rgba(129,140,248,0.8)" />
        <stop offset="100%" stopColor="rgba(167,139,250,0.5)" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Inner component that renders the ReactFlow graph.
 * Separated so it lives inside a ReactFlowProvider.
 */
const FlowInner = ({ blueprint }) => {
  const [expandedId, setExpandedId] = useState(null);
  const { fitView } = useReactFlow();

  // Build initial nodes & edges from blueprint
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildFlowchart(blueprint),
    [blueprint]
  );

  // Inject expandedId / setExpandedId into each node's data
  const nodesWithExpand = useMemo(
    () =>
      initialNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          expandedId,
          setExpandedId,
        },
      })),
    [initialNodes, expandedId]
  );

  const [nodes, , onNodesChange] = useNodesState(nodesWithExpand);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Keep nodes in sync with expandedId changes without re-running layout
  const nodesWithCurrentExpand = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          expandedId,
          setExpandedId,
        },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, expandedId]
  );

  const onNodeClick = useCallback(() => {}, []);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.15, duration: 600 });
  }, [fitView]);

  if (!blueprint?.nodes?.length) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
          color: 'rgba(99,102,241,0.4)',
          fontSize: 13,
          fontFamily: "'Inter', system-ui, sans-serif",
          gap: 8,
        }}
      >
        <GitBranch size={16} />
        No blueprint data available.
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <EdgeGradientDefs />

      <ReactFlow
        nodes={nodesWithCurrentExpand}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, includeHiddenNodes: false }}
        minZoom={0.1}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        style={{
          background: 'transparent',
        }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
      >
        {/* Dot grid background */}
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(99,102,241,0.14)"
          gap={22}
          size={1.2}
        />

        {/* Controls panel */}
        <Controls
          showInteractive={false}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            background: 'rgba(13,11,40,0.92)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10,
            padding: 4,
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            bottom: 16,
            left: 16,
          }}
        />
      </ReactFlow>

      {/* Fit-view shortcut button (top-right of canvas) */}
      <button
        onClick={handleFitView}
        title="Fit to view"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          width: 30,
          height: 30,
          borderRadius: 8,
          background: 'rgba(13,11,40,0.92)',
          border: '1px solid rgba(99,102,241,0.22)',
          color: 'rgba(129,140,248,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
          e.currentTarget.style.color = '#a5b4fc';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(13,11,40,0.92)';
          e.currentTarget.style.color = 'rgba(129,140,248,0.8)';
        }}
      >
        <Maximize2 size={13} strokeWidth={2} />
      </button>
    </div>
  );
};

/**
 * Top-level export — wraps FlowInner in a ReactFlowProvider
 * inside a styled canvas shell with a header.
 */
const BackendBlueprint = ({ blueprint }) => {
  const nodeCount = blueprint?.nodes?.length ?? 0;
  const edgeCount = blueprint?.edges?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
      style={{
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(160deg, rgba(17,13,52,0.98) 0%, rgba(10,8,35,0.99) 100%)',
        border: '1px solid rgba(99,102,241,0.18)',
        boxShadow: '0 0 0 1px rgba(99,102,241,0.06), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* ── Canvas header bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(99,102,241,0.12)',
          background: 'rgba(99,102,241,0.04)',
        }}
      >
        {/* Left: icon + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#818cf8',
              boxShadow: '0 0 8px rgba(129,140,248,0.7)',
            }}
          />
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(129,140,248,0.8)',
            }}
          >
            Architecture Blueprint
          </span>
        </div>

        {/* Right: node / edge meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {[
            { label: 'Nodes', value: nodeCount },
            { label: 'Edges', value: edgeCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 10,
                color: 'rgba(148,163,184,0.6)',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(129,140,248,0.7)',
                }}
              >
                {value}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Flow canvas ── */}
      <div style={{ height: 500, position: 'relative' }}>
        <ReactFlowProvider>
          <FlowInner blueprint={blueprint} />
        </ReactFlowProvider>
      </div>
    </motion.div>
  );
};

export default BackendBlueprint;
