const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const form = document.querySelector("#contact-form");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll("[data-progress]").forEach((bar) => {
      bar.style.width = `${bar.dataset.progress}%`;
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

if (form) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(field, message) {
    field.classList.toggle("invalid", Boolean(message));
    field.closest(".form-field").querySelector(".error-message").textContent = message;
    return !message;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    const subject = form.elements.subject;
    const message = form.elements.message;

    const nameValid = setError(name, name.value.trim() ? "" : "Please enter your name.");
    const emailValid = setError(email,
      !email.value.trim()
        ? "Please enter your email address."
        : !emailPattern.test(email.value.trim())
          ? "Please enter a valid email address."
          : ""
    );
    const subjectValid = setError(subject, subject.value.trim() ? "" : "Please enter a subject.");
    const messageValid = setError(message, message.value.trim().length >= 10 ? "" : "Please write at least 10 characters.");

    if (nameValid && emailValid && subjectValid && messageValid) {
      const success = form.querySelector(".form-success");
      success.textContent = "Thanks! Your message has been validated and is ready to send.";
      success.classList.add("show");
      form.reset();
    }
  });

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) setError(field, "");
    });
  });
}
