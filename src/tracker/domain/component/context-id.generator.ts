import { Injectable } from '@nestjs/common';
import { ulidHolder } from 'src/core/holder/ulid.holder';

@Injectable()
export class ContextIdGenerator {
  constructor() {}

  async execute(): Promise<string> {
    return ulidHolder();
  }
}
