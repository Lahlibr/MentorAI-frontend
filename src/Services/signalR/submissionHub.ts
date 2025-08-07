import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '@/api/axiosInstance';

export class SubmissionHubService {
  private connection: signalR.HubConnection;
  private readonly baseUrl: string = API_BASE_URL.replace('/api', ''); // remove /api if needed

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/submissionHub`)
      .withAutomaticReconnect()
      .build();
  }

  async start(): Promise<void> {
    try {
      await this.connection.start();
      console.log('SignalR connection started');
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
    }
  }

  async stop(): Promise<void> {
    await this.connection.stop();
  }

  async joinSubmissionGroup(submissionId: number): Promise<void> {
    await this.connection.invoke('JoinSubmissionGroup', submissionId);
  }

  onSubmissionGraded(callback: (result: any) => void): void {
    this.connection.on('ReceiveSubmissionGraded', callback);
  }

  offSubmissionGraded(): void {
    this.connection.off('ReceiveSubmissionGraded');
  }
}

export const submissionHub = new SubmissionHubService();
