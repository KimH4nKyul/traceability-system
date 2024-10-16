export class TrackingEventCriteria {
  contextId?: string;
  txId?: string;
  txType?: string;
  objId?: string;
  objType?: string;
  timestamp?: number;
  order: 'asc' | 'desc';

  message(): string {
    const part = Object.fromEntries(
      Object.entries(this).filter(
        ([_, value]) => value !== undefined && value !== null,
      ),
    );
    return JSON.stringify(part);
  }
}
