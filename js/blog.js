document.addEventListener('DOMContentLoaded', async () => {
    const blogContainer = document.getElementById('blog-list-container');
    if (!blogContainer) return;

    try {
        const response = await fetch('./content/blog/index.json');
        if (!response.ok) throw new Error('Could not load blog index');
        
        let posts = await response.json();
        
        if (posts.length === 0) {
            blogContainer.innerHTML = '<p class="text-gray-500">No posts available right now.</p>';
            return;
        }

        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Group posts by topic
        const topics = {};
        posts.forEach(post => {
            const topic = post.topic || 'General';
            if (!topics[topic]) topics[topic] = [];
            topics[topic].push(post);
        });

        // Setup Filters
        const filterContainer = document.getElementById('blog-filters');
        if (filterContainer) {
            const topicNames = Object.keys(topics).sort();
            let filterHtml = `<button data-filter="all" class="filter-btn active px-4 py-2 border border-black dark:border-white rounded-full text-sm font-medium bg-black text-white dark:bg-white dark:text-black transition-colors">All</button>`;
            
            topicNames.forEach(topic => {
                filterHtml += `<button data-filter="${topic}" class="filter-btn px-4 py-2 border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white rounded-full text-sm font-medium transition-colors">${topic}</button>`;
            });
            
            filterContainer.innerHTML = filterHtml;
            filterContainer.classList.remove('hidden');

            const filterBtns = filterContainer.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selectedTopic = e.target.getAttribute('data-filter');
                    
                    // Update active styling
                    filterBtns.forEach(b => {
                        b.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'border-black', 'dark:border-white', 'active');
                        b.classList.add('border-black/20', 'dark:border-white/20');
                    });
                    
                    e.target.classList.remove('border-black/20', 'dark:border-white/20');
                    e.target.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'border-black', 'dark:border-white', 'active');
                    
                    renderPosts(selectedTopic);
                });
            });
        }

        function renderPosts(filterTopic) {
            let html = '';
            
            for (const [topicName, topicPosts] of Object.entries(topics)) {
                if (filterTopic !== 'all' && topicName !== filterTopic) continue;

                html += `
                    <div class="mb-12">
                        <h2 class="font-display text-2xl font-bold uppercase tracking-widest border-b border-black/10 dark:border-white/10 pb-2 mb-6">${topicName}</h2>
                        <div class="space-y-4">
                `;
                
                topicPosts.forEach(post => {
                    let imageHtml = post.image 
                        ? `<img src="${post.image}" alt="${post.title}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0 mr-4" />` 
                        : '';
                        
                    html += `
                        <article onclick="window.location.href='post.html?id=${post.id}'" class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer border border-transparent rounded-lg">
                            <div class="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                                ${imageHtml}
                                <div>
                                    <h4 class="font-display text-lg font-bold">${post.title}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${post.description}</p>
                                </div>
                            </div>
                            <span class="text-xs font-mono uppercase mt-2 sm:mt-0 text-gray-500 min-w-[100px] text-left sm:text-right flex-shrink-0">${post.date}</span>
                        </article>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
            
            blogContainer.innerHTML = html;
        }

        // Initial render
        renderPosts('all');

    } catch (err) {
        console.error("Error loading blogs:", err);
        blogContainer.innerHTML = '<p class="text-red-500">Failed to load writings.</p>';
    }
});
