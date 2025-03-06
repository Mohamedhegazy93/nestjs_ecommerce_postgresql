import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
// POST: ~/product
  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
// GET: ~/product
  @Get()
  findAll(
    @Query('title') title:string,
    @Query('minPrice') minPrice:string,
    @Query('maxPrice') maxPrice:string,

) {
    return this.productService.findAll(title,minPrice,maxPrice);
  }
// GET: ~/product/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
  // UPDATE: ~/product/:id
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
  // Delete: ~/product/:id
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
