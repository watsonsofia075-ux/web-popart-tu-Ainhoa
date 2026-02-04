// ========== HERO AUDIO CONTROL ==========

const heroAudio = document.getElementById('hero-audio');
const audioToggle = document.getElementById('audio-toggle');
const audioIcon = document.querySelector('.audio-icon');

let audioPlaying = false;

// Función para actualizar el ícono
function updateAudioIcon() {
    if (audioPlaying) {
        audioIcon.textContent = '🔊';
        audioToggle.classList.add('playing');
    } else {
        audioIcon.textContent = '🔇';
        audioToggle.classList.remove('playing');
    }
}

// Click en el botón de audio
if (audioToggle) {
    audioToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (heroAudio) {
            if (audioPlaying) {
                heroAudio.pause();
                audioPlaying = false;
            } else {
                heroAudio.muted = false;
                heroAudio.play().catch(err => console.log('Audio play failed:', err));
                audioPlaying = true;
            }
            updateAudioIcon();
        }
    });
}

// Escuchar eventos de audio
if (heroAudio) {
    heroAudio.addEventListener('play', function() {
        audioPlaying = true;
        updateAudioIcon();
    });

    heroAudio.addEventListener('pause', function() {
        audioPlaying = false;
        updateAudioIcon();
    });

    heroAudio.addEventListener('ended', function() {
        audioPlaying = false;
        updateAudioIcon();
    });
}

// Permitir que el usuario inicie el audio con cualquier clic
document.addEventListener('click', function initAudio() {
    if (heroAudio && heroAudio.paused && !audioPlaying) {
        heroAudio.muted = false;
        heroAudio.play().catch(err => console.log('Audio play failed:', err));
    }
}, { once: true });

// También intentar reproducir sin muted después de que la página cargue
window.addEventListener('load', function() {
    if (heroAudio) {
        heroAudio.muted = false;
        heroAudio.play().then(() => {
            audioPlaying = true;
            updateAudioIcon();
        }).catch(err => console.log('Audio autoplay failed:', err));
    }
});

// ========== HERO CAROUSEL AUTOMATION ==========

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextHeroSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-rotate hero carousel every 5 seconds
setInterval(nextHeroSlide, 5000);

// ========== HORIZONTAL CAROUSEL CONTROLS ==========

const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

if (carouselTrack && prevBtn && nextBtn) {
    const items = Array.from(carouselTrack.querySelectorAll('.carousel-item'));
    let currentIndex = 0;
    let itemWidth = 0;
    let autoplayId = null;

    function updateSizes() {
        if (!items.length) return;
        const style = getComputedStyle(items[0]);
        const marginRight = parseFloat(style.marginRight) || 0;
        itemWidth = Math.round(items[0].getBoundingClientRect().width + marginRight);
        carouselTrack.style.transition = 'transform 0.6s ease';
        showSlide(currentIndex);
    }

    function showSlide(index) {
        if (!items.length) return;
        currentIndex = (index + items.length) % items.length;
        const offset = currentIndex * itemWidth;
        carouselTrack.style.transform = `translateX(-${offset}px)`;
    }

    prevBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        resetAutoplay();
    });

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayId = setInterval(nextSlide, 4000);
    }

    function stopAutoplay() {
        if (autoplayId) {
            clearInterval(autoplayId);
            autoplayId = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Pause autoplay on hover and resume on leave
    const carouselContainer = document.querySelector('.horizontal-carousel') || carouselTrack.parentElement;
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoplay);
        carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    window.addEventListener('resize', function() {
        // small debounce
        clearTimeout(window._carouselResizeTimeout);
        window._carouselResizeTimeout = setTimeout(updateSizes, 120);
    });

    // initialize
    updateSizes();
    startAutoplay();
}

// ========== SMOOTH SCROLLING ==========

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ========== ACTIVE NAV LINK ON SCROLL ==========

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

// Observe work items
document.querySelectorAll('.work-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

// Observe movement items
document.querySelectorAll('.movement-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

// ========== CONSOLE MESSAGE ==========

console.log('%cDavid Hockney: Pop Art y pintura contemporánea', 'color: #000000; font-size: 16px; font-weight: bold;');
console.log('%cThe Museum of Modern Art', 'color: #767676; font-size: 14px;');
