/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call productService.create', async () => {
    const dto: CreateProductDto = {
      name: 'Test',
      stock: 5,
      price: 0,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const files = [{ filename: 'img.jpg' }] as any;
    await controller.create(dto, { images: files });
    expect(service.create).toHaveBeenCalledWith(dto, files);
  });

  it('should call productService.findAll', () => {
    const query = { name: 'Test' };
    controller.findAll(query);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should call productService.findOne', () => {
    controller.findOne('123');
    expect(service.findOne).toHaveBeenCalledWith('123');
  });

  it('should call productService.update', () => {
    const updateDto: UpdateProductDto = { name: 'Updated' };
    controller.update('123', updateDto);
    expect(service.update).toHaveBeenCalledWith('123', updateDto);
  });

  it('should call productService.remove', () => {
    controller.remove('123');
    expect(service.remove).toHaveBeenCalledWith('123');
  });
});
