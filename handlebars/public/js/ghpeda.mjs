import { log_in } from './Actions.mjs';
import { updateNavbarForAuth } from './Actions.mjs';

fetch('/me', { credentials: 'include' })
    .then(res => res.ok ? res.json() : { id: null })
    .then(data => updateNavbarForAuth(data.id));
(() => {
    // Prevent any scroll during page load
    document.documentElement.style.scrollBehavior = 'instant';
    
    // Force scroll to top immediately when script loads
    window.scrollTo(0, 0);
    
    window.addEventListener('load', () => {
        // Force scroll again after everything is loaded
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
        
        // Reset scroll behavior after load
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = 'smooth';
        }, 100);
    });
})();


document.addEventListener('DOMContentLoaded', () => {
    const eventsBtn = document.getElementById("events");
    if (eventsBtn) {
        eventsBtn.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "/event";
        });
    }
  })

window.addEventListener("load", adjustBodyPadding);
window.addEventListener("resize", adjustBodyPadding);

function adjustBodyPadding() {
  const navbar = document.querySelector(".navbar");
  const height = navbar.offsetHeight;
  document.body.style.paddingTop = height + "px";
}


document.addEventListener("DOMContentLoaded", async() => {
    window.scrollTo(0, 0);
    const cards = document.querySelectorAll(".court-card:not(.trainer)");
    let selectedCourt = null;

    cards.forEach(card => {
      card.addEventListener("click", () => {
        // Deselect previous
        if (selectedCourt && selectedCourt !== card) {
          selectedCourt.classList.remove("selected");
        }
        // Select new
        card.classList.add("selected");
        selectedCourt = card;

        // Send only the selected court's id
        fetch("/select-court", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courts: [card.dataset.id] })
        });
      });
    });
  
    // Εναλλαγή προβολής COURTS
    
     const TrainersSection = document.getElementById("courts-section");
    
    
    // NEXT → collapse courts, show trainers
    document.getElementById("courts-next").addEventListener("click", () => {
 
  const trainers = document.getElementById("trainers-section");
  
  trainers.scrollIntoView({ behavior: "smooth" });
});
    
    document.getElementById("trainers-next").addEventListener("click", () => {
      
  
      const cal = document.getElementById("calendar-section");
      
      cal.scrollIntoView({ behavior: "smooth" });
    });
    
    // toggle trainers (θα γεμίσει αργότερα)
    
    const trainers = document.querySelectorAll(".court-card.trainer");
let selectedTrainer = null;

trainers.forEach(trainer => {
  trainer.addEventListener("click", () => {
    // Deselect previous
    if (selectedTrainer && selectedTrainer !== trainer) {
      selectedTrainer.classList.remove("selected");
    }
    // Select new
    trainer.classList.add("selected");
    selectedTrainer = trainer;


    // Send only the selected trainer's id
    fetch("/select-trainer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainers: [trainer.dataset.trainerid] })
    });
  });
});
 try {
    const trainerCards = document.querySelectorAll('.court-card.trainer');
    
    for (const card of trainerCards) {
      const trainerId = card.dataset.trainerid;
      const response = await fetch(`/trainer/${trainerId}`);
      
      if (!response.ok) throw new Error(`Failed to fetch trainer ${trainerId}`);
      
      const trainer = await response.json();
      
      // Update card content with trainer name
      const nameElement = card.querySelector('p');
      const imgElement = card.querySelector('img');
      
      if (nameElement) nameElement.textContent = trainer.name;
      if (imgElement) {
        imgElement.src = trainer.img;
        imgElement.alt = `Φωτογραφία του ${trainer.name}`;
      }
    }
  } catch (err) {
    console.error('Error loading trainer data:', err);
  }
