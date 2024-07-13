import { IsNotEmpty } from 'class-validator';

export class DeleteTaskDto {
  @IsNotEmpty()
  id: string;
}
