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
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelector('.to-top').addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
});

// Video gallery: only one video plays at a time; the arrows scroll the row.
const phones = document.getElementById('video-list');
const clips = [...phones.querySelectorAll('video')];
clips.forEach(clip => {
  clip.addEventListener('play', () => {
    clips.forEach(other => { if (other !== clip) other.pause(); });
  });
});
document.querySelectorAll('.phones__nav').forEach(btn => {
  btn.addEventListener('click', () => {
    const gap = parseFloat(getComputedStyle(phones).columnGap) || 22;
    const step = phones.querySelector('.phone').offsetWidth + gap;
    phones.scrollBy({ left: Number(btn.dataset.dir) * step * 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

// Hide an arrow when there is nothing more to scroll to in that direction.
const prevBtn = document.querySelector('.phones__nav--prev');
const nextBtn = document.querySelector('.phones__nav--next');
function updateNav() {
  prevBtn.hidden = phones.scrollLeft < 8;
  nextBtn.hidden = phones.scrollLeft + phones.clientWidth >= phones.scrollWidth - 8;
}
phones.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', updateNav);
updateNav();

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
