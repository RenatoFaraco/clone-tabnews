const calculadora = require('../models/calculadora.js');

test("somar 1 + 2 = 3", () => {
    expect(calculadora.somar(1, 2)).toBe(3);
});

test("somar 5 + 100 = 105", () => {
    expect(calculadora.somar(5, 100)).toBe(105);
});

test("somar banana + 100 = Erro", () => {
    expect(calculadora.somar("banana", 100)).toBe("Erro");
});
