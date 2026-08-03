import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { buildFlowchart } from '../utils/buildFlowchart';
import FlowNode from './FlowNode';

const nodeTypes = { flowNode: FlowNode };

/**
 * Inner component that renders the ReactFlow graph.
 * Separated so it lives inside a ReactFlowProvider.
 */
const FlowInner = ({ blueprint }) => {
  const [expandedId, setExpandedId] = useState(null);

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

  if (!blueprint?.nodes?.length) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
          color: '#4b5563',
          fontSize: 13,
        }}
      >
        No blueprint data available.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ width: '100%', height: 480 }}
    >
      <ReactFlow
        nodes={nodesWithCurrentExpand}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.4}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        style={{
          background: 'transparent',
          borderRadius: 16,
        }}
      >
        <Background
          color="rgba(99,102,241,0.12)"
          gap={24}
          size={1.5}
        />
        <Controls
          style={{
            background: 'rgba(15,12,41,0.9)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 8,
          }}
        />
        <MiniMap
          style={{
            background: 'rgba(15,12,41,0.9)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 8,
          }}
          nodeColor="rgba(99,102,241,0.6)"
          maskColor="rgba(0,0,0,0.4)"
        />
      </ReactFlow>
    </motion.div>
  );
};

/**
 * Top-level export — wraps FlowInner in a ReactFlowProvider.
 */
const BackendBlueprint = ({ blueprint }) => {
  return (
    <ReactFlowProvider>
      <FlowInner blueprint={blueprint} />
    </ReactFlowProvider>
  );
};

export default BackendBlueprint;
