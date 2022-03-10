import { User } from "@modules/users/entities/User";
import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUserUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
    showUserProfileUserUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to return the user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Guilherme",
      email: "guilherme@gui.com",
      password: "1234",
    });

    const userProfile = await showUserProfileUserUseCase.execute(user.id)

    console.log(userProfile)

    expect(userProfile).toBeInstanceOf(User)
  });

  it("should not be able to return the user profile of non-existent user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Guilherme",
        email: "guilherme@gui.com",
        password: "1234",
      });

      await showUserProfileUserUseCase.execute("non-existent-user-id")
    }).rejects.toBeInstanceOf(AppError)
  });
})
