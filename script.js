// ========================================
// DATOS DE LAS INSTALACIONES
// ========================================

const courts = {
    piscina: {
        name: "La Chorrera Municipal Pool",
        location: "La Chorrera, Panama West",
        price: 25,
        sport: "SWIMMING POOL",
        image: "imagenes/piscina.jpg",
        rating: "4.6"
    },

    volleyball: {
        name: "La Chorrera Volley Court",
        location: "La Chorrera, Panama West",
        price: 40,
        sport: "VOLLEYBALL",
        image: "imagenes/voley.webp",
        rating: "4.7"
    },

    football: {
        name: "La Chorrera Turf Pitch",
        location: "La Chorrera, Panama West",
        price: 28,
        sport: "FOOTBALL",
        image: "imagenes/football.jpg",
        rating: "4.8"
    }
};


 html

const overlay = document.getElementById("bookingOverlay");

const bookingImage = document.getElementById("bookingImage");
const bookingTitle = document.getElementById("bookingTitle");
const bookingLocation = document.getElementById("bookingLocation");
const bookingPrice = document.getElementById("bookingPrice");
const bookingSport = document.getElementById("bookingSport");

const closeModal = document.getElementById("closeModal");
const confirmButton = document.getElementById("confirmBooking");
const bookingMessage = document.getElementById("bookingMessage");

const dateOptions = document.getElementById("dateOptions");
const timeGrid = document.getElementById("timeGrid");
const thirdDay = document.getElementById("thirdDay");

let selectedCourt = null;
let selectedDay = 0;
let selectedTime = null;


// ========================================
// FECHAS
// ========================================

function getDateLabel(daysFromToday) {
    const date = new Date();

    date.setDate(date.getDate() + daysFromToday);

    return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric"
    }).toUpperCase();
}




function openBooking(courtId) {

    const court = courts[courtId];

    if (!court) return;

    selectedCourt = courtId;
    selectedDay = 0;
    selectedTime = null;

    bookingImage.src = court.image;
    bookingImage.alt = court.name;

    bookingTitle.textContent = court.name;
    bookingLocation.textContent =
        `${court.location} · ★ ${court.rating}`;

    bookingPrice.textContent = `$${court.price}`;
    bookingSport.textContent = court.sport;

    thirdDay.textContent = getDateLabel(2);

    // Reiniciar los días.
    document.querySelectorAll(".date-button").forEach(button => {
        button.classList.toggle(
            "active",
            Number(button.dataset.day) === 0
        );
    });

    // Reiniciar los horarios.
    document.querySelectorAll(".time-button").forEach(button => {
        button.classList.remove("selected");
    });

    confirmButton.disabled = true;
    confirmButton.textContent = "Select a time";

    bookingMessage.textContent = "";

    overlay.hidden = false;

    document.body.style.overflow = "hidden";

    closeModal.focus();
}




function closeBooking() {

    overlay.hidden = true;

    document.body.style.overflow = "";

    selectedCourt = null;
    selectedTime = null;
}



document.querySelectorAll(".book-button").forEach(button => {

    button.addEventListener("click", () => {

        const courtId = button.dataset.court;

        openBooking(courtId);

    });

});




closeModal.addEventListener("click", closeBooking);


// Cerrar si se pulsa fuera de la ventana.

overlay.addEventListener("click", event => {

    if (event.target === overlay) {
        closeBooking();
    }

});


// Cerrar con la tecla Escape.

document.addEventListener("keydown", event => {

    if (event.key === "Escape" && !overlay.hidden) {
        closeBooking();
    }

});


// ========================================
// SELECCIONAR DÍA
// ========================================

dateOptions.addEventListener("click", event => {

    const button = event.target.closest(".date-button");

    if (!button) return;

    selectedDay = Number(button.dataset.day);
    selectedTime = null;

    document.querySelectorAll(".date-button").forEach(dayButton => {
        dayButton.classList.toggle(
            "active",
            dayButton === button
        );
    });

    // Mostrar las fechas correspondientes.

    document.querySelectorAll(".date-button").forEach(dayButton => {

        const day = Number(dayButton.dataset.day);

        if (day === 0) {
            dayButton.textContent = "Today";
        } else if (day === 1) {
            dayButton.textContent = "Tomorrow";
        } else {
            dayButton.textContent = getDateLabel(2);
        }

    });

    // Reiniciar selección de horarios.

    document.querySelectorAll(".time-button").forEach(timeButton => {
        timeButton.classList.remove("selected");
    });

    confirmButton.disabled = true;
    confirmButton.textContent = "Select a time";

    bookingMessage.textContent = "";

});


// ========================================
// SELECCIONAR HORARIO
// ========================================

timeGrid.addEventListener("click", event => {

    const button = event.target.closest(".time-button");

    if (!button || button.disabled) return;

    selectedTime = button.textContent.trim();

    document.querySelectorAll(".time-button").forEach(timeButton => {
        timeButton.classList.toggle(
            "selected",
            timeButton === button
        );
    });

    confirmButton.disabled = false;

    confirmButton.textContent =
        `Continue · $${courts[selectedCourt].price}`;

    bookingMessage.textContent = "";

});


// ========================================
// CONFIRMAR SELECCIÓN
// ========================================

confirmButton.addEventListener("click", () => {

    if (!selectedCourt || !selectedTime) return;

    const court = courts[selectedCourt];

    const selectedDate = new Date();

    selectedDate.setDate(
        selectedDate.getDate() + selectedDay
    );

    const dateText = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short"
    });

    bookingMessage.textContent =
        `${court.name} · ${dateText} · ${selectedTime} · $${court.price}/hour. ` +
        `Your selection is ready. A real reservation system is needed to confirm availability and complete the booking.`;

});


// ========================================
// FILTRAR DEPORTES
// ========================================

document.querySelectorAll(".filter-button").forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        document.querySelectorAll(".filter-button").forEach(filterButton => {
            filterButton.classList.toggle(
                "active",
                filterButton === button
            );
        });

        document.querySelectorAll(".court-card").forEach(card => {

            const matchesFilter =
                filter === "all" ||
                card.dataset.sport === filter;

            card.classList.toggle("hidden", !matchesFilter);

        });

    });

});




