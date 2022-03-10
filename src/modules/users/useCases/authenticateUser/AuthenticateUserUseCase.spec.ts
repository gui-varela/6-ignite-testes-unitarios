import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate an user", async () => {
    const data = {
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    }

    const user = await createUserUseCase.execute(data);

    const session = await authenticateUserUseCase.execute({
      email: user.email,
      password: "1234",
    })

    expect(session).toHaveProperty("token");
  });

  it("should not be able to authenticate an user with wrong password", () => {
    expect(async () => {
      const data = {
        name: "Guilherme",
        email: "guilherme@gui.com",
        password: "1234",
      }

      const user = await createUserUseCase.execute(data);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "4321",
      })

    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate an user with wrong email", () => {
    expect(async () => {
      const data = {
        name: "Guilherme",
        email: "guilherme@gui.com",
        password: "1234",
      }

      await createUserUseCase.execute(data);

      await authenticateUserUseCase.execute({
        email: "guillermo@gui.com",
        password: data.password,
      })

    }).rejects.toBeInstanceOf(AppError);
  });
})
