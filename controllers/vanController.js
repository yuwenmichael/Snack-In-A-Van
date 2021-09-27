// import required dependencies and models
const van = require("../models/van")
const Van = van.Van
const geocoder = require('../utils/geocoder')

// change an van status(POST)
const updateVanStatus = async(req, res) => {
    try {
        let oneVan = await Van.findOne({ vanId: req.session.van_name }).lean()
            // if the van is open, we change it to close
        if (oneVan.status === 'close') {
            await Van.updateOne({ vanId: req.session.van_name }, { status: "open" }).lean()
        } else {
            await Van.updateOne({ vanId: req.session.van_name }, { status: "close" }).lean()
        }
        oneVan = await Van.findOne({ vanId: req.session.van_name }).lean()
        return res.render('showVanStatus', { "oneVan": oneVan, layout: 'vendor_main.hbs' })
    } catch (error) {

        return res.render('error', { "errorCode": 404, "message": "Error: Van not found!" })
    }
}

// update the location of the van
const updateLocation = async(req, res) => {
    try {
        //get the van whose van_name is stored in the session -- van is logged in
        if (req.session.van_name) {
            const location = {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
            }
            req.session.location = location
            await Van.updateOne({ vanId: req.session.van_name }, { address: req.body.van_location })
            await Van.updateOne({ vanId: req.session.van_name }, { location: location })
            await Van.updateOne({ vanId: req.session.van_name }, { status: "open" })
            return res.render('sendLocationSuccess', { layout: "vendor_main" })
        } else {
            return res.send("login failed")
        }
    } catch (err) { // error occurred
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

// get one van
const getOneVan = async(req, res) => {
    try {
        const oneVan = await Van.findOne({ vanId: req.session.van_name }).lean()
        if (oneVan === null) { // no van found in database
            res.status(404)
            return res.send("Van not found")
        }
        return res.render('vendorHome', { "oneVan": oneVan, layout: 'vendor_main.hbs' })
    } catch (err) { // error occurred
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

// logout of the current van account
const logout = async(req, res) => {
    try {
        await Van.updateOne({ vanId: req.session.van_name }, { status: "close" })
        delete req.session.van_name;
        delete req.session.location;
        req.logout();
        res.redirect('/vendor');

    } catch (err) { // error occurred
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

// export the functionss
module.exports = {
    updateVanStatus,
    getOneVan,
    updateLocation,
    getOneVan,
    logout
}