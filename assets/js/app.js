/* Pointer motion runs only while needed; touch uses the same static layout. */
function cinematicInteractions(isMotionAllowed) {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const hero = document.querySelector(".hero");
  const progress = document.querySelector(".reading-progress span");
  const controllers = [];
  let progressFrame = 0;
  let heroVisible = true;
  const syncAmbient = () => {
    hero.classList.toggle(
      "is-in-view",
      heroVisible && !document.hidden && isMotionAllowed(),
    );
  };
  const observer = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    syncAmbient();
  });
  observer.observe(hero);
  document.addEventListener("visibilitychange", syncAmbient);
  const updateProgress = () => {
    progressFrame = 0;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
  };
  const queueProgress = () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  };
  window.addEventListener("scroll", queueProgress, { passive: true });
  window.addEventListener("resize", queueProgress);
  queueProgress();
  document.querySelectorAll("[data-tilt]").forEach((element) => {
    let frame = 0;
    let bounds;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let lastFrameTime = 0;
    const maxAngle = element.dataset.tilt === "hero" ? 7 : 3.5;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      x = y = targetX = targetY = 0;
      element.style.removeProperty("--tilt-x");
      element.style.removeProperty("--tilt-y");
    };
    const render = (time) => {
      frame = 0;
      if (!isMotionAllowed() || document.hidden) return reset();
      const elapsed = Math.min(64, Math.max(1, time - lastFrameTime));
      lastFrameTime = time;
      const smoothing = 1 - Math.exp(-elapsed / 110);
      x += (targetX - x) * smoothing;
      y += (targetY - y) * smoothing;
      element.style.setProperty("--tilt-x", `${x.toFixed(3)}deg`);
      element.style.setProperty("--tilt-y", `${y.toFixed(3)}deg`);
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.02) {
        frame = requestAnimationFrame(render);
      } else if (!targetX && !targetY) reset();
    };
    const requestRender = () => {
      if (!frame) {
        lastFrameTime = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    element.addEventListener("pointerenter", () => {
      bounds = element.getBoundingClientRect();
    });
    element.addEventListener("pointermove", (event) => {
      if (
        !finePointer.matches ||
        !isMotionAllowed() ||
        event.pointerType === "touch" ||
        element.contains(document.activeElement)
      )
        return;
      bounds ||= element.getBoundingClientRect();
      const dx = Math.max(
        -1,
        Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2),
      );
      const dy = Math.max(
        -1,
        Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2),
      );
      targetX = -dy * maxAngle;
      targetY = dx * maxAngle;
      requestRender();
    });
    element.addEventListener("pointerleave", () => {
      targetX = targetY = 0;
      bounds = null;
      requestRender();
    });
    element.addEventListener("focusin", reset);
    controllers.push(reset);
  });
  const refresh = () => {
    controllers.forEach((reset) => reset());
    syncAmbient();
    queueProgress();
  };
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("resize", refresh);
  finePointer.addEventListener("change", refresh);
  return refresh;
}

