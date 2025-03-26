function somar(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return "Erro";
    }
    return a + b;
}

exports.somar = somar;

