import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, Maximize2, Minimize2, Frame, CheckCircle2 } from 'lucide-react';

const WireframeNode = ({ id, data }) => {
  const { title, description, components = [], expandedNodeId, setExpandedNodeId, screenIndex } = data;
  const isExpanded = expandedNodeId === id;

  const toggle = () => setExpandedNodeId(isExpanded ? null : id);

  // Pink palette for UI Designer
  const accentColor = '#ec4899'; // Pink 500
  const glowColor = 'rgba(236,72,153,0.3)';
  const bgColor = 'rgba(236,72,153,0.1)';

  const handleStyle = {
    background: accentColor,
    border: '2px solid rgba(17,24,39,1)',
    width: 10,
    height: 10,
    boxShadow: `0 0 6px ${glowColor}`,
  };

  return (
    <div style={{ width: 320, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Target handle for incoming prototypes */}
      <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: -5, opacity: 0 }} />
      
      {/* Top Handle to receive cross-links */}
      <Handle type="target" position={Position.Top} id="top" style={{ ...handleStyle, top: -5, opacity: 0 }} />

      <motion.div
        layout
        onClick={toggle}
        whileHover={isExpanded ? {} : { y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{
          cursor: 'pointer',
          borderRadius: 12,
          overflow: 'hidden',
          background: isExpanded
            ? 'linear-gradient(150deg, rgba(30,30,36,0.95) 0%, rgba(18,18,22,0.98) 100%)'
            : 'linear-gradient(150deg, rgba(40,40,46,0.85) 0%, rgba(20,20,25,0.9) 100%)',
          border: isExpanded 
            ? `1px solid ${accentColor}60` 
            : '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: isExpanded
            ? `0 0 0 1px ${accentColor}30, 0 16px 40px rgba(0,0,0,0.7), 0 0 24px ${glowColor}`
            : '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        {/* Figma-like screen header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px', background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Frame size={13} style={{ color: 'rgba(148,163,184,0.7)' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(148,163,184,0.7)', letterSpacing: '0.05em' }}>
              Screen {screenIndex + 1}
            </span>
          </div>
          <div style={{ color: isExpanded ? accentColor : 'rgba(148,163,184,0.5)' }}>
            {isExpanded ? <Minimize2 size={12} strokeWidth={2.5} /> : <Maximize2 size={12} strokeWidth={2.5} />}
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Wireframe UI Title block */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <div style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: 8,
              background: bgColor, border: `1px solid ${accentColor}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor
            }}>
              <LayoutTemplate size={18} strokeWidth={2} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 600, color: '#f8fafc', letterSpacing: '0.01em' }}>
                {title}
              </h4>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(148,163,184,0.85)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: isExpanded ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {description}
              </p>
            </div>
          </div>

          {/* Low-Fidelity Visual Wireframe blocks */}
          <div style={{
            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 6,
            marginBottom: isExpanded ? 16 : 0
          }}>
            {/* Header wireframe */}
            <div style={{ height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 4, width: '100%' }} />
            
            <div style={{ display: 'flex', gap: 6 }}>
              {/* Sidebar wireframe */}
              {title.toLowerCase().includes('dashboard') || title.toLowerCase().includes('workspace') ? (
                <div style={{ height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 4, width: '25%' }} />
              ) : null}
              
              {/* Content body wireframe */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 3, width: '70%' }} />
                <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 3, width: '90%' }} />
                <div style={{ height: 16, background: 'rgba(236,72,153,0.15)', border: `1px dashed ${accentColor}50`, borderRadius: 4, width: '100%', marginTop: 2 }} />
              </div>
            </div>
          </div>

          {/* Expanded Component Details */}
          <AnimatePresence initial={false}>
            {isExpanded && components.length > 0 && (
              <motion.div
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`, margin: '0 0 12px 0' }} />
                
                <h5 style={{ fontSize: 10, fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Screen Composition
                </h5>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {components.map((comp, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8 }}>
                      <CheckCircle2 size={12} style={{ color: accentColor, flexShrink: 0, marginTop: 2 }} strokeWidth={2.5} />
                      <div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{comp.title}</div>
                        <div style={{ fontSize: 10.5, color: '#94a3b8', lineHeight: 1.4 }}>{comp.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Source handle for outgoing prototypes */}
      <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: -5, opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...handleStyle, bottom: -5, opacity: 0 }} />
    </div>
  );
};

export default memo(WireframeNode);
