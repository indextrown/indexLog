let loadedProjects = [];

// 프로젝트 데이터를 가져오는 함수
async function fetchProjects() {
    try {
        const response = await fetch('_projects/index.json');
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const projects = await response.json();
        loadedProjects = projects;
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// 프로젝트 카드를 생성하는 함수
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.project = project.id;

    card.innerHTML = `
        <div class="project-image" style="background-image: url('${project.image}')"></div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <a href="#" class="project-link" data-project-id="${project.id}">
                View Project <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;

    return card;
}

// 모달 오픈 함수
function openProjectModal(projectId) {
    const project = loadedProjects.find(p => p.id === projectId);
    if (!project) return;
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    // 제목, 설명, 이미지, 태그, 기능 등 업데이트
    modal.querySelector('.modal-title').textContent = project.title;
    modal.querySelector('.modal-description').textContent = project.description;
    modal.querySelector('.modal-image').style.backgroundImage = `url(${project.image})`;
    // 태그
    const tagsContainer = modal.querySelector('.modal-tags');
    tagsContainer.innerHTML = '';
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'modal-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    // 기능
    const featuresList = modal.querySelector('.features-list');
    featuresList.innerHTML = '';
    (project.features || []).forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    // 링크
    const links = modal.querySelectorAll('.modal-link');
    if (links[0]) links[0].href = project.demoLink || '#';
    if (links[1]) links[1].href = project.github || '#';
    // 모달 표시
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 프로젝트 그리드를 업데이트하는 함수
async function updateProjectGrid() {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;

    const projects = await fetchProjects();
    projectGrid.innerHTML = '';

    projects.forEach(project => {
        const card = createProjectCard(project);
        projectGrid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', updateProjectGrid);

document.addEventListener('click', function(e) {
    const link = e.target.closest('.project-link');
    if (link) {
        e.preventDefault();
        const projectId = link.getAttribute('data-project-id');
        openProjectModal(projectId);
    }
}); 