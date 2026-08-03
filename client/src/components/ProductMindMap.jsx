import { useCallback, useMemo, useState } from 'react';
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
import { buildMindMap, BRANCH_COLORS } from '../utils/buildMindMap';
import MindMapNode from './MindMapNode';
import { Maximize2, GitMerge } from 'lucide-react';

const nodeTypes = { mindMapNode: MindMapNode };

/* ─────────────────────────────────────────────────────────────────
   Inner canvas — must be inside ReactFlowProvider to use useReactFlow
   ───────────────────────────────────────────────────────────────── */
const MindMapInner = ({ blueprint }) => {
  // expandedBranchId: only one branch can be open at once
  const [expandedBranchId, setExpandedBranchId] = useState(null);
  const { fitView } = useReactFlow();

  // Build nodes + edges once from blueprint
  const { nodes: rawNodes, edges: rawEdges } = useMemo(
    () => buildMindMap(blueprint),
    [blueprint]
  );

  // When expandedBranchId changes, reveal / hide child nodes + edges for that branch
  const computedNodes = useMemo(() => {
    return rawNodes.map((n) => {
      let hidden = n.hidden ?? false;

      if (n.data.nodeKind === 'child') {
        // Show children only when their parent branch is expanded
        hidden = n.data.parentId !== expandedBranchId;
      }

      return {
        ...n,
        hidden,
        data: {
          ...n.data,
          expandedBranchId,
          setExpandedBranchId,
        },
      };
    });
  }, [rawNodes, expandedBranchId]);

  const computedEdges = useMemo(() => {
    return rawEdges.map((e) => {
      // Hide branch→child edges unless that branch is expanded
      const isBranchChildEdge = e.id.startsWith('edge-branch-') && !e.id.startsWith('edge-center-');
      let hidden = e.hidden ?? false;

      if (isBranchChildEdge) {
        // Extract branch id from edge id: "edge-branch-{bi}-child-{bi}-{ci}"
        const branchId = e.source; // source is always the branch node
        hidden = branchId !== expandedBranchId;
      }

      return { ...e, hidden };
    });
  }, [rawEdges, expandedBranchId]);

  const [nodes, , onNodesChange] = useNodesState(computedNodes);
  const [edges, , onEdgesChange] = useEdgesState(computedEdges);

  // Keep nodes/edges in sync when expandedBranchId changes
  const liveNodes = useMemo(
    () =>
      nodes.map((n) => {
        let hidden = false;
        if (n.data.nodeKind === 'child') {
          hidden = n.data.parentId !== expandedBranchId;
        }
        return {
          ...n,
          hidden,
          data: { ...n.data, expandedBranchId, setExpandedBranchId },
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, expandedBranchId]
  );

  const liveEdges = useMemo(
    () =>
      edges.map((e) => {
        const isBranchChild = e.id.startsWith('edge-branch-') && !e.id.startsWith('edge-center-');
        return {
          ...e,
          hidden: isBranchChild ? e.source !== expandedBranchId : false,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [edges, expandedBranchId]
  );

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 600 });
  }, [fitView]);

  if (!blueprint?.center) {
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
        <GitMerge size={16} />
        No mind map data available.
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
      <ReactFlow
        nodes={liveNodes}
        edges={liveEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, includeHiddenNodes: false }}
        minZoom={0.1}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        panOnScroll
        selectionOnDrag={false}
        style={{ background: 'transparent' }}
      >
        {/* Dot grid — warmer teal tint for the PM canvas */}
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(45,212,191,0.1)"
          gap={24}
          size={1.2}
        />

        {/* Controls */}
        <Controls
          showInteractive={false}
          style={{
            background: 'rgba(10,8,35,0.92)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10,
            padding: 4,
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            bottom: 16,
            left: 16,
          }}
        />
      </ReactFlow>

      {/* Fit-view button (top-right) */}
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
          background: 'rgba(10,8,35,0.92)',
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
          e.currentTarget.style.background = 'rgba(10,8,35,0.92)';
          e.currentTarget.style.color = 'rgba(129,140,248,0.8)';
        }}
      >
        <Maximize2 size={13} strokeWidth={2} />
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Top-level export — canvas shell matching BackendBlueprint style
   ───────────────────────────────────────────────────────────────── */
const ProductMindMap = ({ blueprint }) => {
  const branchCount = blueprint?.branches?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
      style={{
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(160deg, rgba(10,18,40,0.99) 0%, rgba(6,10,28,0.99) 100%)',
        border: '1px solid rgba(45,212,191,0.14)',
        boxShadow: '0 0 0 1px rgba(45,212,191,0.05), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* ── Header bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(45,212,191,0.1)',
          background: 'rgba(45,212,191,0.03)',
        }}
      >
        {/* Left: dot + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#2dd4bf',
              boxShadow: '0 0 8px rgba(45,212,191,0.8)',
            }}
          />
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(45,212,191,0.75)',
            }}
          >
            Product Strategy Mind Map
          </span>
        </div>

        {/* Right: branch / topic counts */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {[
            { label: 'Topics', value: branchCount },
            { label: 'Click to expand', value: '→' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 10,
                color: 'rgba(148,163,184,0.55)',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(45,212,191,0.65)',
                }}
              >
                {value}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Canvas ── */}
      <div style={{ height: 520, position: 'relative' }}>
        <ReactFlowProvider>
          <MindMapInner blueprint={blueprint} />
        </ReactFlowProvider>
      </div>
    </motion.div>
  );
};

export default ProductMindMap;
