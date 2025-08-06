// Service List-Detail functionality (dynamic from JSON)
document.addEventListener("DOMContentLoaded", function () {
  // Only run on services.html
  if (!location.pathname.endsWith("services.html")) return;

  const servicesList = document.querySelector(".services-list");
  const servicesDetails = document.querySelector(".services-details");
  if (!servicesList || !servicesDetails) return;

  fetch("assets/js/services.json")
    .then((res) => res.json())
    .then((services) => {
      // Render service items
      servicesList.innerHTML = services
        .map(
          (service, idx) => `
            <div class="service-item${
              idx === 0 ? " active" : ""
            }" data-service="${service.id}">
              <i class="${service.icon}"></i>
              <h3>${service.title}</h3>
            </div>
          `
        )
        .join("");

      // Render service details
      servicesDetails.innerHTML = services
        .map(
          (service, idx) => `
            <div class="service-detail${idx === 0 ? " active" : ""}" id="${
            service.id
          }">
              <h2>${service.heading}</h2>
              ${service.description.map((desc) => `<p>${desc}</p>`).join("")}
              <div class="service-features">
                <h3>${service.featuresTitle}</h3>
                <ul>
                  ${service.features
                    .map(
                      (feature) =>
                        `<li><i class="fas fa-check"></i> ${feature}</li>`
                    )
                    .join("")}
                </ul>
              </div>
              <div class="service-clients">
                <h3>${service.clientsTitle}</h3>
                ${service.clients.map((c) => `<p>${c}</p>`).join("")}
                <a href="contact.html" class="btn btn-primary">Contact Us</a>
              </div>
            </div>
          `
        )
        .join("");

      // Add click event listeners
      const serviceItems = document.querySelectorAll(".service-item");
      const serviceDetails = document.querySelectorAll(".service-detail");
      serviceItems.forEach((item) => {
        item.addEventListener("click", function () {
          serviceItems.forEach((i) => i.classList.remove("active"));
          serviceDetails.forEach((d) => d.classList.remove("active"));
          this.classList.add("active");
          const serviceId = this.getAttribute("data-service");
          document.getElementById(serviceId).classList.add("active");
        });
      });
    });
});
// Gallery Functionality (dynamic from JSON)
document.addEventListener("DOMContentLoaded", function () {
  // Only run on gallery.html
  if (!location.pathname.endsWith("gallery.html")) return;

  const galleryGrid = document.querySelector(".gallery-grid");
  if (!galleryGrid) return;

  fetch("assets/js/gallery.json")
    .then((res) => res.json())
    .then((imagesData) => {
      // Render gallery items
      galleryGrid.innerHTML = imagesData
        .map(
          (img, idx) => `
            <div class="gallery-item" data-index="${idx}">
              <img src="${img.src}" alt="${img.alt}" class="gallery-img" />
            </div>
          `
        )
        .join("");

      // Lightbox functionality
      const lightbox = document.querySelector(".lightbox");
      const lightboxImg = document.querySelector(".lightbox-img");
      const lightboxCaption = document.querySelector(".lightbox-caption");
      const lightboxClose = document.querySelector(".lightbox-close");
      const lightboxPrev = document.querySelector(".lightbox-nav .prev");
      const lightboxNext = document.querySelector(".lightbox-nav .next");
      let currentIndex = 0;

      function updateLightbox() {
        lightboxImg.src = imagesData[currentIndex].src;
        lightboxCaption.textContent = imagesData[currentIndex].alt;
      }

      // Add click event to each gallery item
      galleryGrid.querySelectorAll(".gallery-item").forEach((item, idx) => {
        item.addEventListener("click", function () {
          currentIndex = idx;
          updateLightbox();
          lightbox.classList.add("active");
          document.body.style.overflow = "hidden";
        });
      });

      lightboxClose.addEventListener("click", function () {
        lightbox.classList.remove("active");
        document.body.style.overflow = "auto";
      });

      lightboxPrev.addEventListener("click", function () {
        currentIndex =
          (currentIndex - 1 + imagesData.length) % imagesData.length;
        updateLightbox();
      });

      lightboxNext.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % imagesData.length;
        updateLightbox();
      });

      // Close lightbox when clicking outside image
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
          lightbox.classList.remove("active");
          document.body.style.overflow = "auto";
        }
      });

      // Keyboard navigation
      document.addEventListener("keydown", function (e) {
        if (lightbox.classList.contains("active")) {
          if (e.key === "Escape") {
            lightbox.classList.remove("active");
            document.body.style.overflow = "auto";
          } else if (e.key === "ArrowLeft") {
            currentIndex =
              (currentIndex - 1 + imagesData.length) % imagesData.length;
            updateLightbox();
          } else if (e.key === "ArrowRight") {
            currentIndex = (currentIndex + 1) % imagesData.length;
            updateLightbox();
          }
        }
      });
    });
});
// Load components
function loadComponents() {
  // Load header
  fetch("assets/components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("afterbegin", data);
      initMobileMenu();
      setActiveLink();
    });

  // Load footer
  fetch("assets/components/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("beforeend", data);
      document.getElementById("current-year").textContent =
        new Date().getFullYear();
    });
}

