import { RandomStringIdHolder } from './interface/random-string-id.holder';
import { ulid } from 'ulid';

export const ulidHolder: RandomStringIdHolder = async () => ulid();