document.querySelectorAll(".more-info").forEach(span => {
  span.addEventListener("click", async (e) => {
    e.stopPropagation();
    const id = span.dataset.id;
    
     
      console.log('Fetching trainer with ID:', id); // Debug log
      const response = await fetch(`/trainer/${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error('Failed to fetch trainer data');
      const trainer = await response.json();

      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";

      const modal = document.createElement("div");
      modal.className = "trainer-modal";

      modal.innerHTML = `
  <div class="modal-header">
    <h2>${trainer.name}</h2>
    <button class="close-modal" aria-label="Close">&times;</button>
  </div>
  <div class="modal-body profile-modal">
    <div class="trainer-profile-grid">
      <div class="trainer-image-container">
        <img src="${trainer.img}" class="trainer-photo" alt="${trainer.name}">
        <div class="trainer-rating">
          <span class="rating-label">Αξιολόγηση</span>
          <span class="rating-stars">${trainer.rating}</span>
        </div>
      </div>
      <div class="trainer-info">
        <div class="trainer-bio">
          <h3>Σχετικά</h3>
          <p>${trainer.bio}</p>
        </div>
        <div class="trainer-skills">
          <h3>Εξειδίκευση</h3>
          <ul>
            ${trainer.skills.map(skill => `
              <li>
                <span class="skill-icon">✓</span>
                <span>${skill}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      </div>
    </div>
  </div>
`;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      setTimeout(() => overlay.classList.add("active"), 10);
    
        const closeBtn = modal.querySelector('.close-modal');
      if (closeBtn) {
      closeBtn.addEventListener('click', () => {
      overlay.classList.remove("active");
      setTimeout(() => overlay.remove(), 300);
      });
    }
        modal.addEventListener("click", e => e.stopPropagation());
      });
    });
      // Add additional CSS for the delete button
  if (!document.getElementById('booking-modal-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'booking-modal-styles';
    styleSheet.textContent = `
      .trainer-modal {
    background:rgba(240, 240, 240, 0.9);
    opacity: 0.95;
    border-radius: 12px;
    width: 95%;
    max-width: 800px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .trainer-modal .modal-header {
    background:rgb(38, 160, 101);
    color: white;
    padding: 20px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .trainer-modal .modal-header h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .trainer-modal .close-modal {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 5px;
    transition: transform 0.2s;
  }

  .trainer-modal .close-modal:hover {
    transform: scale(1.2);
  }

  .trainer-profile-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 30px;
    padding: 30px;
  }

  .trainer-image-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .trainer-photo {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .trainer-rating {
    background: #f8fafc;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
  }

  .rating-label {
    display: block;
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 5px;
  }

  .rating-stars {
    font-size: 1.2rem;
    color: #eab308;
  }

  .trainer-info {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .trainer-bio h3,
  .trainer-skills h3 {
    color: #1e3a8a;
    font-size: 1.4rem;
    margin: 0 0 15px 0;
    text-decoration: none !important;
    
  }

  .trainer-bio p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #334155;
    margin: 0;
    text-decoration: none !important;
  }
  
  .trainer-skills ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  .trainer-skills li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.1rem;
    color: #334155;
  }

  .skill-icon {
    color: #22c55e;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .trainer-profile-grid {
      grid-template-columns: 1fr;
    }
  }

      .booking-modal.modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .booking-modal.modal-overlay.active {
        opacity: 1;
      }
      
      .booking-form.trainer-modal {
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
      }
      .booking-form label {
       
        color: #047857;
      }
      .booking -
      .booking-modal.active .booking-form {
        transform: translateY(0);
      }
      
      .booking-form .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      
      .booking-form .modal-header h3 {
        margin: 0;
        
        color: black;
      }
      
      
      .booking-form .form-group {
        margin-bottom: 15px;
      }
      
      .booking-form label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
      }
      
      .booking-form input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
      
      .booking-form .form-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }
      
      .booking-form .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      
      .booking-form .btn.primary {
        background-color: #047857;
        color: white;
      }
      
      .booking-form .btn.primary:hover {
        background-color: #065f46;
      }
      
      .booking-form .btn.danger {
        background-color: #dc2626;
        color: white;
      }
      
      .booking-form .btn.danger:hover {
        background-color: #b91c1c;
      }
      
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1100;
      }
      
      .notification {
        padding: 12px 20px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        color: white;
      }
      
      .notification.show {
        transform: translateX(0);
      }
      
      .notification.success {
        background-color: #047857;
      }
      
      .notification.error {
        background-color: #dc2626;
      }
      
      .notification.info {
        background-color: #2563eb;
      }
    .modal-header .close-modal {
    position: absolute;
    right: 20px;
    top: 20px;
    background: none;
    border: none;
    font-size: 28px;
    color: white;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .modal-header .close-modal:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }

  .modal-header {
    position: relative;
    padding: 20px 60px 20px 30px;
  }
   .trainer-bio {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 10px;
  scrollbar-width: thin;
  text-decoration: unset !important;
}

  .trainer-bio::-webkit-scrollbar {
    width: 6px;
  }

  .trainer-bio::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
  }

  .trainer-bio::-webkit-scrollbar-track {
    background-color: #f1f5f9;
  }

  .trainer-skills {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
  }

  .trainer-skills ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    max-width: 100%;
  }

  .trainer-skills li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    color: #334155;
    background-color: #f1f5f9;
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    white-space: nowrap;
    height: 32px;
    flex: 0 1 auto;
    max-width: calc(100% - 16px);
  }

 @media (max-width: 768px) {
  .trainer-skills ul {
    gap: 6px;
  }
  
  .trainer-skills li {
    font-size: 0.875rem;
    padding: 4px 10px;
    height: 28px;
  }
 }
    `;
    document.head.appendChild(styleSheet);
  }
  
  // Create notification container if it doesn't exist
  if (!document.querySelector('.notification-container')) {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }// Existing calendar initialization
  if (document.getElementById("calendar")) {
    console.log("Initializing calendar..."); // Debug log

    const calendar = new tui.Calendar('#calendar', {
      defaultView: 'month',
      month: {
        startDayOfWeek: 1,
        narrowWeekend: false,
        visibleWeeksCount: null,
        isAlways6Weeks: false,
        workweek: false,
        daynames: ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ'],
        gridSelection: {
          enableDblClick: true,
          enableClick: true,
          selectable: true
        }
      },
      gridSelection: true,
      taskView: false,
      scheduleView: ['time'],
      useFormPopup: false,
      useDetailPopup: false, // Changed to false to use our custom popup
      useCreationPopup: false,
      isReadOnly: false,
      
      template: {
  time: function(schedule) {
    const pad = n => n.toString().padStart(2, '0');
    const start = `${pad(schedule.start.getHours())}:${pad(schedule.start.getMinutes())}`;
    const end = `${pad(schedule.end.getHours())}:${pad(schedule.end.getMinutes())}`;
    return `<strong>${start} - ${end}</strong>`;
  },
 
  }
    });
    

    fetch('/events')
    .then(res => res.json())
    .then(async events =>  {
      console.log('Loading saved events:', events);
      await calendar.createEvents(events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
      
    })
    .catch(err => {
      console.error('Error loading events:', err);
      showNotification('Σφάλμα φόρτωσης κρατήσεων', 'error');
    });

    // Replace the existing click handler with this:
    document.addEventListener('click', function(e) {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl.contains(e.target) || e.target.closest('.toastui-calendar-daygrid-cell')) {
        // Clear any grid selection state
        calendar.clearGridSelections();
        
        // Also remove any remaining selection elements
        setTimeout(() => {
            document.querySelectorAll('.toastui-calendar-grid-selection')
                .forEach(el => el.remove());
        }, 100);
    }
    })

    // REMOVE all other event handlers and ONLY use these:
    calendar.on('selectDateTime', (event) => {
      console.log('selectDateTime fired:', event);
      
      showCustomCreatePopup(event);
    });

    calendar.on('clickSchedule', (event) => {
      console.log('clickSchedule fired:', event);
      
      if (event.schedule) {
        showEditEventPopup(event.schedule);
      }
    });

    calendar.on('beforeCreateSchedule', (event) => {
      console.log('beforeCreateSchedule fired:', event);
      event.preventDefault();
      showCustomCreatePopup(event);
    });
   // This must be outside any DOMContentLoaded or calendar block!
    // Place this ONCE, OUTSIDE any DOMContentLoaded or other block, at the end of your file:

    // Test event
    calendar.createEvents([{
      id: '1',
      calendarId: '1',
      title: 'Test Event',
      category: 'time',
      start: new Date(),
      end: new Date(Date.now() + 3600000)
    }]);
    
    console.log("Calendar initialized"); // Debug log
    
  
  
    // Create a custom popup for creating new events
    function showCustomCreatePopup(eventInfo) {
    // Create overlay
      fetch('/check-auth', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => {
        if (!res.ok) {
            // User is not authenticated, show login modal
            log_in(() => {
                // This callback runs after successful login
                createBookingModal(eventInfo);
            });
            return Promise.reject('Not authenticated');
        }
        return res.json();
    })
    .then(() => {
        // User is authenticated, show booking modal
        createBookingModal(eventInfo);
    })
    .catch(err => {
        if (err !== 'Not authenticated') {
            console.error('Auth check failed:', err);
        }
    });
}
    function createBookingModal(eventInfo) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay booking-modal";
    
    // Format the selected date - FIXED: removed .toDate()
    const dateStr = eventInfo.start.toLocaleDateString('el-GR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Rest of your modal creation code...
    const modal = document.createElement("div");
    modal.className = "trainer-modal booking-form";
    
    modal.innerHTML = `
      <div class="modal-header">
        <h3>Νέα Κράτηση - ${dateStr}</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="booking-form">
          <div class="form-group">
            <label for="booking-title">Περιγραφή:</label>
            <input type="text" id="booking-title" required placeholder="π.χ. Προπόνηση τένις">
          </div>
          
          <div class="form-group">
            <label for="booking-time-start">Ώρα έναρξης:</label>
            <input type="time" id="booking-time-start" required value="09:00">
          </div>
          
          <div class="form-group">
            <label for="booking-time-end">Ώρα λήξης:</label>
            <input type="time" id="booking-time-end" required value="10:00">
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn primary">Κράτηση</button>
          </div>
        </form>
      </div>
    `;
    
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    // After you create the modal and append it to the overlay
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
    closeBtn.addEventListener('click', () => {
    overlay.classList.remove("active");
    setTimeout(() => overlay.remove(), 300);
      });
    }
    // Show modal with animation
    setTimeout(() => overlay.classList.add("active"), 10);
    
    // Handle form submission
    const form = modal.querySelector("#booking-form");
    form.addEventListener("submit", function(e) {
    e.preventDefault();
  
    // Get form values
    const title = document.getElementById("booking-title").value;
    const timeStart = document.getElementById("booking-time-start").value;
    const timeEnd = document.getElementById("booking-time-end").value;
  
    // Create date objects for start and end - FIXED: removed .toDate()
    const startDate = new Date(eventInfo.start);  // Changed this line
    const endDate = new Date(startDate);
    
    // Set hours and minutes from the time inputs
    const [startHours, startMinutes] = timeStart.split(':').map(Number);
    const [endHours, endMinutes] = timeEnd.split(':').map(Number);
    
    startDate.setHours(startHours, startMinutes, 0);
    endDate.setHours(endHours, endMinutes, 0);
  
    // Create the schedule
    const schedule = {
      id: String(Date.now()),
      calendarId: '1',
      title: title,
      category: 'time',
      start: startDate,
      end: endDate,
      isAllDay: false,
      bgColor: "red"
    };
      
      // Create the event in the calendar
      fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...schedule,
          start: schedule.start.toISOString(),
          end: schedule.end.toISOString()
        })
      })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
    if (!ok) throw new Error(data.message);
    // επιτυχία
    })
      .then(data => {
        // Only add to calendar if server accepted
        calendar.createEvents([schedule]);
        showNotification("Η κράτηση ολοκληρώθηκε με επιτυχία!", "success");
      })
      .catch(err => {
    console.error("❌ Σφάλμα κατά την αποθήκευση:", err);
    showNotification(err.message, "error");
    } );
      
      // Close the modal
      overlay.classList.remove("active");
      setTimeout(() => overlay.remove(), 300);
    });
    
    // Close modal when clicking the X or outside
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("close-modal")) {
        overlay.classList.remove("active");
        setTimeout(() => overlay.remove(), 300);
      }
    });
    
    // Prevent clicks inside modal from closing it
    modal.addEventListener("click", e => e.stopPropagation());
  }
  

  
  // Add CSS for the custom booking modal
  if (!document.getElementById('booking-modal-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'booking-modal-styles';
    styleSheet.textContent = `
      .booking-modal.modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .booking-modal.modal-overlay.active {
        opacity: 1;
      }
      
      .booking-form.trainer-modal {
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
      }
      
      .booking-modal.active .booking-form {
        transform: translateY(0);
      }
      
      .booking-form .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      
      .booking-form .modal-header h3 {
        margin: 0;
        font-size: 1.2rem;
        color: #047857;
      }
      
      .booking-form .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      }
      
      .booking-form .form-group {
        margin-bottom: 15px;
      }
      
      .booking-form label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
      }
      
      .booking-form input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
      
      .booking-form .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      
      .booking-form .btn.primary {
        background-color: #047857;
        color: white;
      }
      
      .booking-form .btn.primary:hover {
        background-color: #065f46;
      }
      
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1100;
      }
      
      .notification {
        padding: 12px 20px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        color: white;
      }
      
      .notification.show {
        transform: translateX(0);
      }
      
      .notification.success {
        background-color: #047857;
      }
      
      .notification.error {
        background-color: #dc2626;
      }
      
      .notification.info {
        background-color: #2563eb;
      }
    `;
    document.head.appendChild(styleSheet);
  }
  
  // Create notification container if it doesn't exist
  if (!document.querySelector('.notification-container')) {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  // Handle clicking on an empty day cell - this is the main entry point for our custom flow
  
  
  function showEditEventPopup(schedule) {
    // Create overlay
    console.log("Editing schedule:", schedule);
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay booking-modal";
    
    // Format dates
    const startDate = new Date(schedule.start);
    const endDate = new Date(schedule.end);
    
    const dateStr = startDate.toLocaleDateString('el-GR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format times (HH:MM)
    const formatTime = (date) => {
      return date.toTimeString().substring(0, 5);
    };
    
    // Create the modal with a form
    const modal = document.createElement("div");
    modal.className = "trainer-modal booking-form";
    
    modal.innerHTML = `
      <div class="modal-header">
        <h3>Επεξεργασία Κράτησης - ${dateStr}</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="edit-booking-form">
          <div class="form-group">
            <label for="edit-booking-title">Περιγραφή:</label>
            <input type="text" id="edit-booking-title" required value="${schedule.title}">
          </div>
          
          <div class="form-group">
            <label for="edit-booking-time-start">Ώρα έναρξης:</label>
            <input type="time" id="edit-booking-time-start" required value="${formatTime(startDate)}">
          </div>
          
          <div class="form-group">
            <label for="edit-booking-time-end">Ώρα λήξης:</label>
            <input type="time" id="edit-booking-time-end" required value="${formatTime(endDate)}">
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn primary">Αποθήκευση</button>
            <button type="button" id="delete-booking" class="btn danger">Διαγραφή</button>
          </div>
        </form>
      </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    // After you create the modal and append it to the overlay
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
    closeBtn.addEventListener('click', () => {
    overlay.classList.remove("active");
    setTimeout(() => overlay.remove(), 300);
  });
  
  }
    // Show modal with animation
    setTimeout(() => overlay.classList.add("active"), 10);
    
    // Handle form submission for update
    const form = modal.querySelector("#edit-booking-form");
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      
      // Get form values
      const title = document.getElementById("edit-booking-title").value;
      const timeStart = document.getElementById("edit-booking-time-start").value;
      const timeEnd = document.getElementById("edit-booking-time-end").value;
      
      // Create date objects for start and end
      const startDateNew = new Date(startDate);
      const endDateNew = new Date(endDate);
      
      // Set hours and minutes from the time inputs
      const [startHours, startMinutes] = timeStart.split(':').map(Number);
      const [endHours, endMinutes] = timeEnd.split(':').map(Number);
      
      startDateNew.setHours(startHours, startMinutes, 0);
      endDateNew.setHours(endHours, endMinutes, 0);
      
      // Create the changes object
      const changes = {
        title: title,
        start: startDateNew,
        end: endDateNew
      };
      
      // Update the event in the calendar
      calendar.updateSchedule(schedule.id, schedule.calendarId, changes);
      
      // Send to server
      fetch('/update-booking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: schedule.id,
          calendarId: schedule.calendarId,
          ...changes,
          start: changes.start.toISOString(),
          end: changes.end.toISOString()
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("✅ Η κράτηση ενημερώθηκε:", data);
        showNotification("Η κράτηση ενημερώθηκε με επιτυχία!", "success");
      })
      .catch(err => {
        console.error("❌ Σφάλμα κατά την ενημέρωση:", err);
        showNotification("Η ενημέρωση απέτυχε. Παρακαλώ δοκιμάστε ξανά.", "error");
        // Revert to original schedule if server update fails
        calendar.updateSchedule(schedule.id, schedule.calendarId, schedule);
      });
      
      // Close the modal
      overlay.classList.remove("active");
      setTimeout(() => overlay.remove(), 300);
    });
    
    // Handle delete button
    const deleteBtn = document.getElementById("delete-booking");
    deleteBtn.addEventListener("click", function() {
      if (confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την κράτηση;")) {
        // Delete from calendar
        calendar.deleteSchedule(schedule.id, schedule.calendarId);
        
        // Send delete request to server
        fetch('/delete-booking', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: schedule.id })
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Server returned ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("✅ Η κράτηση διαγράφηκε:", data);
          showNotification("Η κράτηση διαγράφηκε με επιτυχία!", "success");
        })
        .catch(err => {
          console.error("❌ Σφάλμα κατά την διαγραφή:", err);
          showNotification("Η διαγραφή απέτυχε. Παρακαλώ δοκιμάστε ξανά.", "error");
          // Add the event back if server delete fails
          calendar.createEvents([schedule]);
        });
        
        // Close the modal
        overlay.classList.remove("active");
        setTimeout(() => overlay.remove(), 300);
      }
    });
    
    // Close modal when clicking the X or outside
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("close-modal")) {
        overlay.classList.remove("active");
        setTimeout(() => overlay.remove(), 300);
      }
    });
    
    // Prevent clicks inside modal from closing it
    modal.addEventListener("click", e => e.stopPropagation());
    
  }
  
  // Helper function for notifications
  function showNotification(message, type = "info") {
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
  
  } else {
    console.error("Calendar element not found!"); // Debug log
  }
  
})
document.addEventListener('mousedown', function(e) {
  document.querySelectorAll('.toastui-calendar-see-more-container').forEach(popup => {
    // Only close if click is outside popup AND not on a "more" button
    if (
      !popup.contains(e.target) &&
      !e.target.closest('.toastui-calendar-more-btn')
    ) {
      popup.remove();
    }
  });
});