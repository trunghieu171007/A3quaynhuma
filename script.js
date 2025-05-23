const images = [
    'images/image1.jpg',
    'images/image2.jpg',
    'images/image3.jpg',
    'images/image4.jpg',
    'images/image5.jpg',
    'images/image6.jpg',
    'images/image7.jpg',
];

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Render gallery
images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.className = 'gallery-img';
    img.addEventListener('click', e => openZoom(e, img));
    gallery.appendChild(img);
});

let zoomClone = null;
let lastRect = null;
let lastImg = null;

function openZoom(e, img) {
    lastRect = img.getBoundingClientRect();
    lastImg = img;
    zoomClone = img.cloneNode();
    zoomClone.classList.add('img-zoom-clone');
    zoomClone.style.objectFit = 'contain'; // Đảm bảo giữ tỉ lệ gốc khi phóng to
    document.body.appendChild(zoomClone);
    // Đặt vị trí ban đầu (hình vuông)
    Object.assign(zoomClone.style, {
        left: lastRect.left + 'px',
        top: lastRect.top + 'px',
        width: lastRect.width + 'px',
        height: lastRect.height + 'px',
        opacity: '1',
    });
    lightbox.classList.add('active');
    img.style.visibility = 'hidden';
    // Tính toán vị trí và kích thước mục tiêu giữ nguyên tỉ lệ gốc
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Lấy kích thước thật của ảnh
    const tempImg = new window.Image();
    tempImg.src = img.src;
    tempImg.onload = function() {
        const imgW = tempImg.naturalWidth;
        const imgH = tempImg.naturalHeight;
        const scaleW = vw * 0.8 / imgW;
        const scaleH = vh * 0.8 / imgH;
        const scale = Math.min(scaleW, scaleH, 1.5);
        const targetW = imgW * scale;
        const targetH = imgH * scale;
        const targetLeft = (vw - targetW) / 2;
        const targetTop = (vh - targetH) / 2;
        setTimeout(() => {
            zoomClone.classList.add('zoomed');
            Object.assign(zoomClone.style, {
                left: targetLeft + 'px',
                top: targetTop + 'px',
                width: targetW + 'px',
                height: targetH + 'px',
            });
        }, 10);
    };
}

function closeZoom() {
    if (!zoomClone || !lastRect || !lastImg) return;
    // Khi thu nhỏ, chuyển object-fit về cover để khớp với gallery
    zoomClone.style.objectFit = 'cover';
    zoomClone.classList.remove('zoomed');
    Object.assign(zoomClone.style, {
        left: lastRect.left + 'px',
        top: lastRect.top + 'px',
        width: lastRect.width + 'px',
        height: lastRect.height + 'px',
        opacity: '1',
        transition: 'left 0.4s cubic-bezier(.4,1,.6,1), top 0.4s cubic-bezier(.4,1,.6,1), width 0.4s cubic-bezier(.4,1,.6,1), height 0.4s cubic-bezier(.4,1,.6,1), opacity 0.3s',
    });
    lightbox.classList.remove('active');
    setTimeout(() => {
        if (zoomClone) {
            zoomClone.remove();
            zoomClone = null;
        }
        if (lastImg) {
            lastImg.style.visibility = '';
        }
        lastRect = null;
        lastImg = null;
    }, 400);
}

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeZoom();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeZoom();
});

// Header scroll effect
const header = document.getElementById('site-header');
// Function to handle header scroll effect with throttling
let lastScrollTime = 0;
const scrollThrottleMs = 5; // Reduced throttle time for smoother transitions
let ticking = false;

function handleHeaderScroll() {
    const currentTime = Date.now();
    if (currentTime - lastScrollTime < scrollThrottleMs) return;
    
    lastScrollTime = currentTime;
    // Lower threshold to trigger earlier
    if (window.scrollY > 20) {
        if (!header.classList.contains('scrolled')) {
            header.classList.add('scrolled');
        }
    } else {
        if (header.classList.contains('scrolled')) {
            header.classList.remove('scrolled');
        }
    }
    ticking = false;
}

// Add scroll event listener with requestAnimationFrame for smoother performance
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleHeaderScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Initialize header state on page load
document.addEventListener('DOMContentLoaded', () => {
    handleHeaderScroll(); // Check initial scroll position
    
    // Add click handler for header to reset scroll position
    header.addEventListener('click', () => {
        if (header.classList.contains('scrolled')) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});
