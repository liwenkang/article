import { Test, TestingModule } from '@nestjs/testing';
import { DynamicResourceAllocationService } from '../dynamic-resource-allocation.service';

describe('DynamicResourceAllocationService', () => {
  let service: DynamicResourceAllocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicResourceAllocationService],
    }).compile();

    service = module.get<DynamicResourceAllocationService>(DynamicResourceAllocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
