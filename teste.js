class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function salvarUsuario(input) {
  if (!input) {
    throw new ReferenceError("É necessário enviar o 'input'");
  }

  if (!input.name) {
    throw new ValidationError("Preencha seu nome competo");
  }

  if (!input.username) {
    throw new ValidationError("Preencha seu nome de usuário");
  }

  if (!input.age) {
    throw new ValidationError("Preencha sua idade");
  }
}

try {
  salvarUsuario({});
} catch (error) {
  if (error instanceof ReferenceError) {
    throw error;
  }
  if (error instanceof ValidationError) {
    console.log(error);
  }
}
