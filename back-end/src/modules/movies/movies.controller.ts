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
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PublicRoute } from 'src/decorators/public-route.decorator';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMovieDto: CreateMovieDto) {
    const movie = await this.moviesService.create(createMovieDto);
    return movie;
  }
  @PublicRoute()
  @Get()
  async findAll(
    @Query('page') page,
    @Query('limit') limit,
    @Query('search') search?: string,
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const movies = await this.moviesService.findAll(
      pageNumber,
      limitNumber,
      search,
    );
    return movies;
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(id);
    return movie;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const movie = await this.moviesService.update(id, updateMovieDto);
    return movie;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.moviesService.remove(id);
  }
}
