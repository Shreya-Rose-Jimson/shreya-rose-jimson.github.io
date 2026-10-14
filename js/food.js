document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('food-grid-container');
    const lightbox = document.getElementById('food-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDate = document.getElementById('lightbox-date');
    const lightboxNote = document.getElementById('lightbox-note');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!gridContainer || typeof foodData === 'undefined') return;

    let currentIndex = 0;

    function renderGrid() {
        if (!foodData || foodData.length === 0) {
            gridContainer.innerHTML = `
                <div class="col-span-full py-16 text-center text-gray-500 font-mono text-sm">
                    No dishes posted yet.
                </div>
            `;
            return;
        }

        let html = '';
        foodData.forEach((item, index) => {
            html += `
                <div class="food-card group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-gray-900 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300" data-index="${index}">
                    <img 
                        src="${item.image}" 
                        alt="${item.title}" 
                        loading="lazy"
                        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        onerror="this.src='images/placeholder.png'"
                    />

                    <!-- Minimal Hover Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                        <div class="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 class="font-display text-lg md:text-xl font-bold tracking-tight text-white mb-1 leading-snug">${item.title}</h3>
                            <div class="flex items-center justify-between text-xs font-mono text-gray-300">
                                <span>${item.date || ''}</span>
                                <span class="text-[11px] opacity-75 font-sans">View &rarr;</span>
                            </div>
                        </div>
                    </div>

                    <!-- Subtle Mobile Bar for Touch Screens -->
                    <div class="sm:hidden absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-3 py-2 flex items-center justify-between text-white">
                        <span class="font-display text-sm font-semibold truncate">${item.title}</span>
                        ${item.date ? `<span class="font-mono text-[10px] text-gray-300 ml-2 whitespace-nowrap">${item.date}</span>` : ''}
                    </div>
                </div>
            `;
        });

        gridContainer.innerHTML = html;

        // Bind click events for lightbox
        const cards = gridContainer.querySelectorAll('.food-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.getAttribute('data-index'), 10);
                openLightbox(idx);
            });
        });
    }

    function openLightbox(index) {
        if (!lightbox || !foodData[index]) return;
        currentIndex = index;
        const item = foodData[currentIndex];

        lightboxImg.src = item.image;
        lightboxImg.alt = item.title;
        if (lightboxTitle) lightboxTitle.textContent = item.title;
        if (lightboxDate) {
            lightboxDate.textContent = item.date || '';
            lightboxDate.style.display = item.date ? 'inline-block' : 'none';
        }
        if (lightboxNote) {
            lightboxNote.textContent = item.note || '';
            lightboxNote.style.display = item.note ? 'block' : 'none';
        }

        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.classList.add('overflow-hidden');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
    }

    function showNext() {
        if (foodData.length === 0) return;
        currentIndex = (currentIndex + 1) % foodData.length;
        openLightbox(currentIndex);
    }

    function showPrev() {
        if (foodData.length === 0) return;
        currentIndex = (currentIndex - 1 + foodData.length) % foodData.length;
        openLightbox(currentIndex);
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });
    }
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!lightbox || lightbox.classList.contains('hidden')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // Initial render
    renderGrid();
});
