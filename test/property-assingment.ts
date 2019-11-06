import { ID, named as _ } from '../';

const typed = {
  named1: _(id => ({ id: id, type: 'Type' })),
  named2: _(id => ({ id: id, type: 'Other Type' })),
  named3: ID,
};

interface Type {
  id: string;
  label: string;
}

const type1: Type = { id: ID, label: 'label1' };
const type2 = {
  subType21: { id: ID, label: 'label21' },
  subType22: { id: ID, label: 'label22' },
};

console.log(typed.named1.id === 'named1');
console.log(typed.named2.id === 'named2');
console.log(typed.named3 === 'typed');

console.log(type1.id === 'type1');
console.log(type2.subType21.id === 'subType21');
console.log(type2.subType21.id === 'subType21');
