// Grab all the elements we need
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const caption = document.getElementById('caption');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// keeps track of which images are currently visible (after filtering)
// and which one is open in the lightbox
let visibleItems = galleryItems;
let currentIndex = 0;

// ---------- Category filtering ----------
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // default to "all" if the button is missing data-filter for some reason
    const filter = btn.dataset.filter || 'All';

    // update active state on buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    galleryItems.forEach(item => {
      // "all" (or no filter) always shows every single image
      const matches = filter === 'All' ? true : item.dataset.category === filter;
      item.classList.toggle('hidden', !matches);
    });

    // recalc which items are visible so next/prev only cycles through these
    visibleItems = galleryItems.filter(item => !item.classList.contains('hidden'));
  });
});

// ---------- Open lightbox ----------
galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    // only consider items that are currently visible
    visibleItems = galleryItems.filter(i => !i.classList.contains('hidden'));
    currentIndex = visibleItems.indexOf(item);
    openLightbox(currentIndex);
  });
});

function openLightbox(index) {
  const item = visibleItems[index];
  const img = item.querySelector('img');

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  caption.textContent = img.alt;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // stop background scroll
}

// ---------- Navigation ----------
function showNext() {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  openLightbox(currentIndex);
}

function showPrev() {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  openLightbox(currentIndex);
}

nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

// ---------- Close lightbox ----------
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeLightbox);

// click on the dark background (but not the image itself) closes it
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ---------- Keyboard support ----------
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;

  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'Escape') closeLightbox();
});