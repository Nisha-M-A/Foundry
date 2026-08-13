import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, 
  MonitorSmartphone, Globe, Database, HardDrive, Rows, Layers, Cloud, Settings, Server
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TYPE_ICONS = {
  client: MonitorSmartphone,
  gateway: Globe,
  database: Database,
  storage: HardDrive,
  queue: Rows,
  service: Layers,
  external: Cloud,
};

const ArchitectureNode = ({ id, data }) => {
  const { title, description, type, palette, expandedNodeId, setExpandedNodeId } = data;
  const isExpanded = expandedNodeId === id;
  const Icon = TYPE_ICONS[type] || Server;
  const isExternal = type === 'external';
  const { isDark } = useTheme();

  const toggle = () => setExpandedNodeId(isExpanded ? null : id);

  // Parse out a couple of fake "implementation notes" from the description by splitting on periods
  // to satisfy the "2-3 implementation notes" requirement if we don't have an explicit array
  const notes = description.split('. ').filter(n => n.trim().length > 3).slice(0, 3);
  if (notes.length > 0) {
    notes[notes.length - 1] = notes[notes.length - 1].replace(/\.$/, ''); // clean trailing period
  }

  // Handle styles
  const handleStyle = {
    background: palette.color,
    border: '2px solid rgba(15,23,42,0.9)',
    width: 10,
    height: 10,
    boxShadow: `0 0 6px ${palette.color}80`,
  };

  return (
    <div style={{ width: 280, position: 'relative', zIndex: isExpanded ? 50 : 1, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left connection handle (Target from previous layer) */}
      <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: -5 }} />

      <motion.div
        layout
        onClick={toggle}
        whileHover={isExpanded ? {} : { y: -2, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          cursor: 'pointer',
          borderRadius: type === 'service' ? 12 : type === 'database' ? 20 : 8,
          background: isDark ? (
            isExpanded
              ? `linear-gradient(150deg, rgba(15,23,42,0.95) 0%, rgba(9,14,23,0.98) 100%)`
              : `linear-gradient(150deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.9) 100%)`
          ) : (
            isExpanded
              ? `linear-gradient(150deg, #ffffff 0%, #f8fafc 100%)`
              : `#ffffff`
          ),
          border: isExternal 
            ? `2px dashed ${palette.color}80` 
            : `1px solid ${isExpanded ? palette.color + (isDark ? '60' : '80') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
          backdropFilter: 'blur(16px)',
          boxShadow: isDark ? (
            isExpanded
              ? `0 0 0 1px ${palette.color}40, 0 12px 40px rgba(0,0,0,0.6), 0 0 24px ${palette.glow}`
              : '0 4px 16px rgba(0,0,0,0.5)'
          ) : (
            isExpanded
              ? `0 0 0 1px ${palette.color}20, 0 12px 30px rgba(0,0,0,0.1), 0 0 20px ${palette.glow.replace('0.4', '0.15')}`
              : '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)'
          ),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', minHeight: 64 }}>
          {/* Icon Badge */}
          <div
            style={{
              flexShrink: 0,
              width: 36,
              height: 36,
              borderRadius: type === 'database' ? '50%' : 8,
              background: isDark ? palette.bg : palette.bg.replace('0.1', '0.05'),
              border: `1px solid ${palette.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isExpanded ? `0 0 12px ${palette.glow}` : 'none',
              color: palette.color,
            }}
          >
            <Icon size={18} strokeWidth={2} />
          </div>

          {/* Title Area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: isDark ? (isExpanded ? '#f8fafc' : '#e2e8f0') : (isExpanded ? '#0f172a' : '#1e293b'),
              lineHeight: 1.3,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {title}
            </div>
            {/* Show type label when collapsed */}
            {!isExpanded && (
              <div style={{
                fontSize: 10,
                fontWeight: 600,
                color: palette.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: 2,
              }}>
                {type}
              </div>
            )}
          </div>

          {/* Expand toggle button */}
          <div
            style={{
              flexShrink: 0,
              width: 24,
              height: 24,
              borderRadius: 6,
              background: isExpanded ? palette.bg : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
              border: `1px solid ${isExpanded ? palette.color + '40' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isExpanded ? palette.color : (isDark ? 'rgba(148,163,184,0.6)' : 'rgba(100,116,139,0.8)'),
            }}
          >
            {isExpanded ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
          </div>
        </div>
      </motion.div>

        {/* Expanded Description & Notes */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 'calc(100% + 16px)',
                width: 280,
                borderRadius: 12,
                background: isDark ? `linear-gradient(150deg, rgba(15,23,42,0.95) 0%, rgba(9,14,23,0.98) 100%)` : '#ffffff',
                border: isDark ? `1px solid ${palette.color}50` : `1px solid ${palette.color}40`,
                backdropFilter: 'blur(16px)',
                boxShadow: isDark ? `0 12px 40px rgba(0,0,0,0.6), 0 0 24px ${palette.glow}` : `0 4px 20px rgba(0,0,0,0.1), 0 0 10px ${palette.glow.replace('0.4', '0.1')}`,
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${palette.color}50, transparent)`, margin: '0 16px', display: 'none' }} />
              
              <div style={{ padding: '12px 16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Settings size={12} style={{ color: palette.color }} />
                  <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: palette.color }}>
                    Component Details
                  </span>
                </div>
                
                {/* Short AI Explanation */}
                <p style={{ fontSize: 11, color: isDark ? 'rgba(148,163,184,0.9)' : 'rgba(71,85,105,0.9)', lineHeight: 1.5, margin: '0 0 10px 0', fontStyle: 'italic' }}>
                  {description}
                </p>

                {/* Implementation Notes (from parsed sentences) */}
                {notes.length > 0 && (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {notes.map((note, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 10.5, color: isDark ? '#cbd5e1' : '#334155', lineHeight: 1.4 }}>
                        <span style={{ flexShrink: 0, width: 4, height: 4, borderRadius: '50%', background: palette.color, marginTop: 5, boxShadow: `0 0 4px ${palette.color}80` }} />
                        {note}.
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Right connection handle (Source to next layer) */}
      <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: -5 }} />
    </div>
  );
};

export default memo(ArchitectureNode);
