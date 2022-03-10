import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit"
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement for an non-existent user", async () => {
    await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user_id_not_found",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Deposit"
      })
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to withdraw if user has no founds", async () => {
    const user = await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Payment"
      })
    }).rejects.toBeInstanceOf(AppError);
  })
});
