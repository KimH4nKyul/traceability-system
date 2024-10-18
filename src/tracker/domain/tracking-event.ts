import { TrackingEventRecordCommand } from './dto/command/tracking-event.record.command';

export class TrackingEventInterface {
  id?: string;
  contextId: string;
  prevTxId?: string | null;
  txId: string;
  txType: string;
  txSrc: string;
  objId?: string | null;
  objType?: string | null;
  timestamp: number;
  metadata?: Record<string, any> | null;

  static of(trackingEvent: TrackingEvent): TrackingEventInterface {
    return {
      ...trackingEvent,
    };
  }

  static toDomain(trackingEvent: TrackingEventInterface): TrackingEvent {
    return new TrackingEvent(trackingEvent);
  }
}

export class TrackingEvent {
  id?: string;
  contextId: string;
  prevTxId?: string | null;
  txId: string;
  txType: string;
  txSrc: string;
  objId?: string | null;
  objType?: string | null;
  timestamp: number;
  metadata?: Record<string, any> | null;

  constructor({
    id,
    contextId,
    prevTxId,
    txId,
    txType,
    txSrc,
    objId,
    objType,
    timestamp,
    metadata,
  }: TrackingEventInterface) {
    if (id) this.id = id;
    this.contextId = contextId;
    this.prevTxId = prevTxId;
    this.txId = txId;
    this.txType = txType;
    this.txSrc = txSrc;
    this.objId = objId;
    this.objType = objType;
    this.timestamp = timestamp;
    this.metadata = metadata;
  }

  static from(
    command: TrackingEventRecordCommand,
    txId: string,
    timestamp: number,
  ): TrackingEvent {
    return new TrackingEvent({
      ...command,
      txId,
      timestamp,
    });
  }

  addPreviousTxId(prevTxId: string): TrackingEvent {
    return new TrackingEvent({ ...this, prevTxId });
  }
}

export type TrackingEvents = TrackingEvent[];
