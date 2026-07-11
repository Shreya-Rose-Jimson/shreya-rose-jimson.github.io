document.addEventListener('DOMContentLoaded', async () => {
    const postContainer = document.getElementById('post-content');
    if (!postContainer) return;

    // Get the post ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postContainer.innerHTML = '<h1>Post not found</h1><p>No post ID provided.</p>';
        return;
    }

    try {
        // First, fetch the index to find the file name (and ensure it's a valid post)
        const indexResponse = await fetch('./content/blog/index.json');
        if (!indexResponse.ok) throw new Error('Could not load blog index');
        
        const posts = await indexResponse.json();
        const postMeta = posts.find(p => p.id === postId);

        if (!postMeta) {
            postContainer.innerHTML = '<h1>Post not found</h1><p>The requested post does not exist.</p>';
            return;
        }

        // Set the page title
        document.title = `${postMeta.title} | Shreya Rose Jimson`;

        // Fetch the actual markdown file
        const mdResponse = await fetch(`./content/blog/${postMeta.file}`);
        if (!mdResponse.ok) throw new Error('Could not load markdown file');
        
        let mdText = await mdResponse.text();

        // Fix relative asset paths in the markdown text so they load correctly from the site root
        mdText = mdText.replace(/!\[([^\]]*)\]\(\.\.\/assets\//g, '![$1](./content/assets/');

        // Parse markdown to HTML using marked.js
        // We assume marked is loaded via CDN in post.html
        postContainer.innerHTML = marked.parse(mdText);

        // Render any LaTeX math equations using MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([postContainer]).catch((err) => console.error("MathJax error:", err));
        }

    } catch (err) {
        console.error("Error loading post:", err);
        postContainer.innerHTML = '<h1>Error</h1><p>Failed to load the post. Please try again later.</p>';
    }
});
