import { 
    UseInterceptors,
    ClassSerializerInterceptor,
    ExecutionContext,
    CallHandler,
    NestInterceptor
 } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';


@UseInterceptors(ClassSerializerInterceptor)
export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle();
    }
}

