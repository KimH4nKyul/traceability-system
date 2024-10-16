export type TrackingEvent = {
  id: string;
  contextId: string;
  prevTxId?: string | null;
  txId: string;
  txType: string;
  txSrc: string;
  objId: string;
  objType: string;
  timestamp: number;
  metadata?: Record<string, any> | null;
};

export type TrackingEvents = TrackingEvent[];
