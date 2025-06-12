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
  //  Filter by name 
  if (filters.name) {
    query.name = { $regex: filters.name, $options: 'i' };
  }

  // Filter by stock 
  if (filters.stock) {
    const stockValue = Number(filters.stock);
    if (!isNaN(stockValue)) {
      query.stock = { $gte: stockValue };
    }
  }

  // Filter by created date (entire day range)
  if (filters.createdAt) {
    const date = new Date(filters.createdAt);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    query.createdAt = {
      $gte: date,
      $lt: nextDay,
    };
  }

  return this.productModel.find(query);
}


  async findOne(id: string) {
    const trimmedId = id.trim(); 
    const product = await this.productModel.findById(trimmedId);
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
