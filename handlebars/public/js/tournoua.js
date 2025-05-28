// Fixed version of your tournament modal code
import { updateNavbarForAuth } from '/js/Actions.mjs';
import { log_in } from '/js/Actions.mjs';

let selectedSeason = null;
let currentFormType = null;

function showCustomCreatePopup(eventInfo) {
    console.log("Tournament registration triggered for:", eventInfo);
    
    fetch('/check-auth', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => {
        if (!res.ok) {
            // User is not authenticated, show login modal
            log_in((userData) => {
                // This callback runs after successful login
                console.log("Login successful, opening tournament modal");
                // Add a small delay to ensure DOM is ready
                setTimeout(() => {
                    openModal(eventInfo);
                }, 100);
            });
            return Promise.reject('Not authenticated');
        }
        return res.json();
    })
    .then(() => {
        // User is authenticated, show booking modal immediately
        openModal(eventInfo);
    })
    .catch(err => {
        if (err !== 'Not authenticated') {
            console.error('Auth check failed:', err);
        }
    });
}

// Fixed openModal function with better error handling
function openModal(season) {
    selectedSeason = season;
    console.log("Opening modal for season:", season);

    // Check if modal container exists
    const modalContainer = document.getElementById('modalContainer1');
    if (!modalContainer) {
        console.error('Modal container not found!');
        alert('Σφάλμα: Το modal δεν μπόρεσε να φορτώσει. Παρακαλώ ανανεώστε τη σελίδα.');
        return;
    }

    const modalContent = document.getElementById('modalContent1');
    if (!modalContent) {
        console.error('Modal content container not found!');
        alert('Σφάλμα: Το modal δεν μπόρεσε να φορτώσει. Παρακαλώ ανανεώστε τη σελίδα.');
        return;
    }

    fetch('/html/forma_tournoua.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Clear any existing content first
            modalContent.innerHTML = '';
            
            // Set the new content
            modalContent.innerHTML = html;

            // Set selected season in the form (optional UI indicator)
            const select = modalContent.querySelector('#tournament');
            if (select) select.value = season;

            // Show the modal
            modalContainer.style.display = 'block';

            // Initialize form components
            initializeAgeDropdown();
            attachFormSubmitListeners();

            // Setup close button
            const closeBtn = modalContent.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    modalContainer.style.display = 'none';
                };
            }

            console.log("Modal opened successfully");
        })
        .catch(error => {
            console.error('Error loading tournament form:', error);
            alert('Σφάλμα κατά τη φόρτωση της φόρμας. Παρακαλώ ανανεώστε τη σελίδα.');
        });
}

// Make function globally available
window.showCustomCreatePopup = showCustomCreatePopup;

// Function to initialize the age dropdown in the loaded form
function initializeAgeDropdown() {
    const ageSelect = document.getElementById("age-select");
    if (!ageSelect) {
        console.log("Age select not found, skipping initialization");
        return;
    }
    
    const selected = ageSelect.querySelector(".selected-option");
    const optionsContainer = ageSelect.querySelector(".options");
    const hiddenInput = ageSelect.querySelector("input");

    if (!selected || !optionsContainer || !hiddenInput) {
        console.error("Age dropdown components not found");
        return;
    }

    // Clear existing options
    optionsContainer.innerHTML = '';

    // Create age options (4-17)
    for (let i = 4; i <= 17; i++) {
        const option = document.createElement("div");
        option.classList.add("option");
        option.textContent = i;
        option.dataset.value = i;
        optionsContainer.appendChild(option);
    }

    // Add event listeners
    selected.addEventListener("click", () => {
        ageSelect.classList.toggle("open");
    });

    optionsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("option")) {
            const value = e.target.dataset.value;
            selected.textContent = value;
            hiddenInput.value = value;
            ageSelect.classList.remove("open");
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!ageSelect.contains(e.target)) {
            ageSelect.classList.remove("open");
        }
    });
}

// Fixed function to attach form submit listeners
function attachFormSubmitListeners() {
    const formMe = document.getElementById("form-me");
    const formChild = document.getElementById("form-child");

    if (formMe) {
        formMe.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleFormSubmit(e, 'me');
        });
    }

    if (formChild) {
        formChild.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleFormSubmit(e, 'child');
        });
    }
}

