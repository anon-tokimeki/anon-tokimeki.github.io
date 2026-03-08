// Data novel - Silakan edit sesuai kebutuhan Anda
const novelsData = [
    {
        id: 1,
        title: "Judul Novel 1",
        author: "Nama Penulis",
        description: "Deskripsi singkat tentang novel ini. Bisa menceritakan sinopsis atau hal menarik lainnya.",
        cover: "https://via.placeholder.com/300x200/667eea/ffffff?text=Novel+Cover",
        status: "ongoing",
        rating: 4.5,
        genres: ["Fantasi", "Petualangan", "Romance"],
        seasons: [
            {
                name: "Season 1",
                chapters: 10,
                url: "anon-tokimeki.github.io/novel/judul-novel-1/season-1"
            },
            {
                name: "Season 2",
                chapters: 8,
                url: "anon-tokimeki.github.io/novel/judul-novel-1/season-2"
            }
        ]
    },
    {
        id: 2,
        title: "Judul Novel 2",
        author: "Nama Penulis Lain",
        description: "Deskripsi untuk novel kedua. Bisa diisi dengan cerita yang menarik.",
        cover: "https://via.placeholder.com/300x200/764ba2/ffffff?text=Novel+Cover",
        status: "completed",
        rating: 4.8,
        genres: ["Slice of Life", "Drama"],
        seasons: [
            {
                name: "Season 1",
                chapters: 12,
                url: "anon-tokimeki.github.io/novel/judul-novel-2/season-1"
            }
        ]
    },
    {
        id: 3,
        title: "Judul Novel 3",
        author: "Penulis Ketiga",
        description: "Novel dengan genre action dan komedi yang seru untuk dibaca.",
        cover: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Novel+Cover",
        status: "ongoing",
        rating: 4.2,
        genres: ["Action", "Komedi"],
        seasons: [
            {
                name: "Season 1",
                chapters: 5,
                url: "anon-tokimeki.github.io/novel/judul-novel-3/season-1"
            }
        ]
    },
    {
        id: 4,
        title: "Judul Novel 4",
        author: "Penulis Keempat",
        description: "Novel misteri dengan plot twist yang mengejutkan.",
        cover: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Novel+Cover",
        status: "hiatus",
        rating: 4.0,
        genres: ["Misteri", "Thriller"],
        seasons: [
            {
                name: "Season 1",
                chapters: 7,
                url: "anon-tokimeki.github.io/novel/judul-novel-4/season-1"
            }
        ]
    }
];

// DOM Elements
const novelGrid = document.getElementById('novelGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const chapterModal = document.getElementById('chapterModal');
const modalNovelTitle = document.getElementById('modalNovelTitle');
const chapterList = document.getElementById('chapterList');
const closeModal = document.querySelector('.close-modal');

// State
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'latest';

// Display novels
function displayNovels() {
    let filteredNovels = filterNovels();
    filteredNovels = sortNovels(filteredNovels);
    
    if (filteredNovels.length === 0) {
        novelGrid.innerHTML = '<div class="loading"><i class="fas fa-search"></i> Tidak ada novel ditemukan</div>';
        return;
    }
    
    novelGrid.innerHTML = filteredNovels.map(novel => createNovelCard(novel)).join('');
    
    // Add click event to novel cards
    document.querySelectorAll('.novel-card').forEach(card => {
        card.addEventListener('click', () => openChapterModal(card.dataset.id));
    });
}

// Create novel card HTML
function createNovelCard(novel) {
    const statusClass = `status-${novel.status}`;
    const statusText = novel.status.charAt(0).toUpperCase() + novel.status.slice(1);
    const totalChapters = novel.seasons.reduce((acc, season) => acc + season.chapters, 0);
    
    return `
        <div class="novel-card" data-id="${novel.id}">
            <div class="novel-cover">
                <img src="${novel.cover}" alt="${novel.title}">
                <span class="novel-status ${statusClass}">${statusText}</span>
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
                        <i class="fas fa-list"></i> ${totalChapters} Chapters
                    </span>
                </div>
                <p class="novel-description">${novel.description}</p>
                <div class="novel-genres">
                    ${novel.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Filter novels based on status and search
function filterNovels() {
    return novelsData.filter(novel => {
        // Filter by status
        if (currentFilter !== 'all' && novel.status !== currentFilter) {
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
        case 'latest':
        default:
            return sorted.sort((a, b) => b.id - a.id);
    }
}

// Open chapter modal
function openChapterModal(novelId) {
    const novel = novelsData.find(n => n.id == novelId);
    if (!novel) return;
    
    modalNovelTitle.textContent = novel.title;
    
    const chaptersHTML = novel.seasons.map(season => {
        const seasonChapters = Array.from({ length: season.chapters }, (_, i) => i + 1);
        
        return `
            <div class="season-section">
                <h3 class="season-title">${season.name}</h3>
                <div class="chapter-list">
                    ${seasonChapters.map(chapter => 
                        `<a href="https://${season.url}/chapter-${chapter}" target="_blank" class="chapter-item">
                            <i class="fas fa-book"></i> Chapter ${chapter}
                        </a>`
                    ).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    chapterList.innerHTML = chaptersHTML || '<div class="no-chapters">Belum ada chapter tersedia</div>';
    chapterModal.style.display = 'block';
}

// Close modal
function closeModal() {
    chapterModal.style.display = 'none';
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    displayNovels();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        displayNovels();
    });
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    displayNovels();
});

closeModal.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === chapterModal) {
        closeModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayNovels();
});
