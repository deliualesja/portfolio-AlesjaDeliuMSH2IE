/* ------------------------------------------------------------------
   VIDEOS: add your YouTube links here. Normal, short and Shorts links
   all work. While the list is empty, the Videos section stays hidden.
   Example:
   { title: "Campaign name", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", vertical: true }
   ------------------------------------------------------------------ */
var VIDEOS = [];

/* ------------------------------------------------------------------ */

document.getElementById('y').textContent = new Date().getFullYear();

// If the photo is missing, the rose gradient behind it shows instead.
const photo = document.querySelector('.photo');
photo.addEventListener('error', () => { photo.hidden = true; });

// Highlight the rail link of the section being read.
const links = [...document.querySelectorAll('.rail__link')];
const sections = [...document.querySelectorAll('.section[id]')];
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting);
  if (!visible.length) return;
  const id = visible[0].target.id;
  links.forEach(link => {
    const active = link.getAttribute('href') === '#' + id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
sections.forEach(section => observer.observe(section));

// Contact form: opens the visitor's email app with the message filled in.
const form = document.querySelector('.form');
const [nameField, emailField, messageField] = form.querySelectorAll('input, textarea');
nameField.required = emailField.required = messageField.required = true;
nameField.autocomplete = 'name';
emailField.autocomplete = 'email';
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const subject = 'Portfolio enquiry — ' + nameField.value.trim();
  const body = 'Name: ' + nameField.value.trim() + '\nEmail: ' + emailField.value.trim() + '\n\n' + messageField.value.trim();
  window.location.href = 'mailto:deliualesja@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});
const note = document.createElement('p');
note.className = 'muted';
note.textContent = 'Opens your email app to send the message.';
form.appendChild(note);

// Back to top
document.querySelector('.to-top').addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});

// Videos
function youtubeId(url) {
  const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{11}$/.test(url) ? url : null;
}
const videoList = document.getElementById('video-list');
let added = 0;
VIDEOS.forEach(v => {
  const id = youtubeId(v.url);
  if (!id) return;
  const fig = document.createElement('figure');
  fig.className = 'video' + (v.vertical ? ' vertical' : '');
  const frame = document.createElement('div');
  frame.className = 'frame';
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube-nocookie.com/embed/' + id;
  iframe.title = v.title || 'Video';
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  frame.appendChild(iframe);
  fig.appendChild(frame);
  if (v.title) {
    const cap = document.createElement('figcaption');
    cap.textContent = v.title;
    fig.appendChild(cap);
  }
  videoList.appendChild(fig);
  added++;
});
if (added) {
  document.getElementById('videos').hidden = false;
  document.getElementById('nav-videos').hidden = false;
  sections.push(document.getElementById('videos'));
  observer.observe(document.getElementById('videos'));
}

// Screenshot viewer: click a screenshot to enlarge it, click again or press Esc to close.
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
document.querySelectorAll('.shot__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    lightboxImg.src = btn.dataset.full;
    lightboxImg.alt = btn.querySelector('img').alt;
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else window.open(btn.dataset.full, '_blank', 'noopener');
  });
});
lightbox.addEventListener('click', () => lightbox.close());
