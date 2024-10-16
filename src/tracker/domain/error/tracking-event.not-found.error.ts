import { NotFoundError } from '../../../core/error/not-found.error';

export class TrackingEventNotFoundError extends NotFoundError {
  constructor(expect: string) {
    super('TrackingEvent', expect);
  }
}
