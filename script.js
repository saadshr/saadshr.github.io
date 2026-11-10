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
