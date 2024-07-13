import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from '../../../test/src/task/dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { TaskStatus } from './task.status.enum';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.getTaskById(id);

    if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  deleteTask(deleteTaskDto: DeleteTaskDto): Promise<void> {
    return this.tasksRepository.deleteTask(deleteTaskDto);
  }

  updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.tasksRepository.updateTask(id, status);
  }
}