// Get Quote Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Modal elements
  const quoteModal = document.getElementById("quoteModal");
  const openQuoteButtons = document.querySelectorAll(".open-quote-modal");
  const closeQuoteButton = document.querySelector(".close-modal");

  // Open modal when any "Get a Quote" button is clicked
  if (openQuoteButtons.length) {
    openQuoteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        quoteModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent scrolling
      });
    });
  }

  // Close modal when X button is clicked
  if (closeQuoteButton) {
    closeQuoteButton.addEventListener("click", function () {
      quoteModal.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scrolling
    });
  }

  // Close modal when clicking outside the modal content
  quoteModal.addEventListener("click", function (e) {
    if (e.target === quoteModal) {
      quoteModal.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scrolling
    }
  });

  // Form submission
  const quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const formData = new FormData(this);

      // Here you would typically send the form data to a server
      // For demonstration, we'll just show an alert
      alert("Thank you for your quote request! We will contact you soon.");

      // Close modal and reset form
      quoteModal.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scrolling
      this.reset();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".choose-track");
  const items = document.querySelectorAll(".choose-item");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.querySelector(".prev-arrow");
  const nextBtn = document.querySelector(".next-arrow");

  let currentIndex = 0;
  const itemCount = items.length;

  function updateCarousel() {
    const itemWidth = items[0].offsetWidth;
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function moveToIndex(index) {
    if (index < 0) index = itemCount - 1;
    if (index >= itemCount) index = 0;

    currentIndex = index;
    updateCarousel();
  }

  // Button events
  nextBtn.addEventListener("click", () => moveToIndex(currentIndex + 1));
  prevBtn.addEventListener("click", () => moveToIndex(currentIndex - 1));

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => moveToIndex(index));
  });

  // Auto-rotate (optional)
  let autoRotate = setInterval(() => moveToIndex(currentIndex + 1), 5000);

  // Pause on hover
  const carousel = document.querySelector(".choose-carousel");
  carousel.addEventListener("mouseenter", () => clearInterval(autoRotate));
  carousel.addEventListener("mouseleave", () => {
    autoRotate = setInterval(() => moveToIndex(currentIndex + 1), 5000);
  });

  // Responsive adjustments
  window.addEventListener("resize", updateCarousel);
});

// Initialize mobile menu
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navbar = document.querySelector(".navbar");

  if (mobileMenuBtn && navbar) {
    // Ensure we're working with fresh elements
    const newMobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const newNavbar = document.querySelector(".nav-links");

    newMobileMenuBtn.addEventListener("click", function () {
      newNavbar.classList.toggle("active");
      const icon = this.querySelector("i");
      if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });

    // Close menu when clicking on nav links
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        newNavbar.classList.remove("active");
        const icon = newMobileMenuBtn.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      });
    });
  }
}

// Set active link based on current page
function setActiveLink() {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

// Then modify your DOMContentLoaded event listener to include this:
document.addEventListener("DOMContentLoaded", function () {
  loadComponents();
  initBackToTop(); // Add this line

  // Sticky header on scroll
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 50);
    }
  });
});

// Back to Top Button Functionality
function initBackToTop() {
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTop.classList.add("active");
      } else {
        backToTop.classList.remove("active");
      }
    });

    // Smooth scroll to top when clicked
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}
