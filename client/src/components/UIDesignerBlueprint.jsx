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
import { buildWireframeLayout } from '../utils/buildWireframeLayout';
import WireframeNode from './WireframeNode';
import { Maximize2, PenTool } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const nodeTypes = { wireframeNode: WireframeNode };

/* ─────────────────────────────────────────────────────────────
   Wireframe Inner Canvas
   ───────────────────────────────────────────────────────────── */
const WireframeInner = ({ blueprint }) => {
  const [expandedNodeId, setExpandedNodeId] = useState(null);
  const { fitView } = useReactFlow();
  const { isDark } = useTheme();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildWireframeLayout(blueprint),
    [blueprint]
  );

  const nodesWithExpand = useMemo(
    () =>
      initialNodes.map((n) => ({
        ...n,
        zIndex: n.id === expandedNodeId ? 50 : 1,
        data: {
          ...n.data,
          expandedNodeId,
          setExpandedNodeId,
        },
      })),
    [initialNodes, expandedNodeId]
  );

  const [nodes, , onNodesChange] = useNodesState(nodesWithExpand);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Keep nodes in sync with expanded state
  const nodesWithCurrentExpand = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        zIndex: n.id === expandedNodeId ? 50 : 1,
        data: {
          ...n.data,
          expandedNodeId,
          setExpandedNodeId,
        },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, expandedNodeId]
  );

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 600 });
  }, [fitView]);

  if (!blueprint?.screens?.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: isDark ? 'rgba(236,72,153,0.4)' : 'rgba(236,72,153,0.6)', fontSize: 13, gap: 8 }}>
        <PenTool size={16} /> No wireframe data available.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
      <ReactFlow
        nodes={nodesWithCurrentExpand}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, includeHiddenNodes: false }}
        minZoom={0.1}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        <Background variant={BackgroundVariant.Cross} color="rgba(236,72,153,0.15)" gap={32} size={2} />

        <Controls
          showInteractive={false}
          style={{ background: isDark ? 'rgba(17,24,39,0.92)' : 'rgba(255,255,255,0.92)', border: `1px solid ${isDark ? 'rgba(236,72,153,0.2)' : 'rgba(236,72,153,0.4)'}`, borderRadius: 10, padding: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.5)', bottom: 16, left: 16 }}
        />
      </ReactFlow>

      <button
        onClick={handleFitView}
        title="Fit to view"
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 10, width: 30, height: 30, borderRadius: 8,
          background: isDark ? 'rgba(17,24,39,0.92)' : 'rgba(255,255,255,0.92)', border: `1px solid ${isDark ? 'rgba(236,72,153,0.25)' : 'rgba(236,72,153,0.4)'}`, color: isDark ? 'rgba(236,72,153,0.8)' : 'rgba(219,39,119,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)', transition: 'background 0.2s, color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(236,72,153,0.2)' : 'rgba(236,72,153,0.1)'; e.currentTarget.style.color = isDark ? '#fbcfe8' : '#db2777'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? 'rgba(17,24,39,0.92)' : 'rgba(255,255,255,0.92)'; e.currentTarget.style.color = isDark ? 'rgba(236,72,153,0.8)' : 'rgba(219,39,119,0.8)'; }}
      >
        <Maximize2 size={13} strokeWidth={2} />
      </button>
    </div>
  );
};

const UIDesignerBlueprint = ({ blueprint }) => {
  const screenCount = blueprint?.screens?.length ?? 0;
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
      style={{
        width: '100%', borderRadius: 16, overflow: 'hidden',
        background: isDark ? 'linear-gradient(160deg, rgba(17,24,39,0.98) 0%, rgba(10,15,25,0.99) 100%)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(236,72,153,0.2)' : 'rgba(236,72,153,0.3)'}`,
        boxShadow: isDark ? '0 0 0 1px rgba(236,72,153,0.06), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)' : '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: `1px solid ${isDark ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0.2)'}`, background: isDark ? 'rgba(236,72,153,0.05)' : 'rgba(236,72,153,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ec4899', boxShadow: '0 0 8px rgba(236,72,153,0.8)' }} />
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(236,72,153,0.85)' : 'rgba(219,39,119,1)' }}>
            Wireframe Board
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Inter', system-ui, sans-serif" }}>
          {[
            { label: 'Screens', value: screenCount },
            { label: 'Click to inspect', value: '→' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: isDark ? 'rgba(148,163,184,0.6)' : 'rgba(100,116,139,0.8)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? 'rgba(236,72,153,0.8)' : 'rgba(219,39,119,0.9)' }}>{value}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 500, position: 'relative' }}>
        <ReactFlowProvider>
          <WireframeInner blueprint={blueprint} />
        </ReactFlowProvider>
      </div>
    </motion.div>
  );
};

export default UIDesignerBlueprint;
