import { Module } from '@nestjs/common';
import { TrackerUsecase } from './tracker/application/usecase/tracker.create.usecase';
import { UserService } from './user/user.service';

@Module({
  providers: [TrackerUsecase, UserService],
})
export class AppModule {}
