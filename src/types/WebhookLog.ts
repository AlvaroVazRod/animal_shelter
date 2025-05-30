export interface WebhookLog {
  id: number;
  eventType: string;
  receivedAt: string;
  payload: string;
}