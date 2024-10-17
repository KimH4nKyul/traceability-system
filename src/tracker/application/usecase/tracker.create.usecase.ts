import { Injectable } from '@nestjs/common';
import { TrackingEventRecordCommand } from 'src/tracker/domain/dto/command/tracking-event.record.command';
import { ContextIdService } from 'src/tracker/domain/service/context-id.service';
import { TrackingEventRecordService } from 'src/tracker/domain/service/tracking-event.record.service';

@Injectable()
export class TrackerCreateUsecase {
  constructor(
    private readonly contextIdService: ContextIdService,
    private readonly trackingEventRecordService: TrackingEventRecordService,
  ) {}

  async contextId(): Promise<string> {
    return await this.contextIdService.generate();
  }

  // TODO: 애플리케이션 레이어에서 유즈케이스 레이어로 Command를 내리지 않도록 수정 필요
  async record(command: TrackingEventRecordCommand): Promise<void> {
    return await this.trackingEventRecordService.record(command);
  }
}
