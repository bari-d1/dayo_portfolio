const header = document.querySelector('header');
const experienceSection = document.querySelector('#experience');
const menuIcon = document.querySelector('#menu-icon');
const sectionLinks = document.querySelector('.section-links');
const navBackdrop = document.querySelector('.nav-backdrop');

function closeMobileNav() {
    header.classList.remove('nav-open');
    navBackdrop.classList.remove('open');
    menuIcon.classList.add('fa-bars');
    menuIcon.classList.remove('fa-xmark');
}

menuIcon.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    navBackdrop.classList.toggle('open', isOpen);
    menuIcon.classList.toggle('fa-bars', !isOpen);
    menuIcon.classList.toggle('fa-xmark', isOpen);
});

navBackdrop.addEventListener('click', closeMobileNav);

sectionLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
});

const navLinks = Array.from(sectionLinks.querySelectorAll('a'));

const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const link = navLinks.find((l) => l.getAttribute('href') === `#${entry.target.id}`);
        if (!link) return;
        if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}, {
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0
});

navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) activeLinkObserver.observe(section);
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
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.08, ease: 'power2.out', overwrite: 'auto' }
        );
    } else {
        gsap.to(techExpandRows, {
            opacity: 0, y: 24, duration: 0.3, stagger: 0.08, ease: 'power2.in', overwrite: 'auto',
            onComplete: () => techExpandPanel.classList.remove('open')
        });
    }
});

const skillCards = document.querySelectorAll('[data-skill-card]');

skillCards.forEach((card) => {
    const headerBtn = card.querySelector('.skill-card-header');

    headerBtn.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');

        skillCards.forEach((otherCard) => {
            otherCard.classList.remove('open');
            otherCard.querySelector('.skill-card-header').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            card.classList.add('open');
            headerBtn.setAttribute('aria-expanded', 'true');
        }
    });
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-skill-card]')) {
        skillCards.forEach((card) => {
            card.classList.remove('open');
            card.querySelector('.skill-card-header').setAttribute('aria-expanded', 'false');
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
navObserver.observe(document.querySelector('#contact'));

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

const mobileNavQuery = window.matchMedia('(max-width: 768px)');
const expCards = document.querySelectorAll('.grid-card');

expCards.forEach((card) => {
    card.addEventListener('click', () => {
        if (mobileNavQuery.matches) {
            const isOpen = card.classList.contains('exp-open');
            expCards.forEach((c) => c.classList.remove('exp-open'));
            if (!isOpen) card.classList.add('exp-open');
        } else {
            openCardModal(card);
        }
    });
});

const fanWraps = Array.from(document.querySelectorAll('.grid-card-wrap'));
const FAN_ANGLES = [-37.5, -12.5, 12.5, 37.5];
const FAN_VISIBLE = FAN_ANGLES.length;
let fanStart = 0;

function updateFan() {
    if (mobileNavQuery.matches) return;

    const total = fanWraps.length;
    fanWraps.forEach((wrap, i) => {
        const card = wrap.querySelector('.grid-card');
        const pos = (i - fanStart + total) % total;
        if (pos < FAN_VISIBLE) {
            wrap.classList.remove('fan-hidden');
            wrap.style.opacity = '1';
            card.style.setProperty('--angle', `${FAN_ANGLES[pos]}deg`);
        } else {
            card.style.setProperty('--angle', '0deg');
            wrap.style.opacity = '0';
            wrap.classList.add('fan-hidden');
        }
    });
}

if (fanWraps.length > FAN_VISIBLE) {
    updateFan();

    document.querySelector('.fan-prev').addEventListener('click', () => {
        fanStart = (fanStart - 1 + fanWraps.length) % fanWraps.length;
        updateFan();
    });

    document.querySelector('.fan-next').addEventListener('click', () => {
        fanStart = (fanStart + 1) % fanWraps.length;
        updateFan();
    });
} else {
    document.querySelector('.fan-prev').style.display = 'none';
    document.querySelector('.fan-next').style.display = 'none';
}

mobileNavQuery.addEventListener('change', (e) => {
    if (e.matches) {
        fanWraps.forEach((wrap) => {
            wrap.style.opacity = '';
            wrap.classList.remove('fan-hidden');
        });
    } else {
        updateFan();
    }
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

(function () {
    const visibleFanWraps = () => fanWraps.filter((w) => !w.classList.contains('fan-hidden'));
    let fanHideTimer = null;

    gsap.set(visibleFanWraps(), { y: -200, opacity: 0 });

    function playFanEntrance() {
        clearTimeout(fanHideTimer);
        gsap.fromTo(visibleFanWraps(),
            { y: -200, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.06, force3D: true, overwrite: 'auto' }
        );
    }

    function hideFanEntrance() {
        fanHideTimer = setTimeout(() => {
            gsap.set(visibleFanWraps(), { y: -200, opacity: 0 });
        }, 500);
    }

    ScrollTrigger.create({
        trigger: '.experience',
        start: 'top 65%',
        end: 'bottom top',
        onEnter: playFanEntrance,
        onEnterBack: playFanEntrance,
        onLeave: hideFanEntrance,
        onLeaveBack: hideFanEntrance
    });
})();

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
if (statNumber) {
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
}

/* ---- Footer contact form ---- */
const contactForm = document.querySelector('#contact-form');
const contactFormStatus = document.querySelector('#contact-form-status');
const contactSubmitBtn = contactForm.querySelector('.footer-submit');
const contactSubmitText = contactForm.querySelector('.footer-submit-text');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = contactForm.querySelector('#contact-email').value.trim();
    const message = contactForm.querySelector('#contact-message').value.trim();

    contactSubmitBtn.disabled = true;
    contactSubmitText.textContent = 'Sending...';
    contactFormStatus.textContent = '';
    contactFormStatus.className = 'form-status';

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message })
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
