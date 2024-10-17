import { Injectable } from '@nestjs/common';
import { TrackingEvents } from 'src/tracker/domain/tracking-event';
import { TrackingEventSearchService } from '../../domain/service/tracking-event.search.service';

@Injectable()
export class TrackerReadUsecase {
  constructor(
    private readonly trackingEventSearchService: TrackingEventSearchService,
  ) {}

  async context(contextId: string): Promise<TrackingEvents> {
    return await this.trackingEventSearchService.context(contextId);
  }
}
