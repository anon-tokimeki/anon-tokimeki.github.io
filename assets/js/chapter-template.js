// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// Data Novel - Sesuaikan dengan novel Anda
const novelsData = {
    'the-lost-kingdom': {
        title: 'The Lost Kingdom',
        author: 'J.K. Rowling',
        description: 'Sebuah petualangan epik di kerajaan yang hilang, penuh dengan misteri dan keajaiban.',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
        seasons: [
            {
                name: 'Season 1',
                chapters: 10,
                baseUrl: '/novel/the-lost-kingdom/season-1'
            },
            {
                name: 'Season 2',
                chapters: 8,
                baseUrl: '/novel/the-lost-kingdom/season-2'
            }
        ]
    },
    'love-in-tokyo': {
        title: 'Love in Tokyo',
        author: 'Haruki Murakami',
        description: 'Kisah romantis di tengah hiruk pikuk kota Tokyo.',
        cover: 'https://images.unsplash.com/photo-1545569341-973eb848179a?w=300&h=400&fit=crop',
        seasons: [
            {
                name: 'Season 1',
                chapters: 12,
                baseUrl: '/novel/love-in-tokyo/season-1'
            }
        ]
    },
    'martial-god': {
        title: 'Martial God',
        author: 'Gu Long',
        description: 'Perjalanan seorang pendekar dalam menguasai ilmu bela diri tertinggi.',
        cover: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=300&h=400&fit=crop',
        seasons: [
            {
                name: 'Season 1',
                chapters: 15,
                baseUrl: '/novel/martial-god/season-1'
            },
            {
                name: 'Season 2',
                chapters: 5,
                baseUrl: '/novel/martial-god/season-2'
            }
        ]
    }
};

// Get current novel and chapter info from URL
function getCurrentNovelInfo() {
    const path = window.location.pathname;
    const matches = path.match(/\/novel\/([^\/]+)\/season-(\d+)\/chapter-(\d+)\.html/);
    
    if (matches) {
        return {
            novelId: matches[1],
            season: parseInt(matches[2]),
            chapter: parseInt(matches[3])
        };
    }
    return null;
}

// Generate chapter content
function generateChapterContent(novelInfo) {
    const novel = novelsData[novelInfo.novelId];
    if (!novel) return '<p>Novel tidak ditemukan</p>';
    
    const season = novel.seasons[novelInfo.season - 1];
    if (!season) return '<p>Season tidak ditemukan</p>';
    
    // Template konten chapter yang dinamis
    const chapterTemplates = {
        1: `
            <h2>Bab 1: Awal Petualangan</h2>
            <p>Matahari pagi menyinari kota kecil yang tenang. ${novel.title} membuka mata dan meregangkan tubuh. Hari ini akan menjadi hari yang berbeda, pikirnya.</p>
            <p>Sejak kecil, ia selalu merasa ada yang berbeda dari dirinya. Mimpi-mimpi aneh sering menghantuinya, tentang kerajaan megah dan pertempuran epik.</p>
            <p>"Selamat pagi, ${novel.author}!" sapa ibunya dari dapur. "Aku membuat sarapan favoritmu."</p>
            <p>Namun sebelum ia sempat menjawab, surat misterius tiba-tiba muncul di atas meja. Amplop emas dengan segel kerajaan yang tidak dikenal.</p>
            <p>Dengan tangan gemetar, ia membuka surat itu. Isinya membuat jantungnya berdegup kencang...</p>
        `,
        2: `
            <h2>Bab 2: Panggilan Takdir</h2>
            <p>Surat itu berbunyi: "Kau adalah pewaris takhta Kerajaan yang Hilang. Kembalilah sebelum matahari terbenam di hari ketiga."</p>
            <p>"Ini pasti mimpi," gumamnya. Tapi segel kerajaan terasa nyata di tangannya.</p>
            <p>Seorang pria berjubah muncul dari pintu. "Aku sudah lama mencarimu, Tuanku."</p>
            <p>Perjalanan menuju takdirnya pun dimulai...</p>
        `
    };
    
    // Gunakan template yang sesuai atau buat template default
    return chapterTemplates[novelInfo.chapter] || `
        <h2>Bab ${novelInfo.chapter}: Kelanjutan Cerita</h2>
        <p>Petualangan ${novel.title} berlanjut. Setelah kejadian sebelumnya, ia harus menghadapi tantangan baru yang lebih berat.</p>
        <p>"Kau harus siap menghadapi apapun yang akan datang," kata mentor. "Karena ini baru permulaan."</p>
        <p>Dengan tekad bulat, ia melangkah maju...</p>
        <p><i>Bersambung ke chapter berikutnya...</i></p>
    `;
}

// Load chapter content
function loadChapter() {
    const novelInfo = getCurrentNovelInfo();
    if (!novelInfo) {
        document.getElementById('novelContent').innerHTML = '<p>URL tidak valid</p>';
        return;
    }
    
    const novel = novelsData[novelInfo.novelId];
    if (!novel) {
        document.getElementById('novelContent').innerHTML = '<p>Novel tidak ditemukan</p>';
        return;
    }
    
    // Set page title
    document.getElementById('pageTitle').textContent = `${novel.title} - Chapter ${novelInfo.chapter} | NovelVerse`;
    document.getElementById('novelTitle').textContent = novel.title;
    document.getElementById('chapterTitle').textContent = `Chapter ${novelInfo.chapter}`;
    document.getElementById('authorName').textContent = novel.author;
    document.getElementById('updateDate').textContent = new Date().toLocaleDateString('id-ID');
    
    // Generate content
    const content = generateChapterContent(novelInfo);
    document.getElementById('novelContent').innerHTML = content;
    
    // Load chapter select
    loadChapterSelect(novel, novelInfo);
    
    // Setup navigation
    setupNavigation(novel, novelInfo);
}

