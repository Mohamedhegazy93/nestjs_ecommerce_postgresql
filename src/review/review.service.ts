import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Review } from './entities/review.entity';
import { Length } from 'class-validator';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}


  //CREATE REVIEW
  async create(createReviewDto: CreateReviewDto, prodcutId: number, payload) {
    const user = await this.usersRepository.findOneByOrFail({ id: payload.id });
    const product = await this.productsRepository.findOneByOrFail({
      id: prodcutId,
    });

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      product,
      user,
    });

    const saveReview = await this.reviewsRepository.save(review);
    return {
      message: 'reviewd scuessfully',
      saveReview,
    };
  }

  //GET ALL REVIEWS
  async findAll(pageNumber: number, reviewPerPage: number) {
    const reviews = await this.reviewsRepository.find({
      skip: reviewPerPage * (pageNumber - 1),
      take: reviewPerPage,
      relations: { product: true },
    });
    if (!reviews) {
      throw new NotFoundException('no reviews yet');
    }

    return {
      length: reviews.length,
      reviews,
    };
  }

  //GET REVIEWS FOR PRODUCT
  async findReviewsForProduct(productId: number, payload) {
    const reviews = await this.reviewsRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
    });
    if (!reviews) {
      throw new NotFoundException('no reviews for this product');
    }
    const user = await this.usersRepository.findOneBy({ id: payload.id });

    return reviews.map((review) => {
      const { user, ...rev } = review;
      return {
        Length: reviews.length,
        rev,
        userName: user?.userName,
      };
    });
  }

  //GET SPECIFIC REVIEW
  async getReview(id: number) {
    const review = await this.reviewsRepository.find({
      where: { id },
      relations: ['user'],
    });
    if (!review) {
      throw new NotFoundException();
    }

    return review;
  }

  // Update Review
  async update(id: number, updateReviewDto: UpdateReviewDto, payload) {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!review) {
      throw new NotFoundException();
    }

    if (review.user.id === payload.id || payload.role === 'admin') {
      this.reviewsRepository.merge(review, updateReviewDto);
      await this.reviewsRepository.save(review);

      return {
        message: 'reviewe updated sucessfully',
        review,
      };
    }
    throw new UnauthorizedException();
  }

  // Delete Review
  async remove(id: number, payload) {
    const review = await this.reviewsRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundException();
    }
    if (review.user.id === payload.id || payload.role === 'admin') {
      await this.reviewsRepository.remove(review);
      return { message: 'reviewe deleted sucessfully' };
    }
    throw new UnauthorizedException();
  }
}
