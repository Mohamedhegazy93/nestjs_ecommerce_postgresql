import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  // POST: ~/review/:id
  @Post(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Param('id', ParseIntPipe) prodcutId: string,
    @Req() req,
  ) {
    return this.reviewService.create(createReviewDto, +prodcutId, req.user);
  }

  // GET: ~/review
  @Get()
  findAll(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('reviewPerPage', ParseIntPipe) reviewPerPage: number,
  ) {
    return this.reviewService.findAll(pageNumber, reviewPerPage);
  }

  // GET: ~/review/:productId/reviews
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @Get(':productId/reviews')
  findReviewForProduct(@Param('productId') productId: string, @Req() req) {
    return this.reviewService.findReviewsForProduct(+productId, req.user);
  }
  // GET: ~/review/:id
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @Get(':id')
  getReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.getReview(id);
  }
  // UPDATE: ~/review/:id
  @UseGuards(AuthGuard)
  @Roles(Role.User, Role.Admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    return this.reviewService.update(+id, updateReviewDto, req.user);
  }
  // DELETE: ~/review/:id
  @UseGuards(AuthGuard)
  @Roles(Role.User, Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @Req() req) {
    return this.reviewService.remove(+id, req.user);
  }
}
