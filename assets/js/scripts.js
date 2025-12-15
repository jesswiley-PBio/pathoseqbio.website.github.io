// scripts.js

// === Theme Toggle ===
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("light-mode") ? "light" : "dark"
    );
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

// === Google Translate ===
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: "en",
    includedLanguages: "en,fr,es,ms,zh-CN,ko,vi,th,id,ta",
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, "google_translate_element");
}

function reloadGoogleTranslate() {
  // Clear the container
  const container = document.getElementById('google_translate_element');
  if (container) {
    container.innerHTML = '';
  }

  // Remove any old script
  const oldScript = document.querySelector('script[src*="translate_a/element.js"]');
  if (oldScript) {
    oldScript.remove();
  }

  // Inject new script
  const gtScript = document.createElement('script');
  gtScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  gtScript.type = "text/javascript";
  document.head.appendChild(gtScript);
}

// Fix disappearing Translate widget when navigating with back/forward buttons
window.addEventListener('pageshow', function (event) {
  const container = document.getElementById('google_translate_element');
  const iframeExists = container && container.querySelector('iframe');

  if (!iframeExists) {
    reloadGoogleTranslate();  // 🔁 Force reload when back button is used
  }
});


// === Collaborators Map Setup ===
document.addEventListener("DOMContentLoaded", function () {
  const mapElement = document.getElementById("leaflet-map");
  if (!mapElement) return; // Only run if map exists on this page

  const map = L.map('leaflet-map', {
    worldCopyJump: false,
    maxBoundsViscosity: 1.0
  }).setView([10, 0], 2);

  // Fix gray edge bug — this keeps map from shifting or repeating
  const bounds = L.latLngBounds([[-85, -180], [85, 180]]);
  map.setMaxBounds(bounds);

  // Tile layer setup
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 2,
    noWrap: true,        // Prevents wrapping/duplicating world
    continuousWorld: false, // Ensures the map stops at world bounds
    bounds: bounds       // Explicitly define tile bounds
  }).addTo(map);


  // Partner data
  const partners = [
    { name: "UNMC / Nebraska Med", coords: [41.2565, -95.9345], logo: "assets/img/UNMC-2.jpg", url: "https://www.unmc.edu/", blurb: "Local sequencing partner for clinical and surveillance samples." , dois: [ "https://doi.org/10.1016/j.ajoc.2025.102486", "https://doi.org/10.1017/ice.2024.240", "https://doi.org/10.1016/j.idcr.2024.e01989" ] },
    { name: "NAMRU-IP", coords: [1.3521, 103.8198], logo: "assets/img/NAMRU-IP.jpg", url: "https://www.namru3.org/", blurb: "US DoD biomedical research institute supporting studies in SE Asia." , dois: [] },
    { name: "Monash University", coords: [3.0738, 101.5183], logo: "assets/img/Monash_University_logo.svg", url: "https://www.monash.edu/", blurb: "Research partner for clinical respiratory sample studies.", dois: [] },
    { name: "University of Malaysia Sabah", coords: [5.8950, 116.0510], logo: "assets/img/UMS-Logo.png", url: "https://ums.edu.my/v5/", blurb: "Research partner for DENV and other ID studies." , dois: []},
    { name: "TIDREC", coords: [3.1390, 101.6869], logo: "assets/img/tidrec-logo.png", url: "https://tidrec.um.edu.my", blurb: "Partnered to validate hybrid-capture panels for endemic viruses such as Influenza and DENV.", dois: [] },
    { name: "Hanyang University", coords: [37.5571, 127.0459], logo: "assets/img/hanyang.jpg", url: "https://www.hanyang.ac.kr/web/eng", blurb: "Partnered to validate hybrid-capture panels for endemic viruses and bacteria like SFTSV, Hantaan, Scrub Typhus, Q-Fever etc. and perform phylogenetic analysis.", dois: ["https://doi.org/10.1002/jmv.70305"] },
    { name: "LOMWRU", coords: [17.9757, 102.6331], logo: "assets/img/LOMWRU.png", url: "https://www.tropmedres.ac/units/lomwru-lao-pdr", blurb: "Testing and evaluation site for respiratory panel (hybrid-capture) sequencing.", dois: ["https://doi.org/10.1136/bmjopen-2024-098006"] },
    { name: "Institut Pasteur Dakar (IPD)", coords: [14.7167, -17.4677], logo: "assets/img/IPD.webp", url: "https://institutpasteurdakar.sn/", blurb: "Collaborated hybrid-capture ONT sequencing of Rift Valley Fever project.", dois: [] },
    { name: "INRB (DRC)", coords: [-4.3224, 15.3070], logo: "assets/img/INRB.jpeg", url: "https://inrb.net/", blurb: "Partner for MPXV sequencing." , dois: [] },
    { name: "Noguchi (Ghana)", coords: [5.6037, -0.1870], logo: "assets/img/noguchi.png", url: "https://noguchi.ug.edu.gh/", blurb: "Collaborated on Illumina and ONT DENV and MPXV sequencing." , dois: [] }
  ];

  // Add markers with popup cards
  partners.forEach(p => {
    const popup = `
      <div style="text-align:center;">
        <img src="${p.logo}" alt="${p.name} logo" style="width:80px;height:auto;margin-bottom:10px;"><br/>
        <strong><a href="${p.url}" target="_blank">${p.name}</a></strong><br/>
        <small>${p.blurb}</small><br/>
        ${Array.isArray(p.dois) && p.dois.length > 0
          ? `<div style="margin-top:8px;">
              ${p.dois.map((link, i) => 
               `<a href="${link}" target="_blank" style="display:block; margin:3px 0; color:#249bc6; text-decoration:none;">
                 🔗 Publication ${p.dois.length > 1 ? i + 1 : ""}
                </a>`
              ).join("")}
            </div>`
          : ""
        }
      </div>`;
    const marker = L.marker(p.coords).addTo(map).bindPopup(popup);
    marker.on('click', () => map.flyTo(p.coords, 5, { duration: 1.5 }));
  });
});

// === Scroll-triggered fade-in animation ===
const fadeIns = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

fadeIns.forEach(section => {
  observer.observe(section);
});


// === Contact Form Handling ===
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const statusDiv = document.getElementById("formSuccess");

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
    .then(response => {
      if (response.ok) {
        form.reset();
        statusDiv.style.display = "block";
      } else {
        alert("Oops! Something went wrong. Please try again later.");
      }
    })
    .catch(() => alert("Network error. Please try again later."));
}


