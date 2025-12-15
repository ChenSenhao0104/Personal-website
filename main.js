// main.js

// 1. 从 node_modules 引入 GSAP 和 ScrollTrigger（本地依赖，不走 CDN）
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注册插件
gsap.registerPlugin(ScrollTrigger);

// 等 DOM 准备好再运行
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1. 自定义光标
  // =========================
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.style.left = `${posX}px`;
      cursorOutline.style.top = `${posY}px`;
    });

    const hoverTargets = document.querySelectorAll(".hover-target, a, button");
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("hovering");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("hovering");
      });
    });
  } else {
    // 触屏设备：隐藏自定义光标
    if (cursorDot) cursorDot.style.display = "none";
    if (cursorOutline) cursorOutline.style.display = "none";
  }

  // =========================
  // 2. Hero 首屏入场动画
  // =========================
  const heroTimeline = gsap.timeline({
    defaults: { duration: 0.9, ease: "power3.out" },
  });

  heroTimeline
    .from(".hero-subtitle", {
      y: 40,
      autoAlpha: 0,
    })
    .from(
      ".hero-title .line-1",
      {
        y: 120,
        autoAlpha: 0,
      },
      "-=0.5"
    )
    .from(
      ".hero-title .line-2",
      {
        y: 120,
        autoAlpha: 0,
      },
      "-=0.7"
    )
    .from(
      ".hero-visual-container",
      {
        x: 80,
        autoAlpha: 0,
      },
      "-=0.6"
    )
    .from(
      ".hero-footer-bar",
      {
        y: 40,
        autoAlpha: 0,
      },
      "-=0.4"
    );

  // =========================
  // 3. ScrollTrigger：滚动 Reveal 动画
  // =========================
  const revealFromBottom = (selector, yOffset = 60) => {
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: yOffset,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });
  };

  // Intro：右侧 4 个格子
  revealFromBottom(".intro-section .content-box", 40);

  // 各 Section 标题（ON TRACK / PODIUM / OFF TRACK）
  revealFromBottom(".section-header", 50);

  // ON TRACK：每一行项目
  revealFromBottom(".project-row", 60);

  // THE PODIUM：每一行奖项
  revealFromBottom("#podium .table-row", 40);

  // OFF TRACK：每一张生活卡片
  revealFromBottom(".offtrack-grid .ot-card", 50);

  // Contact：整体块
  revealFromBottom(".contact-inner", 40);

  console.log("[INIT] GSAP + ScrollTrigger from npm 已启用");

  // =========================
  // 4. 导航滚动阴影效果
  // =========================
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
      } else {
        navbar.style.boxShadow = "none";
      }
    });
  }

  // =========================
  // 5. 移动端导航展开
  // =========================
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navCta = document.querySelector(".nav-cta");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      if (isOpen) {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "100%";
        navLinks.style.left = "0";
        navLinks.style.width = "100%";
        navLinks.style.background = "#ffffff";
        navLinks.style.padding = "16px 24px";
        navLinks.style.borderTop = "1px solid #111";
        navLinks.style.gap = "12px";
      } else {
        navLinks.style.display = "none";
      }

      if (navCta) {
        navCta.style.display = isOpen ? "none" : "";
      }
    });
  }
});
