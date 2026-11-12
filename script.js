// ============================================
// VARIABLES GLOBALES DE SEGURIDAD
// ============================================
const bookingOverlay = document.getElementById("bookingOverlay");
const selectTimeBtn = document.getElementById("selectTimeBtn");

// =====================================
// TEAM REGISTRATION
// =====================================
document.addEventListener("click", function(event) {
    const button = event.target.closest(".join-team-btn");

    if (button && !button.classList.contains("view-profile-btn")) {
        const card = button.closest(".team-card");
        const overlay = document.getElementById("registrationOverlay");

        if (!card || !overlay) return;

        const category = card.querySelector(".team-category").textContent;
        const teamName = card.querySelector(".team-card-image h3").textContent;
        const location = card.querySelector(".team-location").textContent;
        const rating = card.querySelector(".team-rating").textContent;
        const members = card.querySelector(".team-card-details span:last-child").textContent;
        const description = card.querySelector(".team-description").textContent.trim();

        document.getElementById("registrationCategory").textContent = category;
        document.getElementById("registrationTeamName").textContent = teamName;
        document.getElementById("registrationLocation").textContent = location;
        document.getElementById("registrationRating").textContent = rating;
        document.getElementById("registrationMembers").textContent = members;

        document.getElementById("registrationDescription").textContent =
            description + " Secure your spot in the community.";

        document.getElementById("registrationFormContainer").style.display = "block";
        document.getElementById("registrationSuccess").classList.remove("active");
        document.getElementById("teamRegistrationForm").reset();

        overlay.classList.add("active");
        return;
    }

    if (event.target.closest("#closeRegistration")) {
        document.getElementById("registrationOverlay").classList.remove("active");
        return;
    }

    if (event.target.closest("#doneRegistration")) {
        document.getElementById("registrationOverlay").classList.remove("active");
        return;
    }

    const overlay = document.getElementById("registrationOverlay");
    if (overlay && event.target === overlay) {
        overlay.classList.remove("active");
    }
});

// =====================================
// SUBMIT REGISTRATION
// =====================================
document.addEventListener("submit", function(event) {
    if (event.target.id !== "teamRegistrationForm") return;

    event.preventDefault();

    const name = document.getElementById("registrationName").value.trim();
    if (!name) return;

    const teamName = document.getElementById("registrationTeamName").textContent.trim();

    document.getElementById("successMessage").textContent =
        "You're on the roster at " + teamName + ". We'll be in touch shortly.";

    document.getElementById("registrationFormContainer").style.display = "none";
    document.getElementById("registrationSuccess").classList.add("active");
});

