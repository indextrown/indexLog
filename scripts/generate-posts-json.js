const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 블로그 포스트 디렉토리 경로
const postsDir = path.join(process.cwd(), '_posts');
const outputDir = postsDir; // index.json을 _posts에 저장

// 마크다운 파일 목록 가져오기
const postFiles = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'));

// 포스트 데이터 추출
const posts = postFiles.map(file => {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const id = path.basename(file, '.md');
    // 첫 번째 단락을 excerpt로 사용
    const excerpt = content.split(/\n\n|\r\n\r\n/)[0].replace(/^#.*$/gm, '').trim();
    return {
        id,
        ...data,
        excerpt
    };
});

// 날짜 기준 내림차순 정렬 (date 필드가 있으면)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// JSON 파일 생성
const outputPath = path.join(outputDir, 'index.json');
fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));

console.log('블로그 인덱스 JSON 파일이 생성되었습니다:', outputPath); 