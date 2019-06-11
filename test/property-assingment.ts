import { named } from '../';

const typed = {
  named1: named(id => ({ id: id, type: 'Type' })),
  named2: named(id => ({ id: id, type: 'Other Type' })),
};

console.log(typed.named1.id === 'named1');
console.log(typed.named2.id === 'named2');
