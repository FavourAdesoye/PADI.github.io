const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")
  ?.matches;

function setYear() {
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function setupReveal() {
  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function toast(formEl, message) {
  const toastEl = formEl.querySelector(".toast");
  if (!toastEl) return;
  toastEl.textContent = message;
}

function openMailDraft({ subject, body }) {
  const to = "hello@padi.bio";
  const params = new URLSearchParams({
    subject,
    body,
  });
  window.location.href = `mailto:${to}?${params.toString()}`;
}

function setupContactForm() {
  const form = document.querySelector("#contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = form.querySelector("#fullName")?.value?.trim();
    const email = form.querySelector("#email")?.value?.trim();
    const message = form.querySelector("#message")?.value?.trim();

    if (!fullName || !email || !message) {
      toast(form, "Please fill out all fields.");
      return;
    }

    toast(form, "Opening your email app…");
    openMailDraft({
      subject: `PADÌ — Contact from ${fullName}`,
      body: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}\n`,
    });
  });
}

function setupStoryForm() {
  const form = document.querySelector("#storyForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#storyName")?.value?.trim() || "Anonymous";
    const email = form.querySelector("#storyEmail")?.value?.trim() || "";
    const story = form.querySelector("#storyText")?.value?.trim();

    if (!story) {
      toast(form, "Please write your story before submitting.");
      return;
    }

    toast(form, "Opening your email app…");
    openMailDraft({
      subject: `PADÌ — Story submission (${name})`,
      body: `Name: ${name}\nEmail: ${email}\n\nStory:\n${story}\n`,
    });
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      if (!text) return;
      const ok = await copyToClipboard(text);
      const label = ok ? "Copied!" : "Copy failed";
      btn.textContent = label;
      window.setTimeout(() => {
        btn.textContent = "Copy Zelle recipient";
      }, 1400);
    });
  });
}

function setupLogoFallbacks() {
  document.querySelectorAll(".logo-badge").forEach((badge) => {
    const img = badge.querySelector(".logo-img");
    const fallback = badge.querySelector(".logo-fallback");
    if (!img || !fallback) return;

    const markMissing = () => badge.classList.add("is-missing");
    const markPresent = () => badge.classList.remove("is-missing");

    img.addEventListener("error", markMissing);
    img.addEventListener("load", markPresent);

    // If the image is missing from the start, let the browser fire "error".
    // If it is cached and already complete, ensure state is correct.
    if (img.complete && img.naturalWidth > 0) markPresent();
  });
}

setYear();
setupReveal();
setupContactForm();
setupStoryForm();
setupCopyButtons();
setupLogoFallbacks();
