import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from '../../../test/src/task/dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTaskById(id: string): Promise<Task> {
    return this.findOne({ where: { id } });
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  async deleteTask(deleteTaskDto: DeleteTaskDto): Promise<void> {
    const { id } = deleteTaskDto;
    const result = await this.delete({ id });

    if (result.affected === 0)
      throw new NotFoundException(`Task with the ID ${id} was not found.`);
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.save(task);

    return task;
  }
}
