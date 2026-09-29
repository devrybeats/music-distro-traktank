import * as sgMail from "@sendgrid/mail";
import { env } from "@/env";

if (env.SEND_GRID_API_KEY) {
  sgMail.setApiKey(env.SEND_GRID_API_KEY);
}

export const verifyEMail = async (
  email: string,
  name: string,
  token: string,
) => {
  const msg = {
    to: email,
    from: {
      name: "Verify Email",
      email: "welcome@weplugmusic.com",
    },
    templateId: env.VERIFY_EMAIL_TEMPLATE_ID,
    dynamicTemplateData: {
      name: name,
      verifyLink: `${env.NEXT_PUBLIC_HOME_URL}/api/verify?token=${token}`,
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
