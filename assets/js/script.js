// ==================== GLOBAL ARCHITECTURAL STATE & MATRIX ====================
let cart = [];
let currentPage = 1;
let selectedCategory = 'all';
let searchQuery = '';
let activeSeason = 'mawlid';
const PRODUCTS_PER_PAGE = 4;
const RESILIENT_FALLBACK_IMG = "assets/images/empty_img.png";

// ==================== SYSTEM INTERFACES AND LOADING ENGINE ====================
window.addEventListener('DOMContentLoaded', () => {
    initPreloaderSequence();
    initLuxuryInteractionsCanvas();
    initAmbientAtmosphere();
});

function initPreloaderSequence() {
    const tl = gsap.timeline({
        onComplete: () => {
            const loader = document.getElementById('loader');
            if(loader) {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                setTimeout(() => loader.remove(), 800);
            }
            initApplicationCore();
        }
    });
    tl.to('.preloader-title', { opacity: 1, y: 0, duration: 1, ease: "power4.out" })
      .to('.preloader-bar', { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, "-=0.6");
}

function initApplicationCore() {
    initLenisHighPerfScroll();
    initScrollAnimationsMatrix();
    initMagneticNodeTranslators();
    initOrnamentDrawOnScroll();
    lazyLoadFallbackObserver();
    fetchStorefrontPayload();
    initDeliveryFields();
    initSeasonalSwitcher();
    initCategorySearch();
}

// ==================== HIGH PERFORMANCE ENGINE & INTERFACES ====================
function initLenisHighPerfScroll() {
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        orientation: 'vertical'
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

function initScrollAnimationsMatrix() {
    gsap.registerPlugin(ScrollTrigger);
    const navbar = document.getElementById('navbar');
    let navbarScrollTicking = false;
    window.addEventListener('scroll', () => {
        if (navbarScrollTicking) return;
        navbarScrollTicking = true;
        requestAnimationFrame(() => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
            navbarScrollTicking = false;
        });
    }, { passive: true });

    gsap.to('.hero-reveal', { opacity: 1, y: 0, duration: 1.4, stagger: 0.2, ease: "power3.out" });

    gsap.utils.toArray('.text-scroller-fade, .img-reveal-wrapper').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 50 }, {
            opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        });
    });
}

function initMagneticNodeTranslators() {
    if (window.innerWidth < 1024) return;
    const nodes = document.querySelectorAll('.magnetic-element');
    nodes.forEach(node => {
        node.addEventListener('mousemove', (e) => {
            const rect = node.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(node, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: "power2.out" });
        });
        node.addEventListener('mouseleave', () => {
            gsap.to(node, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        });
    });
}

function initOrnamentDrawOnScroll() {
    const strokes = document.querySelectorAll('.ornament-stroke');
    if (!strokes.length) return;
    strokes.forEach(path => {
        const length = path.getTotalLength ? path.getTotalLength() : 900;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        gsap.to(path, {
            strokeDashoffset: 0, ease: "none",
            scrollTrigger: { trigger: '#hero', start: "top top", end: "bottom top", scrub: 0.6 }
        });
    });
}

