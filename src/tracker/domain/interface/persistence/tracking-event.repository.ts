import { TrackingEventCriteria } from '../../dto/criteria/tracking-event.criteria';
import { TrackingEvent, TrackingEvents } from '../../tracking-event';

export interface TrackingEventWriteRepository {
  findById(id: bigint): Promise<TrackingEvent | null>;
  record(trackingEvent: TrackingEvent): Promise<void>;
}

export interface TrackingEventReadRepository {
  findByContextId(contextId: string): Promise<TrackingEvents>;
  findByTxId(txId: string): Promise<TrackingEvent | null>;
  findWithCriteria(criteria: TrackingEventCriteria): Promise<TrackingEvents>;
}
