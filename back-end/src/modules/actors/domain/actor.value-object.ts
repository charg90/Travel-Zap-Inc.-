export class Name {
  private readonly value: string;

  constructor(value: string) {
    if (/\d/.test(value)) {
      throw new Error('Name cannot contain numbers');
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
