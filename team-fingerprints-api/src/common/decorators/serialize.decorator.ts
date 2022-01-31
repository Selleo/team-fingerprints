import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
