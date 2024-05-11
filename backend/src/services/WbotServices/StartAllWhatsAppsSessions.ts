import { startQueueProcess } from "../../queues";
import { runSendMessage } from "../../sendWork";
import ListWhatsAppsService from "../WhatsappService/ListWhatsAppsService";
import { StartWhatsAppSession } from "./StartWhatsAppSession";

export const StartAllWhatsAppsSessions = async (): Promise<void> => {
  const whatsapps = await ListWhatsAppsService();
  if (whatsapps.length > 0) {
    whatsapps.forEach(whatsapp => {
      StartWhatsAppSession(whatsapp);
    });
  }

   setTimeout(() => {
     startQueueProcess();
   }, 5000);

   setTimeout(() => {
    runSendMessage();
  }, 30000);
};
