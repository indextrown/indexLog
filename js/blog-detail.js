import { loadMarkdownPost } from './markdown-processor.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Get blog ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!blogId) {
        window.location.href = 'index.html#blog';
        return;
    }

    try {
        // Load blog content from markdown file
        const { content, metadata } = await loadMarkdownPost(blogId);
        
        // Update page title
        document.title = `${metadata.title} - My Portfolio`;
        
        // Update header content
        document.querySelector('.blog-category-tag').textContent = metadata.category;
        document.querySelector('.blog-article-title').textContent = metadata.title;
        document.querySelector('.blog-date').textContent = metadata.date;
        document.querySelector('.blog-author').textContent = metadata.author;
        
        // Update image
        const imageElement = document.querySelector('.blog-article-image');
        imageElement.style.backgroundImage = `url(${metadata.image})`;
        
        // Update content
        const contentElement = document.querySelector('.blog-article-content');
        contentElement.innerHTML = content;
        
        // 코드 블록에 구문 강조 적용
        contentElement.querySelectorAll('pre code').forEach((block) => {
            const language = block.className || 'swift';
            block.className = `language-${language}`;
            hljs.highlightElement(block);
        });
    } catch (error) {
        console.error('Error loading blog:', error);
        window.location.href = 'index.html#blog';
    }
}); 