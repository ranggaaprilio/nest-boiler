import { TodoM } from '../../domain/model/todo'
import { TodoRepository } from '../../domain/repositories/todoRepository.interface'

export class GetTodoUseCases {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: number): Promise<TodoM> {
    const result= await this.todoRepository.findById(id)
    if (!result) {
      throw new Error('Todo not found')
    }
    return result
  }
}