// Load chapter select dropdown
function loadChapterSelect(novel, currentInfo) {
    const select = document.getElementById('chapterSelect');
    select.innerHTML = '';
    
    novel.seasons.forEach((season, seasonIndex) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = season.name;
        
        for (let i = 1; i <= season.chapters; i++) {
            const option = document.createElement('option');
            option.value = `${season.baseUrl}/chapter-${i}.html`;
            option.textContent = `${season.name} - Chapter ${i}`;
            
            if (seasonIndex + 1 === currentInfo.season && i === currentInfo.chapter) {
                option.selected = true;
            }
            
            optgroup.appendChild(option);
        }
        
        select.appendChild(optgroup);
    });
    
    select.addEventListener('change', (e) => {
        window.location.href = e.target.value;
    });
}

// Setup navigation buttons
function setupNavigation(novel, currentInfo) {
    const prevChapter = document.getElementById('prevChapter');
    const nextChapter = document.getElementById('nextChapter');
    const prevChapterBottom = document.getElementById('prevChapterBottom');
    const nextChapterBottom = document.getElementById('nextChapterBottom');
    
    // Find previous chapter
    let prevUrl = null;
    let nextUrl = null;
    
    // Check previous chapter in same season
    if (currentInfo.chapter > 1) {
        const season = novel.seasons[currentInfo.season - 1];
        prevUrl = `${season.baseUrl}/chapter-${currentInfo.chapter - 1}.html`;
    } else if (currentInfo.season > 1) {
        // Previous season last chapter
        const prevSeason = novel.seasons[currentInfo.season - 2];
        prevUrl = `${prevSeason.baseUrl}/chapter-${prevSeason.chapters}.html`;
    }
    
    // Check next chapter in same season
    const currentSeason = novel.seasons[currentInfo.season - 1];
    if (currentInfo.chapter < currentSeason.chapters) {
        nextUrl = `${currentSeason.baseUrl}/chapter-${currentInfo.chapter + 1}.html`;
    } else if (currentInfo.season < novel.seasons.length) {
        // Next season first chapter
        const nextSeason = novel.seasons[currentInfo.season];
        nextUrl = `${nextSeason.baseUrl}/chapter-1.html`;
    }
    
    // Set buttons
    [prevChapter, prevChapterBottom].forEach(btn => {
        if (prevUrl) {
            btn.onclick = () => window.location.href = prevUrl;
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    });
    
    [nextChapter, nextChapterBottom].forEach(btn => {
        if (nextUrl) {
            btn.onclick = () => window.location.href = nextUrl;
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    });
}

// Reading settings
function initReadingSettings() {
    const content = document.getElementById('novelContent');
    const fontSizeSpan = document.getElementById('fontSize');
    let fontSize = 16;
    
    document.getElementById('decreaseFont').addEventListener('click', () => {
        if (fontSize > 12) {
            fontSize -= 2;
            content.style.fontSize = fontSize + 'px';
            fontSizeSpan.textContent = fontSize + 'px';
        }
    });
    
    document.getElementById('increaseFont').addEventListener('click', () => {
        if (fontSize < 24) {
            fontSize += 2;
            content.style.fontSize = fontSize + 'px';
            fontSizeSpan.textContent = fontSize + 'px';
        }
    });
    
    document.getElementById('fontFamily').addEventListener('change', (e) => {
        content.style.fontFamily = e.target.value;
    });
    
    // Theme modes
    document.getElementById('lightMode').addEventListener('click', () => {
        document.body.classList.remove('dark-theme', 'sepia-theme');
    });
    
    document.getElementById('darkMode').addEventListener('click', () => {
        document.body.classList.remove('sepia-theme');
        document.body.classList.add('dark-theme');
    });
    
    document.getElementById('sepiaMode').addEventListener('click', () => {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('sepia-theme');
    });
}

// Progress bar
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Back to top
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Like button
function initLikeButton() {
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');
    let liked = false;
    let count = parseInt(likeCount.textContent);
    
    likeBtn.addEventListener('click', () => {
        if (!liked) {
            count++;
            likeBtn.innerHTML = `<i class="fas fa-heart"></i> ${count}`;
            liked = true;
        } else {
            count--;
            likeBtn.innerHTML = `<i class="far fa-heart"></i> ${count}`;
            liked = false;
        }
    });
}

// Load comments
function loadComments() {
    const commentsList = document.getElementById('commentsList');
    const sampleComments = [
        {
            user: 'Pembaca Setia',
            comment: 'Ceritanya seru banget! Lanjutkan!',
            time: '2 jam yang lalu'
        },
        {
            user: 'Novel Lover',
            comment: 'Kapan update chapter selanjutnya?',
            time: '5 jam yang lalu'
        },
        {
            user: 'Bookworm',
            comment: 'Plot twistnya keren!',
            time: '1 hari yang lalu'
        }
    ];
    
    commentsList.innerHTML = sampleComments.map(comment => `
        <div class="comment-item">
            <img src="https://ui-avatars.com/api/?name=${comment.user}&background=6366f1&color=fff" alt="${comment.user}">
            <div class="comment-content">
                <div class="comment-header">
                    <h4>${comment.user}</h4>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <p>${comment.comment}</p>
                <div class="comment-actions">
                    <button><i class="far fa-heart"></i> 5</button>
                    <button><i class="far fa-reply"></i> Balas</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    loadChapter();
    initReadingSettings();
    initProgressBar();
    initBackToTop();
    initLikeButton();
    loadComments();
    
    // Theme toggle from main.js
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('light-theme')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }
});
