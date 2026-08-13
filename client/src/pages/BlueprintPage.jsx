import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { ArrowLeft, User, Cpu, PenTool, Database, AlertCircle, Loader2 } from 'lucide-react';
import { getProjectById } from '../api/project';
import { useTheme } from '../context/ThemeContext';

// Lazy-load visualizations — only the one that matches the current route is loaded
const ProductMindMap        = lazy(() => import('../components/ProductMindMap'));
const ArchitectureBlueprint = lazy(() => import('../components/ArchitectureBlueprint'));
const BackendBlueprint      = lazy(() => import('../components/BackendBlueprint'));
const UIDesignerBlueprint   = lazy(() => import('../components/UIDesignerBlueprint'));

// ── Config for each blueprint type ────────────────────────────────────────────
const BLUEPRINT_CONFIG = {
  product: {
    agentKey:      'productManager',
    agentName:     'Product Manager',
    blueprintType: 'Mind Map Blueprint',
    Icon:          User,
    accentColor:   'rgba(45,212,191,0.9)',
    accentBorder:  'rgba(45,212,191,0.18)',
    accentBg:      'rgba(45,212,191,0.04)',
    Component:     ProductMindMap,
    loadingText:   'Loading mind map...',
  },
  architecture: {
    agentKey:      'systemArchitect',
    agentName:     'System Architect',
    blueprintType: 'Architecture Blueprint',
    Icon:          Cpu,
    accentColor:   'rgba(6,182,212,0.9)',
    accentBorder:  'rgba(6,182,212,0.18)',
    accentBg:      'rgba(6,182,212,0.04)',
    Component:     ArchitectureBlueprint,
    loadingText:   'Loading architecture diagram...',
  },
  backend: {
    agentKey:      'backendEngineer',
    agentName:     'Backend Engineer',
    blueprintType: 'Flowchart Blueprint',
    Icon:          Database,
    accentColor:   'rgba(129,140,248,0.9)',
    accentBorder:  'rgba(99,102,241,0.18)',
    accentBg:      'rgba(99,102,241,0.04)',
    Component:     BackendBlueprint,
    loadingText:   'Loading flowchart...',
  },
  ui: {
    agentKey:      'uiDesigner',
    agentName:     'UI Designer',
    blueprintType: 'Wireframe Blueprint',
    Icon:          PenTool,
    accentColor:   'rgba(236,72,153,0.9)',
    accentBorder:  'rgba(236,72,153,0.18)',
    accentBg:      'rgba(236,72,153,0.04)',
    Component:     UIDesignerBlueprint,
    loadingText:   'Loading wireframes...',
  },
};

