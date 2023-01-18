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
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthService, AuthGuard, CurrentUser, UserDto } from '@node-ms/auth';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.ticketsService.create(createTicketDto, user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.ticketsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.ticketsService.findOneBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
