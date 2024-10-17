import { TrackingEventRecordCommand } from './dto/command/tracking-event.record.command';

export class TrackingEvent {
  contextId: string;
  prevTxId?: string | null;
  txId: string;
  txType: string;
  txSrc: string;
  objId: string;
  objType: string;
  timestamp: number;
  metadata?: Record<string, any> | null;

  static of(command: TrackingEventRecordCommand) {
    return { ...command };
  }

  addPreviousTxId(prevTxId: string): TrackingEvent {
    this.prevTxId = prevTxId;
    return this;
  }
}

export type TrackingEvents = TrackingEvent[];
