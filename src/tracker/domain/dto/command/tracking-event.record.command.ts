export class TrackingEventRecordCommand {
  contextId: string;
  prevTxId?: string | null;
  txId?: string;
  txType: string;
  txSrc: string;
  objId?: string;
  objType?: string;
  timestamp: Date;
  metadata?: Record<string, any> | null;
}
