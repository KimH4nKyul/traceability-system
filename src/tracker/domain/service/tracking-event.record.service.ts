import { Injectable } from '@nestjs/common';
import { TrackingEventRecorder } from '../component/tracking-event.recorder';
import { TrackingEventRecordCommand } from '../dto/command/tracking-event.record.command';
import { TrackingEvent } from '../tracking-event';
import { systemTimeHolder } from 'src/core/holder/system-time.holder';
import { ulidHolder } from 'src/core/holder/ulid.holder';
import { TrackingEventReader } from '../component/tracking-event.reader';

@Injectable()
export class TrackingEventRecordService {
  constructor(
    private readonly trackingEventReader: TrackingEventReader,
    private readonly trackingEventRecorder: TrackingEventRecorder,
  ) {}

  async record(command: TrackingEventRecordCommand): Promise<void> {
    let trackingEvent = await TrackingEvent.from(
      command,
      systemTimeHolder,
      ulidHolder,
    );
    trackingEvent = await this.trackingEventReader.previousTxId(trackingEvent);
    await this.trackingEventRecorder.execute(trackingEvent);
  }
}
