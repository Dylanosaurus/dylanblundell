// JavaScript for Dylan Blundell Portfolio
// Handle anchor scrolling after page load and collapsible sections

(function() {
    // Collapsible sections functionality
    function initCollapsibleSections() {
        const categories = document.querySelectorAll('.project-category');
        const toggleAllBtn = document.getElementById('toggle-all-btn');
        const toggleButtons = document.querySelectorAll('.toggle-btn');

        // Toggle individual section
        toggleButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const category = btn.closest('.project-category');
                if (category) {
                    category.classList.toggle('collapsed');
                    updateToggleAllButton();
                }
            });
        });

        // Toggle section on header click
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    const category = header.closest('.project-category');
                    if (category) {
                        category.classList.toggle('collapsed');
                        updateToggleAllButton();
                    }
                }
            });
        });

        // Expand a specific section
        function expandSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section && section.classList.contains('collapsed')) {
                section.classList.remove('collapsed');
            }
        }

        // Toggle all sections
        function toggleAllSections() {
            const allExpanded = Array.from(categories).every(cat => !cat.classList.contains('collapsed'));
            
            categories.forEach(category => {
                if (allExpanded) {
                    category.classList.add('collapsed');
                } else {
                    category.classList.remove('collapsed');
                }
            });
            
            updateToggleAllButton();
        }

        // Update toggle all button text
        function updateToggleAllButton() {
            if (!toggleAllBtn) return;
            const allExpanded = Array.from(categories).every(cat => !cat.classList.contains('collapsed'));
            
            if (allExpanded) {
                toggleAllBtn.textContent = 'Collapse All';
            } else {
                toggleAllBtn.textContent = 'Expand All';
            }
        }

        if (toggleAllBtn) {
            toggleAllBtn.addEventListener('click', toggleAllSections);
            updateToggleAllButton();
        }

        // Expand section from hash in URL
        const hash = window.location.hash.substring(1); // Remove #
        if (hash) {
            expandSection(hash);
        }

        // Expose expandSection for use by scroll function
        window.expandSection = expandSection;
    }

    // Function to wait for images to load
    function waitForImages(callback) {
        const images = document.querySelectorAll('img');
        let loadedCount = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
            callback();
            return;
        }

        function imageLoaded() {
            loadedCount++;
            if (loadedCount === totalImages) {
                callback();
            }
        }

        images.forEach(img => {
            if (img.complete) {
                imageLoaded();
            } else {
                img.addEventListener('load', imageLoaded);
                img.addEventListener('error', imageLoaded); // Count errors as loaded
            }
        });
    }

    // Function to scroll to hash after page is fully loaded
    function scrollToHash() {
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                // Expand the section if it's collapsed
                if (window.expandSection) {
                    const sectionId = hash.substring(1);
                    window.expandSection(sectionId);
                }
                
                // Wait for images, then scroll
                waitForImages(() => {
                    // Additional delay to ensure section expansion animation completes
                    setTimeout(() => {
                        const headerOffset = 100; // Offset for fixed header
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 550); // Wait for collapse animation (0.5s) + small buffer
                });
            }
        }
    }

    // Initialize collapsible sections
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initCollapsibleSections();
        });
    } else {
        initCollapsibleSections();
    }

    // If page is already loaded, scroll immediately
    if (document.readyState === 'complete') {
        scrollToHash();
    } else {
        // Wait for page to fully load (including images)
        window.addEventListener('load', scrollToHash);
    }

    // Also handle hash changes for same-page navigation
    window.addEventListener('hashchange', () => {
        if (window.expandSection) {
            const hash = window.location.hash.substring(1);
            if (hash) {
                window.expandSection(hash);
                setTimeout(scrollToHash, 550);
            }
        } else {
            scrollToHash();
        }
    });
})();

