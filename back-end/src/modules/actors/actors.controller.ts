import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Post()
  create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.create(createActorDto);
  }

  @Post(':actorId/add-to-movie/:movieId')
  async addActorToMovie(
    @Param('actorId') actorId: string,
    @Param('movieId') movieId: string,
  ) {
    return this.actorsService.addActorToMovie(actorId, movieId);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.actorsService.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actorsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActorDto: UpdateActorDto) {
    return this.actorsService.update(id, updateActorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actorsService.remove(id);
  }
}
