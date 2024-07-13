import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from '../../../test/src/task/dto/create-task.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Task> {
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
}
