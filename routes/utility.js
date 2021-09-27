// middleware to ensure vendor is logged in
function isLoggedIn(req, res, next) {
    if (req.session.van_name) {
        return next();
    }
    // if not logged in, redirect to login form
    res.redirect('/vendor');
}

// middleware to ensure customer is logged in
function isLoggedInCustomer(req, res, next) {

    if (req.session.email) {
        return next();
    }
    // if not logged in, redirect to login form
    res.redirect('/customer/login');
}

// middleware to get the choosen van
function isSelectedVan(req, res, next) {
    if (req.session.vanId) {
        return next();
    }
    res.redirect('/customer');
}

function isSendLocation(req, res, next) {
    if (req.session.location) {
        return next();
    }
    res.redirect('/vendor/send_location');
}

// export the function
module.exports = {
    isLoggedIn,
    isLoggedInCustomer,
    isSelectedVan,
    isSendLocation
}