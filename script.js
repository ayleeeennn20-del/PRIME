
// ============================================
// PRIME - SISTEMA DE RESERVAS
// ============================================

// Elementos del menú

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


// Horarios disponibles para la demostración

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


// Datos de la reserva seleccionada

let selectedCourt = null;
let selectedDate = null;
let selectedTime = null;


// ============================================
// ABRIR EL MENÚ DESDE CADA TARJETA
// ============================================

document.querySelectorAll(".tarjeta").forEach((card) => {

    const bookButton = card.querySelector(".book-btn");

    if (!bookButton) return;

    bookButton.addEventListener("click", () => {

        const image = card.querySelector(".court-image img");
        const title = card.querySelector(".court-info h3");
        const location = card.querySelector(".court-info .location");
        const rating = card.querySelector(".rating");
        const price = card.querySelector(".price");

        const imagePath = image.getAttribute("src");
        const ratingText = rating.textContent.replace("★", "").trim();

        // Obtener los datos de la cancha

        selectedCourt = {
            name: title.textContent.trim(),
            location: location.textContent.trim(),
            image: imagePath,
            rating: ratingText,
            price: Number(price.textContent.replace("$", "").trim()),
            sport: getSportName(title.textContent)
        };

        // Mostrar los datos en el menú

        bookingImage.src = selectedCourt.image;
        bookingImage.alt = selectedCourt.name;

        bookingTitle.textContent = selectedCourt.name;
        bookingLocation.textContent = selectedCourt.location;
        bookingRating.textContent = selectedCourt.rating;

        bookingPrice.textContent = "$" + selectedCourt.price;
        bookingSport.textContent = selectedCourt.sport;

        // Preparar las fechas y los horarios

        createDateButtons();
        selectedDate = null;
        selectedTime = null;

        bookingTimes.innerHTML = "";
        bookingMessage.textContent = "";
        bookingMessage.classList.remove("visible");

        selectTimeBtn.disabled = true;
        selectTimeBtn.textContent = "Select a time slot";

        // Abrir el menú

        bookingOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        closeModal.focus();
    });

});


// ============================================
// IDENTIFICAR EL DEPORTE
// ============================================

function getSportName(courtName) {

    const name = courtName.toLowerCase();

    if (name.includes("pool")) {
        return "SWIMMING POOL";
    }

    if (name.includes("volley")) {
        return "VOLLEYBALL";
    }

    if (name.includes("turf") || name.includes("football")) {
        return "FOOTBALL";
    }

    return "SPORTS COURT";
}


// ============================================
// CREAR LAS FECHAS
// ============================================

function getLocalDate(daysFromToday) {

    const date = new Date();

    // Utilizamos la fecha local del navegador.
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

    bookingDates.innerHTML = "";

    const dateOptions = [
        { label: "Today", offset: 0 },
        { label: "Tomorrow", offset: 1 },
        {
            label: getLocalDate(2).toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric"
            }),
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

            // Activar la fecha elegida

            bookingDates.querySelectorAll("button").forEach((dateButton) => {
                dateButton.classList.remove("active");
            });

            button.classList.add("active");

            // Crear los horarios correspondientes

            createTimeButtons();

            bookingMessage.textContent = "";
            bookingMessage.classList.remove("visible");

            selectTimeBtn.disabled = true;
            selectTimeBtn.textContent = "Select a time slot";
        });

        bookingDates.appendChild(button);

        // Seleccionar automáticamente Today

        if (index === 0) {
            button.click();
        }

    });

}


// ============================================
// CREAR LOS HORARIOS
// ============================================

function createTimeButtons() {

    bookingTimes.innerHTML = "";

    timeSlots.forEach((slot) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "booking-time-btn";
        button.textContent = slot.label;

        // Demostración: 10 AM, 1 PM y 4 PM
        // aparecen como horarios no disponibles.

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

                // Quitar la selección anterior

                bookingTimes.querySelectorAll("button").forEach((timeButton) => {
                    timeButton.classList.remove("selected");
                });

                // Marcar el horario seleccionado

                button.classList.add("selected");

                selectTimeBtn.disabled = false;

                selectTimeBtn.textContent =
                    `Continue — ${slot.label}`;

                bookingMessage.textContent = "";
                bookingMessage.classList.remove("visible");

            });

        }

        bookingTimes.appendChild(button);

    });

}


// ============================================
// CONTINUAR CON LA RESERVA
// ============================================


selectTimeBtn.addEventListener("click", () => {

    // Comprobar que se eligieron la cancha, la fecha y el horario.
    if (!selectedCourt || !selectedDate || !selectedTime) {
        bookingMessage.textContent =
            "Please select a date and time first.";

        bookingMessage.classList.add("visible");
        return;
    }

    // Guardar temporalmente la reserva.
    const pendingBooking = {
        name: selectedCourt.name,
        location: selectedCourt.location,
        price: selectedCourt.price,
        sport: selectedCourt.sport,
        date: formatDate(selectedDate),
        time: selectedTime.label
    };

    sessionStorage.setItem(
        "primePendingBooking",
        JSON.stringify(pendingBooking)
    );

    // Cerrar el menú de reserva.
    bookingOverlay.classList.remove("active");
    document.body.style.overflow = "";

    // Mostrar la sección SIGN IN.
    const accountPage = document.getElementById("accountPage");

    if (accountPage) {
        accountPage.hidden = false;

        accountPage.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        console.error(
            "No se encontró la sección #accountPage en index.html"
        );
    }

});


 
// ============================================
// CERRAR EL MENÚ
// ============================================

