document.addEventListener("DOMContentLoaded", async () => {
  await injectSharedLayout();
  initSite();
});

async function injectSharedLayout() {
  const includeNodes = document.querySelectorAll("[data-include]");
  if (!includeNodes.length) {
    return;
  }

  const cache = {};
  const rootPath = document.body.dataset.root || ".";
  const includeMap = {
    header: "header.html",
    footer: "footer.html",
    "contact-form": "contact-form.html"
  };

  for (const node of includeNodes) {
    const type = node.getAttribute("data-include");
    const includeFile = includeMap[type];
    if (!includeFile) {
      continue;
    }
    const filePath = `${rootPath}/partials/${includeFile}`;
    if (!cache[filePath]) {
      const response = await fetch(filePath);
      cache[filePath] = response.ok ? await response.text() : "";
    }
    node.innerHTML = cache[filePath];
  }
  hydrateRouteLinks(rootPath);
}

function hydrateRouteLinks(rootPath) {
  document.querySelectorAll("[data-route]").forEach((node) => {
    const route = node.getAttribute("data-route");
    if (!route) {
      return;
    }
    node.setAttribute("href", `${rootPath}${route}`);
  });
}

function initSite() {
  initCursorGlow();
  initSmartHeader();
  initScrollProgress();
  initFloatingActions();
  initTickerLoop();
  initReveal();
  initCounters();
  initNavAndMenu();
  initProjectFilters();
  initPointerEffects();
  initYear();
  initAutoProfileImage();
  initContactForm();
}

function initTickerLoop() {
  const tickers = document.querySelectorAll(".ticker");
  if (!tickers.length) {
    return;
  }

  tickers.forEach((ticker) => {
    if (ticker.dataset.loopReady === "true") {
      return;
    }
    const items = [...ticker.children];
    if (!items.length) {
      return;
    }

    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      ticker.appendChild(clone);
    });

    ticker.dataset.loopReady = "true";
  });
}

function initSmartHeader() {
  const header = document.querySelector(".site-header");
  if (!header) {
    return;
  }

  const setHeaderHeightVar = () => {
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
  };
  setHeaderHeightVar();
  window.addEventListener("resize", setHeaderHeightVar);

  function getHeroPassThreshold() {
    const hero = document.querySelector(".hero") || document.querySelector(".inner-hero");
    if (!hero) {
      return window.innerHeight * 0.88;
    }
    const rect = hero.getBoundingClientRect();
    return window.scrollY + rect.bottom;
  }

  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const siteNav = document.querySelector(".site-nav");
    const menuOpen = siteNav?.classList.contains("open");

    if (menuOpen) {
      header.classList.remove("header-hidden");
      lastScrollY = y;
      return;
    }

    const heroPass = getHeroPassThreshold();
    if (y < heroPass) {
      header.classList.remove("header-hidden");
      lastScrollY = y;
      return;
    }

    const delta = y - lastScrollY;
    if (Math.abs(delta) >= 10) {
      if (delta > 0) {
        header.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
      }
    }
    lastScrollY = y;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  onScroll();
}

function initCursorGlow() {
  const cursorGlow = document.querySelector(".cursor-glow");
  if (!cursorGlow || !window.matchMedia("(pointer:fine)").matches) {
    return;
  }
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

function initScrollProgress() {
  const scrollProgress = document.querySelector(".scroll-progress");
  if (!scrollProgress) {
    return;
  }
  const updateScrollProgress = () => {
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScrollable > 0 ? (window.scrollY / totalScrollable) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();
}

function initFloatingActions() {
  const toTopBtn = document.querySelector(".to-top-btn");
  if (!toTopBtn) {
    return;
  }
  const toggleButton = () => {
    toTopBtn.classList.toggle("show", window.scrollY > 320);
  };
  window.addEventListener("scroll", toggleButton, { passive: true });
  toggleButton();
  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) {
    return;
  }
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((element) => revealObserver.observe(element));
}

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) {
    return;
  }
  let countersAnimated = false;
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || countersAnimated) {
          return;
        }
        countersAnimated = true;
        counters.forEach((counter) => animateCounter(counter));
        observer.disconnect();
      });
    },
    { threshold: 0.45 }
  );
  counterObserver.observe(counters[0]);
}

