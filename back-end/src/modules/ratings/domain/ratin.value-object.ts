export class Score {
  private value: number;

  constructor(value: number) {
    if (value < 0 || value > 10) {
      throw new Error('Score must be between 0 and 10');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  static fromNumber(value: number): Score {
    return new Score(value);
  }
}
