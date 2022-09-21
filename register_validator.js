const Validator = require('fastest-validator');

const v = new Validator();

module.exports = (req, res, next) => {

    const schema = {
        email: "email",
        password: "string|min:5|max:10",
        username: "string|min:5"
    }

    const check = v.compile(schema)

    const isValidate = check(req.body);

    if (isValidate !== true) {
        return res.status(400).send(isValidate)
    } else {
        return next();
    }
}