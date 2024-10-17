import { Injectable } from '@nestjs/common';
import { TrackingEventReadRepository } from '../interface/persistence/tracking-event.repository';
import { TrackingEvent, TrackingEvents } from '../tracking-event';
import { TrackingEventNotFoundError } from '../error/tracking-event.not-found.error';
import { TrackingEventCriteria } from '../dto/criteria/tracking-event.criteria';

@Injectable()
export class TrackingEventReader {
  constructor(
    private readonly trackingEventReadRepository: TrackingEventReadRepository,
  ) {}

  async previousTxId(trackingEvent: TrackingEvent): Promise<TrackingEvent> {
    const events = await this.context(trackingEvent.contextId);
    if (events.length === 0) return trackingEvent.addPreviousTxId(null);

    const prevTxId = events.sort((a, b) => b.timestamp - a.timestamp)[0].txId;
    return trackingEvent.addPreviousTxId(prevTxId);
  }

  async context(contextId: string): Promise<TrackingEvents> {
    const events = await this.trackingEventReadRepository.findById(contextId);

    return events;
  }

  async getByTxId(txId: string): Promise<TrackingEvent> {
    const event = await this.trackingEventReadRepository.findByTxId(txId);
    if (!event) throw new TrackingEventNotFoundError(`TxId: ${txId}`);
    return event;
  }

  async getByCriteria(
    criteria: TrackingEventCriteria,
  ): Promise<TrackingEvents> {
    const events =
      await this.trackingEventReadRepository.findWithCriteria(criteria);
    if (events.length === 0)
      throw new TrackingEventNotFoundError(
        `Criteria Details: ${criteria.message()}`,
      );
    return events;
  }
}