function initLuxuryInteractionsCanvas() {
    const canvas = document.getElementById('rippleCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let ripples = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    window.addEventListener('click', (e) => {
        ripples.push({ x: e.clientX, y: e.clientY, r: 2, alpha: 0.35 });
    });
    function renderLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ripples.forEach((ripple, index) => {
            ripple.r += 3.5; ripple.alpha -= 0.008;
            if(ripple.alpha <= 0) ripples.splice(index, 1);
            else {
                ctx.beginPath(); ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(199, 123, 135, ${ripple.alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
            }
        });
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

function initAmbientAtmosphere() {
    const starsLayer = document.getElementById('starsLayer');
    const sparkleLayer = document.getElementById('sparkleLayer');
    const glow = document.getElementById('mouseGlow');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (starsLayer && !reduceMotion) {
        const starCount = window.innerWidth < 768 ? 18 : 34;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('span');
            star.className = 'star-twinkle';
            star.style.left = `${Math.random() * 100}%`; star.style.top = `${Math.random() * 55}%`;
            star.style.animationDelay = `${Math.random() * 4}s`;
            starsLayer.appendChild(star);
        }
    }
    if (sparkleLayer && !reduceMotion) {
        const sparkleCount = window.innerWidth < 768 ? 0 : 10;
        for (let i = 0; i < sparkleCount; i++) {
            const s = document.createElement('div');
            s.className = 'sparkle-drift';
            s.style.left = `${Math.random() * 100}%`; s.style.bottom = `-5%`;
            s.style.animationDuration = `${14 + Math.random() * 10}s`;
            s.innerHTML = `<svg width="${8 + Math.random()*8}" height="${8 + Math.random()*8}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/></svg>`;
            sparkleLayer.appendChild(s);
        }
    }
    if (glow && !reduceMotion) {
        window.addEventListener('mousemove', (e) => {
            glow.style.setProperty('--mx', `${(e.clientX / window.innerWidth) * 100}%`);
            glow.style.setProperty('--my', `${(e.clientY / window.innerHeight) * 100}%`);
        }, { passive: true });
    }
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message) {
    let toast = document.getElementById('luxuryToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'luxuryToast';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle text-seasonal-gold"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==================== SEASONAL & SEARCH ====================
function initSeasonalSwitcher() {
    const pills = document.querySelectorAll('.theme-pill');
    pills.forEach(pill => pill.addEventListener('click', () => window.setSeasonalTheme(pill.getAttribute('data-season'))));
}

window.setSeasonalTheme = function(season) {
    if (!season || season === activeSeason) return;
    activeSeason = season;
    document.documentElement.setAttribute('data-theme', season);
    document.querySelectorAll('.theme-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-season') === season));
};

function initCategorySearch() {
    const container = document.getElementById('mawlidProductsContainer');
    if (!container || document.getElementById('categorySearchInput')) return;
    const wrapper = document.createElement('div');
    wrapper.id = 'categorySearchWrap'; wrapper.className = 'w-full mb-8';
    wrapper.innerHTML = `
        <div class="relative max-w-md mx-auto">
            <i class="fas fa-search absolute top-1/2 -translate-y-1/2 right-5 text-primary/30 text-sm pointer-events-none"></i>
            <input type="text" id="categorySearchInput" placeholder="ابحث عن منتج..." class="w-full py-3.5 pr-12 pl-5 rounded-full border border-primary/80 bg-white/70 backdrop-blur-sm text-sm text-primary placeholder:text-primary focus:outline-none focus:border-seasonal-gold transition-colors" autocomplete="off" />
            <button type="button" id="categorySearchClear" aria-label="Clear search" class="hidden absolute top-1/2 -translate-y-1/2 left-5 text-primary/30 hover:text-primary transition-colors text-xs"><i class="fas fa-times"></i></button>
        </div>
    `;
    container.parentElement.insertBefore(wrapper, container);
    const input = wrapper.querySelector('#categorySearchInput');
    const clearBtn = wrapper.querySelector('#categorySearchClear');
    let debounceTimer;
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        clearBtn.classList.toggle('hidden', value.length === 0);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = value.trim().toLowerCase();
            currentPage = 1;
            rerenderStorefrontGridSmoothly();
        }, 250);
    });
    clearBtn.addEventListener('click', () => {
        input.value = ''; searchQuery = ''; currentPage = 1;
        clearBtn.classList.add('hidden');
        rerenderStorefrontGridSmoothly();
        input.focus();
    });
}

// ==================== DATA & GRID ====================
async function fetchStorefrontPayload() {
    try {
        const response = await fetch('assets/data/data.json');
        if (!response.ok) throw new Error('Data payload link disrupted');
        const data = await response.json();
        window.allProducts = data.products;
    } catch (e) {
        console.error('❌ Failed to load products data:', e.message);
        window.allProducts = [];
    }
    renderStorefrontGrid();
}

