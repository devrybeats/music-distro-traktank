import * as sgMail from "@sendgrid/mail";
import { env } from "@/env";

if (env.SEND_GRID_API_KEY) {
  sgMail.setApiKey(env.SEND_GRID_API_KEY);
}

export const sendMusicReleaseAlertToAdmin = async () => {
  const msg = {
    to: "tylertooxclusive@gmail.com",
    from: {
      name: "New Update Alert",
      email: "noreply@weplugmusic.com",
    },
    templateId: env.RELEASE_NOTIFICATION_TEMPLATE_ID,
  };

  async function sendEmail() {
    try {
      await sgMail.send(msg);
    } catch (error: unknown) {
      console.error(error);

      if (typeof error === "object" && error !== null && "response" in error) {
        console.error((error as { response: { body: unknown } }).response.body);
      }
    }
  }
  await sendEmail();
};
