const { body } = require("express-validator");
const validitionSchema = () => {
    return [
        body("title")
            .notEmpty()
            .withMessage("titile is required")
            .isLength({ min: 2 })
            .withMessage("minmon length 2 char"),
        body("price").notEmpty().withMessage("price is required"),
    ]
};
module.exports ={ validitionSchema};