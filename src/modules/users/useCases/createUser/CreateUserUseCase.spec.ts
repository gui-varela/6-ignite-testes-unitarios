import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to create an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    })

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create users with an existing email", () => {
    expect( async () => {
      await createUserUseCase.execute({
        name: "Guilherme",
        email: "guilherme@gui.com",
        password: "1234",
      });

      await createUserUseCase.execute({
        name: "Guillermo",
        email: "guilherme@gui.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
