module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you need to login frist")
        return res.render('./users/login.ejs')
    }
    next()
}