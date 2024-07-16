import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from '../../../test/src/task/dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<Task[]> {
    const { search, status } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) query.andWhere('task.status = :status', { status });

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filter ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: UserEntity): Promise<Task> {
    const found = this.findOne({ where: { id, user } });

    if (!found) throw new NotFoundException(`Task with ID ${id} not found`);

    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);

    return task;
  }

  async deleteTask(
    deleteTaskDto: DeleteTaskDto,
    user: UserEntity,
  ): Promise<void> {
    const { id } = deleteTaskDto;
    const result = await this.delete({ id, user });

    if (result.affected === 0)
      throw new NotFoundException(`Task with the ID ${id} was not found.`);
  }

  async updateTask(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await this.save(task);

    return task;
  }
}
