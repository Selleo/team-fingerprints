import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class CategoryController {
  @Get()
  printSth() {
    return 'category path';
  }

  @Get(':categoryId')
  helloWorld(@Param('categoryId') categoryId: string): string {
    return categoryId;
  }
}
