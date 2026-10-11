/* Alpine owns interactive state; native links remain usable without JavaScript. */
document.addEventListener("alpine:init", () => {
  Alpine.data("portfolio", () => ({
    menuOpen: false,
    theme: document.documentElement.dataset.theme || "arya-dark",
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
      let animationContext;
      const animate = () => {
        animationContext?.revert();
        if (motionPreference.matches || !window.gsap) return;
        animationContext = gsap.context(() => {
          gsap.from(".hero-copy > *", {
            y: 18,
            opacity: 0,
            duration: 0.65,
            stagger: 0.09,
            ease: "power2.out",
            clearProps: "all",
          });
          gsap.from(".portrait-board", {
            opacity: 0,
            duration: 0.85,
            delay: 0.15,
            ease: "power2.out",
            clearProps: "all",
          });
          if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
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
          }
        });
      };
      this.$nextTick(animate);
      motionPreference.addEventListener("change", animate);
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
