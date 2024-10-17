import { Injectable } from '@nestjs/common';
import { TrackerCreateUsecase } from './usecase/tracker.create.usecase';
import { TrackerReadUsecase } from './usecase/tracker.read.usecase';
import { TrackingEventRecordCommand } from '../domain/dto/command/tracking-event.record.command';
import { TrackingEventsFindResult } from '../domain/dto/result/tracking-events.find.result';

@Injectable()
export class TrackerApplication {
  constructor(
    private readonly create: TrackerCreateUsecase,
    private readonly read: TrackerReadUsecase,
  ) {}

  async contextId(): Promise<string> {
    return await this.create.contextId();
  }

  async record(command: TrackingEventRecordCommand): Promise<void> {
    return await this.create.record(command);
  }

  async context(contextId: string): Promise<TrackingEventsFindResult> {
    return TrackingEventsFindResult.of(await this.read.context(contextId));
  }
}
