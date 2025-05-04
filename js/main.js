// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Scroll Animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.project-card, .skill-card, .contact-form');
    const windowHeight = window.innerHeight;
    const triggerBottom = windowHeight * 0.8;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < triggerBottom) {
            element.classList.add('visible');
        }
    });
};

// Intersection Observer for more precise animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.project-card, .skill-card, .contact-form').forEach(element => {
    observer.observe(element);
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);
// Initial check for elements in view
window.addEventListener('load', animateOnScroll);

// Project data
const projects = {
    socialapp: {
        title: "Social Media App",
        description: "실시간 소셜 미디어 앱 개발 프로젝트입니다. Firebase를 활용한 실시간 피드 업데이트와 사용자 상호작용 기능을 구현했습니다. UIKit을 사용하여 네이티브한 iOS 사용자 경험을 제공합니다.",
        image: "https://via.placeholder.com/800x400",
        tags: ["Swift", "Firebase", "UIKit", "Auto Layout", "Push Notifications"],
        features: [
            "실시간 피드 업데이트",
            "사용자 인증 및 프로필 관리",
            "사진/영상 공유 기능",
            "댓글 및 좋아요 시스템",
            "푸시 알림",
            "오프라인 지원"
        ],
        demoLink: "#",
        githubLink: "#"
    },
    fitnessapp: {
        title: "Fitness Tracker",
        description: "건강 관리 앱 개발 프로젝트입니다. Apple HealthKit을 연동하여 사용자의 건강 데이터를 수집하고 시각화합니다. SwiftUI를 사용하여 모던한 UI를 구현했습니다.",
        image: "https://via.placeholder.com/800x400",
        tags: ["SwiftUI", "HealthKit", "CoreData", "Charts", "WidgetKit"],
        features: [
            "HealthKit 데이터 연동",
            "운동 데이터 시각화",
            "목표 설정 및 추적",
            "위젯 지원",
            "다크 모드 지원",
            "애플워치 연동"
        ],
        demoLink: "#",
        githubLink: "#"
    },
    ecommerceapp: {
        title: "E-commerce App",
        description: "쇼핑 앱 개발 프로젝트입니다. ARKit을 활용한 제품 미리보기와 StoreKit을 통한 인앱 결제 시스템을 구현했습니다. 사용자 경험을 최적화하기 위한 다양한 기능을 포함했습니다.",
        image: "https://via.placeholder.com/800x400",
        tags: ["Swift", "ARKit", "StoreKit", "CoreML", "CloudKit"],
        features: [
            "AR 제품 미리보기",
            "인앱 결제 시스템",
            "제품 추천 시스템",
            "주문 추적",
            "위시리스트",
            "푸시 알림"
        ],
        demoLink: "#",
        githubLink: "#"
    }
};

// Modal functionality
const modal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close-modal');
const projectCards = document.querySelectorAll('.project-card');

function openModal(projectId) {
    const project = projects[projectId];
    
    // Update modal content
    document.querySelector('.modal-title').textContent = project.title;
    document.querySelector('.modal-description').textContent = project.description;
    document.querySelector('.modal-image').style.backgroundImage = `url(${project.image})`;
    
    // Update tags
    const tagsContainer = document.querySelector('.modal-tags');
    tagsContainer.innerHTML = '';
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'modal-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // Update features
    const featuresList = document.querySelector('.features-list');
    featuresList.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Update links
    const links = document.querySelectorAll('.modal-link');
    links[0].href = project.demoLink;
    links[1].href = project.githubLink;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalHandler() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners
projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // .project-link를 클릭하면 모달을 띄우지 않고 기본 링크 이동만 한다
        if (e.target.closest('.project-link')) return;
        const projectId = card.dataset.project;
        openModal(projectId);
    });
});

closeModal.addEventListener('click', closeModalHandler);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModalHandler();
    }
});

// Blog Section
const blogCards = document.querySelectorAll('.blog-card');
const blogCategories = document.querySelectorAll('.blog-category');
const blogGrid = document.querySelector('.blog-grid');

// Load blog posts from JSON index
async function loadBlogPosts() {
    try {
        const response = await fetch('_posts/index.json');
        if (!response.ok) throw new Error('Failed to fetch blog index');
        const posts = await response.json();

        // Clear existing blog cards
        blogGrid.innerHTML = '';

        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.innerHTML = `
                <div class="blog-image" style="background-image: url('${post.image || 'https://via.placeholder.com/800x400'}')"></div>
                <div class="blog-content">
                    <div class="blog-category-tag">${post.category || 'Uncategorized'}</div>
                    <div class="blog-date">${post.date || 'No date'}</div>
                    <h3 class="blog-title">${post.title || 'Untitled'}</h3>
                    <p class="blog-excerpt">${post.excerpt || 'No excerpt available'}</p>
                    <div class="blog-author">
                        <img src="https://via.placeholder.com/40" alt="Author">
                        <span>${post.author || 'Unknown'}</span>
                    </div>
                    <a href="blog-detail.html?id=${post.id}" class="blog-link" target="_blank">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            blogGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

// Filter blog posts by category
function filterBlogPosts(category) {
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach(card => {
        const cardCategory = card.querySelector('.blog-category-tag').textContent;
        if (category === 'All' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize blog functionality
function initializeBlog() {
    // Load blog posts
    loadBlogPosts();
    
    // Add category filter event listeners
    const blogCategories = document.querySelectorAll('.blog-category');
    blogCategories.forEach(category => {
        category.addEventListener('click', () => {
            // Update active state
            blogCategories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            // Filter posts
            const selectedCategory = category.textContent;
            filterBlogPosts(selectedCategory);
        });
    });
}

// Initialize blog when the page loads
document.addEventListener('DOMContentLoaded', initializeBlog);

document.addEventListener('click', function(e) {
    const link = e.target.closest('.project-link');
    if (link) {
        e.preventDefault();
        const projectId = link.getAttribute('data-project-id');
        openModal(projectId);
    }
}); 