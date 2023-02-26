import { Test } from '@nestjs/testing';
import { TypeOrmService } from './typeorm.service';
import { TypeOrmModule } from './typeorm.module';
import { LoggerModule } from 'src/logger';
import { In, EntityManager } from 'src/interface';

import { MPetType } from 'src/modules/models';

describe('TypeormService', () => {
  let typeormService: TypeOrmService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule, LoggerModule],
      providers: [TypeOrmService],
    }).compile();
    typeormService = module.get<TypeOrmService>(TypeOrmService);
    await typeormService.initialize();
  });

  afterEach(async () => {
    await typeormService.close();
  });

  describe('TypeormService.find()', () => {
    it('should return array', async () => {
      await expect(
        typeormService.find<MPetType>(MPetType, {
          where: {
            id: In([1, 2]),
          },
        }),
      ).resolves.toEqual([
        {
          id: 1,
          code: '001',
          value: '猫',
          createUserCd: 'SYSTEM',
          createdAt: new Date('2023-02-25T10:46:47.000Z'),
          updateUserCd: 'SYSTEM',
          updatedAt: new Date('2023-02-25T10:46:47.000Z'),
        },
        {
          id: 2,
          code: '002',
          value: '犬',
          createUserCd: 'SYSTEM',
          createdAt: new Date('2023-02-25T10:46:47.000Z'),
          updateUserCd: 'SYSTEM',
          updatedAt: new Date('2023-02-25T10:46:47.000Z'),
        },
      ]);
    });

    it('should return empty array', async () => {
      await expect(
        typeormService.find<MPetType>(MPetType, {
          where: {
            id: 100,
          },
        }),
      ).resolves.toEqual([]);
    });
  });

  describe('TypeormService.findOne()', () => {
    it('should return a value', async () => {
      await expect(
        typeormService.findOne<MPetType>(MPetType, {
          where: {
            code: '001',
          },
        }),
      ).resolves.toEqual({
        id: 1,
        code: '001',
        value: '猫',
        createUserCd: 'SYSTEM',
        createdAt: new Date('2023-02-25T10:46:47.000Z'),
        updateUserCd: 'SYSTEM',
        updatedAt: new Date('2023-02-25T10:46:47.000Z'),
      });
    });

    it('should return a value', async () => {
      await expect(
        typeormService.findOne<MPetType>(MPetType, {
          where: {
            id: 100,
          },
        }),
      ).resolves.toBeNull();
    });
  });

  describe('TypeormService.insert()', () => {
    it('should return a value', async () => {
      await typeormService
        .query('DELETE FROM m_pet_type WHERE id = 8')
        .catch((err) => {
          throw err;
        });

      await expect(
        typeormService.insert<MPetType>(MPetType, {
          id: 8,
          code: '008',
          value: '鹿',
        }),
      ).resolves.toEqual({
        generatedMaps: [{}],
        identifiers: [
          {
            id: 8,
          },
        ],
        raw: {
          affectedRows: 1,
          fieldCount: 0,
          info: '',
          insertId: 8,
          serverStatus: 2,
          warningStatus: 0,
        },
      });
    });
  });

  describe('TypeormService.delete()', () => {
    it('should return a value', async () => {
      typeormService.insert<MPetType>(MPetType, {
        id: 9,
        code: '009',
        value: '蛇',
      });

      await expect(
        typeormService.delete<MPetType>(MPetType, {
          id: 9,
        }),
      ).resolves.toEqual({
        affected: 1,
        raw: [],
      });
    });
  });

  describe('TypeormService.query()', () => {
    it('SELECT 1 should return array result', async () => {
      await expect(typeormService.query('select 1')).resolves.toEqual([
        {
          '1': '1',
        },
      ]);
    });

    it('INSERT value to m_pet_type should return object', async () => {
      await typeormService
        .query('DELETE FROM m_pet_type WHERE id = 6')
        .catch((err) => {
          throw err;
        });

      const query =
        'INSERT INTO `m_pet_type` (`id`, `code`, `value`) VALUES (6, ?, ?);';
      await expect(typeormService.query(query, ['005', '豹'])).resolves.toEqual(
        {
          affectedRows: 1,
          fieldCount: 0,
          info: '',
          insertId: 6,
          serverStatus: 2,
          warningStatus: 0,
        },
      );
    });
  });

  describe('TypeormService.namedQuery()', () => {
    it('SELECT * FROM m_pet_type WHERE id in (:...ids) should return array result', async () => {
      await expect(
        typeormService.namedQuery(
          'SELECT * FROM m_pet_type WHERE id in (:...ids)',
          {
            ids: [1, 2],
          },
        ),
      ).resolves.toEqual([
        {
          id: 1,
          code: '001',
          value: '猫',
          create_user_cd: 'SYSTEM',
          created_at: new Date('2023-02-25T10:46:47.000Z'),
          update_user_cd: 'SYSTEM',
          updated_at: new Date('2023-02-25T10:46:47.000Z'),
        },
        {
          id: 2,
          code: '002',
          value: '犬',
          create_user_cd: 'SYSTEM',
          created_at: new Date('2023-02-25T10:46:47.000Z'),
          update_user_cd: 'SYSTEM',
          updated_at: new Date('2023-02-25T10:46:47.000Z'),
        },
      ]);
    });

    it('INSERT value to m_pet_type should return object', async () => {
      await typeormService
        .query('DELETE FROM m_pet_type WHERE id = 7')
        .catch((err) => {
          throw err;
        });

      const query =
        'INSERT INTO `m_pet_type` (`id`, `code`, `value`) VALUES (7, :code, :value);';
      await expect(
        typeormService.namedQuery(query, { code: '006', value: '熊' }),
      ).resolves.toEqual({
        affectedRows: 1,
        fieldCount: 0,
        info: '',
        insertId: 7,
        serverStatus: 2,
        warningStatus: 0,
      });
    });
  });

  describe('TypeormService.transact()', () => {
    it('single table insert and can see the data before commit', async () => {
      await expect(
        typeormService.transact(async (tx: EntityManager) => {
          await tx.delete<MPetType>(MPetType, { id: 9 });
          await tx.insert<MPetType>(MPetType, {
            id: 9,
            code: '009',
            value: '鯨',
          });
          await tx.findOne<MPetType>(MPetType, {
            where: { id: 9 },
          });
        }),
      ).resolves.toBeUndefined();
    });

    it('should return err', async () => {
      await expect(
        typeormService.transact(async () => {
          throw new Error('error!!');
        }),
      ).rejects.toEqual(new Error('error!!'));
    });

    it('single table insert then throw Duplicate entry error', async () => {
      await expect(
        typeormService.transact(async (tx: EntityManager) => {
          await tx.insert<MPetType>(MPetType, {
            id: 1,
            code: '009',
            value: '鯨',
          });
        }),
      ).rejects.toEqual(
        new Error("Duplicate entry '1' for key 'm_pet_type.PRIMARY'"),
      );
    });
  });
});
