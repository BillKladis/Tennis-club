import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'fs/promises';
import dotenv from 'dotenv';
import { sessionMiddleware } from './app-setup/app-setup-session.mjs';
import * as loginController from './controllers/login.mjs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app=express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let selectedCourts = [];  // Κρατάμε λίστα
let selectedTrainers = [];
app.use(express.static(path.join(__dirname, 'public')));

// Ρύθμιση Handlebars για .hbs αρχεία
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// Use session middleware here - BEFORE your routes
app.use(sessionMiddleware);

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Αρχική', isHome: true, extraCss: 'index.css' }));
app.get('/ghpeda', (req, res) => res.render('ghpeda', { title: 'Γήπεδα', isGhpeda: true, extraCss: 'ghpeda.css', extraScript: 'ghpeda.mjs', defer: true }));
app.get('/tmimata', (req, res) => res.render('tmimata', { title: 'Τμήματα', isTmimata: true, extraCss: 'tmimata.css' }));
app.get('/tournoua', (req, res) => res.render('tournoua', { title: 'Τουρνουά', isTournoua: true, extraCss: 'tournoua.css',extraScript: 'tournoua.js', defer: true }));
app.get('/anakoinoseis', (req, res) => {res.render('anakoinoseis', { title: 'Ανακοινώσεις', isAnakoinoseis: true, extraCss: 'anakoinoseis.css', extraScript: 'anakoinoseis.mjs', defer: true });});
app.get('/epikoinonia', (req, res) => res.render('epikoinonia', { title: 'Επικοινωνία', isEpikoinonia: true, extraCss: 'epikoinonia.css' }));
//---------------------posts&gets
app.get('/trainer/:id', async (req, res) => {
  try {
    console.log("abc")
    const model = await import('./model/better-sqlite.mjs');
    console.log("def")
    console.log('Fetching trainer with ID:', req.params.id);
    const trainer = await model.getTrainerById(req.params.id);
    console.log("trainer")
    if (!trainer) {
      res.status(404).json({ error: 'Trainer not found' });
      return;
    }
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/events/:category', async (req, res) => {
  try {
      const model = await import('./model/better-sqlite.mjs');
      const events = model.getEventsByCategory(req.params.category);
      res.json(events);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
app.post('/api/register-tour', loginController.checkAuthenticated, async (req, res) => {
  try {
    const formData = req.body;
    const model = await import('./model/better-sqlite.mjs');
    const insertedId = model.insertRegistration(formData);

    res.json({ id: insertedId });
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message || 'Failed to insert registration');
  }
});
app.post('/book', loginController.checkAuthenticated, async (req, res) => {
  try {
    const model = await import('./model/better-sqlite.mjs');
    // Add court and trainer to the booking object
    const booking = {
      ...req.body,
      court: selectedCourts[0] || null,      // Use the first selected court
      trainer: selectedTrainers[0] || null   // Use the first selected trainer
    };
    await model.addSchedule(booking);
    res.status(200).json({ message: "Η κράτηση αποθηκεύτηκε." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.get('/me', (req, res) => {
  if (req.session.loggedUserId) {
      // You can expand this to return more user info if needed
      res.json({ id: req.session.loggedUserId });
  } else {
      res.status(401).json({ id: null });
  }
});
app.post("/select-court", (req, res) => {
  selectedCourts = req.body.courts;  // Παίρνουμε ολόκληρη τη λίστα
  console.log("Επιλεγμένα γήπεδα:", selectedCourts);
  res.status(200).json({ message: "Επιλογές ενημερώθηκαν." });
});
app.post("/select-trainer", (req, res) => {
  selectedTrainers = req.body.trainers; // λίστα ή μεμονωμένο id
  console.log("Επιλεγμένοι προπονητές:", selectedTrainers);
  res.status(200).json({ message: "Προπονητές ενημερώθηκαν." });
});
app.get('/events', async (req, res) => {
  try {
    const model = await import(`./model/better-sqlite.mjs`);
    //const data = await readFile('public/events.json', 'utf-8');
    const data = await model.getSchedule()
    res.json(data);
  } catch (err) {
    console.error('Error reading events:', err);
    res.status(500).json({ error: 'Failed to load events' });
  }
});
app.post('/register', async (req, res) => {
  try {
      // req.body should contain {username, email, password}
      await loginController.doRegister(req, res);
  } catch (err) {
      res.status(500).json({
          success: false,
          message: 'Σφάλμα κατά την εγγραφή'
      });
  }
});
app.post('/login', async (req, res) => {
  try {
      await loginController.doLogin(req, res);
  } catch (err) {
      res.status(500).json({
          success: false,
          message: 'Σφάλμα κατά τη σύνδεση'
      });
  }
});

app.get('/check-auth', (req, res) => {
  if (req.session.loggedUserId) {
      res.json({ authenticated: true });
  } else {
      res.status(401).json({ authenticated: false });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));