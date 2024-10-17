import { IdHolder } from './interface/id.holder';
import { ulid } from 'ulid';

export const ulidHolder: IdHolder = async () => ulid();