function renderStorefrontGrid() {
    const container = document.getElementById("mawlidProductsContainer");
    if (!container) return;
    if (!window.allProducts || window.allProducts.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-20"><p class="text-primary/40 font-light">لا توجد منتجات متوفرة حالياً.</p></div>`;
        renderPaginationControls(0); return;
    }
    const filtered = window.allProducts.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch = !searchQuery || (p.name || '').toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const paginatedItems = filtered.slice(start, start + PRODUCTS_PER_PAGE);
    if(paginatedItems.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-20"><p class="text-primary/40 font-light">لا توجد نتائج مطابقة.</p></div>`;
        renderPaginationControls(filtered.length); return;
    }
    container.innerHTML = paginatedItems.map((item, idx) => `
        <article class="product-card seasonal-surface p-5 rounded-[2.5rem] border border-primary/5 flex flex-col h-full opacity-0 translate-y-8" style="animation-delay: ${idx * 60}ms">
            <div class="product-image-container relative aspect-[4/5] seasonal-bg mb-6 rounded-3xl overflow-hidden">
                ${item.badge ? `<span class="absolute top-4 right-4 z-20 seasonal-surface text-seasonal-gold text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-luxury-sm border border-seasonal-gold/20">${item.badge}</span>` : ''}
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3C/svg%3E" data-src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105 lazy-load opacity-0" onload="handleImageCompletion(this)" onerror="handleImageDisruption(this)">
                <div class="absolute inset-0 skeleton-loader"></div>
                <button onclick="addToCart('${item.id}')" aria-label="Add ${item.name} to Cart" class="absolute bottom-5 right-5 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-luxury-md hover:bg-seasonal-gold transition-colors duration-300 z-20 magnetic-element">
                    <i class="fas fa-plus text-sm"></i>
                </button>
            </div>
            <div class="flex flex-col flex-1 px-2 text-center">
                <h4 class="text-xl font-dmserif text-primary mb-2">${item.name}</h4>
                ${item.pieces ? `<p class="text-graystone text-xs mb-2 ${Array.isArray(item.contents) && item.contents.length ? 'cursor-pointer hover:text-primary transition-colors' : ''}" ${Array.isArray(item.contents) && item.contents.length ? `onclick="openProductDetailsModal('${item.id}')"` : ''}>${Number(item.pieces).toLocaleString("ar-EG")} قطعة</p>` : ''}
                ${Array.isArray(item.contents) && item.contents.length ? `<button onclick="openProductDetailsModal('${item.id}')" class="text-seasonal-gold text-xs font-bold underline underline-offset-2 hover:text-primary transition-colors mb-2">عرض المحتويات</button>` : ''}
                <div class="mt-auto pt-4 border-t border-primary/5">
                    <span class="text-base font-bold text-primary">${parseInt(item.price, 10).toLocaleString("ar-EG")} ج.م</span>
                </div>
            </div>
        </article>
    `).join("");
    gsap.to('.product-card', { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" });
    lazyLoadFallbackObserver();
    renderPaginationControls(filtered.length);
}

function renderPaginationControls(totalItems) {
    const container = document.getElementById("paginationContainer");
    if(!container) return;
    const pageCount = Math.ceil(totalItems / PRODUCTS_PER_PAGE);
    if(pageCount <= 1) { container.innerHTML = ""; return; }
    const pageButton = (label, targetPage, opts = {}) => `
        <button ${!!opts.disabled ? 'disabled' : `onclick="changeStorePage(${targetPage})"`} class="w-10 h-10 rounded-full font-bold text-xs border transition-all duration-300 flex items-center justify-center ${!!opts.active ? 'bg-primary text-white border-primary' : 'bg-white text-primary/60 border-primary/10 hover:border-primary'} ${!!opts.disabled ? 'opacity-30 cursor-not-allowed' : ''}">${label}</button>
    `;
    const dots = `<span class="w-10 h-10 flex items-center justify-center text-primary/30 text-xs font-bold select-none">…</span>`;
    const keyPages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
    const sortedPages = [...keyPages].filter(p => p >= 1 && p <= pageCount).sort((a, b) => a - b);
    let html = pageButton('<i class="fas fa-chevron-right text-[10px]"></i>', currentPage - 1, { disabled: currentPage === 1 });
    let previousPage = 0;
    sortedPages.forEach(p => {
        if (previousPage && p - previousPage > 1) html += dots;
        html += pageButton(p, p, { active: p === currentPage });
        previousPage = p;
    });
    html += pageButton('<i class="fas fa-chevron-left text-[10px]"></i>', currentPage + 1, { disabled: currentPage === pageCount });
    container.innerHTML = html;
}

function rerenderStorefrontGridSmoothly() {
    const container = document.getElementById("mawlidProductsContainer");
    if (!container || !container.children.length) { renderStorefrontGrid(); return; }
    container.classList.add('grid-swapping');
    setTimeout(() => { renderStorefrontGrid(); container.classList.remove('grid-swapping'); }, 180);
}

window.changeStorePage = (page) => {
    if (page < 1) return;
    currentPage = page;
    rerenderStorefrontGridSmoothly();
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
};

window.filterCategory = (category, btn) => {
    selectedCategory = category; currentPage = 1;
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    const target = btn || document.querySelector(`.category-btn[data-category="${category}"]`);
    if (target) target.classList.add('active');
    rerenderStorefrontGridSmoothly();
};

// ==================== IMAGES ====================
function handleImageCompletion(img) {
    img.classList.remove('opacity-0'); img.style.opacity = '1';
    const loader = img.parentElement.querySelector('.skeleton-loader');
    if(loader) { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 600); }
}
function handleImageDisruption(img) {
    img.onerror = null; img.src = RESILIENT_FALLBACK_IMG; handleImageCompletion(img);
}
function lazyLoadFallbackObserver() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.remove('lazy-load');
                    obs.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => observer.observe(img));
    } else {
        lazyImages.forEach(img => { img.src = img.getAttribute('data-src'); img.classList.remove('lazy-load'); });
    }
}

