import { Injectable } from '@nestjs/common';
import { RandomStringIdHolder } from './interface/random-string-id.holder';
import { ulid } from 'ulid';

@Injectable()
export class UlidHolder implements RandomStringIdHolder {
  async generate(): Promise<string> {
    return ulid();
  }
}
