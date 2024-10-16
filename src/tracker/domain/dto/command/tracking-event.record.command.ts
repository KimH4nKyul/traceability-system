import { TrackingEvent } from '../../tracking-event';

export class TrackingEventRecordCommand {
  id: bigint;
  contextId: string;
  prevTxId?: string | null;
  txId: string;
  txType: string;
  txSrc: string;
  objId: string;
  objType: string;
  timestamp: Date;
  metadata?: Record<string, any> | null;

  toDomain(): TrackingEvent {
    return {
      ...this,
      id: this.id.toString(),
      timestamp: this.timestamp.getTime(),
    };
  }
}
