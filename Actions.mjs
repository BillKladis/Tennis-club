let currentUserId = null; // Store user login state

fetch('/me', { credentials: 'include' })
    .then(res => res.ok ? res.json() : { id: null })
    .then(data => {
        currentUserId = data.id;
        updateNavbarForAuth(data.id);
    });

document.getElementById("load-courts").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/courts";
});

// Handle connection button click
document.getElementById("connection").addEventListener("click", (e) => {
    e.preventDefault();
    if (currentUserId) {
        // Logged in — log out
        fetch('/logout', { method: 'POST', credentials: 'include' })
            .then(() => {
                currentUserId = null;
                updateNavbarForAuth(currentUserId);
            });
    } else {
        // Not logged in — show login modal
        log_in((userData) => {
            // After login, update state and UI
            currentUserId = userData.id;
            updateNavbarForAuth(currentUserId);
        });
    }
});

// Handle apply button clicks (for tmhmata forms)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleApplyClick();
        });
    });
});

function handleApplyClick() {
    if (currentUserId) {
        // User is logged in, open the tmhmata form
        openTmhmataModal();
    } else {
        // User not logged in, show login modal first
        log_in((userData) => {
            // After successful login, update state and open the form
            currentUserId = userData.id;
            updateNavbarForAuth(currentUserId);
            
            // Now open the tmhmata form
            openTmhmataModal();
        });
    }
}

function openTmhmataModal() {
    // Wait for the function to be available
    if (typeof window.openModalTmhmata === 'function') {
        window.openModalTmhmata();
    } else {
        // If not immediately available, wait a bit and try again
        setTimeout(() => {
            if (typeof window.openModalTmhmata === 'function') {
                window.openModalTmhmata();
            } else {
                console.error('openModalTmhmata function still not found after waiting');
                alert('Σφάλμα: Η φόρμα δεν μπόρεσε να φορτώσει. Παρακαλώ ανανεώστε τη σελίδα.');
            }
        }, 100);
    }
}
  
function loadModalCSS() {
    if (!document.querySelector("#modal-css")) {
        const link = document.createElement("link");
        link.id = "modal-css";
        link.rel = "stylesheet";
        link.href = "log_in.css";  // Load your modal styles
        document.head.appendChild(link);
    }
}

export function updateNavbarForAuth(userId) {
    const connBtn = document.getElementById("connection");
    if (!connBtn) return;
    
    // Remove any existing event listeners by cloning the button
    const newConnBtn = connBtn.cloneNode(true);
    connBtn.parentNode.replaceChild(newConnBtn, connBtn);
    
    if (userId) {
        newConnBtn.textContent = "Έξοδος";
        newConnBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fetch('/logout', { method: 'POST', credentials: 'include' })
                .then(() => window.location.reload());
        });
    } else {
        newConnBtn.textContent = "Σύνδεση";
        newConnBtn.addEventListener('click', function(e) {
            e.preventDefault();
            log_in();
        });
    }
}

