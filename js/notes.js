document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notes-list-container');
    const filterContainer = document.getElementById('notes-filters');
    const searchInput = document.getElementById('notes-search');
    
    if (!notesContainer || typeof notesData === 'undefined') return;

    // Sort notes by title alphabetically as a default
    const sortedNotes = [...notesData].sort((a, b) => a.title.localeCompare(b.title));

    let activeTopic = 'all';
    let searchQuery = '';

    // Group posts by topic to build filters
    const topics = {};
    sortedNotes.forEach(note => {
        const subject = note.subject || 'Other';
        if (!topics[subject]) topics[subject] = [];
        topics[subject].push(note);
    });

    // Initialize Filters
    if (filterContainer) {
        const topicNames = Object.keys(topics).sort();
        let filterHtml = `<button data-filter="all" class="filter-btn active px-4 py-2 border border-black dark:border-white rounded-full text-sm font-medium bg-black text-white dark:bg-white dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">All</button>`;
        
        topicNames.forEach(topic => {
            filterHtml += `<button data-filter="${topic}" class="filter-btn px-4 py-2 border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">${topic}</button>`;
        });
        
        filterContainer.innerHTML = filterHtml;
        filterContainer.classList.remove('hidden');

        const filterBtns = filterContainer.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                activeTopic = e.target.getAttribute('data-filter');
                
                // Update active styling
                filterBtns.forEach(b => {
                    b.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'border-black', 'dark:border-white', 'active');
                    b.classList.add('border-black/20', 'dark:border-white/20');
                });
                
                e.target.classList.remove('border-black/20', 'dark:border-white/20');
                e.target.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'border-black', 'dark:border-white', 'active');
                
                renderNotes();
            });
        });
    }

    // Initialize Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderNotes();
        });
    }

    function renderNotes() {
        let html = '';
        let totalMatches = 0;
        
        for (const [subjectName, subjectNotes] of Object.entries(topics)) {
            if (activeTopic !== 'all' && subjectName !== activeTopic) continue;

            const filteredNotes = subjectNotes.filter(note => {
                if (!searchQuery) return true;
                
                const searchableText = `
                    ${note.title} 
                    ${note.description || ''} 
                    ${note.subject || ''} 
                    ${(note.tags || []).join(' ')}
                `.toLowerCase();
                
                return searchableText.includes(searchQuery);
            });

            if (filteredNotes.length === 0) continue;
            
            totalMatches += filteredNotes.length;

            html += `
                <div class="mb-12">
                    <h2 class="font-display text-2xl font-bold uppercase tracking-widest border-b border-black/10 dark:border-white/10 pb-2 mb-6">${subjectName}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            `;
            
            filteredNotes.forEach(note => {
                const pageCountHtml = note.pages ? `<span class="text-xs font-mono bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded ml-3">${note.pages} pages</span>` : '';
                const tagsHtml = note.tags && note.tags.length > 0 
                    ? `<div class="mt-4 flex flex-wrap gap-2">
                        ${note.tags.map(tag => `<span class="text-xs font-mono text-gray-500 border border-gray-300 dark:border-gray-700 px-2 py-0.5 rounded-full">#${tag}</span>`).join('')}
                       </div>`
                    : '';

                html += `
                    <div class="flex flex-col justify-between p-6 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border border-black/10 dark:border-white/10 rounded-lg group">
                        <div>
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-display text-xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">${note.title}</h3>
                                ${pageCountHtml}
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-4">${note.description || ''}</p>
                            ${tagsHtml}
                        </div>
                        <div class="mt-6">
                            <a href="${note.googleDriveUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gray-500 transition-colors focus:outline-none focus:underline border-b border-transparent hover:border-gray-500 pb-0.5">
                                View PDF
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        if (totalMatches === 0) {
            html = `
                <div class="text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400 text-lg">No notes found matching your search.</p>
                </div>
            `;
        }
        
        notesContainer.innerHTML = html;
    }

    // Initial render
    renderNotes();
});
