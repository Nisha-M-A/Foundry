import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Database,
  Server,
  Shield,
  Layers,
  Zap,
  GitBranch,
  Lock,
  Globe,
  Package,
  Code2,
  Cpu,
  Box,
  ArrowRightLeft,
  Cloud,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Maps node title keywords → icon component + accent colour.
 * Falls back to a sensible default when nothing matches.
 */
function resolveNodeMeta(title = '', index = 0) {
  const t = title.toLowerCase();

  const palette = [
    { icon: Database,        color: '#818cf8', glow: 'rgba(129,140,248,0.25)' }, // indigo
    { icon: Server,          color: '#34d399', glow: 'rgba(52,211,153,0.25)'  }, // emerald
    { icon: Shield,          color: '#f472b6', glow: 'rgba(244,114,182,0.25)' }, // pink
    { icon: Zap,             color: '#fbbf24', glow: 'rgba(251,191,36,0.25)'  }, // amber
    { icon: GitBranch,       color: '#60a5fa', glow: 'rgba(96,165,250,0.25)'  }, // blue
    { icon: Cloud,           color: '#a78bfa', glow: 'rgba(167,139,250,0.25)' }, // violet
    { icon: ArrowRightLeft,  color: '#2dd4bf', glow: 'rgba(45,212,191,0.25)'  }, // teal
    { icon: Package,         color: '#fb923c', glow: 'rgba(251,146,60,0.25)'  }, // orange
  ];

  if (t.includes('auth') || t.includes('login') || t.includes('session'))
    return { icon: Lock,           color: '#f472b6', glow: 'rgba(244,114,182,0.25)' };
  if (t.includes('api') || t.includes('endpoint') || t.includes('rest') || t.includes('route'))
    return { icon: Globe,          color: '#60a5fa', glow: 'rgba(96,165,250,0.25)' };
  if (t.includes('db') || t.includes('database') || t.includes('sql') || t.includes('mongo') || t.includes('redis'))
    return { icon: Database,       color: '#818cf8', glow: 'rgba(129,140,248,0.25)' };
  if (t.includes('server') || t.includes('backend') || t.includes('node') || t.includes('express'))
    return { icon: Server,         color: '#34d399', glow: 'rgba(52,211,153,0.25)' };
  if (t.includes('cache') || t.includes('queue') || t.includes('worker') || t.includes('job'))
    return { icon: Zap,            color: '#fbbf24', glow: 'rgba(251,191,36,0.25)' };
  if (t.includes('service') || t.includes('micro'))
    return { icon: Layers,         color: '#a78bfa', glow: 'rgba(167,139,250,0.25)' };
  if (t.includes('deploy') || t.includes('cloud') || t.includes('aws') || t.includes('gcp') || t.includes('azure'))
    return { icon: Cloud,          color: '#38bdf8', glow: 'rgba(56,189,248,0.25)' };
  if (t.includes('logic') || t.includes('business') || t.includes('process'))
    return { icon: Code2,          color: '#fb923c', glow: 'rgba(251,146,60,0.25)' };
  if (t.includes('package') || t.includes('module') || t.includes('lib'))
    return { icon: Package,        color: '#86efac', glow: 'rgba(134,239,172,0.25)' };
  if (t.includes('cpu') || t.includes('compute') || t.includes('process'))
    return { icon: Cpu,            color: '#f9a8d4', glow: 'rgba(249,168,212,0.25)' };
  if (t.includes('event') || t.includes('stream') || t.includes('pubsub'))
    return { icon: ArrowRightLeft, color: '#2dd4bf', glow: 'rgba(45,212,191,0.25)' };

  // Fallback — cycle through palette by index
  return palette[index % palette.length];
}

/**
 * Premium FlowNode for the Backend Blueprint.
 *
 * Design: glassmorphism card with icon, title, brief description,
 * smooth accordion detail panel, single-node-at-a-time.
 */
