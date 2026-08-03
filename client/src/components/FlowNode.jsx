import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Circle } from 'lucide-react';

/**
 * Premium FlowNode for the Backend Blueprint.
 *
 * Design language: glassmorphism card, Foundry indigo palette,
 * smooth expand/collapse detail panel, single-node-at-a-time constraint.
 *
 * State is lifted: expandedId / setExpandedId passed via data prop.
 */
const FlowNode = ({ id, data }) => {
  const isExpanded = data.expandedId === id;

  const toggle = () => data.setExpandedId(isExpanded ? null : id);

  return (
    /* Wrapper — width matches NODE_WIDTH in buildFlowchart.js */
    <div style={{ width: 290, fontFamily: "'Inter', 'system-ui', sans-serif" }}>

      {/* ── Top connection handle ── */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'rgba(99,102,241,0.9)',
          border: '2px solid rgba(30,27,75,0.8)',
          width: 10,
          height: 10,
          top: -5,
        }}
      />

      {/* ── Main node card ── */}
      <motion.div
        layout
        onClick={toggle}
        whileHover={isExpanded ? {} : { scale: 1.015, y: -2 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        style={{
          cursor: 'pointer',
          borderRadius: 14,
          overflow: 'hidden',
          background: isExpanded
            ? 'linear-gradient(145deg, rgba(49,46,129,0.55) 0%, rgba(30,27,75,0.85) 100%)'
            : 'linear-gradient(145deg, rgba(30,27,75,0.75) 0%, rgba(15,12,41,0.90) 100%)',
          border: isExpanded
            ? '1px solid rgba(129,140,248,0.55)'
            : '1px solid rgba(99,102,241,0.22)',
          backdropFilter: 'blur(12px)',
          boxShadow: isExpanded
            ? '0 0 0 1px rgba(99,102,241,0.2), 0 8px 32px rgba(99,102,241,0.18), 0 2px 8px rgba(0,0,0,0.5)'
            : '0 2px 12px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.08)',
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            minHeight: 60,
          }}
        >
          {/* Left: dot accent + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <div
              style={{
                flexShrink: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isExpanded
                  ? 'rgba(165,180,252,1)'
                  : 'rgba(99,102,241,0.8)',
                boxShadow: isExpanded
                  ? '0 0 8px rgba(165,180,252,0.6)'
                  : '0 0 6px rgba(99,102,241,0.4)',
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: isExpanded ? '#e0e7ff' : '#c7d2fe',
                lineHeight: 1.35,
                letterSpacing: '0.01em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {data.title}
            </span>
          </div>

          {/* Right: expand toggle */}
          <div
            style={{
              flexShrink: 0,
              marginLeft: 12,
              width: 24,
              height: 24,
              borderRadius: 6,
              background: isExpanded
                ? 'rgba(99,102,241,0.25)'
                : 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isExpanded ? '#a5b4fc' : '#6366f1',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {isExpanded
              ? <ChevronUp size={13} strokeWidth={2.5} />
              : <ChevronDown size={13} strokeWidth={2.5} />
            }
          </div>
        </div>

        {/* ── Expandable detail panel ── */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              {/* Hairline divider */}
              <div
                style={{
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)',
                  margin: '0 16px',
                }}
              />

              <div style={{ padding: '12px 16px 16px' }}>
                {/* Description */}
                {data.description && (
                  <p
                    style={{
                      fontSize: 11.5,
                      color: '#94a3b8',
                      lineHeight: 1.55,
                      marginBottom: data.details?.length ? 12 : 0,
                    }}
                  >
                    {data.description}
                  </p>
                )}

                {/* Detail bullets */}
                {data.details?.length > 0 && (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {data.details.map((detail, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                          fontSize: 11,
                          color: '#a5b4fc',
                          lineHeight: 1.45,
                        }}
                      >
                        {/* Bullet dot */}
                        <span
                          style={{
                            flexShrink: 0,
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: 'rgba(99,102,241,0.7)',
                            marginTop: 4,
                            boxShadow: '0 0 4px rgba(99,102,241,0.4)',
                          }}
                        />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Bottom connection handle ── */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'rgba(99,102,241,0.9)',
          border: '2px solid rgba(30,27,75,0.8)',
          width: 10,
          height: 10,
          bottom: -5,
        }}
      />
    </div>
  );
};

export default memo(FlowNode);
