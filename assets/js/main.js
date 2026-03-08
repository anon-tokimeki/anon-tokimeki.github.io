// Inisialisasi AOS
AOS.init({
    duration: 800,
    once: true
});

// Inisialisasi Particles.js
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    },
    retina_detect: true
});

// Data Novel - PERBAIKAN: Format URL yang benar
const novelsData = [
    {
        id: 1,
        title: "The Lost Kingdom",
        author: "J.K. Rowling",
        description: "Sebuah petualangan epik di kerajaan yang hilang, penuh dengan misteri dan keajaiban.",
        fullDescription: "Di sebuah kerajaan yang tersembunyi dari dunia modern, seorang pemuda menemukan takdirnya untuk menyelamatkan kerajaan dari kehancuran. Dengan bantuan teman-teman barunya, ia harus menghadapi berbagai rintangan dan mengungkap rahasia masa lalu.",
        cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
        status: "ongoing",
        rating: 4.5,
        totalRatings: 1234,
        genres: ["Fantasy", "Adventure", "Magic"],
        views: 15000,
        likes: 3200,
        seasons: [
            { name: "Season 1", chapters: 10, url: "anon-tokimeki.github.io/novel/the-lost-kingdom/season-1" },
            { name: "Season 2", chapters: 8, url: "anon-tokimeki.github.io/novel/the-lost-kingdom/season-2" }
        ],
        releaseDate: "2024-01-15",
        publisher: "Fantasy Books"
    },
    {
        id: 2,
        title: "Love in Tokyo",
        author: "Haruki Murakami",
        description: "Kisah romantis di tengah hiruk pikuk kota Tokyo.",
        fullDescription: "Dua insan berbeda dunia dipertemukan di Tokyo. Seorang gadis lokal dan turis asing harus menghadapi perbedaan budaya dan rintangan cinta mereka.",
        cover: "https://images.unsplash.com/photo-1545569341-973eb848179a?w=300&h=200&fit=crop",
        status: "completed",
        rating: 4.8,
        totalRatings: 2156,
        genres: ["Romance", "Drama", "Slice of Life"],
        views: 25000,
        likes: 5400,
        seasons: [
            { name: "Season 1", chapters: 12, url: "anon-tokimeki.github.io/novel/love-in-tokyo/season-1" }
        ],
        releaseDate: "2023-12-10",
        publisher: "Romance Publishing"
    },
    {
        id: 3,
        title: "Martial God",
        author: "Gu Long",
        description: "Perjalanan seorang pendekar dalam menguasai ilmu bela diri tertinggi.",
        fullDescription: "Di dunia persilatan, seorang pemuda dengan bakat terpendam harus berjuang melawan musuh kuat dan mengungkap rahasia di balik kematian gurunya.",
        cover: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=300&h=200&fit=crop",
        status: "ongoing",
        rating: 4.3,
        totalRatings: 3456,
        genres: ["Action", "Martial Arts", "Wuxia"],
        views: 18000,
        likes: 2800,
        seasons: [
            { name: "Season 1", chapters: 15, url: "anon-tokimeki.github.io/novel/martial-god/season-1" },
            { name: "Season 2", chapters: 5, url: "anon-tokimeki.github.io/novel/martial-god/season-2" }
        ],
        releaseDate: "2024-02-01",
        publisher: "Action Books"
    },
    {
        id: 4,
        title: "Mystery Mansion",
        author: "Agatha Christie",
        description: "Misteri pembunuhan di sebuah rumah tua angker.",
        fullDescription: "Sekelompok orang terperangkap di mansion mewah saat badai. Ketika satu per satu mulai mati, mereka harus menemukan pembunuh di antara mereka.",
        cover: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=200&fit=crop",
        status: "hiatus",
        rating: 4.6,
        totalRatings: 987,
        genres: ["Mystery", "Thriller", "Horror"],
        views: 12000,
        likes: 2100,
        seasons: [
            { name: "Season 1", chapters: 7, url: "anon-tokimeki.github.io/novel/mystery-mansion/season-1" }
        ],
        releaseDate: "2023-11-20",
        publisher: "Mystery House"
    }
];

