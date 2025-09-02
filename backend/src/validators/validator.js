import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long")
      .isLength({ max: 50 })
      .withMessage("Name must not exceed 50 characters"),

    body("dob")
      .notEmpty()
      .withMessage("Date of Birth is required")
      .isDate({ format: "DD-MM-YYYY" }) 
      .withMessage("DOB must be a valid date (DD-MM-YYYY)")
      .custom((value) => {
        const today = new Date();
        const dob = new Date(value);
        if (dob >= today) {
          throw new Error("DOB must be in the past");
        }
        return true;
      }),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email")
  ];
};

const emailOtpValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please enter a valid email"),

        body("otp")
            .trim()
            .notEmpty()
            .withMessage("OTP is required")
            .isNumeric()
            .withMessage("OTP must be a number")
            .isLength({ min: 6, max: 6 })
            .withMessage("OTP must be exactly 6 digits"),
    ];
};

const emailValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Valid email is required"),
  ];
};

export { userRegistrationValidator, emailOtpValidator, emailValidator };
