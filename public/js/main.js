/**
 * Main JavaScript file
 * Optimized for performance with efficient event handling
 */

// Use an IIFE to avoid polluting the global scope
(function() {
  // Helper functions to improve performance and readability
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Element cache to avoid repeated DOM lookups
  const elements = {};

  // Set up view toggles
  function setupViewToggle() {
    elements.gridViewBtn = $('#gridViewBtn');
    elements.listViewBtn = $('#listViewBtn');
    elements.gridView = $('#gridView');
    elements.listView = $('#listView');

    if (!elements.gridViewBtn || !elements.listViewBtn) return;

    // Function to toggle view - reduces code duplication
    const toggleView = (showGrid) => {
      // Toggle visibility
      elements.gridView.classList.toggle('hidden', !showGrid);
      elements.listView.classList.toggle('hidden', showGrid);

      // Toggle button appearance for grid button
      elements.gridViewBtn.classList.toggle('bg-primary-500', showGrid);
      elements.gridViewBtn.classList.toggle('text-white', showGrid);
      elements.gridViewBtn.classList.toggle('bg-white', !showGrid);
      elements.gridViewBtn.classList.toggle('text-gray-500', !showGrid);

      // Toggle button appearance for list button
      elements.listViewBtn.classList.toggle('bg-primary-500', !showGrid);
      elements.listViewBtn.classList.toggle('text-white', !showGrid);
      elements.listViewBtn.classList.toggle('bg-white', showGrid);
      elements.listViewBtn.classList.toggle('text-gray-500', showGrid);

      // Save preference to localStorage for persistence
      localStorage.setItem('preferredView', showGrid ? 'grid' : 'list');
    };

    // Add event listeners once
    elements.gridViewBtn.addEventListener('click', () => toggleView(true));
    elements.listViewBtn.addEventListener('click', () => toggleView(false));

    // Set initial view based on saved preference
    const savedView = localStorage.getItem('preferredView');
    if (savedView === 'list') {
      toggleView(false);
    }
  }

  // Set up dropdown functionality
  function setupDropdowns() {
    elements.sortDropdown = $('#sortDropdown');
    elements.sortMenu = $('#sortMenu');

    if (!elements.sortDropdown || !elements.sortMenu) return;

    // Toggle dropdown visibility
    elements.sortDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.sortMenu.classList.toggle('hidden');
    });

    // Use event delegation for efficiency
    document.addEventListener('click', (e) => {
      if (elements.sortDropdown && !elements.sortDropdown.contains(e.target)) {
        elements.sortMenu?.classList.add('hidden');
      }
    }, { passive: true });
  }

  // Lazy load images for better performance
  function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const lazyImages = $$('img[loading="lazy"]');
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            if (lazyImage.dataset.src) {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.removeAttribute('data-src');
              lazyImageObserver.unobserve(lazyImage);
            }
          }
        });
      });

      $$('img[data-src]').forEach(img => {
        lazyImageObserver.observe(img);
      });
    }
  }

  // Initialize all components
  function init() {
    setupViewToggle();
    setupDropdowns();
    setupLazyLoading();
    hljs.highlightAll(); // Initialize highlight.js
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
