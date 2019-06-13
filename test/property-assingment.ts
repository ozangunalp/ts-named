import { named as _ } from '../';

const typed = {
  named1: _(id => ({ id: id, type: 'Type' })),
  named2: _(id => ({ id: id, type: 'Other Type' })),
};

console.log(typed.named1.id === 'named1');
console.log(typed.named2.id === 'named2');
