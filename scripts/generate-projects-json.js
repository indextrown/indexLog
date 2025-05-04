const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 프로젝트 디렉토리 경로
const projectsDir = path.join(process.cwd(), '_projects');

// 프로젝트 파일 목록 가져오기
const projectFiles = fs.readdirSync(projectsDir)
    .filter(file => file.endsWith('.md'));

// 프로젝트 데이터 추출
const projects = projectFiles.map(file => {
    const filePath = path.join(projectsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // 파일명에서 ID 추출
    const id = path.basename(file, '.md');
    
    // 주요 기능과 기술 스택 추출
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

    return {
        id,
        ...data,
        features,
        techStack,
        content: content.split('## 프로젝트 상세 설명')[1]?.trim() || ''
    };
});

// 날짜 기준으로 정렬
projects.sort((a, b) => new Date(b.date) - new Date(a.date));

// JSON 파일 생성
const outputPath = path.join(projectsDir, 'index.json');
fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));

console.log('프로젝트 JSON 파일이 생성되었습니다:', outputPath); 