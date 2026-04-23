// ELAN Factory — Chart.js global theming
// Premium dark-mode polish: no heavy grids, soft gradients, tabular nums, custom tooltips

(function() {
  if (typeof Chart === 'undefined') return;

  // Read palette from CSS custom properties (live — responds to theme)
  const cs = getComputedStyle(document.documentElement);
  const v = (name, fallback) => (cs.getPropertyValue(name).trim() || fallback);

  const palette = {
    text: v('--text', '#fafafa'),
    muted: v('--text-muted', '#a1a1aa'),
    dim: v('--text-dim', '#71717a'),
    subtle: v('--text-subtle', '#52525b'),
    surface: v('--surface', '#0f0f11'),
    surface2: v('--surface-2', '#161619'),
    border: v('--border', 'rgba(255, 255, 255, 0.06)'),
    borderStrong: v('--border-strong', 'rgba(255, 255, 255, 0.10)'),
    accent: v('--accent', '#5eead4'),
    pos: v('--pos', '#34d399'),
    neg: v('--neg', '#f87171'),
    warn: v('--warn', '#fbbf24'),
  };

  // Chart palette from --chart-N vars (fallback to noir defaults)
  const fallback = ['#5eead4', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa', '#fb923c', '#c084fc', '#9ca3af'];
  window.CHART_COLORS = [1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => v('--chart-' + n, fallback[i]));

  // Global defaults
  Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.font.weight = 500;
  Chart.defaults.color = palette.muted;

  Chart.defaults.animation.duration = 600;
  Chart.defaults.animation.easing = 'easeOutQuart';

  Chart.defaults.layout.padding = 4;

  // Legend
  Chart.defaults.plugins.legend.position = 'top';
  Chart.defaults.plugins.legend.align = 'end';
  Chart.defaults.plugins.legend.labels.boxWidth = 8;
  Chart.defaults.plugins.legend.labels.boxHeight = 8;
  Chart.defaults.plugins.legend.labels.padding = 14;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
  Chart.defaults.plugins.legend.labels.color = palette.muted;
  Chart.defaults.plugins.legend.labels.font = { size: 11, weight: 500 };

  // Tooltip
  Chart.defaults.plugins.tooltip.backgroundColor = palette.surface2;
  Chart.defaults.plugins.tooltip.titleColor = palette.text;
  Chart.defaults.plugins.tooltip.bodyColor = palette.muted;
  Chart.defaults.plugins.tooltip.borderColor = palette.borderStrong;
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.tooltip.boxPadding = 6;
  Chart.defaults.plugins.tooltip.boxWidth = 8;
  Chart.defaults.plugins.tooltip.boxHeight = 8;
  Chart.defaults.plugins.tooltip.usePointStyle = true;
  Chart.defaults.plugins.tooltip.titleFont = { size: 12, weight: 600 };
  Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
  Chart.defaults.plugins.tooltip.caretSize = 0;
  Chart.defaults.plugins.tooltip.caretPadding = 12;

  // Scale defaults
  Chart.defaults.scale.border = Chart.defaults.scale.border || {};
  Chart.defaults.scale.border.display = false;
  Chart.defaults.scale.grid.drawBorder = false;
  Chart.defaults.scale.grid.color = v('--border-soft', 'rgba(255, 255, 255, 0.04)');
  Chart.defaults.scale.grid.drawTicks = false;
  Chart.defaults.scale.ticks.color = palette.dim;
  Chart.defaults.scale.ticks.font = { size: 11, weight: 500 };
  Chart.defaults.scale.ticks.padding = 10;

  // Bar element
  Chart.defaults.elements.bar.borderRadius = 4;
  Chart.defaults.elements.bar.borderSkipped = false;

  // Line element
  Chart.defaults.elements.line.borderWidth = 2;
  Chart.defaults.elements.line.tension = 0.35;

  // Point element
  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.hoverRadius = 6;
  Chart.defaults.elements.point.hoverBorderWidth = 2;

  Chart.defaults.elements.arc.borderWidth = 2;
  Chart.defaults.elements.arc.borderColor = palette.surface;

  // Helper: create vertical gradient for line fills
  window.chartGradient = function(ctx, colorHex, height) {
    height = height || 300;
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, colorHex + '55');
    g.addColorStop(0.8, colorHex + '08');
    g.addColorStop(1, colorHex + '00');
    return g;
  };

  // Helper: format numbers consistently
  window.fmtNum = function(v, currency) {
    currency = currency || '€';
    const abs = Math.abs(v);
    if (abs >= 1e9) return (v / 1e9).toFixed(2) + 'B' + currency;
    if (abs >= 1e6) return (v / 1e6).toFixed(abs >= 10e6 ? 1 : 2) + 'M' + currency;
    if (abs >= 1e3) return (v / 1e3).toFixed(abs >= 10e3 ? 0 : 1) + 'k' + currency;
    return Math.round(v).toLocaleString('ru-RU') + currency;
  };

  window.fmtPct = function(v, digits) {
    return (v * 100).toFixed(digits || 1) + '%';
  };
})();
