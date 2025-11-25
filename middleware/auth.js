// import csrf from 'csurf';
// export const csrfProtection = csrf({ cookie: true });



// Check Login Authentication

export const checkAuth = (req, res, next) => {
    if (!req.session.schoolId) {
      return res.redirect('/login');
    } 
    next();
  };

export const homeValid = (req, res, next) => {
    if (req.session.schoolId) {
      return res.redirect('/dashboard');
    } 
    next();
  };