export function log_in(onSuccess) {
    // Check if modal already exists and remove it
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    loadModalCSS();

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modalContainer = document.createElement("div");
    modalContainer.className = "login-modal";

    modalContainer.innerHTML = `
        <div class="modal-header">
            <h2>Σύνδεση</h2>
            <button class="close-modal" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
            <form id="login-form" autocomplete="off">  
                <div class="form-group">
                    <label for="username">Όνομα Χρήστη</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Κωδικός</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="login-btn">Σύνδεση</button>
            </form>
            <div class="register-section">
                <p>Δεν έχετε λογαριασμό;</p>
                <button id="show-register" class="register-btn">Εγγραφή</button>
            </div>
            <div id="register-form-container"></div>
        </div>
    `;

    // Add the register form to its container
    const registerFormHTML = `
        <form id="register-form" style="display: none;">
            <div class="form-group">
                <label for="reg-username">Όνομα Χρήστη</label>
                <input type="text" id="reg-username" name="username" required>
            </div>
            <div class="form-group">
                <label for="reg-email">Email</label>
                <input type="email" id="reg-email" name="email" required>
            </div>
            <div class="form-group">
                <label for="reg-password">Κωδικός</label>
                <input type="password" id="reg-password" name="password" required>
            </div>
            <div class="form-group">
                <label for="reg-password-confirm">Επιβεβαίωση Κωδικού</label>
                <input type="password" id="reg-password-confirm" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="register-btn">Εγγραφή</button>
                <button type="button" class="back-to-login">Επιστροφή στη Σύνδεση</button>
            </div>
            <div class="login-section" style="margin-top: 15px; text-align: center;">
                <p>Έχετε ήδη λογαριασμό;</p>
                <button type="button" class="switch-to-login">Σύνδεση</button>
            </div>
        </form>
    `;

    overlay.appendChild(modalContainer);
    document.body.appendChild(overlay);
    
    // Add register form to the container
    modalContainer.querySelector("#register-form-container").innerHTML = registerFormHTML;

    // Get references to all elements AFTER they've been added to the DOM
    const loginForm = modalContainer.querySelector("#login-form");
    const registerFormElement = modalContainer.querySelector("#register-form");
    const registerSection = modalContainer.querySelector(".register-section");

    // Show modal with animation
    setTimeout(() => overlay.classList.add("active"), 10);

    // Close button functionality
    let isClosing = false;
    const closeModal = () => {
        if (isClosing) return; // Prevent multiple calls
        isClosing = true;
        
        if (overlay && overlay.parentNode) {
            overlay.classList.remove("active");
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.remove();
                }
            }, 300);
        }
    };

    modalContainer.querySelector(".close-modal").addEventListener("click", closeModal);

    // Handle form submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        try {
            const loginRes = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            if (!loginRes.ok) {
                throw new Error("Λάθος στοιχεία!");
            }

            // Login successful - close modal immediately
            closeModal();

            // Fetch updated user data
            const userRes = await fetch('/me', { credentials: 'include' });
            const userData = userRes.ok ? await userRes.json() : { id: null };
            
            // Update global state and UI
            currentUserId = userData.id;
            updateNavbarForAuth(userData.id);
            
            // Call success callback if provided
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(userData);
            }

        } catch (err) {
            alert(err.message);
        }
    });

    // Show register form when button is clicked
    modalContainer.querySelector('#show-register').addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerFormElement.style.display = 'block';
        registerSection.style.display = 'none';
    });

    // Function to switch back to login form
    function switchToLogin() {
        loginForm.style.display = 'block';
        registerFormElement.style.display = 'none';
        registerSection.style.display = 'block';
    }

    // Add both ways to return to login form
    modalContainer.querySelector('.back-to-login').addEventListener('click', switchToLogin);
    modalContainer.querySelector('.switch-to-login').addEventListener('click', switchToLogin);

    // Update register form submission to include email
    registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = registerFormElement.querySelector('#reg-username').value;
        const email = registerFormElement.querySelector('#reg-email').value;
        const password = registerFormElement.querySelector('#reg-password').value;
        const confirmPassword = registerFormElement.querySelector('#reg-password-confirm').value;

        if (password !== confirmPassword) {
            alert('Οι κωδικοί δεν ταιριάζουν!');
            return;
        }

        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        .then(res => {
            if (!res.ok) throw new Error('Η εγγραφή απέτυχε');
            return res.json();
        })
        .then(data => {
            alert('Επιτυχής εγγραφή! Παρακαλώ συνδεθείτε.');
            switchToLogin();
        })
        .catch(err => {
            alert(err.message);
        });
    });

    // Stop propagation of clicks inside the modal
    modalContainer.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Close on overlay click
    overlay.addEventListener("click", closeModal);

    return overlay; // Return the overlay element
}
export function showNotification(message, type = "info") {
    // Find or create notification container
    let container = document.querySelector(".notification-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "notification-container";
      document.body.appendChild(container);
    }
    
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Add show class after a small delay for animation
    setTimeout(() => {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }, 10);
    
  }