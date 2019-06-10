import { named } from '../';

interface Element {
  id: string;
  type: string;
}

export class Typed implements Element {
  public static readonly named1 = named(id => new Typed(id, 'Type'));
  public static readonly named2 = named(id => new Typed(id, 'Other Type'));

  private constructor(public id: string, public type: string) {}
}

console.log(Typed.named1.id === 'named1');
console.log(Typed.named2.id === 'named2');
