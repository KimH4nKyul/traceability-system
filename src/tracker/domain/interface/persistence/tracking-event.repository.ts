import { TrackingEventCriteria } from '../../dto/criteria/tracking-event.criteria';
import { TrackingEvent, TrackingEvents } from '../../tracking-event';

export interface TrackingEventWriteRepository {
  record(trackingEvent: TrackingEvent): Promise<void>;
}

export interface TrackingEventReadRepository {
  findById(contextId: string): Promise<TrackingEvents>;
  findByTxId(txId: string): Promise<TrackingEvent | null>;
  findWithCriteria(criteria: TrackingEventCriteria): Promise<TrackingEvents>;
}
