import { Injectable } from '@nestjs/common';
import { ContextIdGenerator } from '../component/context-id.generator';

@Injectable()
export class ContextIdService {
  constructor(private readonly contextIdGenerator: ContextIdGenerator) {}

  async generate(): Promise<string> {
    return this.contextIdGenerator.execute();
  }
}
