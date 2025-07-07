export class Title {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}

export class Description {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Description cannot be empty');
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}

export class Rating {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0 || value > 10) {
      throw new Error('Rating must be between 0 and 10');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