// ── BlueprintPage ──────────────────────────────────────────────────────────────
const BlueprintPage = () => {
  const { projectId, blueprintType } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [project, setProject]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');

  const config = BLUEPRINT_CONFIG[blueprintType];

  useEffect(() => {
    if (!projectId) {
      setError('No project ID in URL.');
      setIsLoading(false);
      return;
    }
    if (!config) {
      setError(`Unknown blueprint type: "${blueprintType}".`);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        const res = await getProjectById(projectId);
        if (!cancelled) {
          if (res.success) {
            setProject(res.project);
          } else {
            setError('Project not found.');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load project.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [projectId, blueprintType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = () => navigate('/dashboard');

  // ── Unknown blueprint type ─────────────────────────────────────────────────
  if (!config) {
    return (
      <div style={{ ...styles.page, background: isDark ? 'linear-gradient(160deg, #030712 0%, #060a1c 100%)' : '#f9fafb', color: isDark ? '#e2e8f0' : '#111827' }}>
        <div style={{ ...styles.errorBox, background: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.1)' }}>
          <AlertCircle size={18} style={{ color: '#f87171', flexShrink: 0 }} />
          <span style={{ color: '#f87171', fontSize: 14 }}>
            Unknown blueprint type: &ldquo;{blueprintType}&rdquo;
          </span>
        </div>
      </div>
    );
  }

  const {
    agentName,
    blueprintType: bpLabel,
    Icon,
    accentColor,
    accentBorder,
    accentBg,
    Component,
    loadingText,
  } = config;

  const agentData   = project?.agentResponses?.[config.agentKey];
  const blueprint   = agentData?.blueprint ?? null;
  const projectName = project?.projectName ?? '';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ ...styles.page, background: isDark ? 'linear-gradient(160deg, #030712 0%, #060a1c 100%)' : '#f9fafb', color: isDark ? '#e2e8f0' : '#111827' }}>
      {/* ── Header ── */}
      <header
        style={{
          ...styles.header,
          borderBottom: `1px solid ${isDark ? accentBorder : accentBorder.replace('0.18', '0.4').replace('0.25', '0.5')}`,
          background: isDark ? accentBg : accentBg.replace('0.04', '0.1'),
        }}
      >
        {/* Back button */}
        <button
          onClick={handleBack}
          style={{ ...styles.backBtn, color: accentColor }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          aria-label="Back to project dashboard"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          <span>Back to Project</span>
        </button>

        {/* Title block */}
        <div style={styles.titleBlock}>
          <div
            style={{
              ...styles.iconWrap,
              borderColor: isDark ? accentBorder : accentBorder.replace('0.18', '0.4'),
              color: accentColor,
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            }}
          >
            <Icon size={16} />
          </div>
          <div>
            <div style={{ ...styles.agentName, color: accentColor }}>{agentName}</div>
            {projectName && (
              <div style={styles.projectNameLine}>{projectName}</div>
            )}
          </div>
          <div
            style={{
              ...styles.bpTypePill,
              borderColor: isDark ? accentBorder : accentBorder.replace('0.18', '0.4'),
              color: accentColor,
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            }}
          >
            {bpLabel}
          </div>
        </div>

        {/* Right spacer */}
        <div style={{ flex: 1 }} />
      </header>

      {/* ── Canvas ── */}
      <main style={styles.canvas}>
        {/* Loading */}
        {isLoading && (
          <div style={styles.centred}>
            <Loader2
              size={22}
              style={{
                color: accentColor,
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ color: 'rgba(148,163,184,0.6)', fontSize: 13, marginTop: 10 }}>
              {loadingText}
            </span>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div style={{ ...styles.centred }}>
            <div style={{ ...styles.errorBox, background: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.1)' }}>
              <AlertCircle size={18} style={{ color: '#f87171', flexShrink: 0 }} />
              <span style={{ color: '#f87171', fontSize: 14 }}>{error}</span>
            </div>
          </div>
        )}

        {/* No blueprint data */}
        {!isLoading && !error && !blueprint && (
          <div style={styles.centred}>
            <span style={{ color: isDark ? 'rgba(148,163,184,0.4)' : 'rgba(15,23,42,0.4)', fontSize: 13 }}>
              No blueprint data available for this agent yet.
            </span>
          </div>
        )}

        {/* Visualization */}
        {!isLoading && !error && blueprint && (
          <Suspense
            fallback={
              <div style={styles.centred}>
                <Loader2
                  size={22}
                  style={{
                    color: accentColor,
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <span
                  style={{ color: 'rgba(148,163,184,0.6)', fontSize: 13, marginTop: 10 }}
                >
                  {loadingText}
                </span>
              </div>
            }
          >
            <div style={styles.vizWrapper}>
              <Component blueprint={blueprint} />
            </div>
          </Suspense>
        )}
      </main>

      {/* Keyframes for spinner — injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ── Styles — consistent with Foundry dark/glassmorphism aesthetic ─────────────
const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '11px 20px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    flexShrink: 0,
    flexWrap: 'wrap',
    rowGap: 8,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.01em',
    padding: '6px 10px',
    borderRadius: 8,
    transition: 'background 0.15s',
    flexShrink: 0,
  },
  titleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    rowGap: 6,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  agentName: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.01em',
    lineHeight: 1.2,
  },
  projectNameLine: {
    fontSize: 11,
    color: 'rgba(148,163,184,0.45)',
    marginTop: 2,
    maxWidth: 280,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  bpTypePill: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    border: '1px solid',
    borderRadius: 6,
    padding: '3px 9px',
  },
  canvas: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: 0,
  },
  vizWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflowY: 'auto',
    padding: '16px 20px 20px',
    boxSizing: 'border-box',
  },
  centred: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorBox: {
    maxWidth: 480,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 12,
    padding: '14px 18px',
  },
};

export default BlueprintPage;
