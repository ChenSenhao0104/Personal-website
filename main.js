// main.js
document.addEventListener('DOMContentLoaded', () => {
    // =========================
    // 1. 自定义光标（桌面端）
    // =========================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        });

        const hoverTargets = document.querySelectorAll('.hover-target, a, button');
        hoverTargets.forEach((target) => {
            target.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            target.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    } else {
        // 触屏设备隐藏自定义光标
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }

    // =========================
    // 2. Hero 区鼠标轻微跟随
    // =========================
    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.querySelector('.hero-title');
    const heroVisual = document.querySelector('.hero-visual-container');

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const relX = e.clientX / window.innerWidth - 0.5; // -0.5 ~ 0.5
            const relY = e.clientY / window.innerHeight - 0.5;

            if (heroTitle instanceof HTMLElement) {
                heroTitle.style.transform = `translate(${relX * -10}px, ${relY * -5}px)`;
            }
            if (heroVisual instanceof HTMLElement) {
                heroVisual.style.transform = `translate(${relX * 12}px, ${relY * 8}px)`;
            }
        });
    }

    // =========================
    // 3. Hero 进场动画（GSAP）
    // =========================
    if (window.gsap) {
        const { gsap } = window;

        const heroTl = gsap.timeline({
            defaults: { duration: 0.8, ease: 'power3.out' }
        });

        heroTl
            .from('.hero-subtitle', {
                y: 40,
                autoAlpha: 0
            })
            .from(
                '.hero-title .line-1',
                {
                    y: 80,
                    autoAlpha: 0
                },
                '-=0.4'
            )
            .from(
                '.hero-title .line-2',
                {
                    y: 80,
                    autoAlpha: 0
                },
                '-=0.6'
            )
            .from(
                '.hero-img-placeholder',
                {
                    y: 60,
                    autoAlpha: 0
                },
                '-=0.5'
            )
            .from(
                '.hero-footer-bar',
                {
                    y: 30,
                    autoAlpha: 0
                },
                '-=0.4'
            );
    } else {
        console.warn('GSAP 未成功加载，Hero 动画将退化为静态。');
        // 兜底：如果没有 GSAP，就直接让 Hero 相关 reveal 都可见
        document
            .querySelectorAll('.hero-subtitle, .hero-title, .hero-img-placeholder, .hero-footer-bar')
            .forEach((el) => el.classList && el.classList.add('visible'));
    }

    // =========================
    // 4. IntersectionObserver 驱动的滚动 reveal
    // =========================
    // 你的 style.css 里已经有：
    // .reveal { opacity: 0; transform: translateY(30px); ... }
    // .reveal.visible { opacity: 1; transform: translateY(0); }
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const delayAttr = target.getAttribute('data-delay');
                        const delay = delayAttr ? parseInt(delayAttr, 10) : 0;

                        if (delay > 0) {
                            setTimeout(() => {
                                target.classList.add('visible');
                            }, delay);
                        } else {
                            target.classList.add('visible');
                        }

                        observer.unobserve(target);
                    }
                });
            },
            {
                root: null,
                threshold: 0.15
            }
        );

        revealEls.forEach((el) => io.observe(el));
    } else {
        // 非现代浏览器兜底：直接全部显示
        revealEls.forEach((el) => el.classList.add('visible'));
    }

    // =========================
    // 5. 导航栏滚动阴影
    // =========================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // =========================
    // 6. 移动端导航折叠
    // =========================
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinks.getAttribute('data-open') === 'true';

            if (isOpen) {
                navLinks.setAttribute('data-open', 'false');
                navLinks.style.display = 'none';
                if (navCta instanceof HTMLElement) navCta.style.display = 'none';
            } else {
                navLinks.setAttribute('data-open', 'true');
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#fff';
                navLinks.style.borderTop = '1px solid #000';
                navLinks.style.padding = '16px 24px';
                if (navCta instanceof HTMLElement) {
                    navCta.style.display = 'block';
                    navCta.style.marginTop = '12px';
                }
            }
        });
    }
});