const FlowNode = ({ id, data }) => {
  const isExpanded = data.expandedId === id;
  const { icon: Icon, color, glow } = resolveNodeMeta(data.title, data.nodeIndex ?? 0);
  const { isDark } = useTheme();

  const toggle = () => data.setExpandedId(isExpanded ? null : id);

  return (
    <div style={{ width: 300, position: 'relative', zIndex: isExpanded ? 50 : 1, fontFamily: "'Inter', 'system-ui', sans-serif" }}>

      {/* ── Top connection handle ── */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: color,
          border: '2px solid rgba(15,12,41,0.9)',
          width: 9,
          height: 9,
          top: -4.5,
          boxShadow: `0 0 6px ${color}`,
        }}
      />

      {/* ── Main node card ── */}
      <motion.div
        layout
        onClick={toggle}
        whileHover={isExpanded ? {} : { y: -2, scale: 1.012 }}
        whileTap={{ scale: 0.982 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          cursor: 'pointer',
          borderRadius: 16,
          background: isDark ? (
            isExpanded
              ? 'linear-gradient(150deg, rgba(30,27,75,0.95) 0%, rgba(20,18,60,0.98) 100%)'
              : 'linear-gradient(150deg, rgba(20,18,55,0.92) 0%, rgba(13,11,40,0.96) 100%)'
          ) : (
            isExpanded
              ? 'linear-gradient(150deg, #ffffff 0%, #f8fafc 100%)'
              : '#ffffff'
          ),
          border: isDark ? (
            isExpanded
              ? `1px solid ${color}55`
              : '1px solid rgba(99,102,241,0.18)'
          ) : (
            isExpanded
              ? `1px solid ${color}55`
              : '1px solid rgba(0,0,0,0.06)'
          ),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: isDark ? (
            isExpanded
              ? `0 0 0 1px ${color}30, 0 12px 40px rgba(0,0,0,0.6), 0 0 24px ${glow}`
              : '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)'
          ) : (
            isExpanded
              ? `0 0 0 1px ${color}15, 0 12px 30px rgba(0,0,0,0.1), 0 0 24px ${glow.replace('0.25', '0.1')}`
              : '0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)'
          ),
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* ── Header row ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '13px 14px',
            minHeight: 64,
          }}
        >
          {/* Icon container */}
          <div
            style={{
              flexShrink: 0,
              width: 34,
              height: 34,
              borderRadius: 10,
              background: isDark ? `${color}18` : `${color}10`,
              border: `1px solid ${color}35`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isExpanded ? `0 0 12px ${glow}` : 'none',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <Icon size={16} style={{ color, strokeWidth: 2 }} />
          </div>

          {/* Title + short description */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 650,
                color: isDark ? (isExpanded ? '#e0e7ff' : '#c7d2fe') : (isExpanded ? '#1e293b' : '#334155'),
                lineHeight: 1.3,
                letterSpacing: '0.008em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                marginBottom: data.description ? 3 : 0,
              }}
            >
              {data.title}
            </div>
            {data.description && !isExpanded && (
              <div
                style={{
                  fontSize: 10.5,
                  color: isDark ? 'rgba(148,163,184,0.75)' : 'rgba(100,116,139,0.85)',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {data.description}
              </div>
            )}
          </div>

          {/* Expand toggle button */}
          <div
            style={{
              flexShrink: 0,
              width: 22,
              height: 22,
              borderRadius: 7,
              background: isExpanded ? `${color}25` : (isDark ? 'rgba(99,102,241,0.08)' : 'rgba(0,0,0,0.03)'),
              border: `1px solid ${isExpanded ? color + '40' : (isDark ? 'rgba(99,102,241,0.18)' : 'rgba(0,0,0,0.06)')}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isExpanded ? color : (isDark ? 'rgba(99,102,241,0.7)' : 'rgba(100,116,139,0.8)'),
              transition: 'all 0.2s ease',
            }}
          >
            {isExpanded
              ? <ChevronUp size={12} strokeWidth={2.5} />
              : <ChevronDown size={12} strokeWidth={2.5} />
            }
          </div>
        </div>
      </motion.div>

        {/* ── Expandable detail popover ── */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: 300,
                marginTop: 8,
                borderRadius: 16,
                background: isDark ? 'linear-gradient(150deg, rgba(30,27,75,0.95) 0%, rgba(20,18,60,0.98) 100%)' : '#ffffff',
                border: `1px solid ${color}55`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: isDark ? `0 12px 40px rgba(0,0,0,0.8), 0 0 24px ${glow}` : `0 8px 30px rgba(0,0,0,0.15), 0 0 15px ${glow.replace('0.25', '0.1')}`,
                overflow: 'hidden',
                zIndex: 50,
              }}
            >
              <div style={{ padding: '16px' }}>
                {/* Section label */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 12,
                      borderRadius: 2,
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: color,
                    }}
                  >
                    Implementation Details
                  </span>
                </div>

                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {(data.details || []).map((detail, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        fontSize: 11,
                        color: isDark ? 'rgba(148,163,184,0.9)' : 'rgba(51,65,85,0.9)',
                        lineHeight: 1.45,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: color,
                          opacity: 0.8,
                          marginTop: 5,
                          boxShadow: `0 0 5px ${color}80`,
                        }}
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* ── Bottom connection handle ── */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: color,
          border: '2px solid rgba(15,12,41,0.9)',
          width: 9,
          height: 9,
          bottom: -4.5,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
    </div>
  );
};

export default memo(FlowNode);
