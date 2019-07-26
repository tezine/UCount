import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalsService {

    static readonly appVersion="1.0.0";
}