// ==================== DELIVERY ====================
function initDeliveryFields() {
    const deliveryFields = document.getElementById('deliveryFields');
    if (deliveryFields) { deliveryFields.classList.add('hidden'); deliveryFields.style.maxHeight = '0'; deliveryFields.style.opacity = '0'; }
    const pickupRadio = document.querySelector('input[name="orderType"][value="pickup"]');
    if (pickupRadio) pickupRadio.checked = true;
}

window.toggleDeliveryFields = function() {
    const deliveryFields = document.getElementById('deliveryFields');
    const selected = document.querySelector('input[name="orderType"]:checked');
    if (selected && selected.value === 'delivery') {
        deliveryFields.classList.remove('hidden'); deliveryFields.style.maxHeight = '500px'; deliveryFields.style.opacity = '1';
        document.getElementById('governorateSelect').setAttribute('required', 'required');
        document.getElementById('deliveryAddress').setAttribute('required', 'required');
    } else {
        deliveryFields.style.maxHeight = '0'; deliveryFields.style.opacity = '0';
        setTimeout(() => deliveryFields.classList.add('hidden'), 300);
        document.getElementById('governorateSelect').removeAttribute('required');
        document.getElementById('deliveryAddress').removeAttribute('required');
    }
};

// ==================== PRODUCT DETAILS MODAL ====================
function ensureProductDetailsModal() {
    let modal = document.getElementById('productDetailsModal');
    if (modal && modal.dataset.dynamic === 'true') return modal;
    if (modal) modal.remove(); // remove any static/incompatible markup and rebuild our own

    modal = document.createElement('div');
    modal.id = 'productDetailsModal';
    modal.dataset.dynamic = 'true';
    modal.style.cssText = `
        position: fixed; inset: 0; z-index: 9999; display: none;
        align-items: center; justify-content: center;
        background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px); padding: 16px;
        opacity: 0; transition: opacity 0.3s ease;
    `;
    modal.innerHTML = `
        <div class="pd-modal-pop" style="background:#fff; border-radius:2rem; padding:2rem; max-width:32rem; width:100%; max-height:85vh; overflow-y:auto; box-shadow:0 25px 50px -12px rgba(0,0,0,0.35); opacity:1; transform:scale(0.92); transition:transform 0.3s ease, opacity 0.3s ease;">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:16px;">
                <div>
                    <h3 id="productDetailsTitle" style="font-size:1.5rem; font-family:inherit; color:var(--tw-color-primary, #d90441); margin:0;"></h3>
                    <p id="productDetailsMeta" style="color:#8B7B7E; font-size:0.75rem; margin:4px 0 0;"></p>
                </div>
                <button onclick="closeProductDetailsModal()" aria-label="إغلاق" style="width:36px; height:36px; flex-shrink:0; border-radius:9999px; background:#F5AEB833; color:#d90441; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px;">✕</button>
            </div>
            <div style="width:100%; aspect-ratio:16/9; border-radius:1.5rem; overflow:hidden; background:#F5AEB822; margin-bottom:20px;">
                <img id="productDetailsImage" src="" alt="" style="width:100%; height:100%; object-fit:cover;" onerror="this.src=RESILIENT_FALLBACK_IMG" />
            </div>
            <h4 style="font-size:0.875rem; font-weight:bold; color:#d90441; margin-bottom:12px;">محتويات العلبة</h4>
            <ul id="productDetailsList" style="list-style:none; margin:0 0 24px; padding:0; display:flex; flex-direction:column; gap:8px;"></ul>
            <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid #d9044115; padding-top:20px;">
                <span id="productDetailsPrice" style="font-size:1.125rem; font-weight:bold; color:#d90441;"></span>
                <button id="productDetailsAddBtn" style="padding:12px 24px; border-radius:1rem; background:#d90441; color:#fff; font-weight:bold; border:none; cursor:pointer; font-size:0.875rem;">أضف إلى السلة</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeProductDetailsModal(); });
    return modal;
}

window.openProductDetailsModal = (id) => {
    const product = window.allProducts.find(p => p.id == id);
    if (!product) return;
    const modal = ensureProductDetailsModal();

    const titleEl = modal.querySelector('#productDetailsTitle');
    const metaEl = modal.querySelector('#productDetailsMeta');
    const imgEl = modal.querySelector('#productDetailsImage');
    const listEl = modal.querySelector('#productDetailsList');
    const priceEl = modal.querySelector('#productDetailsPrice');
    const addBtn = modal.querySelector('#productDetailsAddBtn');

    if (titleEl) titleEl.innerText = product.name;
    if (metaEl) metaEl.innerText = product.pieces ? `${Number(product.pieces).toLocaleString("ar-EG")} قطعة` : '';
    if (imgEl) { imgEl.src = product.image; imgEl.alt = product.name; }
    if (priceEl) priceEl.innerText = `${parseInt(product.price, 10).toLocaleString("ar-EG")} ج.م`;
    if (addBtn) addBtn.onclick = () => { addToCart(product.id); closeProductDetailsModal(); };

    if (listEl) {
        const contents = Array.isArray(product.contents) ? product.contents : [];
        listEl.innerHTML = contents.map(item => `
            <li style="display:flex; align-items:center; justify-content:space-between; gap:12px; background:#F5AEB815; padding:10px 16px; border-radius:1rem; border:1px solid #d9044108;">
                <span style="font-size:0.875rem; color:#d90441;">${item.name}</span>
                <span style="font-size:0.75rem; font-weight:bold; color:#C77B87; background:#fff; padding:4px 10px; border-radius:9999px; border:1px solid #C77B8733;">${Number(item.qty).toLocaleString("ar-EG")}</span>
            </li>
        `).join('');
    }

    modal.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => {
        modal.style.opacity = '1';
        const pop = modal.querySelector('.pd-modal-pop');
        if (pop) pop.style.transform = 'scale(1)';
    }));
};

window.closeProductDetailsModal = () => {
    const modal = document.getElementById('productDetailsModal');
    if (!modal) return;
    modal.style.opacity = '0';
    const pop = modal.querySelector('.pd-modal-pop');
    if (pop) pop.style.transform = 'scale(0.92)';
    setTimeout(() => { modal.style.display = 'none'; }, 300);
};

// ==================== CART ENGINE ====================
window.openCart = () => {
    const modal = document.getElementById("cartModal");
    const drawer = modal?.querySelector('.cart-drawer');
    if(!modal || !drawer) return;
    modal.classList.remove("hidden"); modal.style.display = "flex";
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.classList.add('is-visible');
            drawer.classList.remove('translate-x-full');
        });
    });
};

window.closeCart = () => {
    const modal = document.getElementById("cartModal");
    const drawer = modal?.querySelector('.cart-drawer');
    if(!modal || !drawer) return;
    modal.classList.remove('is-visible'); drawer.classList.add('translate-x-full');
    setTimeout(() => { modal.classList.add("hidden"); modal.style.display = "none"; }, 500);
};

window.addToCart = (id) => {
    const product = window.allProducts.find(p => p.id == id);
    if (!product) return;
    const existingItem = cart.find(item => item.id == id);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    syncCartUIMatrix();
    // Premium Toast instead of opening cart
    showToast('تمت الإضافة إلى السلة بنجاح ✨');
};

function syncCartUIMatrix() {
    const countEl = document.getElementById('cartCount');
    const itemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutContainer = document.getElementById('cartCheckout');
    const totalEl = document.getElementById('cartTotal');
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countEl) countEl.innerText = totalQuantity;
    if(countEl) gsap.fromTo(countEl, { scale: 1.4 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
    if (cart.length === 0) {
        if(emptyCart) emptyCart.classList.remove('hidden');
        if(checkoutContainer) checkoutContainer.style.display = 'none';
        if(itemsContainer) itemsContainer.innerHTML = '';
        return;
    }
    if(emptyCart) emptyCart.classList.add('hidden');
    if(checkoutContainer) checkoutContainer.style.display = 'block';
    if(itemsContainer) {
        itemsContainer.innerHTML = cart.map((item, idx) => `
            <div class="flex items-center gap-4 seasonal-bg p-4 rounded-3xl border border-primary/5">
                <div class="w-20 h-20 rounded-2xl overflow-hidden bg-white flex-shrink-0 border border-primary/5">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src=RESILIENT_FALLBACK_IMG" />
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-primary text-sm">${item.name}</h4>
                    <p class="text-seasonal-gold font-bold text-xs mt-1">${parseInt(item.price, 10).toLocaleString("ar-EG")} ج.م</p>
                    <div class="flex items-center gap-3 mt-3">
                        <button onclick="updateCartQuantity(${idx}, -1)" class="w-7 h-7 rounded-full bg-white text-primary border border-primary/10 hover:bg-primary hover:text-white transition-colors flex items-center justify-center font-bold text-xs">-</button>
                        <span class="font-bold text-xs w-4 text-center">${item.quantity}</span>
                        <button onclick="updateCartQuantity(${idx}, 1)" class="w-7 h-7 rounded-full bg-white text-primary border border-primary/10 hover:bg-primary hover:text-white transition-colors flex items-center justify-center font-bold text-xs">+</button>
                    </div>
                </div>
                <button onclick="removeFromCartModule(${idx})" class="text-primary/20 hover:text-red-600 transition-colors px-2" aria-label="Remove Item"><i class="fas fa-trash-alt text-sm"></i></button>
            </div>
        `).join('');
    }
    const aggregatedSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if(totalEl) totalEl.innerText = aggregatedSum.toLocaleString("ar-EG") + ' ج.م';
}

window.updateCartQuantity = (index, delta) => {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        syncCartUIMatrix();
    }
};

window.removeFromCartModule = (index) => {
    cart.splice(index, 1);
    syncCartUIMatrix();
};

// ==================== CHECKOUT & WHATSAPP ROUTING ====================
window.sendOrder = function() {
    const errorLog = document.getElementById('cartError');
    if (cart.length === 0) {
        if(errorLog) { errorLog.innerText = 'عذراً، السلة فارغة!'; errorLog.classList.remove('hidden'); }
        return;
    }
    if(errorLog) errorLog.classList.add('hidden');
    const orderType = document.querySelector('input[name="orderType"]:checked');
    if (orderType && orderType.value === 'delivery') {
        const governorate = document.getElementById('governorateSelect').value;
        const address = document.getElementById('deliveryAddress').value.trim();
        if (!governorate) { if(errorLog) { errorLog.innerText = 'يرجى اختيار المحافظة للتوصيل.'; errorLog.classList.remove('hidden'); } return; }
        if (!address) { if(errorLog) { errorLog.innerText = 'يرجى كتابة العنوان بالتفصيل للتوصيل.'; errorLog.classList.remove('hidden'); } return; }
    }
    const modal = document.getElementById('phoneModal');
    if(modal) {
        modal.classList.remove('hidden'); modal.style.display = 'flex';
        requestAnimationFrame(() => { requestAnimationFrame(() => modal.classList.add('is-visible')); });
    }
};

window.closePhoneModal = (clearInputs = false) => {
    const modal = document.getElementById('phoneModal');
    if(modal) {
        modal.classList.remove('is-visible');
        setTimeout(() => { modal.classList.add('hidden'); modal.style.display = 'none'; }, 450);
    }
    if (clearInputs) {
        const nameNode = document.getElementById('customerNameInput');
        const phoneNode = document.getElementById('customerPhoneInput');
        const errNode = document.getElementById('phoneErrorMsg');
        if(nameNode) nameNode.value = '';
        if(phoneNode) phoneNode.value = '';
        if(errNode) errNode.classList.add('hidden');
    }
};

window.confirmPhoneAndSend = function() {
    const name = document.getElementById('customerNameInput')?.value.trim();
    const phone = document.getElementById('customerPhoneInput')?.value.trim();
    const errorMsg = document.getElementById('phoneErrorMsg');
    if (!name || !phone) {
        if(errorMsg) { errorMsg.classList.remove('hidden'); errorMsg.innerText = 'يرجى ملء الحقول الإلزامية.'; }
        return;
    }
    const cleanerPhoneRegex = /^01[0125][0-9]{8}$/;
    if (!cleanerPhoneRegex.test(phone)) {
        if(errorMsg) { errorMsg.classList.remove('hidden'); errorMsg.innerText = 'رقم الجوال المدخل غير صحيح.'; }
        return;
    }
    if(errorMsg) errorMsg.classList.add('hidden');

    // Branch Routing Logic
    const branch = document.getElementById('branchSelect').value;
    let waNumber = '201234567890';
    if (branch === 'benisuef_corniche') waNumber = '201222190350';
    else if (branch === 'benisuef_east') waNumber = '201000206914';
    else if (branch === 'minya_corniche') waNumber = '201098255579';
    else if (branch === 'minya_new') waNumber = '201005551898';
    else if (branch === 'fayoum') waNumber = '201020040656';

    const billingItemsPayload = cart.map(item => `• ${item.name} [العدد: ${item.quantity}] = ${(item.price * item.quantity).toLocaleString("ar-EG")} ج.م`).join('\n');
    const calculatedTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const contextNotes = document.getElementById('customerNotes')?.value.trim();
    const orderType = document.querySelector('input[name="orderType"]:checked');

    let deliveryInfo = '';
    if (orderType && orderType.value === 'delivery') {
        const governorate = document.getElementById('governorateSelect').value;
        const address = document.getElementById('deliveryAddress').value.trim();
        deliveryInfo = `🚚 *طريقة التوصيل:* توصيل\n📍 *المحافظة:* ${governorate}\n🏠 *العنوان:* ${address}\n`;
    } else {
        deliveryInfo = '🏢 *طريقة الاستلام:* استلام من الفرع\n';
    }

    const dispatchTextPayload = `🛍️ *طلب شراء جديد - ديسپاسيتو باتيسري*\n\n` +
        `👤 *اسم العميل الكريم:* ${name}\n` +
        `📱 *رقم الجوال للتواصل:* ${phone}\n\n` +
        `${deliveryInfo}\n` +
        `📦 *تفاصيل المقتنيات:* \n${billingItemsPayload}\n\n` +
        `💰 *الإجمالي الصافي للطلب:* ${calculatedTotal.toLocaleString("ar-EG")} ج.م\n` +
        (contextNotes ? `📝 *ملاحظات إضافية:* ${contextNotes}` : '');

    const encryptedUriPayload = encodeURIComponent(dispatchTextPayload);
    const endpointWireDestination = `https://wa.me/${waNumber}?text=${encryptedUriPayload}`;

    window.closePhoneModal(true);
    window.closeCart();
    window.open(endpointWireDestination, '_blank');
    cart = [];
    syncCartUIMatrix();
};