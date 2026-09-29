import * as sgMail from "@sendgrid/mail";
import { env } from "@/env";

if (env.SEND_GRID_API_KEY) {
  sgMail.setApiKey(env.SEND_GRID_API_KEY);
}

export const sendNewSupportTicketEmail = async (
  email: string | null | undefined,
  referenceNumber: string,
  ticketLink: string,
  description: string,
) => {
  const msg = {
    to: email ?? undefined,
    from: {
      name: "The Weplug Music Team",
      email: "support@weplugmusic.com",
    },
    templateId: env.SUPPORT_TICKET_TEMPLATE_ID,
    dynamicTemplateData: {
      referenceNumber: referenceNumber,
      ticketLink: ticketLink,
      description: description,
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
