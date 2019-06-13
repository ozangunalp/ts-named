export abstract class Enum<T extends Enum<T>> {
  readonly id: string;

  protected constructor(id: string) {
    this.id = id;
  }

  public values(): T[] {
    let clazz = this.constructor;
    return Object.keys(clazz)
      .map(value => (clazz as any)[value])
      .filter(value => value instanceof clazz);
  }

  public get(id: string): T | undefined {
    return this.values().find(value => value.id === id);
  }
}

export function values<T extends Enum<T>>(t: Enum<T>): T[] {
  return t.values();
}

export function get<T extends Enum<T>>(t: Enum<T>, id: string): T | undefined {
  return t.get(id);
}
