const controls = document.querySelector('.project-controls');
const filters = [...controls.querySelectorAll('button[data-filter]')];
const projectGrid = document.querySelector('#projects-grid');
const projects = [...projectGrid.querySelectorAll('[data-category]')];
const projectCount = controls.querySelector('.project-count');

function showProjects(category) {
  let count = 0;
  for (const project of projects) {
    project.hidden = category !== 'all' && project.dataset.category !== category;
    if (!project.hidden) count += 1;
  }
  for (const button of filters) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  }
  projectCount.textContent = `${count} projet${count === 1 ? '' : 's'}`;
}

for (const button of filters) {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    showProjects(button.dataset.filter);
    projectGrid.classList.remove('is-filtered');
    requestAnimationFrame(() => projectGrid.classList.add('is-filtered'));
    scheduleReadingUpdate();
  });
}
showProjects('all');
controls.hidden = false;

const navigation = document.querySelector('#nav');
const progress = navigation.querySelector('.reading-progress');
const destinations = [...navigation.querySelectorAll('.nav-links a')].map(link => ({
  link,
  section: document.querySelector(link.hash)
}));

let scheduled = false;
let activeLink;

function updateReadingPosition() {
  scheduled = false;
  const { scrollHeight, clientHeight } = document.documentElement;
  const scrollableHeight = scrollHeight - clientHeight;
  const position = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progress.style.transform = `scaleX(${Math.max(0, Math.min(position, 1))})`;

  const line = Math.max(0, navigation.getBoundingClientRect().bottom) + 56;
  let current = destinations[0];
  for (const destination of destinations) {
    if (destination.section.getBoundingClientRect().top <= line) current = destination;
  }
  if (scrollableHeight > 0 && window.scrollY >= scrollableHeight - 2) {
    current = destinations.at(-1);
  }
  if (activeLink !== current.link) {
    activeLink?.removeAttribute('aria-current');
    current.link.setAttribute('aria-current', 'location');
    activeLink = current.link;
  }
}

function scheduleReadingUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateReadingPosition);
}

window.addEventListener('scroll', scheduleReadingUpdate, { passive: true });
window.addEventListener('resize', scheduleReadingUpdate);
window.addEventListener('pageshow', scheduleReadingUpdate);
window.addEventListener('load', scheduleReadingUpdate);
updateReadingPosition();


function setupHeroNetwork() {
  const canvas = document.querySelector('.hero-network');
  const toggle = document.querySelector('.motion-toggle');
  const context = canvas.getContext('2d');
  if (!context) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const nodes = [
    [.33, .22], [.43, .22], [.47, .31], [.55, .31], [.59, .21], [.69, .21],
    [.73, .12], [.85, .12], [.91, .22], [.97, .22], [.96, .44], [.91, .53],
    [.91, .69], [.96, .78], [.93, .88], [.81, .88], [.72, .78], [.63, .78],
    [.56, .88], [.47, .88], [.54, .6], [.61, .52], [.66, .45], [.74, .45],
    [.85, .32], [.65, .64], [.75, .63], [.82, .72], [.99, .61], [.38, .71],
  ];
  const connections = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [8, 24, 23, 22, 21, 20, 29],
    [3, 21, 25, 17, 18, 19], [10, 11, 12, 13, 14, 15, 16, 17],
    [12, 27, 26, 25], [11, 28], [16, 26], [5, 22],
  ];

  let points = [];
  let routes = [];
  let width = 0;
  let height = 0;
  let frame = null;
  let active = true;
  let inView = false;
  let time = 0;
  let lastFrame = 0;

  function draw() {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    context.strokeStyle = '#7ddbc652';
    for (const { path } of routes) context.stroke(path);

    for (const [index, point] of points.entries()) {
      const anchor = index % 4 === 0;
      context.beginPath();
      context.arc(point.x, point.y, anchor ? 2.6 : 1.5, 0, Math.PI * 2);
      context.fillStyle = anchor ? '#86e9d2a6' : '#6faaa893';
      context.fill();
    }

    for (const [index, { segments, length }] of routes.entries()) {
      if (length === 0) continue;
      const distance = (time * .047 + length * (index * .17 % 1)) % length;
      const segment = segments.find(edge => distance < edge.end);
      if (!segment) continue;

      const progress = 1 - (segment.end - distance) / segment.length;
      const x = segment.from.x + (segment.to.x - segment.from.x) * progress;
      const y = segment.from.y + (segment.to.y - segment.from.y) * progress;
      const glow = context.createRadialGradient(x, y, 0, x, y, 10);
      glow.addColorStop(0, '#a4ffe2');
      glow.addColorStop(.27, '#79eacc9e');
      glow.addColorStop(1, '#79eacc00');
      context.fillStyle = glow;
      context.fillRect(x - 10, y - 10, 20, 20);
    }
  }

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const scale = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);

    points = nodes.map(([x, y]) => ({ x: x * width, y: y * height }));
    routes = connections.map(connection => {
      let length = 0;
      const path = new Path2D();
      const origin = points[connection[0]];
      path.moveTo(origin.x, origin.y);
      const segments = connection.slice(1).map((node, index) => {
        const from = points[connection[index]];
        const to = points[node];
        const segmentLength = Math.hypot(to.x - from.x, to.y - from.y);
        length += segmentLength;
        path.lineTo(to.x, to.y);
        return { from, to, length: segmentLength, end: length };
      });
      return { path, segments, length };
    });
    draw();
  }

  function animate(now) {
    const elapsed = now - lastFrame;
    if (elapsed >= 32) {
      time += Math.min(elapsed, 50);
      lastFrame = now;
      draw();
    }
    frame = requestAnimationFrame(animate);
  }

  function syncMotion() {
    const enabled = active && !reducedMotion.matches;
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.title = enabled ? 'Mettre l’animation en pause' : 'Reprendre l’animation';

    if (enabled && inView && !document.hidden) {
      if (frame === null) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(animate);
      }
    } else if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  }

  toggle.addEventListener('click', () => {
    active = !active;
    syncMotion();
  });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncMotion();
  }).observe(canvas);
  syncMotion();
}

setupHeroNetwork();

