/* ============================================================
   Main - Navigation, ToC, Progress
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- ToC active section tracking ---
  const sections = document.querySelectorAll('.lecture-section');
  const tocLinks = document.querySelectorAll('.toc-list a');
  const progressFill = document.querySelector('.progress-bar-fill');
  const progressText = document.querySelector('.progress-pct');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        // Make section and all its children visible
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.reveal').forEach(el => {
          el.classList.add('revealed');
        });
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });

  sections.forEach(s => observer.observe(s));

  // --- Smooth scroll for ToC links ---
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile sidebar
        document.querySelector('.sidebar')?.classList.remove('open');
      }
    });
  });

  // --- Progress bar on scroll ---
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `${Math.round(pct)}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // --- Mobile hamburger ---
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== hamburger) {
        sidebar.classList.remove('open');
      }
    });
  }

  // --- Init animations and challenges ---
  // Innit bruv
  Animations.initAll();
  Challenges.init();
});
