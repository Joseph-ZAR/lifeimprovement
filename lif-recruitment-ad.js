
(() => {
  "use strict";

  const START_DATE = "2026-10-28";
  const END_DATE = "2026-11-10";
  const STORAGE_KEY = "lifRecruitmentAdDismissed2026";
  const APPLICATION_URL = "recruitment.html#apply";

  const AD_IMAGES = [
    "assets/lif/Ad%201.jpeg",
    "assets/lif/Ad%202.jpeg"
  ];

  // Use Lesotho's calendar date, regardless of the visitor's device timezone.
  function lesothoDate() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Maseru",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());

    const values = {};
    parts.forEach(part => {
      values[part.type] = part.value;
    });

    return `${values.year}-${values.month}-${values.day}`;
  }

  const today = lesothoDate();
  const campaignActive = today >= START_DATE && today <= END_DATE;

  // Avoid duplicate elements if this script is accidentally included twice.
  if (document.getElementById("lif-recruitment-launcher")) return;

  const style = document.createElement("style");
  style.textContent = `
    #lif-recruitment-launcher {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 99990;
      display: block;
      padding: 12px 17px;
      border: 0;
      border-radius: 30px;
      background: #147a43;
      color: #fff;
      font: 700 14px/1.3 Arial, sans-serif;
      text-decoration: none;
      box-shadow: 0 5px 20px rgba(0,0,0,.24);
    }
    #lif-recruitment-launcher:focus-visible,
    #lif-recruitment-modal button:focus-visible,
    #lif-recruitment-modal a:focus-visible {
      outline: 3px solid #f5c342;
      outline-offset: 3px;
    }
    #lif-recruitment-modal {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      background: rgba(9, 25, 17, .76);
      font-family: Arial, sans-serif;
    }
    #lif-recruitment-modal[hidden] { display: none; }
    #lif-recruitment-modal .lif-ad-card {
      position: relative;
      width: min(760px, 100%);
      max-height: 92vh;
      overflow: auto;
      box-sizing: border-box;
      padding: 22px;
      border-radius: 18px;
      background: #fff;
      color: #193326;
      text-align: center;
      box-shadow: 0 16px 55px rgba(0,0,0,.35);
    }
    #lif-recruitment-modal .lif-ad-close {
      position: absolute;
      top: 9px;
      right: 10px;
      width: 42px;
      height: 42px;
      border: 0;
      border-radius: 50%;
      background: #f0f2f0;
      color: #17251d;
      font-size: 27px;
      cursor: pointer;
    }
    #lif-recruitment-modal h2 {
      margin: 8px 36px 8px;
      color: #137b43;
      font-size: clamp(23px, 4vw, 34px);
      line-height: 1.15;
    }
    #lif-recruitment-modal p {
      margin: 10px 0 16px;
      line-height: 1.5;
    }
    #lif-recruitment-modal .lif-ad-images {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      align-items: center;
      margin: 16px 0;
    }
    #lif-recruitment-modal .lif-ad-images img {
      display: block;
      width: 100%;
      max-height: 34vh;
      object-fit: contain;
      border-radius: 9px;
      background: #f5f6f5;
    }
    #lif-recruitment-modal .lif-ad-apply {
      display: inline-block;
      max-width: 100%;
      box-sizing: border-box;
      margin: 4px 6px;
      padding: 14px 24px;
      border-radius: 9px;
      background: #137b43;
      color: #fff;
      font-weight: 700;
      text-decoration: none;
    }
    #lif-recruitment-modal .lif-ad-later {
      margin: 8px;
      padding: 10px 14px;
      border: 1px solid #cbd5ce;
      border-radius: 8px;
      background: #fff;
      color: #23372b;
      font-weight: 600;
      cursor: pointer;
    }
    @media (max-width: 520px) {
      #lif-recruitment-launcher {
        right: 10px;
        bottom: 10px;
        font-size: 13px;
        padding: 11px 14px;
      }
      #lif-recruitment-modal { padding: 8px; }
      #lif-recruitment-modal .lif-ad-card {
        padding: 16px 12px;
        max-height: 94vh;
      }
      #lif-recruitment-modal .lif-ad-images { gap: 7px; }
      #lif-recruitment-modal .lif-ad-images img { max-height: 27vh; }
    }
    @media (prefers-reduced-motion: reduce) {
      #lif-recruitment-modal * { scroll-behavior: auto !important; }
    }
  `;
  document.head.appendChild(style);

  // The small link remains available even after the popup campaign ends.
  const launcher = document.createElement("a");
  launcher.id = "lif-recruitment-launcher";
  launcher.href = APPLICATION_URL;
  launcher.textContent = "Recruitment: Apply Now";
  launcher.setAttribute("aria-label", "Apply for the LIF Food Presenter / Sales Agent role");
  document.body.appendChild(launcher);

  const modal = document.createElement("div");
  modal.id = "lif-recruitment-modal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "lif-ad-heading");

  modal.innerHTML = `
    <div class="lif-ad-card">
      <button class="lif-ad-close" type="button"
        aria-label="Close recruitment advert">&times;</button>
      <h2 id="lif-ad-heading">LIF Is Recruiting!</h2>
      <p><strong>Food Presenters / Sales Agents</strong></p>
      <p>
        Can you represent LIF professionally, present food products
        confidently, communicate with customers and help drive sales
        in your community? We invite you to apply.
      </p>
      <div class="lif-ad-images"></div>
      <p><strong>Applications open: 28 October – 10 November 2026</strong></p>
      <a class="lif-ad-apply" href="${APPLICATION_URL}">Apply Now</a>
      <button class="lif-ad-later" type="button">Close advert</button>
    </div>
  `;

  const imageContainer = modal.querySelector(".lif-ad-images");

  AD_IMAGES.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = index === 0
      ? "LIF recruitment advert for Food Presenters and Sales Agents"
      : "Additional LIF recruitment campaign information";
    img.loading = "eager";
    imageContainer.appendChild(img);
  });

  document.body.appendChild(modal);

  const closeButtons = modal.querySelectorAll(
    ".lif-ad-close, .lif-ad-later"
  );
  const applyLink = modal.querySelector(".lif-ad-apply");

  let previousFocus = null;

  function openModal() {
    if (!campaignActive) return;
    previousFocus = document.activeElement;
    modal.hidden = false;
    modal.querySelector(".lif-ad-close").focus();
  }

  function closeModal() {
    modal.hidden = true;

    try {
      localStorage.setItem(STORAGE_KEY, "yes");
    } catch (_) {
      // Dismissal still works for the current page if storage is unavailable.
    }

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  closeButtons.forEach(button => {
    button.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key === "Tab") {
      const focusable = Array.from(
        modal.querySelectorAll("button, a[href]")
      ).filter(element => !element.disabled);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // If the visitor chooses Apply Now, remember dismissal on this page too.
  applyLink.addEventListener("click", () => {
    try {
      localStorage.setItem(STORAGE_KEY, "yes");
    } catch (_) {}
  });

  let dismissed = false;
  try {
    dismissed = localStorage.getItem(STORAGE_KEY) === "yes";
  } catch (_) {}

  // Show the popup once per browser during the campaign.
  if (campaignActive && !dismissed) {
    window.setTimeout(openModal, 500);
  }
})();

