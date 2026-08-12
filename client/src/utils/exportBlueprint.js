import { Document, HeadingLevel, ImageRun, Packer, PageBreak, Paragraph, TextRun } from 'docx';
import { jsPDF } from 'jspdf';

const AGENTS = [
  {
    key: 'productManager',
    number: '01',
    title: 'Product Manager',
    detailTitle: 'Product Manager Details',
    diagramTitle: 'Static Mind Map',
    color: '#2dd4bf',
    diagram: 'mindmap',
  },
  {
    key: 'systemArchitect',
    number: '02',
    title: 'System Architect',
    detailTitle: 'Architecture Details',
    diagramTitle: 'Static Architecture Diagram',
    color: '#06b6d4',
    diagram: 'architecture',
  },
  {
    key: 'backendEngineer',
    number: '03',
    title: 'Backend Engineer',
    detailTitle: 'Backend Details',
    diagramTitle: 'Static Backend Flowchart',
    color: '#818cf8',
    diagram: 'flowchart',
  },
  {
    key: 'uiDesigner',
    number: '04',
    title: 'UI Designer',
    detailTitle: 'UI / Screen Details',
    diagramTitle: 'Static Wireframe',
    color: '#ec4899',
    diagram: 'wireframe',
  },
];

const BRANCH_COLORS = ['#60a5fa', '#34d399', '#f97316', '#a78bfa', '#f472b6', '#2dd4bf'];

const asArray = (value) => (Array.isArray(value) ? value : []);
const asText = (value, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim() : fallback);
const projectTitle = (project) => asText(project?.projectName || project?.title, 'Untitled Foundry Project');
const safeFilename = (name) => name.replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'foundry-blueprint';

const escapeXml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const wrapWords = (value, maxChars = 28, maxLines = 3) => {
  const words = asText(value, 'Untitled').split(/\s+/);
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  const clipped = lines.slice(0, maxLines);
  if (lines.length > maxLines) clipped[maxLines - 1] = `${clipped[maxLines - 1].replace(/\.+$/, '')}...`;
  return clipped;
};

const textSvg = (label, x, y, options = {}) => {
  const { size = 17, color = '#e5e7eb', weight = 700, maxChars = 28, maxLines = 3, anchor = 'middle' } = options;
  return wrapWords(label, maxChars, maxLines)
    .map((line, index) => (
      `<text x="${x}" y="${y + index * (size + 5)}" text-anchor="${anchor}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="Inter, Arial, sans-serif">${escapeXml(line)}</text>`
    ))
    .join('');
};

const boxSvg = ({ x, y, width, height, title, subtitle, stroke, fill = '#111827', radius = 14, titleSize = 17, subSize = 12 }) => `
  <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  ${textSvg(title, x + width / 2, y + 31, { size: titleSize, maxChars: 25, maxLines: subtitle ? 2 : 3 })}
  ${subtitle ? textSvg(subtitle, x + width / 2, y + height - 26, { size: subSize, weight: 500, color: '#94a3b8', maxChars: 34, maxLines: 2 }) : ''}
`;

const frameSvg = (width, height, body) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/>
      </marker>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#020617" flood-opacity="0.28"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" rx="24" fill="#020617"/>
    <g filter="url(#shadow)">${body}</g>
  </svg>
`;

const lineSvg = (x1, y1, x2, y2, color = '#64748b') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" marker-end="url(#arrow)" opacity="0.85"/>`;

const findPoint = (items, id) => items.find((item) => item.id === id);

