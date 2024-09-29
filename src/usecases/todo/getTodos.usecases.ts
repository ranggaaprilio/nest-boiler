import { TodoM } from '../../domain/model/todo'
import { TodoRepository } from '../../domain/repositories/todoRepository.interface'

export class GetTodosUseCases {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(): Promise<TodoM[]> {
    return await this.todoRepository.findAll()
  }
}
