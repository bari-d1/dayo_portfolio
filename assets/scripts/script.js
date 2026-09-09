const header = document.querySelector('header');
const experienceSection = document.querySelector('#experience');
const menuIcon = document.querySelector('#menu-icon');
const sectionLinks = document.querySelector('.section-links');

menuIcon.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    menuIcon.classList.toggle('fa-bars', !isOpen);
    menuIcon.classList.toggle('fa-xmark', isOpen);
});

sectionLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        menuIcon.classList.add('fa-bars');
        menuIcon.classList.remove('fa-xmark');
    });
});

const techExpandBtn = document.querySelector('#tech-expand-btn');
const techExpandPanel = document.querySelector('#tech-expand-panel');
const techExpandRows = techExpandPanel.querySelectorAll('.tech-expand-row');
const techTooltip = document.querySelector('.tech-tooltip');
let techExpanded = false;

techExpandBtn.addEventListener('click', () => {
    techExpanded = !techExpanded;
    techExpandBtn.classList.toggle('open', techExpanded);
    techExpandBtn.setAttribute('aria-expanded', String(techExpanded));

    if (techTooltip) {
        techTooltip.remove();
    }

    if (techExpanded) {
        techExpandPanel.classList.add('open');
        gsap.fromTo(techExpandRows,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.18, ease: 'power2.out', overwrite: 'auto' }
        );
    } else {
        gsap.to(techExpandRows, {
            opacity: 0, y: 24, duration: 0.3, stagger: 0.08, ease: 'power2.in', overwrite: 'auto',
            onComplete: () => techExpandPanel.classList.remove('open')
        });
    }
});

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        header.classList.toggle('nav-solid', entry.isIntersecting);
    });
}, {
    rootMargin: '-100px 0px -60% 0px',
    threshold: 0
});

navObserver.observe(experienceSection);

gsap.registerPlugin(ScrollTrigger);

gsap.to('.blob-1', {
    y: 80,
    x: 40,
    ease: 'none',
    scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

gsap.to('.blob-2', {
    y: -60,
    x: -30,
    ease: 'none',
    scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

gsap.fromTo('.about .about-img-container',
    { opacity: 0, y: 40 },
    {
        opacity: 1, y: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.about', start: 'top 70%' }
    }
);

gsap.fromTo('.about .info-box',
    { opacity: 0, y: 40 },
    {
        opacity: 1, y: 0, duration: 1, delay: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.about', start: 'top 70%' }
    }
);

const spotlightEls = document.querySelectorAll('.about-photo-color, .blob-color');

document.addEventListener('mousemove', (e) => {
    spotlightEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});

const flashableBlobs = Array.from(document.querySelectorAll('.blob-color'));
gsap.set(flashableBlobs, { filter: 'blur(90px) brightness(1)' });

document.querySelectorAll('.blob-color').forEach((el) => {
    const section = el.closest('section');
    const startPct = Math.round(55 + Math.random() * 30);
    const endPct = Math.round(5 + Math.random() * 25);
    const targetOpacity = (0.35 + Math.random() * 0.4).toFixed(2);

    gsap.fromTo(el,
        { opacity: 0 },
        {
            opacity: targetOpacity,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: `top ${startPct}%`,
                end: `top ${endPct}%`,
                scrub: true
            }
        }
    );
});

function flashBlobs() {
    const flashCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < flashCount; i++) {
        const el = flashableBlobs[Math.floor(Math.random() * flashableBlobs.length)];

        gsap.fromTo(el,
            { filter: 'blur(90px) brightness(2.4)' },
            { filter: 'blur(90px) brightness(1)', duration: 0.5 + Math.random() * 0.4, ease: 'power2.out', overwrite: 'auto' }
        );
    }
}

let scrollFlashLocked = false;
window.addEventListener('scroll', () => {
    if (scrollFlashLocked) return;
    scrollFlashLocked = true;
    flashBlobs();
    setTimeout(() => { scrollFlashLocked = false; }, 120);
});

const cardModal = document.querySelector('.card-modal');
const cardModalIcon = cardModal.querySelector('.card-modal-icon');
const cardModalTitle = cardModal.querySelector('.card-modal-title');
const cardModalDuration = cardModal.querySelector('.card-modal-duration');
const cardModalText = cardModal.querySelector('.card-modal-text');

function openCardModal(card) {
    cardModalIcon.className = 'card-modal-icon ' + card.querySelector('i').className;
    cardModalTitle.textContent = card.querySelector('span').textContent;
    cardModalDuration.textContent = card.querySelector('h3').textContent;
    cardModalText.innerHTML = card.querySelector('.card-text').innerHTML;
    cardModal.classList.add('open');
}

document.querySelectorAll('.grid-card').forEach((card) => {
    card.addEventListener('click', () => openCardModal(card));
});

cardModal.querySelector('.card-modal-close').addEventListener('click', () => {
    cardModal.classList.remove('open');
});

cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) cardModal.classList.remove('open');
});

const carouselTrack = document.querySelector('.carousel-track');
const carouselCards = document.querySelectorAll('.project-card');
const carouselDotsContainer = document.querySelector('.carousel-dots');
const carouselPrevBtn = document.querySelector('.carousel-prev');
const carouselNextBtn = document.querySelector('.carousel-next');

