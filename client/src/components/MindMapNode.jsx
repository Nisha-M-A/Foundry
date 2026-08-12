import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Brain, Sparkles, Layers, Star, Target, Eye, Map as MapIcon, BarChart2, Users, Rocket, Search, MessageSquare, Lightbulb, Flag, Zap } from 'lucide-react';

function resolveMindMapIcon(label = '') {
  const t = label.toLowerCase();
  if (t.includes('goal') || t.includes('objective') || t.includes('kpi')) return Target;
  if (t.includes('vision') || t.includes('mission')) return Eye;
  if (t.includes('feature') || t.includes('core')) return Star;
  if (t.includes('roadmap') || t.includes('plan') || t.includes('timeline')) return MapIcon;
  if (t.includes('metric') || t.includes('analytics') || t.includes('data')) return BarChart2;
  if (t.includes('user') || t.includes('customer') || t.includes('persona')) return Users;
  if (t.includes('launch') || t.includes('release') || t.includes('deploy')) return Rocket;
  if (t.includes('research') || t.includes('study')) return Search;
  if (t.includes('feedback') || t.includes('review')) return MessageSquare;
  if (t.includes('idea') || t.includes('concept')) return Lightbulb;
  if (t.includes('milestone')) return Flag;
  return Sparkles; // Default
}

/**
 * MindMapNode — renders three visual variants:
 *   'center'  — large pulsing central hub
 *   'branch'  — primary topic node with expand/collapse
 *   'child'   — compact leaf node (no expand, just shows description)
 *
 * State is lifted: expandedBranchId / setExpandedBranchId passed via data prop.
 */