// DOM Elements
const novelGrid = document.getElementById('novelGrid');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.querySelectorAll('.filter-tab');
const sortSelect = document.getElementById('sortSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const categoryChips = document.querySelectorAll('.chip');
const modal = document.getElementById('novelModal');
const themeToggle = document.getElementById('themeToggle');

// State
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'latest';
let currentCategory = 'all';
let currentPage = 1;
const novelsPerPage = 8;
let isLoading = false;

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-theme')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
});

// Display novels dengan lazy loading
function displayNovels(reset = true) {
    if (reset) {
        currentPage = 1;
        novelGrid.innerHTML = '';
    }
    
    let filteredNovels = filterNovels();
    filteredNovels = sortNovels(filteredNovels);
    
    // Pagination
    const start = (currentPage - 1) * novelsPerPage;
    const end = start + novelsPerPage;
    const paginatedNovels = filteredNovels.slice(0, end);
    
    // Hide load more if no more novels
    if (end >= filteredNovels.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
    
    if (reset) {
        novelGrid.innerHTML = paginatedNovels.map(novel => createNovelCard(novel)).join('');
    } else {
        novelGrid.innerHTML += paginatedNovels.slice(start).map(novel => createNovelCard(novel)).join('');
    }
    
    // Add click events to cards
    document.querySelectorAll('.novel-card').forEach(card => {
        card.addEventListener('click', () => openNovelModal(card.dataset.id));
    });
    
    // Add animation to new cards
    document.querySelectorAll('.novel-card').forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
    });
}

