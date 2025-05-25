const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

app.use(express.static('public'));

//κατάληξη .hbs
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Αρχική', isHome: true, extraCss: 'index.css' }));
app.get('/ghpeda', (req, res) => res.render('ghpeda', { title: 'Γήπεδα', isGhpeda: true, extraCss: 'ghpeda.css' }));
app.get('/tmimata', (req, res) => res.render('tmimata', { title: 'Τμήματα', isTmimata: true, extraCss: 'tmimata.css' }));
app.get('/tournoua', (req, res) => res.render('tournoua', { title: 'Τουρνουά', isTournoua: true, extraCss: 'tournoua.css' }));
app.get('/anakoinoseis', (req, res) => {res.render('anakoinoseis', { title: 'Ανακοινώσεις', isAnakoinoseis: true, extraCss: 'anakoinoseis.css', extraScript: 'anakoinoseis.js', defer: true });});
app.get('/epikoinonia', (req, res) => res.render('epikoinonia', { title: 'Επικοινωνία', isEpikoinonia: true, extraCss: 'epikoinonia.css' }));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
