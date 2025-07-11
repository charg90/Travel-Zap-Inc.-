import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastNameToActors1751905297201 implements MigrationInterface {
  name = 'AddLastNameToActors1751905297201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "actor" ADD "last_name" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "actor" DROP COLUMN "last_name"`);
  }
}
