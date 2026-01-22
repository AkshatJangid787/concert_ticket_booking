import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS environment variables are missing. Email sending will fail.");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail(to: string, subject: string, html: string) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("FATAL: Email credentials missing in env variables.");
        console.error("EMAIL_USER defined:", !!process.env.EMAIL_USER);
        console.error("EMAIL_PASS defined:", !!process.env.EMAIL_PASS);
        return false;
    }

    try {
        console.log(`Attempting to send email to ${to}...`);
        const info = await transporter.sendMail({
            from: `"Ashish Soni Live" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Message sent successfully:", info.messageId);
        return true;
    } catch (error: any) {
        console.error("Error sending email:", error);
        if (error.code === 'EAUTH') {
            console.error("Authentication failed. Please check your EMAIL_USER and EMAIL_PASS. You likely need an App Password.");
        }
        return false;
    }
}
