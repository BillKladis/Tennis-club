import argon2d from 'argon2';
const userModel = await import('../model/better-sqlite.mjs');
export let doRegister = async function (req, res) {
    try {
        if (!req.body.username || !req.body.password || !req.body.email) {
            return res.status(400).json({
                success: false,
                message: 'Λείπουν απαραίτητα πεδία'
            });
        }

        const registrationResult = await userModel.registerUser(
            req.body.username,
            req.body.password,
            req.body.email
        );

        return res.status(200).json({
            success: true,
            message: 'Επιτυχής εγγραφή'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export let doLogin = async function (req, res) {
    try {
        const { username, password } = req.body;

        // Get user from database
        const user = await userModel.getUserByUsername(username);
        
        // If user not found
        if (!user || !user.password || !user.id) {
            throw new Error('Δε βρέθηκε αυτός ο χρήστης');
        }

        // Verify password using argon2
        const match = await argon2d.verify(user.password, password);
        
        if (!match) {
            throw new Error('Λάθος κωδικός πρόσβασης');
        }

        // Set session
        req.session.loggedUserId = user.id;
        
        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Επιτυχής σύνδεση'
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
}

export let doLogout = (req, res) => {
   //Σημειώνουμε πως ο χρήστης δεν είναι πια συνδεδεμένος
   req.session.destroy();
   res.redirect('/');
};

//Τη χρησιμοποιούμε για να ανακατευθύνουμε στη σελίδα /login όλα τα αιτήματα από μη συνδεδεμένους χρήστες
export let checkAuthenticated = function (req, res, next) {
   //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
   if (req.session.loggedUserId) {
      console.log('user is authenticated', req.originalUrl);
      //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
      next();
   } else {
      //Ο χρήστης δεν έχει ταυτοποιηθεί, αν απλά ζητάει το /login ή το register δίνουμε τον
      //έλεγχο στο επόμενο middleware που έχει οριστεί στον router
      if (req.originalUrl === '/login' || req.originalUrl === '/register') {
         next();
      } else {
         //Στείλε το χρήστη στη "/login"
         console.log('not authenticated, redirecting to /login');
         res.redirect('/login');
      }
   }
};