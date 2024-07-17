import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './task.repository';
import { TaskStatus } from './task.status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    //initialize a NestJS module with tasksService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaksById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTaksById', () => {
    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someUd', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
