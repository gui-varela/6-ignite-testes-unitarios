import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationUseCase } from "@modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation Use Case", () => {
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

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to list statement operations", async () => {
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

    console.log({
      use_id: user.id,
      statement_id: statement.id
    })

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    });

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("user_id");
  });
  it("should not be able to list statements of an non-existent user", async () => {
    const user = await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user_id_not_found",
        statement_id: statement.id,
      })
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to list statements if the statement does't exist", async () => {
    const user = await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "Wrong id",
      })
    }).rejects.toBeInstanceOf(AppError);
  });
});