// ============================================
// PRIME - SISTEMA DE RESERVAS
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    const bookingOverlay = document.getElementById("bookingOverlay");
    const closeModal = document.getElementById("closeModal");

    const bookingImage = document.getElementById("bookingImage");
    const bookingTitle = document.getElementById("bookingTitle");
    const bookingLocation = document.getElementById("bookingLocation");
    const bookingRating = document.getElementById("bookingRating");
    const bookingPrice = document.getElementById("bookingPrice");
    const bookingSport = document.getElementById("bookingSport");

    const bookingDates = document.getElementById("bookingDates");
    const bookingTimes = document.getElementById("bookingTimes");
    const selectTimeBtn = document.getElementById("selectTimeBtn");
    const bookingMessage = document.getElementById("bookingMessage");

    const timeSlots = [
        { label: "9:00 AM", hour: 9 },
        { label: "10:00 AM", hour: 10 },
        { label: "11:00 AM", hour: 11 },
        { label: "12:00 PM", hour: 12 },
        { label: "1:00 PM", hour: 13 },
        { label: "2:00 PM", hour: 14 },
        { label: "3:00 PM", hour: 15 },
        { label: "4:00 PM", hour: 16 },
        { label: "5:00 PM", hour: 17 }
    ];

    let selectedCourt = null;
    let selectedDate = null;
    let selectedTime = null;

    document.addEventListener("click", function (event) {
        const bookButton = event.target.closest(".book-btn");
        if (!bookButton) return;

        const card = bookButton.closest(".tarjeta") || bookButton.parentElement.parentElement;
        
        const image = card ? card.querySelector("img") : null;
        const title = card ? card.querySelector("h3") : null;
        const location = card ? card.querySelector(".location, p") : null;
        const rating = card ? card.querySelector(".rating") : null;
        const price = card ? card.querySelector(".price") : null;

        selectedCourt = {
            name: title ? title.textContent.trim() : "Sports Court",
            location: location ? location.textContent.trim() : "La Chorrera, Panama",
            image: image ? image.getAttribute("src") : "",
            rating: rating ? rating.textContent.replace("★", "").trim() : "4.7",
            price: price ? Number(price.textContent.replace("$", "").trim()) : 25,
            sport: title ? getSportName(title.textContent) : "SPORTS COURT"
        };

        if (bookingImage) { bookingImage.src = selectedCourt.image; bookingImage.alt = selectedCourt.name; }
        if (bookingTitle) bookingTitle.textContent = selectedCourt.name;
        if (bookingLocation) bookingLocation.textContent = selectedCourt.location;
        if (bookingRating) bookingRating.textContent = selectedCourt.rating;
        if (bookingPrice) bookingPrice.textContent = "$" + selectedCourt.price;
        if (bookingSport) bookingSport.textContent = selectedCourt.sport;

        createDateButtons();
        selectedDate = null;
        selectedTime = null;

        if (bookingTimes) bookingTimes.innerHTML = "";
        if (bookingMessage) {
            bookingMessage.textContent = "";
            bookingMessage.classList.remove("visible");
        }

        if (selectTimeBtn) {
            selectTimeBtn.disabled = true;
            selectTimeBtn.textContent = "Select a time slot";
        }

        if (bookingOverlay) {
            bookingOverlay.style.display = "flex";
            bookingOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        if (closeModal) closeModal.focus();
    });

    function getSportName(courtName) {
        const name = courtName.toLowerCase();
        if (name.includes("pool")) return "SWIMMING POOL";
        if (name.includes("volley")) return "VOLLEYBALL";
        if (name.includes("turf") || name.includes("football")) return "FOOTBALL";
        return "SPORTS COURT";
    }

    function getLocalDate(daysFromToday) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + daysFromToday);
        return date;
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function createDateButtons() {
        if (!bookingDates) return;
        bookingDates.innerHTML = "";

        const dateOptions = [
            { label: "Today", offset: 0 },
            { label: "Tomorrow", offset: 1 },
            {
                label: getLocalDate(2).toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
                offset: 2
            }
        ];

        dateOptions.forEach((option, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "booking-date-btn";
            button.textContent = option.label;

            button.addEventListener("click", () => {
                selectedDate = getLocalDate(option.offset);
                selectedTime = null;

                bookingDates.querySelectorAll("button").forEach((dateButton) => {
                    dateButton.classList.remove("active");
                });

                button.classList.add("active");
                createTimeButtons();

                if (bookingMessage) {
                    bookingMessage.textContent = "";
                    bookingMessage.classList.remove("visible");
                }
                if (selectTimeBtn) {
                    selectTimeBtn.disabled = true;
                    selectTimeBtn.textContent = "Select a time slot";
                }
            });

            bookingDates.appendChild(button);

            if (index === 0) {
                button.click();
            }
        });
    }

    function createTimeButtons() {
        if (!bookingTimes) return;
        bookingTimes.innerHTML = "";

        timeSlots.forEach((slot) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "booking-time-btn";
            button.textContent = slot.label;

            const unavailableHours = [10, 13, 16];
            const today = getLocalDate(0);
            const isToday = formatDate(selectedDate) === formatDate(today);
            const currentHour = new Date().getHours();
            const isPastTime = isToday && slot.hour <= currentHour;

            if (unavailableHours.includes(slot.hour) || isPastTime) {
                button.disabled = true;
            } else {
                button.addEventListener("click", () => {
                    selectedTime = slot;

                    bookingTimes.querySelectorAll("button").forEach((timeButton) => {
                        timeButton.classList.remove("selected");
                    });

                    button.classList.add("selected");

                    if (selectTimeBtn) {
                        selectTimeBtn.disabled = false;
                        selectTimeBtn.textContent = `Continue — ${slot.label}`;
                    }

                    if (bookingMessage) {
                        bookingMessage.textContent = "";
                        bookingMessage.classList.remove("visible");
                    }
                });
            }

            bookingTimes.appendChild(button);
        });
    }

    if (selectTimeBtn) {
        selectTimeBtn.addEventListener("click", () => {
            if (!selectedCourt || !selectedDate || !selectedTime) {
                if (bookingMessage) {
                    bookingMessage.textContent = "Please select a date and time first.";
                    bookingMessage.classList.add("visible");
                }
                return;
            }

            const pendingBooking = {
                name: selectedCourt.name,
                location: selectedCourt.location,
                price: selectedCourt.price,
                sport: selectedCourt.sport,
                date: formatDate(selectedDate),
                time: selectedTime.label
            };

            sessionStorage.setItem("primePendingBooking", JSON.stringify(pendingBooking));
            closeBookingModal();

            const accountPage = document.getElementById("accountPage");
            if (accountPage) {
                accountPage.hidden = false;
                accountPage.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    function closeBookingModal() {
        if (bookingOverlay) {
            bookingOverlay.style.display = "none";
            bookingOverlay.classList.remove("active");
        }
        document.body.style.overflow = "";
        selectedCourt = null;
        selectedDate = null;
        selectedTime = null;
    }

    const closeButton = document.querySelector(".close-modal");
    if (closeButton) {
        closeButton.onclick = function () {
            closeBookingModal();
        };
    }

    if (bookingOverlay) {
        bookingOverlay.addEventListener("click", (event) => {
            if (event.target === bookingOverlay) {
                closeBookingModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeBookingModal();
        }
    });
});

// ============================================
// VOLVER A COURTS
// ============================================
const backToCourtsButton = document.getElementById("backToCourts");
const accountPageElement = document.getElementById("accountPage");
const courtsSection = document.getElementById("Courts");

if (backToCourtsButton) {
    backToCourtsButton.addEventListener("click", () => {
        if (accountPageElement) accountPageElement.hidden = true;
        closeBookingModal();

        if (courtsSection) {
            courtsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
}

function closeBookingModal() {
    const bookingOverlay = document.getElementById("bookingOverlay");
    if (bookingOverlay) {
        bookingOverlay.style.display = "none";
        bookingOverlay.classList.remove("active");
    }
    document.body.style.overflow = "";
}

document.addEventListener("click", function(e) {
    if (e.target.closest(".close-modal") || e.target.id === "bookingOverlay") {
        closeBookingModal();
    }
});

// ============================================
// INICIALIZACIÓN DEL MAPA LEAFLET EN TU CONTENEDOR
// ============================================
let mapMarkersList = [];

function initPrimeMap() {
    if (typeof L !== 'undefined' && document.getElementById('realLeafletMap')) {
        if (!window.leafletMapInstance) {
            // Coordenadas centradas en La Chorrera, Panamá Oeste
            window.leafletMapInstance = L.map('realLeafletMap', {
                zoomControl: false
            }).setView([8.8810, -79.7860], 14);

            L.control.zoom({ position: 'bottomright' }).addTo(window.leafletMapInstance);

            // Capa gratuita de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(window.leafletMapInstance);

            if (typeof initLeafletMarkers === 'function') {
                initLeafletMarkers();
            }
        } else {
            window.leafletMapInstance.invalidateSize();
        }
    }
}

// Ejecutar al cargar la página si el mapa ya es visible, o llamarlo cuando abras tu contenedor
document.addEventListener("DOMContentLoaded", function() {
    initPrimeMap();

    // Lógica para el botón de cerrar
    const closeBtn = document.getElementById("closeMapModal");
    if (closeBtn) {
        closeBtn.addEventListener("click", function() {
            const container = document.querySelector(".map-interactive-container");
            if (container) {
                container.style.display = "none"; // O la clase que uses para ocultarlo
            }
        });
    }
});

function initLeafletMarkers() {
    const spaceItems = document.querySelectorAll(".space-item");
    mapMarkersList = [];

    spaceItems.forEach(item => {
        const lat = parseFloat(item.dataset.lat);
        const lng = parseFloat(item.dataset.lng);
        const title = item.querySelector("h4").textContent;
        const address = item.querySelector(".space-address").textContent;

        const marker = L.marker([lat, lng]).addTo(window.leafletMapInstance);
        marker.bindPopup(`<b>${title}</b><br>${address}`);

        item.addEventListener("click", () => {
            spaceItems.forEach(i => i.classList.remove("highlighted"));
            item.classList.add("highlighted");
            window.leafletMapInstance.setView([lat, lng], 16, { animate: true });
            marker.openPopup();
        });

        mapMarkersList.push({ element: item, marker: marker, category: item.dataset.category });
    });
}

document.addEventListener("click", function(e) {
    const tagBtn = e.target.closest(".tag-btn");
    if (!tagBtn || !window.leafletMapInstance) return;

    document.querySelectorAll(".tag-btn").forEach(b => b.classList.remove("active"));
    tagBtn.classList.add("active");

    const filter = tagBtn.dataset.filter;
    let count = 0;

    mapMarkersList.forEach(m => {
        if (filter === "all" || m.category === filter) {
            m.element.style.display = "block";
            if (!window.leafletMapInstance.hasLayer(m.marker)) m.marker.addTo(window.leafletMapInstance);
            count++;
        } else {
            m.element.style.display = "none";
            if (window.leafletMapInstance.hasLayer(m.marker)) window.leafletMapInstance.removeLayer(window.leafletMapInstance);
        }
    });

    const counter = document.getElementById("spacesCounter");
    if (counter) counter.textContent = `${count} SPACES`;
});

document.addEventListener("input", function(e) {
    if (e.target && e.target.id === "mapSearchInput") {
        const term = e.target.value.toLowerCase();
        let count = 0;

        mapMarkersList.forEach(m => {
            const text = m.element.textContent.toLowerCase();
            if (text.includes(term)) {
                m.element.style.display = "block";
                if (!window.leafletMapInstance.hasLayer(m.marker)) m.marker.addTo(window.leafletMapInstance);
                count++;
            } else {
                m.element.style.display = "none";
                if (window.leafletMapInstance.hasLayer(m.marker)) window.leafletMapInstance.removeLayer(window.leafletMapInstance);
            }
        });

        const counter = document.getElementById("spacesCounter");
        if (counter) counter.textContent = `${count} SPACES`;
    }
});

document.addEventListener("click", function(e) {
    if (e.target.id === "closeMapModal" || e.target.closest("#closeMapModal") || e.target.id === "mapOverlay" || e.target.id === "mapPrimeLogo") {
        const mapOverlay = document.getElementById("mapOverlay");
        if (mapOverlay) {
            mapOverlay.style.display = "none";
            mapOverlay.classList.remove("active");
        }
        document.body.style.overflow = "";
        if (e.target.id === "mapPrimeLogo" || e.target.closest("#mapPrimeLogo")) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// ============================================
// ATHLETES DATA, CARDS & PROFILE DRAWER
// ============================================
const primeAthletesData = [
    {
        id: "diego-fabrega",
        initials: "DF",
        name: "Diego Fábrega",
        level: "ADVANCED",
        rating: "4.9",
        sport: "FOOTBALL",
        bio: "8 years coaching youth teams. Specialist in individual technique.",
        stats: [
            { value: "124", label: "MATCHES" },
            { value: "38", label: "GOALS" },
            { value: "5", label: "TROPHIES" }
        ],
        performance: [
            { label: "OVERALL RATING", score: "4.9", percent: 98 },
            { label: "COACHING QUALITY", score: "5.0", percent: 100 },
            { label: "COMMUNICATION", score: "4.7", percent: 94 },
            { label: "VALUE FOR MONEY", score: "4.8", percent: 96 }
        ],
        specialties: ["Shooting Technique", "Tactical Awareness", "Youth Development"],
        reviewsCount: 3,
        reviews: [
            { author: "Carlos M.", time: "2 weeks ago", text: "Great sessions at El Coco, really improved my ball control." }
        ]
    },
    {
        id: "camila-urena",
        initials: "CU",
        name: "Camila Ureña",
        level: "PROFESSIONAL",
        rating: "5",
        sport: "PADEL",
        bio: "Former professional padel player. Personalized lessons for all levels.",
        stats: [
            { value: "98", label: "MATCHES" },
            { value: "72", label: "WINS" },
            { value: "8", label: "TROPHIES" }
        ],
        performance: [
            { label: "OVERALL RATING", score: "5.0", percent: 100 },
            { label: "COACHING QUALITY", score: "5.0", percent: 100 },
            { label: "COMMUNICATION", score: "4.9", percent: 98 },
            { label: "VALUE FOR MONEY", score: "4.9", percent: 98 }
        ],
        specialties: ["Bandeja & Vibora", "Court Positioning", "Match Strategy"],
        reviewsCount: 5,
        reviews: [
            { author: "Sofia R.", time: "1 week ago", text: "Best padel coach in La Chorrera. Super clear explanations." }
        ]
    },
    {
        id: "ricardo-solis",
        initials: "RS",
        name: "Ricardo Solis",
        level: "COACH",
        rating: "4.8",
        sport: "ATHLETICS",
        bio: "Strength & conditioning coach and running guide. Progressive plans from 5K to 21K.",
        stats: [
            { value: "45", label: "RACES" },
            { value: "1:32:10", label: "PR" },
            { value: "3", label: "TROPHIES" }
        ],
        performance: [
            { label: "OVERALL RATING", score: "4.8", percent: 96 },
            { label: "COACHING QUALITY", score: "4.9", percent: 98 },
            { label: "COMMUNICATION", score: "4.8", percent: 96 },
            { label: "VALUE FOR MONEY", score: "4.7", percent: 94 }
        ],
        specialties: ["Endurance Pacing", "Speed Intervals", "Injury Prevention"],
        reviewsCount: 4,
        reviews: [
            { author: "Javier P.", time: "3 weeks ago", text: "Morning runs at Vacamonte helped me drop 4 minutes on my 10K." }
        ]
    },
    {
        id: "mariana-gomez",
        initials: "MG",
        name: "Mariana Gómez",
        level: "INTERMEDIATE",
        rating: "4.7",
        sport: "5-A-SIDE FOOTBALL",
        bio: "Forward for Las Victorias FC. Active player every week at El Coco.",
        stats: [
            { value: "64", label: "MATCHES" },
            { value: "29", label: "GOALS" },
            { value: "2", label: "TROPHIES" }
        ],
        performance: [
            { label: "OVERALL RATING", score: "4.7", percent: 94 },
            { label: "TEAMWORK", score: "4.9", percent: 98 },
            { label: "COMMUNICATION", score: "4.6", percent: 92 },
            { label: "CONSISTENCY", score: "4.7", percent: 94 }
        ],
        specialties: ["Quick Counter-Attacks", "Dribbling", "Small-Sided Play"],
        reviewsCount: 2,
        reviews: [
            { author: "Elena V.", time: "1 month ago", text: "Always organizes competitive friendly matches on weekends." }
        ]
    },
    {
        id: "luis-torres",
        initials: "LT",
        name: "Luis Torres",
        level: "ADVANCED",
        rating: "4.6",
        sport: "BASKETBALL",
        bio: "Match organizer at Puerto Caimito. Point guard with great court vision.",
        stats: [
            { value: "87", label: "MATCHES" },
            { value: "612", label: "POINTS" },
            { value: "4", label: "TROPHIES" }
        ],
        performance: [
            { label: "OVERALL RATING", score: "4.6", percent: 92 },
            { label: "PLAYMAKING", score: "4.8", percent: 96 },
            { label: "COMMUNICATION", score: "4.6", percent: 92 },
            { label: "DEFENSE", score: "4.5", percent: 90 }
        ],
        specialties: ["Pick & Roll", "Ball Handling", "Perimeter Shooting"],
        reviewsCount: 3,
        reviews: [
            { author: "Marco D.", time: "5 days ago", text: "Great energy on the court at Puerto Caimito Arena." }
        ]
    },
    {
        id: "andrea-vega",
        initials: "AV",
        name: "Andrea Vega",
        level: "INTERMEDIATE",
        rating: "4.8",
        sport: "PADEL",
        bio: "Padel player looking for doubles partners for weekly matches and local tournaments.",
        stats: [
            { value: "52", label: "MATCHES" },
            { value: "34", label: "WINS" },
            { value: "2", label: "TROPHIES" }
        ],
        performance: [
            { label: "OVERALL RATING", score: "4.8", percent: 96 },
            { label: "NET PLAY", score: "4.8", percent: 96 },
            { label: "COMMUNICATION", score: "4.9", percent: 98 },
            { label: "CONSISTENCY", score: "4.7", percent: 94 }
        ],
        specialties: ["Volley Control", "Doubles Coordination", "Defensive Lobs"],
        reviewsCount: 2,
        reviews: [
            { author: "Valeria C.", time: "2 weeks ago", text: "Super reliable partner for evening matches in Barrio Colón." }
        ]
    }
];

function renderAthletesGrid() {
    const grid = document.getElementById("athletesGrid");
    if (!grid || grid.children.length > 0) return;

    primeAthletesData.forEach(athlete => {
        const card = document.createElement("article");
        card.className = "athlete-card";
        card.innerHTML = `
            <div class="athlete-card-top">
                <span class="athlete-level-badge">${athlete.level}</span>
                <div class="athlete-avatar-circle">${athlete.initials}</div>
                <span class="athlete-sport-pill">★ ${athlete.rating} · ${athlete.sport}</span>
            </div>
            <div class="athlete-card-body">
                <h3>${athlete.name}</h3>
                <p class="athlete-bio">${athlete.bio}</p>
                <div class="athlete-stats-row">
                    ${athlete.stats.map(s => `
                        <div class="athlete-stat-box">
                            <strong>${s.value}</strong>
                            <span>${s.label}</span>
                        </div>
                    `).join("")}
                </div>
                <button type="button" class="view-profile-btn" data-athlete-id="${athlete.id}">
                    VIEW PROFILE
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openAthleteDrawer(athleteId) {
    const athlete = primeAthletesData.find(a => a.id === athleteId);
    const drawer = document.getElementById("athleteProfileDrawer");
    const overlay = document.getElementById("athleteDrawerOverlay");
    const content = document.getElementById("athleteDrawerContent");
    const msgInput = document.getElementById("athleteQuickMessageInput");

    if (!athlete || !drawer || !overlay || !content) return;

    const firstName = athlete.name.split(" ")[0];
    if (msgInput) msgInput.placeholder = `Quick message to ${firstName}...`;

    content.innerHTML = `
        <div class="drawer-header-profile">
            <div class="athlete-avatar-circle large">${athlete.initials}</div>
            <div class="drawer-badges">
                <span class="athlete-sport-pill">★ ${athlete.rating} · ${athlete.sport}</span>
                <span class="athlete-level-badge">${athlete.level}</span>
            </div>
            <h2>${athlete.name.toUpperCase()}</h2>
        </div>

        <div class="drawer-section">
            <h4>ABOUT</h4>
            <p>${athlete.bio}</p>
        </div>

        <div class="drawer-section">
            <h4>PERFORMANCE</h4>
            <div class="drawer-performance-card">
                ${athlete.performance.map(p => `
                    <div class="perf-row">
                        <div class="perf-labels">
                            <span>${p.label}</span>
                            <span class="perf-score">${p.score}</span>
                        </div>
                        <div class="perf-bar-bg">
                            <div class="perf-bar-fill" style="width: ${p.percent}%"></div>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>

        <div class="drawer-section">
            <h4>SPECIALTIES</h4>
            <div class="drawer-specialties">
                ${athlete.specialties.map(sp => `<span class="specialty-tag">⚡ ${sp}</span>`).join("")}
            </div>
        </div>

        <div class="drawer-section">
            <h4>CAREER STATS</h4>
            <div class="athlete-stats-row">
                ${athlete.stats.map(s => `
                    <div class="athlete-stat-box">
                        <strong>${s.value}</strong>
                        <span>${s.label}</span>
                    </div>
                `).join("")}
            </div>
        </div>

        <div class="drawer-section">
            <h4>FIELD NOTES · ${athlete.reviewsCount} REVIEWS</h4>
            ${athlete.reviews.map(r => `
                <div class="drawer-review-card">
                    <div class="review-top">
                        <strong>${r.author}</strong>
                        <span class="review-stars">★★★★★</span>
                    </div>
                    <span class="review-time">${r.time}</span>
                    <p>${r.text}</p>
                </div>
            `).join("")}
        </div>
    `;

    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeAthleteDrawer() {
    const drawer = document.getElementById("athleteProfileDrawer");
    const overlay = document.getElementById("athleteDrawerOverlay");
    if (drawer) {
        drawer.classList.remove("active");
        drawer.setAttribute("aria-hidden", "true");
    }
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", renderAthletesGrid);

document.addEventListener("click", function(event) {
    const athletesTrigger = event.target.closest("#viewAthletesBtn, .view-athletes-btn, a[href='#athletes']") ||
                            (event.target.textContent && (
                                event.target.textContent.toUpperCase().includes("VIEW ATHLETES") ||
                                event.target.textContent.toUpperCase().includes("VER DEPORTISTAS")
                            ));

    if (athletesTrigger) {
        event.preventDefault();
        renderAthletesGrid();
        const athletesSection = document.getElementById("athletes");
        if (athletesSection) {
            athletesSection.removeAttribute("hidden");
            athletesSection.style.display = "block";
            athletesSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
    }

    const profileBtn = event.target.closest(".view-profile-btn");
    if (profileBtn) {
        const athleteId = profileBtn.dataset.athleteId;
        if (athleteId) openAthleteDrawer(athleteId);
        return;
    }

    if (event.target.closest("#closeAthleteDrawer") || event.target.id === "athleteDrawerOverlay") {
        closeAthleteDrawer();
    }
});

document.addEventListener("submit", function(event) {
    if (event.target.id !== "athleteQuickMessageForm") return;
    event.preventDefault();
    const input = document.getElementById("athleteQuickMessageInput");
    if (input && input.value.trim()) {
        input.value = "";
        input.placeholder = "Message sent! ✓";
        setTimeout(() => {
            input.placeholder = "Quick message...";
        }, 2500);
    }
});

// ==========================================================
// PRIME - GESTIÓN COMPLETA DE RUTINAS Y MODALES
// ==========================================================
const baseRoutinesData = [
    { 
        id: "full-body", 
        name: "Full Body Blast", 
        desc: "A complete full-body workout targeting all major muscle groups for maximum results.", 
        difficulty: "Intermediate", 
        category: "Full Body", 
        time: "45 min", 
        exercises: [
            {name: "Squats", reps: "4×12"}, 
            {name: "Bench Press", reps: "4×10"}, 
            {name: "Deadlifts", reps: "3×8"}, 
            {name: "Pull-ups", reps: "3×10"}, 
            {name: "Plank", reps: "3×60"}
        ] 
    },
    { 
        id: "upper-body", 
        name: "Upper Body Power", 
        desc: "Focus on chest, back, shoulders, and arms to build upper body strength.", 
        difficulty: "Advanced", 
        category: "Upper Body", 
        time: "40 min", 
        exercises: [
            {name: "Push-ups", reps: "4×20"}, 
            {name: "Shoulder Press", reps: "4×10"}, 
            {name: "Barbell Rows", reps: "4×12"}
        ] 
    },
    { 
        id: "lower-body", 
        name: "Lower Body Strength", 
        desc: "Build powerful legs and glutes with this intensive lower body routine.", 
        difficulty: "Intermediate", 
        category: "Lower Body", 
        time: "35 min", 
        exercises: [
            {name: "Squats", reps: "5×10"}, 
            {name: "Lunges", reps: "4×12"}, 
            {name: "Leg Press", reps: "4×15"}
        ] 
    },
    { 
        id: "core-crusher", 
        name: "Core Crusher", 
        desc: "Sculpt and strengthen your core with targeted abdominal exercises.", 
        difficulty: "Beginner", 
        category: "Core", 
        time: "20 min", 
        exercises: [
            {name: "Plank", reps: "3×60"}, 
            {name: "Crunches", reps: "3×20"}, 
            {name: "Russian Twists", reps: "3×30"}
        ] 
    },
    { 
        id: "hiit-cardio", 
        name: "HIIT Cardio Burn", 
        desc: "High-intensity interval training to torch calories and boost endurance.", 
        difficulty: "Advanced", 
        category: "Cardio", 
        time: "25 min", 
        exercises: [
            {name: "Burpees", reps: "5×15"}, 
            {name: "Jumping Jacks", reps: "5×30"}, 
            {name: "High Knees", reps: "5×40"}
        ] 
    },
    { 
        id: "beginner-found", 
        name: "Beginner Foundation", 
        desc: "Perfect starting point for those new to fitness. Build a solid base.", 
        difficulty: "Beginner", 
        category: "Full Body", 
        time: "30 min", 
        exercises: [
            {name: "Bodyweight Squats", reps: "3×12"}, 
            {name: "Wall Push-ups", reps: "3×15"}, 
            {name: "Glute Bridge", reps: "3×12"}
        ] 
    }
];

function renderRoutinesGrid(filterCategory = "all") {
    const grid = document.getElementById("planCardsGrid");
    if (!grid) return;
    
    grid.innerHTML = "";

    const filtered = filterCategory === "all" 
        ? baseRoutinesData 
        : baseRoutinesData.filter(r => r.category.toLowerCase() === filterCategory.toLowerCase());

    filtered.forEach(routine => {
        const card = document.createElement("div");
        card.className = "routine-card-item";
        card.style.cssText = "background-color: #111115; border: 1px solid #1a1a1e; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between;";
        
        card.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 11px; font-weight: 700; background: rgba(255,85,0,0.15); color: #ff5500; padding: 4px 10px; border-radius: 20px;">${routine.difficulty}</span>
                    <span style="font-size: 12px; color: #8e8e93;">⏱️ ${routine.time}</span>
                </div>
                <h3 style="font-family: 'Anton', sans-serif; font-size: 22px; margin: 0 0 8px 0; color: #ffffff;">${routine.name}</h3>
                <p style="font-size: 13px; color: #8e8e93; line-height: 1.5; margin: 0 0 20px 0;">${routine.desc}</p>
                
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 14px; margin-bottom: 20px;">
                    <span style="font-size: 11px; font-weight: 700; color: #666; letter-spacing: 1px; display: block; margin-bottom: 8px;">EXERCISES (${routine.exercises.length})</span>
                    <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #ccc;">
                        ${routine.exercises.map(ex => `<li style="margin-bottom: 4px;">${ex.name} — <strong style="color: #ff5500;">${ex.reps}</strong></li>`).join("")}
                    </ul>
                </div>
            </div>

            <button type="button" class="btn-edit-routine" data-id="${routine.id}" style="width: 100%; background-color: #1a1a1e; color: #ffffff; border: 1px solid #333; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: background 0.2s;">
                ✎ Edit Routine
            </button>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderRoutinesGrid("all");

    const filterContainer = document.getElementById("planFilterButtons");
    if (filterContainer) {
        filterContainer.addEventListener("click", (e) => {
            const chip = e.target.closest(".filter-chip");
            if (!chip) return;

            document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            const filterValue = chip.dataset.filter;
            renderRoutinesGrid(filterValue);
        });
    }
});

document.addEventListener("click", (e) => {
    const modal = document.getElementById("routineModal");
    if (!modal) return;

    if (e.target.closest("#newRoutineModalBtn")) {
        document.getElementById("modalTitle").textContent = "NEW ROUTINE";
        document.getElementById("routineNameInput").value = "";
        document.getElementById("routineDescInput").value = "";
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    if (e.target.closest(".btn-edit-routine")) {
        const btn = e.target.closest(".btn-edit-routine");
        const routineId = btn.dataset.id;
        const found = baseRoutinesData.find(r => r.id === routineId);

        document.getElementById("modalTitle").textContent = "EDIT ROUTINE";
        if (found) {
            document.getElementById("routineNameInput").value = found.name;
            document.getElementById("routineDescInput").value = found.desc;
            document.getElementById("routineDifficultyInput").value = found.difficulty;
            document.getElementById("routineCategoryInput").value = found.category;
        }
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    if (e.target.closest("#closeModalBtn") || e.target.closest("#cancelModalBtn") || e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
});