import { Test, TestingModule } from '@nestjs/testing';
import { DynamicResourceAllocationController } from '../dynamic-resource-allocation.controller';

describe('DynamicResourceAllocation Controller', () => {
  let controller: DynamicResourceAllocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicResourceAllocationController],
    }).compile();

    controller = module.get<DynamicResourceAllocationController>(DynamicResourceAllocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