const MindMapNode = ({ id, data }) => {
  const {
    label,
    nodeKind,
    color,
    glow,
    bg,
    description,
    branchIndex,
    childCount = 0,
    expandedBranchId,
    setExpandedBranchId,
    isLeft,
  } = data;

  const isCenter = nodeKind === 'center';
  const isBranch = nodeKind === 'branch';
  const isChild  = nodeKind === 'child';
  
  const ResolvedIcon = resolveMindMapIcon(label);

  // A branch is expanded when its id matches expandedBranchId
  const isExpanded = isBranch && expandedBranchId === id;

  const toggle = () => {
    if (!isBranch) return;
    setExpandedBranchId(isExpanded ? null : id);
  };

  // ── CENTER NODE ─────────────────────────────────────────────────
  if (isCenter) {
    return (
      <div
        style={{
          width: 160,
          fontFamily: "'Inter', system-ui, sans-serif",
          position: 'relative',
        }}
      >
        {/* Pulsing ring behind center */}
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            border: '1px solid rgba(129,140,248,0.2)',
            animation: 'mmPulse 3s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: -16,
            borderRadius: '50%',
            border: '1px solid rgba(129,140,248,0.1)',
            animation: 'mmPulse 3s ease-in-out infinite 0.6s',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            borderRadius: 20,
            background: 'linear-gradient(145deg, rgba(49,46,129,0.9) 0%, rgba(30,27,75,0.95) 100%)',
            border: '1.5px solid rgba(129,140,248,0.5)',
            boxShadow: `0 0 0 1px rgba(129,140,248,0.15), 0 0 40px rgba(129,140,248,0.25), 0 8px 32px rgba(0,0,0,0.6)`,
            backdropFilter: 'blur(16px)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 6,
            minHeight: 60,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Brain size={14} style={{ color: '#a5b4fc', flexShrink: 0 }} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#e0e7ff',
                letterSpacing: '0.01em',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              {label}
            </span>
          </div>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(129,140,248,0.6)',
            }}
          >
            Product Strategy
          </span>
        </div>

        {/* Source handles on all 4 sides so edges can exit any direction */}
        <Handle type="source" position={Position.Top}    id="t" style={handleStyle} />
        <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
        <Handle type="source" position={Position.Left}   id="l" style={handleStyle} />
        <Handle type="source" position={Position.Right}  id="r" style={handleStyle} />
      </div>
    );
  }

  // ── BRANCH NODE ─────────────────────────────────────────────────
  if (isBranch) {
    return (
      <div
        style={{
          width: 180,
          fontFamily: "'Inter', system-ui, sans-serif",
          position: 'relative',
          zIndex: isExpanded ? 50 : 1,
        }}
      >
        {/* Handles — target from center (all sides), source to children (all sides) */}
        <Handle type="target" position={Position.Top}    id="tt" style={{ ...handleStyle, background: color }} />
        <Handle type="target" position={Position.Bottom} id="tb" style={{ ...handleStyle, background: color }} />
        <Handle type="target" position={Position.Left}   id="tl" style={{ ...handleStyle, background: color }} />
        <Handle type="target" position={Position.Right}  id="tr" style={{ ...handleStyle, background: color }} />
        <Handle type="source" position={Position.Top}    id="st" style={{ ...handleStyle, background: color }} />
        <Handle type="source" position={Position.Bottom} id="sb" style={{ ...handleStyle, background: color }} />
        <Handle type="source" position={Position.Left}   id="sl" style={{ ...handleStyle, background: color }} />
        <Handle type="source" position={Position.Right}  id="sr" style={{ ...handleStyle, background: color }} />

        <motion.div
          layout
          onClick={toggle}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            cursor: 'pointer',
            borderRadius: 14,
            overflow: 'hidden',
            background: isExpanded
              ? `linear-gradient(145deg, ${bg.replace('0.08', '0.18')} 0%, rgba(13,11,40,0.95) 100%)`
              : `linear-gradient(145deg, rgba(17,14,50,0.9) 0%, rgba(10,8,35,0.95) 100%)`,
            border: isExpanded
              ? `1.5px solid ${color}55`
              : `1px solid rgba(255,255,255,0.07)`,
            backdropFilter: 'blur(14px)',
            boxShadow: isExpanded
              ? `0 0 0 1px ${color}20, 0 8px 28px rgba(0,0,0,0.55), 0 0 20px ${glow}`
              : `0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
            transition: 'box-shadow 0.3s, border-color 0.3s, background 0.3s',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 12px',
              minHeight: 56,
            }}
          >
            {/* Colour pill / accent */}
            {/* Icon Badge */}
            <div
              style={{
                flexShrink: 0,
                width: 26,
                height: 26,
                borderRadius: 8,
                background: bg,
                border: `1px solid ${color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                boxShadow: `0 0 8px ${glow}`,
              }}
            >
              <ResolvedIcon size={14} strokeWidth={2.5} />
            </div>

            {/* Label */}
            <span
              style={{
                flex: 1,
                fontSize: 12,
                fontWeight: 650,
                color: isExpanded ? '#f1f5f9' : '#cbd5e1',
                lineHeight: 1.3,
                letterSpacing: '0.005em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {label}
            </span>

            {/* Expand button */}
            {childCount > 0 && (
              <div
                style={{
                  flexShrink: 0,
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: isExpanded ? `${color}25` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isExpanded ? color + '45' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isExpanded ? color : 'rgba(148,163,184,0.6)',
                  transition: 'all 0.2s',
                }}
              >
                {isExpanded
                  ? <ChevronUp   size={11} strokeWidth={2.5} />
                  : <ChevronDown size={11} strokeWidth={2.5} />
                }
              </div>
            )}
          </div>
        </motion.div>

          {/* Expanded description popover */}
          <AnimatePresence initial={false}>
            {isExpanded && description && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  ...(isLeft ? { right: 'calc(100% + 12px)' } : { left: 'calc(100% + 12px)' }),
                  width: 240,
                  borderRadius: 12,
                  background: `linear-gradient(145deg, rgba(17,14,50,0.95) 0%, rgba(10,8,35,0.98) 100%)`,
                  border: `1px solid ${color}55`,
                  backdropFilter: 'blur(16px)',
                  boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${glow}`,
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                    margin: '0 12px',
                    display: 'none', // hide separator since it's a standalone popover now
                  }}
                />
                <div style={{ padding: '10px 12px 12px' }}>
                  {/* Label bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      marginBottom: 6,
                    }}
                  >
                    <Sparkles size={9} style={{ color, flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color,
                      }}
                    >
                      AI Insight
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 10.5,
                      color: 'rgba(148,163,184,0.85)',
                      lineHeight: 1.55,
                      margin: 0,
                      fontStyle: 'italic',
                    }}
                  >
                    {description}
                  </p>
                  {childCount > 0 && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 9.5,
                        color: color + 'aa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Layers size={9} />
                      {childCount} subtopic{childCount !== 1 ? 's' : ''} revealed
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    );
  }

  // ── CHILD NODE ──────────────────────────────────────────────────
  return (
    <div
      style={{
        width: 160,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <Handle type="target" position={Position.Top}    id="t" style={{ ...handleStyle, background: color }} />
      <Handle type="target" position={Position.Bottom} id="b" style={{ ...handleStyle, background: color }} />
      <Handle type="target" position={Position.Left}   id="l" style={{ ...handleStyle, background: color }} />
      <Handle type="target" position={Position.Right}  id="r" style={{ ...handleStyle, background: color }} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        whileHover={{ scale: 1.04, y: -1 }}
        style={{
          borderRadius: 11,
          background: `linear-gradient(145deg, rgba(17,14,50,0.88) 0%, rgba(10,8,35,0.92) 100%)`,
          border: `1px solid ${color}30`,
          backdropFilter: 'blur(12px)',
          boxShadow: `0 2px 12px rgba(0,0,0,0.4), 0 0 8px ${glow}`,
          padding: '9px 11px',
          cursor: 'default',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
        {/* Icon Badge */}
        <div
          style={{
            flexShrink: 0,
            width: 22,
            height: 22,
            borderRadius: 6,
            background: bg,
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          <ResolvedIcon size={12} strokeWidth={2.5} />
        </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#e2e8f0',
                lineHeight: 1.3,
                marginBottom: description ? 3 : 0,
              }}
            >
              {label}
            </div>
            {description && (
              <div
                style={{
                  fontSize: 10,
                  color: 'rgba(148,163,184,0.65)',
                  lineHeight: 1.45,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {description}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Shared handle style — invisible by default, visible on hover via CSS
const handleStyle = {
  background: 'rgba(129,140,248,0.6)',
  border: '2px solid rgba(10,8,35,0.9)',
  width: 8,
  height: 8,
  opacity: 0,  // hidden visually; edges still connect
};

export default memo(MindMapNode);
