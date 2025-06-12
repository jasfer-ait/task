import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createDto: CreateProductDto, imageFiles: Express.Multer.File[]) {
    const imagePaths = imageFiles.map(file => file.filename);
    const newProduct = new this.productModel({
      ...createDto,
      images: imagePaths,
    });
    return newProduct.save();
  }

  async findAll(filters: any) {
    const query: any = {};
    if (filters.name) query.name = { $regex: filters.name, $options: 'i' };
    if (filters.stock) query.stock = { $gte: Number(filters.stock) };
    if (filters.createdAt) {
      query.createdAt = {
        $gte: new Date(filters.createdAt),
        $lte: new Date(filters.createdAt + 'T23:59:59'),
      };
    }
    return this.productModel.find(query);
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
