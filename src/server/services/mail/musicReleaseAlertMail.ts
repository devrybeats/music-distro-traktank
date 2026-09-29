import * as sgMail from "@sendgrid/mail";
import { env } from "@/env";

if (env.SEND_GRID_API_KEY) {
  sgMail.setApiKey(env.SEND_GRID_API_KEY);
}

export const sendMusicReleaseEmail = async (
  email: string | null | undefined,
  artist: string,
) => {
  const msg = {
    to: email ?? undefined,
    from: {
      name: "Your Music release",
      email: "noreply@weplugmusic.com",
    },
    templateId: env.MUSIC_RELEASE_TEMPLATE_ID,
    dynamicTemplateData: {
      artist: artist,
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