carouselCards.forEach((card, i) => {
    const dot = document.createElement('span');
    dot.className = 'carousel-dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    carouselDotsContainer.appendChild(dot);
});

const carouselDots = document.querySelectorAll('.carousel-dot');

function updateActiveDot() {
    const trackCenter = carouselTrack.scrollLeft + carouselTrack.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    carouselCards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - trackCenter);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
        }
    });
    carouselDots.forEach((dot, i) => dot.classList.toggle('active', i === closestIndex));
}

carouselTrack.addEventListener('scroll', updateActiveDot);
updateActiveDot();

carouselPrevBtn.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: -(carouselCards[0].offsetWidth + 32), behavior: 'smooth' });
});

carouselNextBtn.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: carouselCards[0].offsetWidth + 32, behavior: 'smooth' });
});

function debouncedEntrance(target, vars, triggerVars, leaveDelay = 500) {
    const tween = gsap.from(target, { ...vars, paused: true });
    let hideTimer = null;

    ScrollTrigger.create({
        trigger: triggerVars.trigger,
        start: triggerVars.start,
        end: triggerVars.end,
        onEnter: () => { clearTimeout(hideTimer); tween.play(); },
        onEnterBack: () => { clearTimeout(hideTimer); tween.play(); },
        onLeave: () => { hideTimer = setTimeout(() => tween.progress(0).pause(), leaveDelay); },
        onLeaveBack: () => { hideTimer = setTimeout(() => tween.progress(0).pause(), leaveDelay); }
    });

    return tween;
}

debouncedEntrance('.projects-header',
    { opacity: 0, x: -120, duration: 1, ease: 'power2.out' },
    { trigger: '.projects', start: 'top 75%', end: 'bottom top' }
);

debouncedEntrance('.carousel',
    { opacity: 0, x: 120, duration: 1, ease: 'power2.out' },
    { trigger: '.projects', start: 'top 75%', end: 'bottom top' }
);

debouncedEntrance('.fan-title',
    { y: 150, opacity: 0, duration: 1, ease: 'power2.out' },
    { trigger: '.experience', start: 'top 65%', end: 'bottom top' }
);

debouncedEntrance('.grid-card-wrap',
    { y: -450, opacity: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15, force3D: true },
    { trigger: '.experience', start: 'top 65%', end: 'bottom top' }
);

debouncedEntrance('.footer-cta',
    { y: 50, opacity: 0, duration: 1, ease: 'power2.out' },
    { trigger: 'footer', start: 'top 85%', end: 'bottom top' }
);

debouncedEntrance('.footer-bottom',
    { y: 30, opacity: 0, duration: 1, delay: 0.15, ease: 'power2.out' },
    { trigger: 'footer', start: 'top 85%', end: 'bottom top' }
);

/* ---- Who I Am: scroll-scrubbed word reveal ---- */
const whoamiText = document.querySelector('.whoami-text');
const whoamiWords = whoamiText.textContent.trim().split(/\s+/);
whoamiText.innerHTML = whoamiWords.map((w) => `<span class="word">${w}</span>`).join(' ');

gsap.to('.whoami-text .word', {
    color: '#111827',
    stagger: 0.03,
    ease: 'none',
    scrollTrigger: {
        trigger: '.whoami-inner',
        start: 'top 75%',
        end: 'bottom 45%',
        scrub: true
    }
});

/* ---- Who I Am: pillar cards entrance + 3D tilt ---- */
debouncedEntrance('.pillar-card',
    { y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12 },
    { trigger: '.whoami-pillars', start: 'top 85%', end: 'bottom top' }
);

document.querySelectorAll('.pillar-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -10;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        gsap.to(card, {
            rotateX, rotateY, scale: 1.03,
            transformPerspective: 600,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0, rotateY: 0, scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });
});

/* ---- Who I Am: counting stat ---- */
const statNumber = document.querySelector('.stat-number');
const statCounter = { value: 0 };
gsap.to(statCounter, {
    value: 2000,
    duration: 2,
    ease: 'power1.out',
    scrollTrigger: {
        trigger: '.whoami-stat',
        start: 'top 85%'
    },
    onUpdate: () => {
        statNumber.textContent = Math.floor(statCounter.value).toLocaleString();
    }
});

/* ---- Footer contact form ---- */
const contactForm = document.querySelector('#contact-form');
const contactFormStatus = document.querySelector('#contact-form-status');
const contactSubmitBtn = contactForm.querySelector('.footer-submit');
const contactSubmitText = contactForm.querySelector('.footer-submit-text');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = contactForm.querySelector('#contact-email').value.trim();

    contactSubmitBtn.disabled = true;
    contactSubmitText.textContent = 'Sending...';
    contactFormStatus.textContent = '';
    contactFormStatus.className = 'form-status';

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong. Please try again.');
        }

        contactFormStatus.textContent = "Thanks! I'll be in touch soon.";
        contactFormStatus.classList.add('success');
        contactForm.reset();
    } catch (error) {
        contactFormStatus.textContent = error.message || 'Something went wrong. Please try again.';
        contactFormStatus.classList.add('error');
    } finally {
        contactSubmitBtn.disabled = false;
        contactSubmitText.textContent = 'Submit';
    }
});
