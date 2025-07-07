import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './domain/movie.domain';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMovieDto: CreateMovieDto) {
    const movie = await this.moviesService.create(createMovieDto);
    return movie;
  }

  @Get()
  async findAll() {
    const movies = await this.moviesService.findAll();
    return movies;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ movie: Movie }> {
    const movie = await this.moviesService.findOne(id);
    return { movie };
  }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateMovieDto: UpdateMovieDto,
  // ): Promise<{ movie: Movie }> {
  //   const movie = await this.moviesService.update(id, updateMovieDto);
  //   return { movie };
  // }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.moviesService.remove(id);
  }
}
