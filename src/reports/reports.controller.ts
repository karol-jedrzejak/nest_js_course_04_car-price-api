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


@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService){

    }

    @Post()
    @UseGuards(AuthGuard)
    createReport(@Body() body:CreateReportDTO){
        return this.reportService.create(body);
    }

}
