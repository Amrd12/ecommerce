export const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // User is logged in, proceed to the next middleware or route
        return next();
    }
    // Store the intended URL in session and redirect to login
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
};