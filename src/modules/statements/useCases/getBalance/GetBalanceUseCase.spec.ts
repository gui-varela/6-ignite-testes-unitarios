import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "@modules/statements/useCases/getBalance/GetBalanceUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance Use Case", () => {
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

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to list the balance of an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    });

    const depositOperation = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit"
    });

    const withdrawOperation = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Withdraw"
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id
    });

    const statements = balance.statement;

    const deposit = statements.find(statement => statement.id === depositOperation.id)
    const withdraw = statements.find(statement => statement.id === withdrawOperation.id)

    expect(balance).toHaveProperty("balance");

    expect(deposit).toHaveProperty("id");
    expect(deposit.type).toBe("deposit");

    expect(withdraw).toHaveProperty("id");
    expect(withdraw.type).toBe("withdraw");
  });
  it("should not be able to list statements of an non-existent user", async () => {
    await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    });

    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user_id_not_found",
      })
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to start user account with balance equal to zero", async () => {
    const user = await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    });


    const balance = await getBalanceUseCase.execute({
      user_id: user.id,
    })

    expect(balance.balance).toBe(0);
  });
});
