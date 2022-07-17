import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";
import { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";

declare global {
  interface Window {
    $message: MessageApiInjection;
    $dialog: DialogApiInjection;
    $notification: NotificationApiInjection;
  }
}