const mindMapSvg = (blueprint = {}) => {
  const width = 1000;
  const height = 660;
  const cx = width / 2;
  const cy = height / 2;
  const branches = asArray(blueprint.branches);
  const radius = branches.length <= 4 ? 215 : 250;
  let body = boxSvg({
    x: cx - 110,
    y: cy - 42,
    width: 220,
    height: 84,
    title: blueprint.center || 'Product Blueprint',
    stroke: '#818cf8',
    fill: '#111827',
  });

  branches.forEach((branch, index) => {
    const angle = ((Math.PI * 2) / Math.max(branches.length, 1)) * index - Math.PI / 2;
    const color = BRANCH_COLORS[index % BRANCH_COLORS.length];
    const bx = cx + Math.cos(angle) * radius;
    const by = cy + Math.sin(angle) * radius;
    body += lineSvg(cx, cy, bx, by, color);
    body += boxSvg({
      x: bx - 95,
      y: by - 38,
      width: 190,
      height: 76,
      title: branch.title,
      subtitle: branch.description,
      stroke: color,
      fill: '#0f172a',
    });

    asArray(branch.children).slice(0, 3).forEach((child, childIndex) => {
      const offset = (childIndex - (Math.min(asArray(branch.children).length, 3) - 1) / 2) * 70;
      const childX = bx + Math.cos(angle) * 135 + Math.cos(angle + Math.PI / 2) * offset;
      const childY = by + Math.sin(angle) * 135 + Math.sin(angle + Math.PI / 2) * offset;
      body += lineSvg(bx, by, childX, childY, color);
      body += boxSvg({
        x: childX - 74,
        y: childY - 28,
        width: 148,
        height: 56,
        title: child.title,
        stroke: color,
        fill: '#111827',
        titleSize: 13,
      });
    });
  });

  return frameSvg(width, height, body);
};

const gridPositions = (items, columns, xGap, yGap, boxWidth, boxHeight, marginX = 60, marginY = 70) =>
  items.map((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    return {
      ...item,
      x: marginX + col * xGap,
      y: marginY + row * yGap,
      width: boxWidth,
      height: boxHeight,
    };
  });

const architectureSvg = (blueprint = {}) => {
  const components = asArray(blueprint.components);
  const columns = Math.min(5, Math.max(3, Math.ceil(Math.sqrt(Math.max(components.length, 1) * 1.4))));
  const rows = Math.max(1, Math.ceil(components.length / columns));
  const width = Math.max(920, 100 + columns * 190);
  const height = Math.max(430, 120 + rows * 125);
  const positioned = gridPositions(components, columns, 185, 125, 150, 76);
  let body = '';

  asArray(blueprint.connections).forEach((connection) => {
    const from = findPoint(positioned, connection.from);
    const to = findPoint(positioned, connection.to);
    if (from && to) {
      body += lineSvg(from.x + from.width / 2, from.y + from.height / 2, to.x + to.width / 2, to.y + to.height / 2, '#06b6d4');
    }
  });

  positioned.forEach((component) => {
    body += boxSvg({
      x: component.x,
      y: component.y,
      width: component.width,
      height: component.height,
      title: component.title,
      subtitle: component.description,
      stroke: '#06b6d4',
      fill: '#082f49',
      titleSize: 14,
      subSize: 10,
    });
  });

  return frameSvg(width, height, body || textSvg('No architecture components available', width / 2, height / 2));
};

const flowchartSvg = (blueprint = {}) => {
  const nodes = asArray(blueprint.nodes);
  const columns = Math.min(5, Math.max(1, Math.ceil(nodes.length / 4)));
  const rows = Math.max(1, Math.ceil(nodes.length / Math.max(columns, 1)));
  const width = Math.max(780, 110 + columns * 225);
  const height = Math.max(390, 115 + rows * 115);
  const positioned = gridPositions(nodes, Math.max(columns, 1), 225, 115, 170, 76);
  let body = '';

  asArray(blueprint.edges).forEach((edge) => {
    const from = findPoint(positioned, edge.from);
    const to = findPoint(positioned, edge.to);
    if (from && to) {
      body += lineSvg(from.x + from.width / 2, from.y + from.height / 2, to.x + to.width / 2, to.y + to.height / 2, '#818cf8');
    }
  });

  positioned.forEach((node, index) => {
    body += `<circle cx="${node.x + 16}" cy="${node.y + 18}" r="13" fill="#312e81" stroke="#818cf8" stroke-width="1.5"/>`;
    body += textSvg(String(index + 1), node.x + 16, node.y + 23, { size: 12, maxChars: 2, maxLines: 1 });
    body += boxSvg({
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      title: node.title,
      subtitle: node.description,
      stroke: '#818cf8',
      fill: '#1e1b4b',
      titleSize: 14,
      subSize: 10,
    });
  });

  return frameSvg(width, height, body || textSvg('No backend flow nodes available', width / 2, height / 2));
};

