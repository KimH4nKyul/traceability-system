export abstract class NotFoundError extends Error {
  constructor(
    public source: string,
    public expect: string,
  ) {
    super(`${source}의 ${expect}을/를 찾을 수 없음`);
    this.name = 'NotFoundError';
  }
}
