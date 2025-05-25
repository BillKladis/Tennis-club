document.querySelectorAll("#connection").forEach(button => {
    button.addEventListener("click", login);
});
function loadModalCSS() {
    if (!document.querySelector("#modal-css")) {
        const link = document.createElement("link");
        link.id = "modal-css";
        link.rel = "stylesheet";
        link.href = "/css/login.css";
        document.head.appendChild(link);
    }
}
function login(event) {
    event.preventDefault(); // Prevents default link behavior

    const loginButton = event.target; // Get the clicked button
    
    // Create the modal elements
    const createModal = () => {
        loadModalCSS();  // ✅ Ensure CSS is loaded before opening the modal
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
    
        const modalContainer = document.createElement("div");
        modalContainer.className = "login-modal";
    
        modalContainer.innerHTML = `
        <link rel="stylesheet" href="/css/login.css">
            <div class="modal-header">
                <h2>Σύνδεση</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="login-form" autocomplete="off">  
                    <div class="form-group">
                        <label for="username">Όνομα Χρήστη</label>
                        <input type="text" id="username" name="username" autocomplete="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Κωδικός</label>
                        <input type="password" id="password" name="password" autocomplete="current-password" required>
                    </div>
                    <button type="submit" class="login-btn">Σύνδεση</button>
                    <a href="#" class="forgot-password">Ξέχασες τον κωδικό σου?</a>
                </form>
                <div class="signup-option">
                    <p>Ακόμα δεν είσαι μέλος? <a href="#">Εγγραφή</a></p>
                </div>
            </div>
        `;
    
        overlay.appendChild(modalContainer);
        document.body.appendChild(overlay);
    
        // Ensure modal appears smoothly
        setTimeout(() => overlay.classList.add("active"), 10);
    
        // Close modal only if clicking the background or close button
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay || event.target == document.querySelector(".close-modal")) {
                overlay.classList.remove("active");
                setTimeout(() => overlay.remove(), 300);
            }
        });
    
        // Prevent click inside modal from closing it
        modalContainer.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    
        return overlay;
    };

    // Function to close modal
    const closeModal = () => {
        const overlay = document.querySelector(".modal-overlay");
        if (overlay) {
            overlay.remove();
        }
    };

    // Open the modal
    createModal();
}