const wireframeSvg = (blueprint = {}) => {
  const screens = asArray(blueprint.screens);
  const columns = screens.length > 6 ? 4 : 3;
  const rows = Math.max(1, Math.ceil(screens.length / columns));
  const width = Math.max(940, 80 + columns * 245);
  const height = Math.max(520, 105 + rows * 260);
  const positioned = gridPositions(screens, columns, 245, 260, 190, 210, 55, 60);
  let body = '';

  positioned.forEach((screen, index) => {
    if (index < positioned.length - 1) {
      const next = positioned[index + 1];
      body += lineSvg(screen.x + screen.width, screen.y + 62, next.x, next.y + 62, '#ec4899');
    }
    if (index === 0 && positioned.length > 2) {
      const cross = positioned[2];
      body += lineSvg(screen.x + screen.width, screen.y + screen.height - 45, cross.x, cross.y + screen.height - 45, '#f472b6');
    }
  });

  positioned.forEach((screen) => {
    body += `<rect x="${screen.x}" y="${screen.y}" width="${screen.width}" height="${screen.height}" rx="18" fill="#111827" stroke="#ec4899" stroke-width="2"/>`;
    body += `<rect x="${screen.x + 14}" y="${screen.y + 16}" width="${screen.width - 28}" height="26" rx="8" fill="#312e81" opacity="0.95"/>`;
    body += textSvg(screen.title, screen.x + screen.width / 2, screen.y + 34, { size: 13, maxChars: 22, maxLines: 1 });
    body += `<rect x="${screen.x + 18}" y="${screen.y + 58}" width="${screen.width - 36}" height="34" rx="8" fill="#1f2937" stroke="#475569" stroke-width="1"/>`;
    body += `<rect x="${screen.x + 18}" y="${screen.y + 106}" width="${screen.width - 36}" height="24" rx="7" fill="#0f172a" stroke="#334155" stroke-width="1"/>`;
    body += `<rect x="${screen.x + 18}" y="${screen.y + 140}" width="${screen.width - 36}" height="24" rx="7" fill="#0f172a" stroke="#334155" stroke-width="1"/>`;
    body += textSvg(screen.description, screen.x + screen.width / 2, screen.y + 182, { size: 10, weight: 500, color: '#94a3b8', maxChars: 26, maxLines: 2 });
  });

  return frameSvg(width, height, body || textSvg('No UI screens available', width / 2, height / 2));
};

const diagramSvg = (agent, blueprint) => {
  if (agent.diagram === 'mindmap') return mindMapSvg(blueprint);
  if (agent.diagram === 'architecture') return architectureSvg(blueprint);
  if (agent.diagram === 'flowchart') return flowchartSvg(blueprint);
  return wireframeSvg(blueprint);
};

const exportSections = (project) =>
  AGENTS.map((agent) => {
    const response = project?.agentResponses?.[agent.key] || null;
    return { ...agent, response, blueprint: response?.blueprint || null };
  });

const detailItems = (agent, blueprint = {}) => {
  if (agent.diagram === 'mindmap') {
    return asArray(blueprint.branches).map((branch) => ({
      title: branch.title,
      description: branch.description,
      children: asArray(branch.children).map((child) => ({
        title: child.title,
        description: child.description,
      })),
    }));
  }

  if (agent.diagram === 'architecture') {
    return asArray(blueprint.components).map((component) => ({
      title: component.title,
      description: component.description,
      notes: asArray(blueprint.connections)
        .filter((connection) => connection.from === component.id || connection.to === component.id)
        .map((connection) => `Connection: ${connection.from} -> ${connection.to}`),
    }));
  }

  if (agent.diagram === 'flowchart') {
    return asArray(blueprint.nodes).map((node) => ({
      title: node.title,
      description: node.description,
      notes: asArray(node.details),
    }));
  }

  return asArray(blueprint.screens).map((screen) => ({
    title: screen.title,
    description: screen.description,
    children: asArray(screen.components).map((component) => ({
      title: component.title,
      description: component.description,
    })),
  }));
};

const svgToPng = async (svg) => {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    const scale = Math.min(2, 1800 / Math.max(image.width, image.height));
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const context = canvas.getContext('2d');
    context.fillStyle = '#020617';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    const buffer = await fetch(dataUrl).then((response) => response.arrayBuffer());
    return { dataUrl, buffer, width: image.width, height: image.height };
  } finally {
    URL.revokeObjectURL(url);
  }
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const projectMetadata = (project) => [
  ['Project Name', projectTitle(project)],
  ['Original Product Idea / Prompt', asText(project?.prompt, 'Not available')],
  ['Created', project?.createdAt ? new Date(project.createdAt).toLocaleString() : 'Not available'],
  ['Last Updated', project?.updatedAt ? new Date(project.updatedAt).toLocaleString() : 'Not available'],
];

