import { TrackingEventRecordCommand } from './dto/command/tracking-event.record.command';
import { TimeHolder } from 'src/core/holder/interface/time.holder';
import { IdHolder } from 'src/core/holder/interface/id.holder';

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

  static async from(
    command: TrackingEventRecordCommand,
    timeHolder: TimeHolder,
    idHolder: IdHolder,
  ): Promise<TrackingEvent> {
    return new TrackingEvent({
      ...command,
      txId: await idHolder(),
      timestamp: await timeHolder(),
    });
  }

  addPreviousTxId(prevTxId: string): TrackingEvent {
    return new TrackingEvent({ ...this, prevTxId });
  }
}

export type TrackingEvents = TrackingEvent[];
