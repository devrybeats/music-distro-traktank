import * as sgMail from "@sendgrid/mail";
import { env } from "@/env";

if (env.SEND_GRID_API_KEY) {
  sgMail.setApiKey(env.SEND_GRID_API_KEY);
}

export const passwordResetMail = async (email: string, token: string) => {
  const msg = {
    to: email,
    from: {
      name: "Password Reset",
      email: "password_reset@weplugmusic.com",
    },
    templateId: env.PASSWORD_RESET_TEMPLATE_ID,
    dynamicTemplateData: {
      resetLink: `${env.NEXT_PUBLIC_HOME_URL}/password-reset?token=${token}`,
    },
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