// Create novel card HTML dengan cover image yang lebih baik
function createNovelCard(novel) {
    const statusClass = `status-${novel.status}`;
    const statusText = novel.status === 'ongoing' ? 'Ongoing' : 
                      novel.status === 'completed' ? 'Completed' : 'Hiatus';
    
    // Hitung total chapters
    const totalChapters = novel.seasons.reduce((acc, season) => acc + season.chapters, 0);
    
    // Status color
    const statusColor = novel.status === 'ongoing' ? '#10b981' : 
                       novel.status === 'completed' ? '#6366f1' : '#f59e0b';
    
    return `
        <div class="novel-card" data-id="${novel.id}" data-aos="fade-up">
            <div class="novel-cover">
                <img src="${novel.cover}" alt="${novel.title}" 
                     onerror="this.src='https://via.placeholder.com/300x200/6366f1/ffffff?text=Novel'">
                <span class="novel-status" style="background: ${statusColor}">${statusText}</span>
            </div>
            <div class="novel-info">
                <h3 class="novel-title">${novel.title}</h3>
                <div class="novel-author">
                    <i class="fas fa-pencil-alt"></i> ${novel.author}
                </div>
                <div class="novel-meta">
                    <span class="novel-rating">
                        <i class="fas fa-star"></i> ${novel.rating}
                    </span>
                    <span class="novel-chapters">
                        <i class="fas fa-list"></i> ${totalChapters} Ch
                    </span>
                    <span class="novel-views">
                        <i class="fas fa-eye"></i> ${formatNumber(novel.views)}
                    </span>
                </div>
                <p class="novel-description">${novel.description}</p>
                <div class="novel-genres">
                    ${novel.genres.slice(0, 2).map(genre => 
                        `<span class="genre-tag">${genre}</span>`
                    ).join('')}
                    ${novel.genres.length > 2 ? 
                        `<span class="genre-tag">+${novel.genres.length - 2}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Format angka (1000 -> 1K)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// Filter novels
function filterNovels() {
    return novelsData.filter(novel => {
        // Filter by status
        if (currentFilter !== 'all' && novel.status !== currentFilter) {
            return false;
        }
        
        // Filter by category
        if (currentCategory !== 'all' && !novel.genres.some(g => 
            g.toLowerCase().replace(' ', '-') === currentCategory.toLowerCase())) {
            return false;
        }
        
        // Filter by search
        if (currentSearch) {
            const searchLower = currentSearch.toLowerCase();
            return novel.title.toLowerCase().includes(searchLower) ||
                   novel.author.toLowerCase().includes(searchLower) ||
                   novel.genres.some(genre => genre.toLowerCase().includes(searchLower));
        }
        
        return true;
    });
}

// Sort novels
function sortNovels(novels) {
    const sorted = [...novels];
    
    switch(currentSort) {
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'popular':
            return sorted.sort((a, b) => b.views - a.views);
        case 'latest':
        default:
            return sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }
}

// Open novel modal
function openNovelModal(novelId) {
    const novel = novelsData.find(n => n.id == novelId);
    if (!novel) return;
    
    // Set modal content
    document.getElementById('modalCover').src = novel.cover;
    document.getElementById('modalCover').onerror = function() {
        this.src = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Novel';
    };
    document.getElementById('modalTitle').textContent = novel.title;
    document.getElementById('modalAuthor').textContent = novel.author;
    document.getElementById('modalRating').textContent = novel.rating;
    document.getElementById('modalStatus').textContent = 
        novel.status === 'ongoing' ? 'Ongoing' : 
        novel.status === 'completed' ? 'Completed' : 'Hiatus';
    document.getElementById('fullDescription').textContent = novel.fullDescription || novel.description;
    
    // Set total chapters
    const totalChapters = novel.seasons.reduce((acc, season) => acc + season.chapters, 0);
    document.getElementById('modalChapters').textContent = totalChapters;
    
    // Set genres
    const modalGenres = document.getElementById('modalGenres');
    modalGenres.innerHTML = novel.genres.map(genre => 
        `<span class="genre-tag">${genre}</span>`
    ).join('');
    
    // Set novel details
    const novelDetails = document.getElementById('novelDetails');
    novelDetails.innerHTML = `
        <div class="info-item">
            <strong>Total Views</strong>
            <span>${formatNumber(novel.views)}</span>
        </div>
        <div class="info-item">
            <strong>Total Likes</strong>
            <span>${formatNumber(novel.likes)}</span>
        </div>
        <div class="info-item">
            <strong>Release Date</strong>
            <span>${new Date(novel.releaseDate).toLocaleDateString('id-ID')}</span>
        </div>
        <div class="info-item">
            <strong>Publisher</strong>
            <span>${novel.publisher}</span>
        </div>
    `;
    
    // Set average rating
    document.getElementById('avgRating').textContent = novel.rating;
    
    // Load chapters
    loadChapters(novel);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Load chapters ke modal
function loadChapters(novel) {
    const chaptersPanel = document.getElementById('chaptersPanel');
    
    // PERBAIKAN: Format URL chapter yang benar
    const chaptersHTML = novel.seasons.map(season => {
        const chapterItems = Array.from({ length: season.chapters }, (_, i) => {
            const chapterNum = i + 1;
            // Perbaikan format URL - pastikan URL lengkap
            const baseUrl = season.url.startsWith('http') ? season.url : `https://${season.url}`;
            const chapterUrl = `${baseUrl}/chapter-${chapterNum}`;
            
            return `
                <a href="${chapterUrl}" target="_blank" class="chapter-item">
                    <i class="fas fa-book-open"></i>
                    <div>
                        <strong>Chapter ${chapterNum}</strong>
                        <small>${new Date().toLocaleDateString('id-ID')}</small>
                    </div>
                    <i class="fas fa-external-link-alt" style="margin-left: auto;"></i>
                </a>
            `;
        }).join('');
        
        return `
            <div class="season-section">
                <h3 class="season-title">${season.name}</h3>
                <div class="chapter-grid">
                    ${chapterItems}
                </div>
            </div>
        `;
    }).join('');
    
    chaptersPanel.innerHTML = chaptersHTML || '<div class="no-chapters">Belum ada chapter tersedia</div>';
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    displayNovels(true);
});

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        displayNovels(true);
    });
});

categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
        categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = chip.dataset.category;
        displayNovels(true);
    });
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    displayNovels(true);
});

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    displayNovels(false);
});

// Modal close
document.querySelector('.modal-close').addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

document.querySelector('.modal-overlay').addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Modal tabs
document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.modal-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        document.getElementById(`${tab.dataset.tab}Panel`).classList.add('active');
    });
});

// Category navigation
document.querySelector('.category-prev').addEventListener('click', () => {
    document.querySelector('.category-chips').scrollBy({ left: -200, behavior: 'smooth' });
});

document.querySelector('.category-next').addEventListener('click', () => {
    document.querySelector('.category-chips').scrollBy({ left: 200, behavior: 'smooth' });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayNovels();
    
    // Add keyboard event for modal close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