function closeBookingModal() {
    bookingOverlay.classList.remove("active");
    document.body.style.overflow = "";

    selectedCourt = null;
    selectedDate = null;
    selectedTime = null;
}
    

const closeButton = document.querySelector(".close-modal"); if (closeButton) { closeButton.onclick = function () { bookingOverlay.classList.remove("active"); document.body.style.overflow = ""; }; }


// Cerrar al hacer clic fuera de la ventana

bookingOverlay.addEventListener("click", (event) => {

    if (event.target === bookingOverlay) {
        closeBookingModal();
    }

});


// Cerrar con Escape

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        bookingOverlay.classList.contains("active")
    ) {
        closeBookingModal();
    }

});
// ============================================
// VOLVER A COURTS
// ============================================
sessionStorage.removeItem("primeCurrentPage");
const backToCourtsButton =
    document.getElementById("backToCourts");

const accountPageElement =
    document.getElementById("accountPage");

const courtsSection =
    document.getElementById("Courts");

if (backToCourtsButton) {

    backToCourtsButton.addEventListener("click", () => {

        // Ocultar la pantalla de cuenta.

        if (accountPageElement) {
            accountPageElement.hidden = true;
        }

        // Cerrar el modal por seguridad.

        if (bookingOverlay) {
            bookingOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";

        // Volver a la sección de canchas.

        if (courtsSection) {

            courtsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

}
// ============================================
// SIGN IN / CREATE ACCOUNT
// ============================================

const accountForm = document.getElementById("accountForm");
const accountHeading = document.getElementById("accountHeading");
const accountSubmit = document.getElementById("accountSubmit");
const accountSwitchText = document.getElementById("accountSwitchText");
const switchAccountMode = document.getElementById("switchAccountMode");
const accountFeedback = document.getElementById("accountFeedback");
const accountPassword = document.getElementById("accountPassword");

let accountMode = "signin";


// Cambiar entre SIGN IN y CREATE ACCOUNT.

switchAccountMode.addEventListener("click", () => {

    accountFeedback.textContent = "";
    accountFeedback.classList.remove("error");

    if (accountMode === "signin") {

        accountMode = "signup";

        accountHeading.textContent = "CREATE ACCOUNT";
        accountSubmit.textContent = "CREATE ACCOUNT";

        accountPassword.autocomplete = "new-password";

        accountSwitchText.firstChild.textContent =
            "Already have an account? ";

        switchAccountMode.textContent = "Sign in";

        accountPassword.minLength = 8;

    } else {

        accountMode = "signin";

        accountHeading.textContent = "SIGN IN";
        accountSubmit.textContent = "SIGN IN";

        accountPassword.autocomplete = "current-password";

        accountSwitchText.firstChild.textContent =
            "Don't have an account? ";

        switchAccountMode.textContent = "Create one";

    }

});


// Mostrar u ocultar contraseña.

document.getElementById("togglePassword").addEventListener(
    "click",
    () => {

        const isPassword =
            accountPassword.type === "password";

        accountPassword.type =
            isPassword ? "text" : "password";

        document.getElementById("togglePassword").setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );

    }
);


// Validar el formulario.

accountForm.addEventListener("submit", (event) => {

    event.preventDefault();

    accountFeedback.classList.remove("error");

    const email =
        document.getElementById("accountEmail").value.trim();

    const password = accountPassword.value;

    if (!email || !password) {

        accountFeedback.textContent =
            "Please enter your email and password.";

        accountFeedback.classList.add("error");
        return;

    }

    if (password.length < 8) {

        accountFeedback.textContent =
            "Your password must contain at least 8 characters.";

        accountFeedback.classList.add("error");
        return;

    }

    if (accountMode === "signin") {

        accountFeedback.textContent =
            "The form is valid, but sign-in authentication has not been configured yet.";

    } else {

        accountFeedback.textContent =
            "The form is valid, but account creation has not been configured yet.";

    }

});


// Recuperación de contraseña.

document.getElementById("forgotPassword").addEventListener(
    "click",
    () => {

        accountFeedback.classList.remove("error");

        accountFeedback.textContent =
            "Password recovery will be available when authentication is configured.";

    }
);


// Los botones sociales necesitan autenticación externa.

document.getElementById("googleButton").addEventListener(
    "click",
    () => {

        accountFeedback.classList.add("error");

        accountFeedback.textContent =
            "Google sign-in has not been configured yet.";

    }
);

document.getElementById("appleButton").addEventListener(
    "click",
    () => {

        accountFeedback.classList.add("error");

        accountFeedback.textContent =
            "Apple sign-in has not been configured yet.";

    }
);


// Abrir y cerrar las preguntas frecuentes.

document.querySelectorAll(".faq-question").forEach((button) => {

    button.addEventListener("click", () => {

        const item = button.closest(".faq-item");

        item.classList.toggle("open");

    });

});
// Restaurar la pantalla actual al recargar.

if (sessionStorage.getItem("primeCurrentPage") === "account") {
    const accountPage = document.getElementById("accountPage");

    if (accountPage) {
        accountPage.hidden = false;
    }
}