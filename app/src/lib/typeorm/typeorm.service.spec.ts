import { Test, TestingModule } from '@nestjs/testing';
import { TypeormService } from './typeorm.service';
import { TypeormModule } from './typeorm.module';
import { MPetType } from 'src/modules/models';

describe('TypeormService', () => {
  let typeormService: TypeormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeormModule],
      providers: [TypeormService],
    }).compile();
    typeormService = module.get<TypeormService>(TypeormService);
  });

  // afterEach(async (done) => {
  //   await typeormService.close();
  //   done();
  // });

  describe('TypeormService.findOne', () => {
    it('SELECT * FROM sample_table_01', async () => {
      const got = await typeormService.findOne<MPetType>(MPetType, {
        where: {
          id: 1,
        },
      });
      console.log(got);
    });
    it('SELECT 1', async () => {
      const got = await typeormService.select('select 1');
      console.log(got);
    });
  });
});
