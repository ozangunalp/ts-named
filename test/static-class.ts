import { named } from '../';
import { Enum } from './Enum';

export class Typed extends Enum<Typed> {
  static readonly named1 = named(id => new Typed(id, 'Type'));
  static readonly named2 = named(id => new Typed(id, 'Other Type'));
  static readonly named3 = named(id => new Typed(id, Typed.named2.id));
  static readonly named4 = named(id => new Typed(id, Typed.named2.id));

  static readonly d: number = 4;

  private constructor(readonly id: string, readonly type: string) {
    super(id);
  }
}

console.log('is equal ? ');
console.log(Typed.named3.id === Typed.named4.id);

console.log('values');
console.log(Typed.prototype.values());

console.log('named2');
console.log(Typed.prototype.get('named2'));

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
