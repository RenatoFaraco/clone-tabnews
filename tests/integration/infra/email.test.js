import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();
    await email.send({
      from: "Teste <contato@teste.com.br>",
      to: "contato@gmail.com.br",
      subject: "Teste de assunto",
      text: "Teste de corpo",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<contato@teste.com.br>");
    expect(lastEmail.recipients[0]).toBe("<contato@gmail.com.br>");
    expect(lastEmail.subject).toBe("Teste de assunto");
    expect(lastEmail.text).toBe("Teste de corpo\n");
  });
});
