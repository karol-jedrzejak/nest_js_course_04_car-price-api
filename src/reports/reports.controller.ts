import { 
    Controller,
    Post,
    Get,
    Body,
    UseGuards
} from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDTO } from './dtos/report.dto';
import { serialize } from 'v8';



@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService){

    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDTO)
    createReport(@Body() body:CreateReportDTO, @CurrentUser() user: User){
        return this.reportService.create(body,user);
    }

}
