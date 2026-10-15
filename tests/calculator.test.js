const Calculator = require('../src/calculator');

describe('Calculator', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  test('penjumlahan', () => {
    expect(calc.add(5, 3)).toBe(8);
  });

  test('pengurangan', () => {
    expect(calc.subtract(5, 3)).toBe(2);
  });

  test('perkalian', () => {
    expect(calc.multiply(5, 3)).toBe(15);
  });

  test('pembagian', () => {
    expect(calc.divide(10, 2)).toBe(5);
  });

  test('pembagian dengan nol menghasilkan error', () => {
    expect(() => calc.divide(10, 0)).toThrow('Cannot divide by zero');
  });
});