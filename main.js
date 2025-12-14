document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // 0. 防御性检查（保证在 CDN 加载失败时不直接报错）
  // =========================
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.warn('[INIT] GSAP 或 ScrollTrigger 没加载成功，动画会降级。');
  }

  // =========================
  // 1. 自定义光标（与当前 HTML/CSS 对齐）
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
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
      });
    });
  } else {
    // 触屏设备：隐藏自定义光标
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';
  }

  // =========================
  // 2. Lenis 平滑滚动（核心升级）
  // =========================
  if (hasLenis) {
    const lenis = new Lenis({
      duration: 1.2,       // 滚动“重量感”
      smoothWheel: true,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 让 ScrollTrigger 感知 Lenis 的滚动
    if (hasScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    console.log('[INIT] Lenis smooth scroll 已启用');
  } else {
    console.warn('[INIT] Lenis 未加载，使用原生滚动。');
  }

  if (!hasGSAP) {
    // 如果连 GSAP 都没有，就只保留自定义光标，直接返回
    return;
  }

  // =========================
  // 3. Hero 首屏入场时间轴（对齐你现在的 Hero 结构）
  // =========================
  const heroTimeline = gsap.timeline({
    defaults: { duration: 0.9, ease: 'power3.out' }
  });

  heroTimeline
    .from('.hero-subtitle', {
      y: 40,
      autoAlpha: 0
    })
    .from(
      '.hero-title .line-1',
      {
        y: 120,
        autoAlpha: 0
      },
      '-=0.5'
    )
    .from(
      '.hero-title .line-2',
      {
        y: 120,
        autoAlpha: 0
      },
      '-=0.7'
    )
    .from(
      '.hero-visual-container',
      {
        x: 80,
        autoAlpha: 0
      },
      '-=0.6'
    )
    .from(
      '.hero-footer-bar',
      {
        y: 40,
        autoAlpha: 0
      },
      '-=0.4'
    );

  // =========================
  // 4. ScrollTrigger：滚动 Reveal 动画
  // =========================
  if (hasScrollTrigger) {
    const revealFromBottom = (selector, yOffset = 60) => {
      gsap.utils.toArray(selector).forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          y: yOffset,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
      });
    };

    // Intro：右侧 4 个格子
    revealFromBottom('.intro-section .content-box', 40);

    // 各 Section 标题（ON TRACK / PODIUM / OFF TRACK）
    revealFromBottom('.section-header', 50);

    // ON TRACK：每一行项目
    revealFromBottom('.project-row', 60);

    // THE PODIUM：每一行奖项
    revealFromBottom('#podium .table-row', 40);

    // OFF TRACK：每一张生活卡片
    revealFromBottom('.offtrack-grid .ot-card', 50);

    // Contact：整体块
    revealFromBottom('.contact-inner', 40);

    console.log('[INIT] ScrollTrigger reveal 动画已注册');
  }

  // =========================
  // 5. 导航滚动效果（视觉小优化）
  // =========================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // =========================
  // 6. 移动端导航展开（保留）
  // =========================
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      if (isOpen) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = '#ffffff';
        navLinks.style.padding = '16px 24px';
        navLinks.style.borderTop = '1px solid #111';
        navLinks.style.gap = '12px';
      } else {
        navLinks.style.display = 'none';
      }

      if (navCta) {
        navCta.style.display = isOpen ? 'none' : '';
      }
    });
  }
});
