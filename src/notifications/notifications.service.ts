import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly sseClients: Map<string, any>;
  constructor() {
    this.sseClients = new Map<string, any>();
  }

  registerClient(userId: string, client: any) {
    this.sseClients.set(userId, client);
  }

  sendNotificationToUser(
    userId: string,
    message: string,
    reservationId: string,
  ) {
    const client = this.sseClients.get(userId);
    if (client) {
      const data = { message, reservationId };
      client.send(JSON.stringify({ data }));
    }
  }
}