function animateCounter(counterElement) {
  const target = Number(counterElement.dataset.target);
  const duration = 1150;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counterElement.textContent = Math.floor(eased * target).toString();
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

function initNavAndMenu() {
  const navLinks = document.querySelectorAll(".site-nav a");
  const bodyPage = document.body.dataset.page;
  if (bodyPage) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.page === bodyPage);
    });
  }

  const inPageLinks = [...navLinks].filter((link) => link.getAttribute("href")?.startsWith("#"));
  if (inPageLinks.length) {
    const sections = inPageLinks.map((link) => document.querySelector(link.getAttribute("href")));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          inPageLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${entry.target.id}`);
          });
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((section) => section && sectionObserver.observe(section));
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }
}

function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      projectCards.forEach((card) => {
        const matches = category === "all" || card.dataset.category === category;
        card.classList.toggle("hidden", !matches);
      });
    });
  });
}

function initPointerEffects() {
  if (!window.matchMedia("(pointer:fine)").matches) {
    return;
  }
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  const interactiveCards = document.querySelectorAll(".service-card, .project-card, .timeline-item, .stat-card");
  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
      card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initYear() {
  const yearNode = document.querySelector("#year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear().toString();
  }
}

function initAutoProfileImage() {
  const autoProfileImage = document.querySelector('[data-auto-profile="true"]');
  if (!autoProfileImage) {
    return;
  }
  const initialSrc = autoProfileImage.getAttribute("src") || "./assets/profile-placeholder.svg";
  const defaultPlaceholder = "./assets/profile-placeholder.svg";
  const fallbackCandidates = [
    "./assets/profile.png",
    "./assets/profile.jpg",
    "./assets/profile.jpeg",
    "./assets/profile.webp",
    "./assets/my-photo.jpg",
    "./assets/my-photo.png",
    "./assets/photo.jpg",
    "./assets/photo.png",
    "./assets/profile.pnh"
  ];
  const isPlaceholderSrc = initialSrc.includes("profile-placeholder.svg");
  const candidates = isPlaceholderSrc
    ? [...fallbackCandidates, defaultPlaceholder]
    : [initialSrc, ...fallbackCandidates.filter((src) => src !== initialSrc), defaultPlaceholder];
  let imageIndex = 0;
  function tryNextImage() {
    if (imageIndex >= candidates.length) {
      autoProfileImage.src = defaultPlaceholder;
      return;
    }
    autoProfileImage.src = candidates[imageIndex];
    imageIndex += 1;
  }
  autoProfileImage.addEventListener("error", tryNextImage);
  tryNextImage();
}

function initContactForm() {
  const contactForm = document.querySelector(".contact-form");
  if (!contactForm) {
    return;
  }
  const formNote = contactForm.querySelector("#form-note");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const successPopup = contactForm.querySelector("#form-success-popup");
  const honeypot = contactForm.querySelector('input[name="company_website"]');
  const captchaQuestionNode = contactForm.querySelector("#captcha-question");
  const captchaAnswerInput = contactForm.querySelector("#captcha-answer");

  let captchaExpected = 0;
  const regenerateCaptcha = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    captchaExpected = a + b;
    if (captchaQuestionNode) {
      captchaQuestionNode.textContent = `${a} + ${b} = ?`;
    }
    if (captchaAnswerInput) {
      captchaAnswerInput.value = "";
    }
  };

  regenerateCaptcha();

  function setFormNote(message, state = "") {
    if (!formNote) {
      return;
    }
    formNote.textContent = message;
    formNote.classList.remove("is-error", "is-success");
    if (state) {
      formNote.classList.add(state);
    }
  }

  function showSuccessPopup(message) {
    if (!successPopup) {
      return;
    }
    const popupTextNode = successPopup.querySelector(".form-popup__content");
    if (popupTextNode) {
      popupTextNode.textContent = message;
    } else {
      successPopup.textContent = message;
    }
    successPopup.setAttribute("aria-hidden", "false");
    successPopup.classList.add("show");
    window.setTimeout(() => {
      successPopup.classList.remove("show");
      successPopup.setAttribute("aria-hidden", "true");
    }, 4200);
  }

  contactForm.addEventListener("submit", (event) => {
    const endpoint = contactForm.dataset.formspreeEndpoint?.trim();

    if (honeypot?.value) {
      event.preventDefault();
      setFormNote("Thanks! Your message was sent successfully.", "is-success");
      contactForm.reset();
      regenerateCaptcha();
      return;
    }

    if (!contactForm.reportValidity()) {
      event.preventDefault();
      setFormNote("Please fill all required fields correctly.", "is-error");
      return;
    }

    if (captchaAnswerInput && Number(captchaAnswerInput.value) !== captchaExpected) {
      event.preventDefault();
      captchaAnswerInput.setCustomValidity("Math verification failed. Please try again.");
      captchaAnswerInput.reportValidity();
      captchaAnswerInput.setCustomValidity("");
      setFormNote("Math verification failed. Please try again.", "is-error");
      regenerateCaptcha();
      return;
    }

    event.preventDefault();
    if (!endpoint) {
      setFormNote(
        "Form endpoint missing. Add your Formspree endpoint to data-formspree-endpoint in contact.html.",
        "is-error"
      );
      return;
    }
    const formData = new FormData(contactForm);
    const emailValue = String(formData.get("email") || "").trim();
    if (emailValue) {
      formData.append("_replyto", emailValue);
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }
    setFormNote("Sending your inquiry...");
    fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        contactForm.reset();
        regenerateCaptcha();
        setFormNote("Success! Your message was sent. I will contact you soon.", "is-success");
        showSuccessPopup("Thanks for filling the form. I will contact you soon.");
      })
      .catch(() => {
        setFormNote("Could not send right now. Please try again or email directly.", "is-error");
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Send Inquiry";
        }
      });
  });
}