// Handle form submission
async function handleFormSubmit(e, formType) {
    e.preventDefault();

    // Check if user is logged in
    try {
        const authRes = await fetch('/me', { credentials: 'include' });
        const authData = await authRes.json();
        if (!authRes.ok || !authData.id) {
            alert("Πρέπει να είστε συνδεδεμένος για να κάνετε εγγραφή.");
            return;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        alert("Σφάλμα ελέγχου πιστοποίησης.");
        return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const categories = [];
    form.querySelectorAll('input[name="category"]:checked').forEach(cb => {
        categories.push(cb.value);
    });

    const notes = formData.get('notes') || '';
    let data = {
        categories,
        notes,
        season: selectedSeason,
    };

    if (formType === 'child') {
        data = {
            ...data,
            childName: formData.get('childName'),
            childSurname: formData.get('childSurname'),
            childAge: formData.get('childAge'),
            childPhone: formData.get('childPhone'),
            childEmail: formData.get('childEmail'),
            parentName: formData.get('parentName'),
            parentSurname: formData.get('parentSurname'),
            parentPhone: formData.get('parentPhone'),
            parentEmail: formData.get('parentEmail'),
        };
    } else if (formType === 'me') {
        data = {
            ...data,
            childName: formData.get('myName'),
            childSurname: formData.get('mySurname'),
            childPhone: formData.get('myPhone'),
            childEmail: formData.get('myEmail'),
        };
    } else {
        alert("Παρακαλώ επιλέξτε τύπο συμμετοχής ('Για εμένα' ή 'Για το παιδί μου').");
        return;
    }

    try {
        const response = await fetch('/api/register-tour', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errMsg = await response.text();
            alert('Σφάλμα: ' + errMsg);
            return;
        }

        const result = await response.json();
        alert(`Η εγγραφή ήταν επιτυχής! ID: ${result.id}`);
        form.reset();

        // Reset dropdown
        const ageSelect = document.getElementById("age-select");
        if (ageSelect) {
            const selected = ageSelect.querySelector(".selected-option");
            const hiddenInput = ageSelect.querySelector("input");
            if (selected) selected.textContent = "Επιλέξτε ηλικία";
            if (hiddenInput) hiddenInput.value = "";
        }

        // Close modal after successful submission
        const modalContainer = document.getElementById('modalContainer1');
        if (modalContainer) {
            modalContainer.style.display = 'none';
        }

    } catch (error) {
        console.error('Form submission error:', error);
        alert('Η αποστολή απέτυχε: ' + error.message);
    }
}

// Add showForm function for the form loaded in modal
function showForm(value) {
    const formMe = document.getElementById("form-me");
    const formChild = document.getElementById("form-child");

    if (formMe) formMe.classList.remove("active");
    if (formChild) formChild.classList.remove("active");

    if (value === "me" && formMe) {
        formMe.classList.add("active");
        currentFormType = "me";
    } else if (value === "child" && formChild) {
        formChild.classList.add("active");
        currentFormType = "child";
    }
}

// Make showForm globally available
window.showForm = showForm;

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('modalContainer1');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth state
    fetch('/me', { credentials: 'include' })
        .then(res => res.ok ? res.json() : { id: null })
        .then(data => updateNavbarForAuth(data.id))
        .catch(err => console.error('Failed to check auth state:', err));

    // Navigation event listeners
    const loadCourtsBtn = document.getElementById("load-courts");
    if (loadCourtsBtn) {
        loadCourtsBtn.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "/courts";
        });
    }

    const indexBtn = document.getElementById("index");
    if (indexBtn) {
        indexBtn.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "/";
        });
    }

    const tourBtn = document.getElementById("tour");
    if (tourBtn) {
        tourBtn.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "/tour";
        });
    }

    // Dropdown navigation
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
            }
        });
    });
});

// Simple pagination logic for future implementation
let currentPage = 0;
const rowsPerPage = 5;

function prevResults() {
    alert("Προηγούμενη σελίδα (δεν υλοποιήθηκε ακόμα)");
}

function nextResults() {
    alert("Επόμενη σελίδα (δεν υλοποιήθηκε ακόμα)");
}