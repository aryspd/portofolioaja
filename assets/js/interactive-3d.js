/**
 * Interactive 3D Effects:
 * - 3D Card Tilt with Dynamic Specular Glare (Tactile Depth)
 * - Hero 3D Geodetic Particle Canvas (Wave mesh reacting to cursor)
 */

(function () {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Initialize 3D Card Tilt Effect
  function init3DCardTilt() {
    if (isReducedMotion) return;

    const cards = document.querySelectorAll("[data-3d-tilt]");
    cards.forEach((card) => {
      // Create glare overlay if not present
      let glare = card.querySelector(".tilt-glare");
      if (!glare) {
        glare = document.createElement("div");
        glare.className = "tilt-glare";
        card.appendChild(glare);
      }

      let bounds = null;

      const onMouseEnter = () => {
        bounds = card.getBoundingClientRect();
      };

      const onMouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = mouseX / bounds.width;
        const yPct = mouseY / bounds.height;

        // Subtle 3D tilt angles (max +/- 10 degrees)
        const tiltX = (0.5 - yPct) * 16;
        const tiltY = (xPct - 0.5) * 16;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.018, 1.018, 1.018)`;

        // Position dynamic specular glare
        glare.style.opacity = "0.22";
        glare.style.background = `radial-gradient(circle at ${xPct * 100}% ${yPct * 100}%, rgba(101, 217, 237, 0.45) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)`;
      };

      const onMouseLeave = () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        glare.style.opacity = "0";
        bounds = null;
      };

      card.addEventListener("mouseenter", onMouseEnter);
      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);
    });
  }

  // 2. Hero 3D Geodetic Particle Canvas
  function initHeroGeodeticCanvas() {
    const canvas = document.getElementById("hero-3d-canvas");
    if (!canvas || isReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    // Geodetic grid nodes
    const cols = Math.floor(width / 45) + 2;
    const rows = Math.floor(height / 45) + 2;
    const nodes = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({
          x: c * 45,
          y: r * 45,
          originX: c * 45,
          originY: r * 45,
          phase: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.01,
        });
      }
    }

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    });

    let frameId;
    let time = 0;

    const render = () => {
      frameId = requestAnimationFrame(render);
      time += 0.02;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Update positions with wave equation & mouse gravity
      nodes.forEach((node) => {
        const wave = Math.sin(time + node.phase + node.originX * 0.005) * 6;
        const dx = mouse.x - node.originX;
        const dy = mouse.y - node.originY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let repelX = 0;
        let repelY = 0;
        if (dist < 140) {
          const force = (1 - dist / 140) * 18;
          repelX = -(dx / dist) * force;
          repelY = -(dy / dist) * force;
        }

        node.x = node.originX + repelX;
        node.y = node.originY + wave + repelY;
      });

      // Render geodetic grid lines
      ctx.lineWidth = 0.75;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const curr = nodes[idx];

          // Horizontal link
          if (c < cols - 1) {
            const right = nodes[idx + 1];
            const dist = Math.hypot(curr.x - mouse.x, curr.y - mouse.y);
            const alpha = Math.max(0.04, Math.min(0.28, 0.35 - dist / 300));
            ctx.strokeStyle = `rgba(101, 217, 237, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(curr.x, curr.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }

          // Vertical link
          if (r < rows - 1) {
            const bottom = nodes[idx + cols];
            const dist = Math.hypot(curr.x - mouse.x, curr.y - mouse.y);
            const alpha = Math.max(0.04, Math.min(0.28, 0.35 - dist / 300));
            ctx.strokeStyle = `rgba(101, 217, 237, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(curr.x, curr.y);
            ctx.lineTo(bottom.x, bottom.y);
            ctx.stroke();
          }

          // Small glowing node point
          const nodeDist = Math.hypot(curr.x - mouse.x, curr.y - mouse.y);
          if (nodeDist < 120) {
            ctx.fillStyle = "rgba(101, 217, 237, 0.7)";
            ctx.beginPath();
            ctx.arc(curr.x, curr.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    render();
  }

  // Interactive Live GIS Simulation Tab Controller
  function initGISTabs() {
    window.setGISTab = function (tabId) {
      const tabs = document.querySelectorAll(".gis-sim-tab");
      const contents = document.querySelectorAll(".gis-sim-panel");

      tabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.tab === tabId);
      });

      contents.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === tabId);
      });
    };

    // Mini Map Iframe Interaction Controls
    window.toggleMapInteraction = function () {
      const overlay = document.getElementById("mini-map-overlay");
      const label = document.getElementById("interaction-text");
      if (!overlay) return;
      const isUnlocked = overlay.classList.toggle("unlocked");
      if (label) {
        label.textContent = isUnlocked ? "Kunci Kontrol Peta" : "Aktifkan Kontrol Peta";
      }
    };

    window.enableMapInteraction = function () {
      const overlay = document.getElementById("mini-map-overlay");
      const label = document.getElementById("interaction-text");
      if (overlay) {
        overlay.classList.add("unlocked");
        if (label) label.textContent = "Kunci Kontrol Peta";
      }
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    init3DCardTilt();
    initHeroGeodeticCanvas();
    initGISTabs();
  });
})();