const addPdfFooter = (pdf) => {
  const totalPages = pdf.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    pdf.setFontSize(8);
    pdf.setTextColor(120, 130, 150);
    pdf.text(`Foundry AI Product Blueprint - Page ${page} of ${totalPages}`, 40, 812);
  }
};

const rgbFromHex = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));

const addPdfTextBlock = (pdf, text, x, y, options = {}) => {
  const { maxWidth = 515, lineHeight = 13, fontSize = 10, color = [55, 65, 81], font = 'normal' } = options;
  pdf.setFont('helvetica', font);
  pdf.setFontSize(fontSize);
  pdf.setTextColor(...color);
  const lines = pdf.splitTextToSize(asText(text, 'Not available'), maxWidth);
  pdf.text(lines, x, y);
  return y + lines.length * lineHeight;
};

export const exportBlueprintPdf = async (project) => {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
  const margin = 40;
  const contentWidth = 515;
  let y = 58;

  const ensureSpace = (needed = 72) => {
    if (y + needed > 770) {
      pdf.addPage();
      y = 54;
    }
  };

  const heading = (label, level = 1, color = '#111827') => {
    ensureSpace(level === 1 ? 82 : 48);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(level === 1 ? 20 : 13);
    pdf.setTextColor(...rgbFromHex(color));
    pdf.text(label, margin, y);
    y += level === 1 ? 30 : 22;
  };

  pdf.setFillColor(2, 6, 23);
  pdf.rect(0, 0, 595, 170, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(29);
  pdf.text('FOUNDRY', margin, 70);
  pdf.setFontSize(17);
  pdf.text('AI PRODUCT BLUEPRINT', margin, 98);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(203, 213, 225);
  pdf.text(projectTitle(project), margin, 130);
  y = 205;

  heading('Project Information', 2, '#111827');
  projectMetadata(project).forEach(([label, value]) => {
    ensureSpace(44);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.text(label, margin, y);
    y += 14;
    y = addPdfTextBlock(pdf, value, margin, y, { maxWidth: contentWidth, lineHeight: 12 });
    y += 12;
  });

  const sections = exportSections(project);

  for (const section of sections) {
    pdf.addPage();
    y = 54;
    heading(`${section.number} - ${section.title}`, 1, section.color);

    if (section.response?.summary) {
      heading('Overview', 2, '#111827');
      y = addPdfTextBlock(pdf, section.response.summary, margin, y, { maxWidth: contentWidth, lineHeight: 13 });
      y += 16;
    }

    const tasks = asArray(section.response?.tasks);
    if (tasks.length) {
      heading('Key Tasks', 2, '#111827');
      tasks.forEach((task) => {
        ensureSpace(24);
        y = addPdfTextBlock(pdf, `- ${task}`, margin + 12, y, { maxWidth: contentWidth - 12, lineHeight: 12 });
      });
      y += 12;
    }

    if (!section.response) {
      y = addPdfTextBlock(pdf, 'No saved agent response is available for this section.', margin, y, { maxWidth: contentWidth, lineHeight: 13 });
      y += 16;
    }

    if (section.blueprint) {
      heading(section.diagramTitle, 2, '#111827');
      const image = await svgToPng(diagramSvg(section, section.blueprint));
      const naturalHeight = (image.height / image.width) * contentWidth;
      const imageHeight = Math.min(300, naturalHeight);
      const imageWidth = naturalHeight > 300 ? (image.width / image.height) * imageHeight : contentWidth;
      ensureSpace(imageHeight + 28);
      pdf.addImage(image.dataUrl, 'PNG', margin + (contentWidth - imageWidth) / 2, y, imageWidth, imageHeight, undefined, 'FAST');
      y += imageHeight + 28;
    }

    const details = detailItems(section, section.blueprint);
    if (details.length) {
      heading(section.detailTitle, 2, '#111827');
      details.forEach((item, index) => {
        ensureSpace(62);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(17, 24, 39);
        pdf.text(`${index + 1}. ${asText(item.title, 'Untitled')}`, margin, y);
        y += 15;
        if (item.description) {
          y = addPdfTextBlock(pdf, `Description: ${item.description}`, margin + 12, y, { maxWidth: contentWidth - 12, lineHeight: 12 });
          y += 4;
        }
        asArray(item.notes).forEach((note) => {
          ensureSpace(22);
          y = addPdfTextBlock(pdf, `- ${note}`, margin + 24, y, { maxWidth: contentWidth - 24, lineHeight: 12 });
        });
        asArray(item.children).forEach((child) => {
          ensureSpace(32);
          y = addPdfTextBlock(pdf, `- ${asText(child.title, 'Untitled')}: ${asText(child.description, '')}`, margin + 24, y, { maxWidth: contentWidth - 24, lineHeight: 12 });
        });
        y += 12;
      });
    }
  }

  addPdfFooter(pdf);
  pdf.save(`${safeFilename(projectTitle(project))}-blueprint.pdf`);
};

const docParagraph = (text, options = {}) =>
  new Paragraph({
    children: [new TextRun({ text: asText(text, 'Not available'), ...options })],
    spacing: { after: 120 },
  });

const docHeading = (text, level = HeadingLevel.HEADING_1) =>
  new Paragraph({
    text,
    heading: level,
    spacing: { before: 180, after: 160 },
  });

const docBullet = (text) =>
  new Paragraph({
    children: [new TextRun(asText(text, 'Not available'))],
    bullet: { level: 0 },
    spacing: { after: 80 },
  });

export const exportBlueprintDocx = async (project) => {
  const children = [
    new Paragraph({
      children: [new TextRun({ text: 'FOUNDRY', bold: true, size: 44, color: '020617' })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'AI PRODUCT BLUEPRINT', bold: true, size: 26, color: '334155' })],
      spacing: { after: 260 },
    }),
    docHeading('Project Information', HeadingLevel.HEADING_1),
  ];

  projectMetadata(project).forEach(([label, value]) => {
    children.push(docParagraph(`${label}: ${value}`));
  });

  for (const section of exportSections(project)) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(docHeading(`${section.number} - ${section.title}`, HeadingLevel.HEADING_1));

    if (section.response?.summary) {
      children.push(docHeading('Overview', HeadingLevel.HEADING_2));
      children.push(docParagraph(section.response.summary));
    }

    const tasks = asArray(section.response?.tasks);
    if (tasks.length) {
      children.push(docHeading('Key Tasks', HeadingLevel.HEADING_2));
      tasks.forEach((task) => children.push(docBullet(task)));
    }

    if (!section.response) {
      children.push(docParagraph('No saved agent response is available for this section.'));
    }

    if (section.blueprint) {
      children.push(docHeading(section.diagramTitle, HeadingLevel.HEADING_2));
      const image = await svgToPng(diagramSvg(section, section.blueprint));
      const maxWidth = 620;
      const maxHeight = 390;
      const naturalHeight = (image.height / image.width) * maxWidth;
      const height = Math.min(maxHeight, Math.round(naturalHeight));
      const width = naturalHeight > maxHeight ? Math.round((image.width / image.height) * height) : maxWidth;
      children.push(new Paragraph({
        children: [new ImageRun({ data: image.buffer, transformation: { width, height }, type: 'png' })],
        spacing: { after: 240 },
      }));
    }

    const details = detailItems(section, section.blueprint);
    if (details.length) {
      children.push(docHeading(section.detailTitle, HeadingLevel.HEADING_2));
      details.forEach((item, index) => {
        children.push(docParagraph(`${index + 1}. ${asText(item.title, 'Untitled')}`, { bold: true }));
        if (item.description) children.push(docParagraph(`Description: ${item.description}`));
        asArray(item.notes).forEach((note) => children.push(docBullet(note)));
        asArray(item.children).forEach((child) => children.push(docBullet(`${asText(child.title, 'Untitled')}: ${asText(child.description, '')}`)));
      });
    }
  }

  const doc = new Document({
    creator: 'Foundry',
    description: 'AI Product Blueprint export generated from saved Foundry project data.',
    title: `${projectTitle(project)} Blueprint`,
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${safeFilename(projectTitle(project))}-blueprint.docx`);
};
