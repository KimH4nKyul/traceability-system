export class TrackingEventRecordCommand {
  contextId: string;
  prevTxId?: string | null;
  txId?: string | null;
  txType: string;
  txSrc: string;
  objId?: string | null;
  objType?: string | null;
  timestamp?: Date | null;
  metadata?: Record<string, any> | null;
}
