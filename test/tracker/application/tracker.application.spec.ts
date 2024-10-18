import { TrackerApplication } from 'src/tracker/application/tracker.application';
import { TrackerCreateUsecase } from 'src/tracker/application/usecase/tracker.create.usecase';
import { TrackerReadUsecase } from 'src/tracker/application/usecase/tracker.read.usecase';
import { ContextIdGenerator } from 'src/tracker/domain/component/context-id.generator';
import { TrackingEventReader } from 'src/tracker/domain/component/tracking-event.reader';
import { TrackingEventRecorder } from 'src/tracker/domain/component/tracking-event.recorder';
import { TrackingEventRecordCommand } from 'src/tracker/domain/dto/command/tracking-event.record.command';
import { TrackingEventCriteria } from 'src/tracker/domain/dto/criteria/tracking-event.criteria';
import {
  TrackingEventReadRepository,
  TrackingEventWriteRepository,
} from 'src/tracker/domain/interface/persistence/tracking-event.repository';
import { ContextIdService } from 'src/tracker/domain/service/context-id.service';
import { TrackingEventRecordService } from 'src/tracker/domain/service/tracking-event.record.service';
import { TrackingEventSearchService } from 'src/tracker/domain/service/tracking-event.search.service';
import {
  TrackingEvents,
  TrackingEvent,
} from 'src/tracker/domain/tracking-event';

