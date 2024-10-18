import { TrackingEventRecordCommand } from 'src/tracker/domain/dto/command/tracking-event.record.command';
import { TrackingEvent } from 'src/tracker/domain/tracking-event';

describe(`🎯 TrackingEvent 테스트`, () => {
  it(`🟢 TrackingEventRecordCommand로 TrackingEvent를 생성할 수 있다.`, async () => {
    // given
    const command: TrackingEventRecordCommand = {
      contextId: 'CTX001',
      txType: 'test',
      txSrc: 'local',
    };
    const txId = 'TX001';
    const timestamp = 1;

    // when
    const trackingEvent = TrackingEvent.from(command, txId, timestamp);

    // then
    expect(trackingEvent.contextId).toBe('CTX001');
    expect(trackingEvent.txType).toBe('test');
    expect(trackingEvent.txSrc).toBe('local');
    expect(trackingEvent.txId).toBe(txId);
    expect(trackingEvent.timestamp).toBe(timestamp);
  });
});
