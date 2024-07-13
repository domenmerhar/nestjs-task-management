import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from '../../../test/src/task/dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getTaskById(id: number): Promise<Task> {
    const found = await this.tasksRepository.getById(id);

    if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  deleteTask(deleteTaskDto: DeleteTaskDto): Promise<void> {
    return this.tasksRepository.deleteTask(deleteTaskDto);
  }

  // constructor(
  //   @InjectRepository(TaskRepository)
  //   private taskRepository: TaskRepository,
  // ) {}
  // async getTaskById(id: number) {
  //   const found = await this.taskRepository.find();
  //   if (!found) {
  //     throw new NotFoundException(`Task with ID "${id}" not found`);
  //   }
  //   return found;
  // }
}
