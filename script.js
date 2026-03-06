let galleryImages = [];
let currentGalleryIndex = 0;

const users = {
    // Имя: Мария Сергеевна
    "masha@mail.ru": { password: "Mashenka", page: "masha.html" },
    // Имя: Елена Геннадьевна
    "lena@mail.ru": { password: "Lenochka", page: "lena.html" },
    // Имя: Соня
    "sonya@mail.ru": { password: "Sonechka", page: "sonya.html" },
    // Имя: Катя
    "katya@mail.ru": { password: "Katenka", page: "katya.html" },
    // Имя: Залина
    "zalina@mail.ru": { password: "Zalinochka", page: "zalina.html" },
    // Имя: Наташа
    "natasha@mail.ru": { password: "Natashenka", page: "natasha.html" },
    // Имя: Лиза
    "liza@mail.ru": { password: "Lizonka", page: "liza.html" },
    // Имя: Кира
    "kira@mail.ru": { password: "Kirochka", page: "kira.html" },
    // Для парней проверка
    "parni@mail.ru": { password: "Parni", page: "masha.html" }
};

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.toLowerCase().trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    if (users[email] && users[email].password === password) {
        window.location.href = users[email].page;
    } else {
        errorMessage.textContent = "🌸 Неверная почта или пароль. Попробуй ещё! 🌸";
        errorMessage.style.color = "#ff6b8b";
        
        document.querySelector('.login-card').style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.querySelector('.login-card').style.animation = '';
        }, 500);
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-5px); }
    }
`;
document.head.appendChild(style);

function setActiveNav(currentPage) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage && currentPage !== 'index.html' && currentPage !== '') {
        setActiveNav(currentPage);
    }
});

function openHeaderLightbox(imageSrc, caption) {
    console.log('Открываю лайтбокс шапки:', imageSrc, 'с подписью:', caption);
    const lightbox = document.getElementById('headerLightbox');
    const lightboxImg = document.getElementById('headerLightbox-img');
    const lightboxCaption = document.getElementById('headerLightbox-caption');
    
    if (!lightbox || !lightboxImg) {
        console.error('Не найден лайтбокс для шапки!');
        return;
    }
    
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption || '🌸';
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeHeaderLightbox(event) {
    if (event) event.stopPropagation();
    const lightbox = document.getElementById('headerLightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openMainPhotoLightbox(imageSrc, caption) {
    console.log('Открываю лайтбокс основного фото:', imageSrc, 'с подписью:', caption);
    const lightbox = document.getElementById('mainPhotoLightbox');
    const lightboxImg = document.getElementById('mainPhotoLightbox-img');
    const lightboxCaption = document.getElementById('mainPhotoLightbox-caption');
    
    if (!lightbox || !lightboxImg) {
        console.error('Не найден лайтбокс для основного фото!');
        return;
    }
    
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption || '🌸';
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeMainPhotoLightbox(event) {
    if (event) event.stopPropagation();
    const lightbox = document.getElementById('mainPhotoLightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openGalleryLightboxFromElement(imgElement) {
    console.log('Кликнули по фото галереи:', imgElement);
    
    const galleryItem = imgElement.closest('.gallery-item');
    if (!galleryItem) {
        console.error('Не найден gallery-item');
        return;
    }
    
    const index = galleryItem.dataset.index;
    if (index === undefined) {
        console.error('Нет data-index');
        return;
    }
    
    const imageSrc = imgElement.src;
    const caption = imgElement.alt || 
                   galleryItem.querySelector('.gallery-overlay p')?.textContent || 
                   'Фото из галереи';
    
    openGalleryLightbox(imageSrc, caption, parseInt(index));
}

function openGalleryLightbox(imageSrc, caption, index) {
    console.log('Открываю лайтбокс галереи:', imageSrc, 'с подписью:', caption, 'индекс:', index);
    
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('galleryLightbox-img');
    const lightboxCaption = document.getElementById('galleryLightbox-caption');
    
    if (!lightbox || !lightboxImg) {
        console.error('Не найден лайтбокс для галереи!');
        return;
    }
    
    collectGalleryImages();
    
    if (galleryImages.length === 0) {
        console.error('Не найдено фото в галерее!');
        return;
    }
    
    currentGalleryIndex = index;
    
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption || '🌸';
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeGalleryLightbox(event) {
    if (event) event.stopPropagation();
    const lightbox = document.getElementById('galleryLightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function changeGalleryPhoto(direction, event) {
    if (event) event.stopPropagation();
    
    if (galleryImages.length === 0) {
        console.log('Нет фото в галерее');
        return;
    }
    
    currentGalleryIndex += direction;
    
    if (currentGalleryIndex < 0) currentGalleryIndex = galleryImages.length - 1;
    if (currentGalleryIndex >= galleryImages.length) currentGalleryIndex = 0;
    
    const img = galleryImages[currentGalleryIndex];
    const lightboxImg = document.getElementById('galleryLightbox-img');
    const lightboxCaption = document.getElementById('galleryLightbox-caption');
    
    if (lightboxImg && lightboxCaption) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt || '🌸';
    }
}

function collectGalleryImages() {
    galleryImages = [];
    
    const images = document.querySelectorAll('.gallery-item img');
    console.log('Найдено img элементов в галерее:', images.length);
    
    images.forEach((img, idx) => {
        const galleryItem = img.closest('.gallery-item');
        const caption = galleryItem?.querySelector('.gallery-overlay p')?.textContent || img.alt || 'Фото из галереи';
        
        galleryImages.push({
            src: img.src,
            alt: caption
        });
    });
    
    console.log('Собрано фото галереи:', galleryImages.length);
}

document.addEventListener('keydown', function(e) {
    const headerLightbox = document.getElementById('headerLightbox');
    const galleryLightbox = document.getElementById('galleryLightbox');
    const mainPhotoLightbox = document.getElementById('mainPhotoLightbox');
    
    if (e.key === 'Escape') {
        console.log('Нажали ESC');
        
        if (headerLightbox && headerLightbox.style.display === 'block') {
            closeHeaderLightbox();
        }
        if (galleryLightbox && galleryLightbox.style.display === 'block') {
            closeGalleryLightbox();
        }
        if (mainPhotoLightbox && mainPhotoLightbox.style.display === 'block') {
            closeMainPhotoLightbox();
        }
    }
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (galleryLightbox && galleryLightbox.style.display === 'block') {
            e.preventDefault();
            changeGalleryPhoto(e.key === 'ArrowLeft' ? -1 : 1, e);
        }
    }
});

document.addEventListener('click', function(e) {
    const headerLightbox = document.getElementById('headerLightbox');
    const mainPhotoLightbox = document.getElementById('mainPhotoLightbox');
    const galleryLightbox = document.getElementById('galleryLightbox');
    
    if (e.target === headerLightbox) {
        console.log('Клик по фону шапки');
        closeHeaderLightbox();
    }
    if (e.target === mainPhotoLightbox) {
        console.log('Клик по фону основного фото');
        closeMainPhotoLightbox();
    }
    if (e.target === galleryLightbox) {
        console.log('Клик по фону галереи (но мы его игнорируем)');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена, проверяю элементы:');
    console.log('headerLightbox:', document.getElementById('headerLightbox'));
    console.log('mainPhotoLightbox:', document.getElementById('mainPhotoLightbox'));
    console.log('galleryLightbox:', document.getElementById('galleryLightbox'));
    console.log('gallery-items:', document.querySelectorAll('.gallery-item').length);
    
    collectGalleryImages();
});