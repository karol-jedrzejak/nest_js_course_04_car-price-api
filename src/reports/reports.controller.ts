import { 
    Controller,
    Post,
    Body,
    UseGuards,
    Patch,
    Param,
    Get,
    Query
} from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDTO } from './dtos/report.dto';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService){}

    @Get()
    getEstimate(@Query() query: GetEstimateDTO){
        return this.reportService.createEstimate(query);
    }


    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDTO)
    createReport(@Body() body:CreateReportDTO, @CurrentUser() user: User){
        return this.reportService.create(body,user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id:string, @Body() body:ApproveReportDTO){
        return this.reportService.changeApproval(body.approved,id);
    }

}
