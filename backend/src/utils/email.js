import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import ApiError from "./api-error.js";

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "HD_Notes",
            link: "https://mailgen.js/",
        },
    });

    let emailText = mailGenerator.generatePlaintext(options.mailGenContent);
    let emailHtml = mailGenerator.generate(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, 
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: '"HD_Notes" <noreply@hdnotes.com>',
            to: options.email,
            subject: options.subject,
            text: emailText,
            html: emailHtml,
        });
    
    }
    catch(error) {
        throw new ApiError(404,"Error during sending mail",error)
    }
}

const emailOtpMailGenContent  = (username, otp) => {
    return {
        body: {
            name: username,
            intro: "Welcome to HD_Notes! We're very excited to have you on board.",
            action: {
                instructions: "Use the following One-Time Password (OTP) to complete your login or signup process:",
                button: {
                    color: "#22BC66", 
                    text: `Your OTP: ${otp}`,
                    
                },
            },
            outro: "If you did not request this OTP, please ignore this email or contact support if you have concerns.",
        },
    };
};





export {sendMail,emailOtpMailGenContent}