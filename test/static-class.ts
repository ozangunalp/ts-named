import { named } from '../';

abstract class Enum<T extends Enum<T>> {
  readonly id: string;

  protected constructor(id: string) {
    this.id = id;
  }

  public values(): T[] {
    let clazz = this.constructor;
    return Object.keys(clazz).map(value => (clazz as any)[value] as T);
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

export class Typed extends Enum<Typed> {
  static readonly named1 = named(id => new Typed(id, 'Type'));
  static readonly named2 = named(id => new Typed(id, 'Other Type'));
  static readonly named3 = named(id => new Typed(id, Typed.named2.id));

  private constructor(public id: string, public type: string) {
    super(id);
  }
}

console.log('values');
console.log(values(Typed.prototype));

console.log('named2');
console.log(get(Typed.prototype, 'named2'));

console.log(Typed.named1.id === 'named1');
console.log(Typed.named2.id === 'named2');

console.log(Typed.named1.values());

let named2: Typed | undefined = Typed.named1.get('named2');
if (named2) {
  console.log(named2.type);
}

let named1 = Typed.named1.get('named1');
if (named1) {
  console.log(named1.type);
}
