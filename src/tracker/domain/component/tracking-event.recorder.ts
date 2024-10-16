import { Injectable } from '@nestjs/common';
import { TrackingEventWriteRepository } from '../interface/persistence/tracking-event.repository';
import { TrackingEvent } from '../tracking-event';

@Injectable()
export class TrackingEventRecorder {
  constructor(
    private readonly trackingEventWriteRepository: TrackingEventWriteRepository,
  ) {}

  async execute(trackingEvent: TrackingEvent): Promise<void> {
    await this.trackingEventWriteRepository.record(trackingEvent);
  }
}
