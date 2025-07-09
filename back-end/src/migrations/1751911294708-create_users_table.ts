import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1751911294708 implements MigrationInterface {
    name = 'CreateUsersTable1751911294708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "actor" ALTER COLUMN "last_name" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actor" ALTER COLUMN "last_name" SET DEFAULT ''`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
