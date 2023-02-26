import { Column, Entity } from 'typeorm';

@Entity('m_pet_type', { schema: 'sample' })
export class MPetType {
  @Column('int', {
    primary: true,
    name: 'id',
    comment: 'id',
  })
  id: number;

  @Column('char', {
    name: 'code',
    length: 3,
  })
  code: string;

  @Column('varchar', {
    name: 'value',
    length: 256,
  })
  value: string;

  @Column('char', {
    name: 'create_user_cd',
    nullable: false,
    length: 10,
  })
  createUserCd: string;

  @Column({
    name: 'created_at',
    type: 'datetime',
    nullable: false,
  })
  cretedAt: string;

  @Column('char', {
    name: 'update_user_cd',
    nullable: false,
    length: 10,
  })
  updateUserCd: string;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    nullable: false,
  })
  updatedAt: string;
}
