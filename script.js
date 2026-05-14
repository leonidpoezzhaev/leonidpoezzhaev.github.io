gsap.registerPlugin(ScrollTrigger);

(function() {
    const wrapper = document.getElementById('sectionsWrapper');
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');
    const navLabels = document.querySelectorAll('.nav-label');
    const cursorGlow = document.getElementById('cursorGlow');
    const totalSections = sections.length;
    let currentIndex = 0;
    let isMobile = window.innerWidth <= 768;

    function updateActiveNav(index) {
        navDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        navLabels.forEach((label, i) => label.classList.toggle('active', i === index));
    }

    function goToSection(index) {
        if (isMobile) return;
        if (index < 0 || index >= totalSections || index === currentIndex) return;
        currentIndex = index;
        const xPercent = -index * 100;
        gsap.to(wrapper, {
            xPercent: xPercent,
            duration: 0.8,
            ease: "power2.inOut",
            overwrite: "auto"
        });
        updateActiveNav(currentIndex);
    }

    function handleWheel(e) {
        if (isMobile) return;
        e.preventDefault();
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (e.deltaX > 30) goToSection(currentIndex + 1);
            else if (e.deltaX < -30) goToSection(currentIndex - 1);
        } else {
            if (e.deltaY > 20) goToSection(currentIndex + 1);
            else if (e.deltaY < -20) goToSection(currentIndex - 1);
        }
    }

    let touchStartX = 0;
    function handleTouchStart(e) { touchStartX = e.touches[0].clientX; }
    function handleTouchEnd(e) {
        if (isMobile) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            if (dx < -40) goToSection(currentIndex + 1);
            else if (dx > 40) goToSection(currentIndex - 1);
        }
    }

    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (!isMobile) {
                goToSection(parseInt(dot.getAttribute('data-index'), 10));
            }
        });
    });

    navLabels.forEach(label => {
        label.addEventListener('click', () => {
            if (!isMobile) {
                goToSection(parseInt(label.getAttribute('data-index'), 10));
            }
        });
    });

    document.querySelectorAll('.nav-to-section').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMobile) return;
            e.preventDefault();
            goToSection(parseInt(link.getAttribute('data-target'), 10));
        });
    });

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    window.addEventListener('resize', () => {
        const mobileNow = window.innerWidth <= 768;
        if (mobileNow !== isMobile) {
            isMobile = mobileNow;
            if (isMobile) {
                gsap.set(wrapper, { clearProps: "transform" });
                wrapper.style.display = "block";
                wrapper.style.height = "auto";
                document.body.style.overflow = "auto";
                document.querySelector('.app').style.overflow = "visible";
                document.querySelector('.section-nav').style.display = "none";
            } else {
                wrapper.style.display = "flex";
                wrapper.style.height = "100%";
                document.body.style.overflow = "hidden";
                document.querySelector('.app').style.overflow = "hidden";
                document.querySelector('.section-nav').style.display = "flex";
                if (currentIndex > 0) {
                    gsap.to(wrapper, { xPercent: -currentIndex * 100, duration: 0 });
                }
            }
        }
    });

    if (!isMobile) {
        updateActiveNav(0);
    }
})();