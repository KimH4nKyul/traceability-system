import { Injectable } from '@nestjs/common';
import { TrackingEventRecorder } from '../component/tracking-event.recorder';
import { TrackingEventRecordCommand } from '../dto/command/tracking-event.record.command';

@Injectable()
export class TrackingEventRecordService {
  constructor(private readonly trackingEventRecorder: TrackingEventRecorder) {}

  async record(command: TrackingEventRecordCommand): Promise<void> {
    await this.trackingEventRecorder.execute(command.toDomain());
  }
}