describe('🎯 Tracker Application 테스트', () => {
  let sut: TrackerApplication;

  const store: Map<string, TrackingEvent> = new Map();
  let count = 1;

  const trackingEventWriteRepository: TrackingEventWriteRepository =
    new (class StubTrackingEventWriteRepository
      implements TrackingEventWriteRepository
    {
      async record(trackingEvent: TrackingEvent): Promise<void> {
        store.set(count.toString(), trackingEvent);
        count++;
      }
    })();

  const trackingEventReadRepository: TrackingEventReadRepository =
    new (class StubTrackingEventReadRepository
      implements TrackingEventReadRepository
    {
      async findById(contextId: string): Promise<TrackingEvents> {
        const trackingEvents = [];
        for (const value of store.values()) {
          if (value.contextId === contextId) {
            trackingEvents.push(value);
          }
        }
        return trackingEvents;
      }
      async findByTxId(txId: string): Promise<TrackingEvent | null> {
        for (const value of store.values()) {
          if (value.txId === txId) {
            return value;
          }
        }
      }
      async findWithCriteria(
        criteria: TrackingEventCriteria,
      ): Promise<TrackingEvents> {
        throw new Error('Method not implemented.');
      }
    })();

  beforeAll(() => {
    const trackingEventRecorder = new TrackingEventRecorder(
      trackingEventWriteRepository,
    );
    const trackingEventReader = new TrackingEventReader(
      trackingEventReadRepository,
    );
    const contextIdGenerator = new ContextIdGenerator();
    const trackingEventRecordService = new TrackingEventRecordService(
      trackingEventReader,
      trackingEventRecorder,
    );
    const contextIdService = new ContextIdService(contextIdGenerator);
    const trackingEventSearchService = new TrackingEventSearchService(
      trackingEventReader,
    );
    const createUsecase = new TrackerCreateUsecase(
      contextIdService,
      trackingEventRecordService,
    );
    const readUsecase = new TrackerReadUsecase(trackingEventSearchService);
    sut = new TrackerApplication(createUsecase, readUsecase);
  });

  let contextId: string;

  describe('🎪 DEMO: 소매업체부터 배송업체까지 이력 시스템 이용 시나리오', () => {
    it('[1-1] 소매업체(최초 이력 발생지)는 이력 발생 전에 Context ID를 생성한다.', async () => {
      contextId = await sut.contextId();

      console.log(
        `✅ [1-1] 소매업체(최초 이력 발생지)는 이력 발생 전에 Context ID를 생성한다.\n`,
        contextId,
      );
    });

    it('[1-2] 소매업체는 주어진 Contexet ID를 활용해 주문 이력을 생성하고, 이 트랜잭션을 이력 시스템에 기록한다.', async () => {
      const tx: TrackingEventRecordCommand = {
        contextId,
        txType: 'order',
        txSrc: 'retailer',
        objId: 'step01',
        objType: 'step01',
        metadata: {
          customerId: 'CUST001', // 고객 ID
          items: [
            { productId: 'PROD123', quantity: 2 }, // 주문 항목 1
            { productId: 'PROD456', quantity: 1 }, // 주문 항목 2
          ],
          totalPrice: 150.0, // 총 주문 금액
          orderDate: '2024-10-01T08:00:00Z', // 주문 발생 시점
        },
      };

      await sut.record(tx);

      console.log(
        `✅ [1-2] 소매업체는 주어진 Contexet ID를 활용해 주문 이력을 생성하고, 이 트랜잭션을 이력 시스템에 기록한다.\n`,
        store,
      );
    });

    it('[2-1] 주문을 받은 제조업체(두번째 이력 발생지)는 공급업체로 재료를 주문하고, 주문 이력을 이력 시스템에 기록한다.', async () => {
      const tx: TrackingEventRecordCommand = {
        contextId,
        txType: 'order',
        txSrc: 'manufacturer',
        objId: 'step02',
        objType: 'step02',
        metadata: {
          supplierId: 'SUP001', // 공급업체 ID
          items: [
            { componentId: 'COMP001', quantity: 100 }, // 필요한 부품 1
            { componentId: 'COMP002', quantity: 50 }, // 필요한 부품 2
          ],
          orderDate: '2024-10-02T09:00:00Z', // 부품 주문 일자
          expectedDeliveryDate: '2024-10-04T17:00:00Z', // 예상 배송일
        },
      };

      await sut.record(tx);

      console.log(
        `✅ [2-1] 주문을 받은 제조업체(두번째 이력 발생지)는 공급업체로 재료를 주문하고, 주문 이력을 이력 시스템에 기록한다.\n`,
        store,
      );
    });

    it('[2-2] 공급업체는 제조업체로 부품(옷, 원단 등)을 보내고, 공급 이력을 시스템에 기록한다.', async () => {
      const tx: TrackingEventRecordCommand = {
        contextId,
        txType: 'supply',
        txSrc: 'supplier',
        objId: 'step02-02',
        objType: 'step02-02',
        metadata: {
          supplierId: 'SUP001', // 공급업체 ID
          shipmentId: 'SHIP001', // 발송된 배송 ID
          componentsShipped: [
            { componentId: 'COMP001', quantity: 100 }, // 발송된 부품 1
            { componentId: 'COMP002', quantity: 50 }, // 발송된 부품 2
          ],
          shipmentDate: '2024-10-03T10:00:00Z', // 발송일
          logisticsProvider: 'LogiCo', // 물류 업체
        },
      };

      await sut.record(tx);

      console.log(
        `✅ [2-2] 공급업체는 제조업체로 부품(옷, 원단 등)을 보내고, 공급 이력을 시스템에 기록한다.\n`,
        store,
      );
    });

    it('[2-3] 재료를 수령한 제조업체는 옷을 생산하고, 생산 이력을 시스템에 기록한다.', async () => {
      const tx: TrackingEventRecordCommand = {
        contextId,
        txType: 'product',
        txSrc: 'manufacturer',
        objId: 'step02-03',
        objType: 'step02-03',
        metadata: {
          manufacturerId: 'MAN001', // 제조업체 ID
          startDate: '2024-10-04T08:00:00Z', // 제조 시작 날짜
          endDate: '2024-10-05T17:00:00Z', // 제조 완료 날짜
          usedComponents: [
            { componentId: 'COMP001', quantity: 100 }, // 사용된 부품 1
            { componentId: 'COMP002', quantity: 50 }, // 사용된 부품 2
          ],
        },
      };

      await sut.record(tx);

      console.log(
        `✅ [2-3] 재료를 수령한 제조업체는 옷을 생산하고, 생산 이력을 시스템에 기록한다.\n`,
        store,
      );
    });

    it('[2-4] 제조업체는 생산 완료한 옷에 대해 품질 검사를 진행하고, 결과를 이력 시스템에 기록한다.', async () => {
      const tx: TrackingEventRecordCommand = {
        contextId,
        txType: 'inspect',
        txSrc: 'manufacturer',
        objId: 'step02-04',
        objType: 'step02-04',
        metadata: {
          manufacturerId: 'MAN001', // 제조업체 ID
          inspectionDate: '2024-10-06T12:00:00Z', // 품질 검사 날짜
          inspector: 'INSPECTOR001', // 검사자
          inspectionResult: 'Passed', // 품질 검사 결과
          remarks: 'All items passed quality checks', // 메모
        },
      };

      await sut.record(tx);

      console.log(
        `✅ [2-4] 제조업체는 생산 완료한 옷에 대해 품질 검사를 진행하고, 결과를 이력 시스템에 기록한다.\n`,
        store,
      );
    });

    it('[2-5] 제조업체는 생산 완료한 옷을 물류업체에 출고하고, 결과를 이력 시스템에 기록한다.', async () => {
      const tx: TrackingEventRecordCommand = {
        contextId,
        txType: 'ship',
        txSrc: 'manufacturer',
        objId: 'step02-05',
        objType: 'step02-05',
        metadata: {
          manufacturerId: 'MAN001', // 제조업체 ID
          shipmentId: 'SHIP002', // 배송 ID
          destination: 'Logistics Center A', // 물류업체 목적지
          shipmentDate: '2024-10-06T14:00:00Z', // 출고 날짜
          logisticsProvider: 'LogiCo', // 물류 업체
        },
      };

      await sut.record(tx);

      console.log(
        `✅ [2-5] 제조업체는 생산 완료한 옷을 물류업체에 출고하고, 결과를 이력 시스템에 기록한다.\n`,
        store,
      );
    });

    it('[3-1] 물류업체는 제조업체가 보낸 옷을 입고하고, 결과를 이력 시스템에 기록한다.', async () => {
      const tx: TrackingEventRecordCommand = {
        contextId,
        txType: 'shipped',
        txSrc: 'logistics',
        objId: 'step03',
        objType: 'step03',
        metadata: {
          logisticsProvider: 'LogiCo', // 물류 업체
          shipmentId: 'SHIP002', // 배송 ID
          receivedDate: '2024-10-07T09:00:00Z', // 입고 일자
          origin: 'Manufacturer A', // 출발지
          destination: 'Logistics Center A', // 물류센터
        },
      };

      await sut.record(tx);

      console.log(
        `✅ [3-1] 물류업체는 제조업체가 보낸 옷을 입고하고, 결과를 이력 시스템에 기록한다.\n`,
        store,
      );
    });

    it('[3-2] 물류업체는 소비자에게 상품을 배송하고, 배송중 이력을 시스템에 기록한다.', async () => {
      const tx: TrackingEventRecordCommand = {
        contextId,
        txType: 'delivery',
        txSrc: 'logistics',
        objId: 'step03-02',
        objType: 'step03-02',
        metadata: {
          logisticsProvider: 'LogiCo', // 물류 업체
          shipmentId: 'SHIP002', // 배송 ID
          deliveryDate: '2024-10-08T12:00:00Z', // 배송 시작 일자
          destination: 'Customer Location', // 배송 목적지
          currentStatus: 'Out for Delivery', // 배송 상태
        },
      };

      await sut.record(tx);

      console.log(
        `✅ [3-2] 물류업체는 소비자에게 상품을 배송하고, 배송중 이력을 시스템에 기록한다.\n`,
        store,
      );
    });

    it('[3-3] 소비자가 배송된 상품을 수령함을 알리면, 물류업체는 배송완료 이력을 시스템에 기록한다.', async () => {
      const tx: TrackingEventRecordCommand = {
        contextId,
        txType: 'delivered',
        txSrc: 'logistics',
        objId: 'step03-03',
        objType: 'step03-03',
        metadata: {
          logisticsProvider: 'LogiCo', // 물류 업체
          shipmentId: 'SHIP002', // 배송 ID
          deliveredDate: '2024-10-08T17:00:00Z', // 배송 완료 일자
          receivedBy: 'Customer A', // 수령자
          destination: 'Customer Location', // 배송 목적지
        },
      };

      await sut.record(tx);

      console.log(
        `✅ [3-3] 소비자가 배송된 상품을 수령함을 알리면, 물류업체는 배송완료 이력을 시스템에 기록한다.\n`,
        store,
      );
    });

    it('[4-1] ContextId로 전체 트랜잭션의 맥락을 조회할 수 있다.', async () => {
      const context = await sut.context(contextId);

      console.log(
        `✅ [4-1] ContextId로 전체 트랜잭션의 맥락을 조회할 수 있다.`,
        context.data,
      );
    });
  });
});
