import { Injectable } from '@nestjs/common';
import { TrackingEventReader } from 'src/tracker/domain/component/tracking-event.reader';
import { TrackingEvents } from 'src/tracker/domain/tracking-event';

@Injectable()
export class TrackingEventSearchService {
  constructor(private readonly trackingEventReader: TrackingEventReader) {}

  // TODO: 현재 DEMO에서는 전채 맥락을 확인하는 것에 집중하고, 추후 전체 기능 개발
  async context(contextId: string): Promise<TrackingEvents> {
    return await this.trackingEventReader.context(contextId);
  }
}
