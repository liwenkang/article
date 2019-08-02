import { Test, TestingModule } from '@nestjs/testing';
import { NetworkParameterPlanningService } from '../network-parameter-planning.service';

describe('NetworkParameterPlanningService', () => {
  let service: NetworkParameterPlanningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkParameterPlanningService],
    }).compile();

    service = module.get<NetworkParameterPlanningService>(NetworkParameterPlanningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
