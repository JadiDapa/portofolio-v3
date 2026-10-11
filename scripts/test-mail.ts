import { config } from "dotenv";
import { sendMail } from "../lib/mail";

config({ path: ".env.local" });

sendMail({
  subject: "Portfolio test email",
  text: "If you can read this, SMTP is working.",
})
  .then(() => console.log("Sent."))
  .catch((err) => {
    console.error("Failed:", err.message);
    process.exit(1);
  });
