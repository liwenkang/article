import { Test, TestingModule } from '@nestjs/testing';
import { NetworkParameterPlanningController } from '../network-parameter-planning.controller';

describe('NetworkParameterPlanning Controller', () => {
  let controller: NetworkParameterPlanningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetworkParameterPlanningController],
    }).compile();

    controller = module.get<NetworkParameterPlanningController>(NetworkParameterPlanningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
