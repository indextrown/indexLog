// 마크다운을 HTML로 변환하는 함수
async function convertMarkdownToHTML(markdown) {
    // 메타데이터와 본문 분리
    const parts = markdown.split('---');
    const content = parts[2].trim();
    
    // 마크다운 파싱을 위한 정규식 기반 변환
    let html = content
        // 헤더 변환
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        
        // 리스트 변환
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/^\d\. (.*$)/gm, '<li>$1</li>')
        
        // 코드 블록 변환
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="$1">$2</code></pre>')
        
        // 인라인 코드 변환
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // 링크 변환
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        
        // 이미지 변환
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
        
        // 굵은 글씨 변환
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        
        // 이탤릭 변환
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        
        // 단락 변환
        .replace(/\n\n/g, '</p><p>')
        .replace(/^\s*([^\n]+)/gm, '<p>$1</p>');

    return html;
}

// 마크다운 파일을 로드하고 HTML로 변환하는 함수
async function loadMarkdownPost(postId) {
    try {
        // _projects에서 먼저 찾고, 없으면 _posts에서 찾기
        let response = await fetch(`_projects/${postId}.md`);
        if (!response.ok) {
            response = await fetch(`_posts/${postId}.md`);
            if (!response.ok) {
                throw new Error('Post not found');
            }
        }
        const markdown = await response.text();
        const html = await convertMarkdownToHTML(markdown);
        return {
            content: html,
            metadata: extractMetadata(markdown)
        };
    } catch (error) {
        console.error('Error loading markdown post:', error);
        throw error;
    }
}

// 마크다운 파일에서 메타데이터 추출
function extractMetadata(markdown) {
    const metadata = {};
    const lines = markdown.split('\n');
    
    for (const line of lines) {
        if (line.startsWith('---')) break;
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
            metadata[key] = value;
        }
    }
    
    return metadata;
}

// 블로그 포스트 목록 가져오기
async function getBlogPosts() {
    try {
        const response = await fetch('_posts/index.json');
        if (!response.ok) {
            throw new Error('Posts index not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        return [];
    }
}

function processMarkdown(markdown) {
    // Process code blocks first
    markdown = markdown.replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Process inline code
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Process headers
    markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    markdown = markdown.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^### (.*$)/gm, '<h3>$1</h3>');

    // Process bold and italic
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Process links
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Process images
    markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');

    // Process lists
    markdown = markdown.replace(/^\s*\*\s(.*$)/gm, '<li>$1</li>');
    markdown = markdown.replace(/^\s*-\s(.*$)/gm, '<li>$1</li>');
    markdown = markdown.replace(/^\s*\d+\.\s(.*$)/gm, '<li>$1</li>');

    // Process paragraphs (preserve line breaks)
    markdown = markdown.replace(/^(?!<[a-z])(.*$)/gm, '<p>$1</p>');

    // Process line breaks
    markdown = markdown.replace(/\n/g, '<br>');

    return markdown;
}

export { loadMarkdownPost, getBlogPosts }; 