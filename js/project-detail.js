import { loadMarkdownPost } from './markdown-processor.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        window.location.href = 'index.html#projects';
        return;
    }

    try {
        // Load project content from markdown file
        const { content, metadata } = await loadMarkdownPost(projectId);
        
        // Update page title
        document.title = `${metadata.title} - My Portfolio`;
        
        // Update header content
        document.querySelector('.project-article-title').textContent = metadata.title;
        document.querySelector('.project-date').textContent = metadata.date;
        
        // Update tags
        const tagsContainer = document.querySelector('.project-tags');
        metadata.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'project-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        // Update image
        const imageElement = document.querySelector('.project-article-image');
        imageElement.style.backgroundImage = `url(${metadata.image})`;
        
        // Extract features and tech stack
        const features = [];
        const techStack = [];
        let currentSection = null;
        
        content.split('\n').forEach(line => {
            if (line.startsWith('## 주요 기능')) {
                currentSection = 'features';
            } else if (line.startsWith('## 기술 스택')) {
                currentSection = 'techStack';
            } else if (line.startsWith('## 프로젝트 상세 설명')) {
                currentSection = null;
            } else if (currentSection === 'features' && line.startsWith('- ')) {
                features.push(line.substring(2));
            } else if (currentSection === 'techStack' && line.startsWith('- ')) {
                techStack.push(line.substring(2));
            }
        });
        
        // Update features
        const featuresList = document.querySelector('.features-list');
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        // Update tech stack
        const techStackList = document.querySelector('.tech-stack-list');
        techStackList.innerHTML = '';
        console.log('techStack:', techStack);
        techStack.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'project-tag';
            tag.textContent = (tech && tech.split(':')[0]) ? tech.split(':')[0] : tech || '기술명';
            techStackList.appendChild(tag);
        });
        
        // Update description
        const descriptionContent = document.querySelector('.description-content');
        const description = content.split('## 프로젝트 상세 설명')[1]?.trim() || '';
        descriptionContent.innerHTML = description;
        
        // 코드 블록에 구문 강조 적용
        descriptionContent.querySelectorAll('pre code').forEach((block) => {
            const language = block.className || 'swift';
            block.className = `language-${language}`;
            hljs.highlightElement(block);
        });
    } catch (error) {
        console.error('Error loading project:', error);
        window.location.href = 'index.html#projects';
    }
}); 