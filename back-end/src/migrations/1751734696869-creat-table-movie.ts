import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatTableMovie1751734696869 implements MigrationInterface {
    name = 'CreatTableMovie1751734696869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "release_date" TIMESTAMP NOT NULL, "movie_title" character varying NOT NULL, "movie_description" character varying, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "movies"`);
    }

}
