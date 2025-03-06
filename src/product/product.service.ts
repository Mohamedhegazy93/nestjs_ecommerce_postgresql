import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}
  // Create Product
  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    const saveProduct = await this.productsRepository.save(product);

    return {
      message: 'product created sucessfully',
      saveProduct,
    };
  }
  // Get All Products
  async findAll(title?: string, minPrice?: string, maxPrice?: string) {
    const filters = {
      ...(title ? { title: Like(`%${title}%`) } : {}),
      ...(minPrice && maxPrice
        ? { price: Between(parseInt(minPrice), parseInt(maxPrice)) }
        : {}),
    };
    const products = await this.productsRepository.find({
      where: filters,
      relations: { reviews: true },
    });
    return {
      length: products.length,
      products,
    };
  }
  // Get Product
  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'],
    });
    if (!product) {
      throw new NotFoundException(`no product for ${id} id`);
    }
    return {
      product,
    };
  }
  // Update Product
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`no product for ${id} id`);
    }
    this.productsRepository.merge(product, updateProductDto);
    await this.productsRepository.save(product);

    return {
      message: 'product updated sucessfully',
      product,
    };
  }
  // Delete Product
  async remove(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`no product for ${id} id`);
    }

    await this.productsRepository.remove(product);
    return {
      message: 'product deleted sucessfully',
    };
  }
}
