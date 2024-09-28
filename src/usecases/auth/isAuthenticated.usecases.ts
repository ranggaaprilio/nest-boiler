import { UserM, UserWithoutPassword } from '../../domain/model/user'
import { UserRepository } from '../../domain/repositories/userRepository.interface'

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: UserRepository) {}

  async execute(username: string): Promise<UserWithoutPassword> {
    const user: UserM = await this.adminUserRepo.getUserByUsername(username)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = user
    return info
  }
}
