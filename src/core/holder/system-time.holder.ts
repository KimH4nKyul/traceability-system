import { TimeHolder } from './interface/time.holder';

export const systemTimeHolder: TimeHolder = async () => Date.now();
