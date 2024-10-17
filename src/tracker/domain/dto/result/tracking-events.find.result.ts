import { TrackingEvents } from '../../tracking-event';

export class TrackingEventsFindResult {
  readonly data: TrackingEvents;

  private constructor(events: TrackingEvents) {
    this.data = events;
  }

  static of(events: TrackingEvents): TrackingEventsFindResult {
    return new TrackingEventsFindResult(events);
  }
}