/* Alpine owns interactive state; native links remain usable without JavaScript. */
document.addEventListener("alpine:init", () => {
  Alpine.data("portfolio", () => ({
    menuOpen: false,
    theme: document.documentElement.dataset.theme || "arya-dark",
    motionEnabled: document.documentElement.dataset.motion !== "paused",
    reducedMotion: false,
    activeSection: "home",
    workFilter: "all",
    showAllWork: false,
    showAllPhotos: false,
    modal: { kind: "", title: "", source: "", embed: "", photoIndex: 0 },
    toast: "",
    toastTimer: null,
    focusOrigin: null,
    photos: [],
    init() {
      document.documentElement.classList.add("js-ready");
      this.photos = Array.from(document.querySelectorAll("[data-photo]")).map(
        (link) => ({
          src: link.href,
          title: link.querySelector("img").alt,
        }),
      );
      const sections = document.querySelectorAll("main > section[id]");
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) this.activeSection = entry.target.id;
            });
          },
          { rootMargin: "-12% 0px -55% 0px", threshold: 0 },
        );
        sections.forEach((section) => observer.observe(section));
      }
      document.addEventListener("click", (event) => {
        if (this.menuOpen && !event.target.closest(".site-header"))
          this.menuOpen = false;
      });
      window.addEventListener("resize", () => {
        if (window.innerWidth > 800) this.menuOpen = false;
      });
      const motionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      this.reducedMotion = motionPreference.matches;
      const refreshCinematic = cinematicInteractions(
        () => this.motionEnabled && !this.reducedMotion,
      );
      let animationContext;
      let openingPlayed = false;
      let finishOpening;
      const animate = () => {
        finishOpening?.();
        animationContext?.revert();
        this.reducedMotion = motionPreference.matches;
        document.documentElement.dataset.motion =
          this.motionEnabled && !this.reducedMotion ? "full" : "paused";
        refreshCinematic();
        if (motionPreference.matches || !this.motionEnabled || !window.gsap) {
          openingPlayed = true;
          return;
        }
        animationContext = gsap.context(() => {
          if (!openingPlayed) {
            openingPlayed = true;
            // One short sequence, using only compositor-friendly properties.
            // No loader, continuous loop, or extra animation dependency.
            const cleanup = () => {
              window.removeEventListener("scroll", finishOpening);
              document.removeEventListener("focusin", finishOpening);
            };
            const opening = gsap.timeline({
              defaults: {
                opacity: 0,
                duration: 0.65,
                ease: "power3.out",
                clearProps: "transform,opacity,willChange",
              },
              onComplete: cleanup,
            });
            finishOpening = () => {
              opening.progress(1);
              cleanup();
            };
            opening
              .from(".header-inner", { y: -6, duration: 0.45 }, 0)
              .from(".hero-copy .eyebrow", { y: 10 }, 0.04)
              .from(".hero-copy h1", { y: 20, duration: 0.8 }, 0.1)
              .from(".hero-tagline", { y: 18, duration: 0.8 }, 0.2)
              .from(".hero-intro", { y: 14 }, 0.3)
              .from(".hero-actions .btn", { y: 12, stagger: 0.07 }, 0.4)
              .from(
                ".social-links a",
                { y: 8, duration: 0.5, stagger: 0.05 },
                0.5,
              )
              .from(
                ".portrait-board",
                {
                  y: 35,
                  scale: 0.94,
                  rotationY: -22,
                  rotationX: 8,
                  duration: 1.25,
                },
                0.12,
              )
              .from(
                ".scene-contact-sheet",
                { y: -20, rotationZ: -16, duration: 1 },
                0.28,
              )
              .from(".scene-ticket", { y: 24, rotationZ: 4, duration: 1 }, 0.4)
              .from(".scene-meta", { duration: 0.6 }, 0.05)
              .from(".scene-caption", { y: 12, duration: 0.6 }, 0.6)
              .from(".hero-bottom", { y: 10, duration: 0.55 }, 0.65);
            // Immediately settle moving targets when a visitor starts interacting.
            window.addEventListener("scroll", finishOpening, { passive: true });
            document.addEventListener("focusin", finishOpening);
          }
          if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            const camera = gsap.matchMedia();
            camera.add("(min-width: 801px)", () => {
              gsap.to(".scene-stage", {
                y: -35,
                rotationY: 5,
                ease: "none",
                scrollTrigger: {
                  trigger: ".hero",
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.6,
                },
              });
              gsap.to(".scene-orbit", {
                rotationZ: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: ".hero",
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.6,
                },
              });
            });
            gsap.utils.toArray(".section-heading").forEach((heading) => {
              gsap.from(heading, {
                y: 18,
                opacity: 0,
                duration: 0.6,
                clearProps: "all",
                scrollTrigger: {
                  trigger: heading,
                  start: "top 94%",
                  once: true,
                },
              });
            });
            gsap.utils
              .toArray(
                ".skill-card, .timeline-item, .achievement, .work-card, .gallery-item",
              )
              .forEach((card) => {
                if (!card.getClientRects().length) return;
                gsap.from(card, {
                  y: 24,
                  opacity: 0,
                  duration: 0.7,
                  ease: "power3.out",
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 96%",
                    once: true,
                  },
                });
              });
          }
        });
      };
      this.$nextTick(animate);
      motionPreference.addEventListener("change", animate);
      this.$watch("motionEnabled", animate);
    },
    toggleMotion() {
      this.motionEnabled = !this.motionEnabled;
      try {
        localStorage.setItem("arya-motion-enabled", String(this.motionEnabled));
      } catch {
        /* The current page preference still works without storage. */
      }
    },
    toggleTheme() {
      this.theme = this.theme === "arya-dark" ? "arya-light" : "arya-dark";
      document.documentElement.dataset.theme = this.theme;
      try {
        localStorage.setItem("arya-portfolio-theme", this.theme);
      } catch {
        /* Storage can be disabled. */
      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      if (this.menuOpen)
        this.$nextTick(() => this.$refs.primaryNav.querySelector("a").focus());
    },
    escapeMenu() {
      if (!this.menuOpen) return;
      this.menuOpen = false;
      this.$refs.menuButton.focus();
    },
    setFilter(filter) {
      this.workFilter = filter;
      this.showAllWork = false;
    },
    visibleWork(category, index) {
      if (this.workFilter !== "all") return this.workFilter === category;
      return this.showAllWork || index < 6;
    },
    workSummary() {
      if (this.workFilter === "tech") return "3 video teknologi";
      if (this.workFilter === "creative") return "6 video kreatif";
      return this.showAllWork ? "9 dari 9 video" : "6 dari 9 video";
    },
    openPhoto(index, trigger) {
      this.focusOrigin = trigger;
      this.modal = {
        kind: "photo",
        title: this.photos[index].title,
        photoIndex: index,
        source: "",
        embed: "",
      };
      this.$nextTick(() => this.showDialog());
    },
    nextPhoto(direction) {
      const index =
        (this.modal.photoIndex + direction + this.photos.length) %
        this.photos.length;
      this.modal.photoIndex = index;
      this.modal.title = this.photos[index].title;
    },
    openVideo(trigger) {
      this.focusOrigin = trigger;
      this.modal = {
        kind: "video",
        title: trigger.dataset.title,
        source: trigger.href,
        embed: trigger.dataset.embed,
        photoIndex: 0,
      };
      this.$nextTick(() => this.showDialog());
    },
    showDialog() {
      document.body.classList.add("modal-open");
      this.$refs.mediaDialog.showModal();
      this.$refs.closeDialog.focus();
    },
    closeDialog() {
      this.$refs.mediaDialog.close();
    },
    trapDialogFocus(event) {
      const controls = Array.from(
        this.$refs.mediaDialog.querySelectorAll(
          'button:not(:disabled), a[href], iframe, [tabindex="0"]',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    onDialogClosed() {
      document.body.classList.remove("modal-open");
      this.modal = {
        kind: "",
        title: "",
        source: "",
        embed: "",
        photoIndex: 0,
      };
      this.focusOrigin?.focus({ preventScroll: true });
    },
    photoKeyboard(event) {
      if (!this.$refs.mediaDialog.open || this.modal.kind !== "photo") return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        this.nextPhoto(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this.nextPhoto(-1);
      }
    },
    notify(message) {
      clearTimeout(this.toastTimer);
      this.toast = message;
      this.toastTimer = setTimeout(() => {
        this.toast = "";
      }, 4000);
    },
    async copyEmail() {
      const email = "arya.sukma.420@gmail.com";
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const input = document.createElement("textarea");
          input.value = email;
          input.style.cssText = "position:fixed;left:-9999px;top:0;resize:none";
          document.body.append(input);
          input.select();
          const copied = document.execCommand("copy");
          input.remove();
          this.$refs.copyButton.focus({ preventScroll: true });
          if (!copied) throw new Error("Clipboard is unavailable");
        }
        this.notify("Alamat email disalin.");
      } catch {
        this.notify(
          "Belum bisa menyalin. Pilih alamat email di atas untuk menyalinnya.",
        );
      }
    },
    collapsePhotos() {
      this.showAllPhotos = !this.showAllPhotos;
      if (!this.showAllPhotos)
        this.$nextTick(() => {
          this.$refs.photoMore.scrollIntoView({
            block: "center",
            behavior: "instant",
          });
        });
    },
  }));
});
