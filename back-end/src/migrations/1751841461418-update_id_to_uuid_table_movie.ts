import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIdToUuidTableMovie1751841461418 implements MigrationInterface {
    name = 'UpdateIdToUuidTableMovie1751841461418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_1a3badf27affbca3a224f01f7de"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "movieId"`);
        await queryRunner.query(`ALTER TABLE "rating" ADD "movieId" uuid`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "FK_992f9af300d8c96c46fea4e5419"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "PK_a69e570bd35d7cd2139d12270e9"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "PK_65be8ded67af2677acfd19854c2" PRIMARY KEY ("actorId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_992f9af300d8c96c46fea4e541"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP COLUMN "movieId"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD "movieId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "PK_65be8ded67af2677acfd19854c2"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "PK_a69e570bd35d7cd2139d12270e9" PRIMARY KEY ("actorId", "movieId")`);
        await queryRunner.query(`CREATE INDEX "IDX_992f9af300d8c96c46fea4e541" ON "movie_actors_actor" ("movieId") `);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_1a3badf27affbca3a224f01f7de" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "FK_992f9af300d8c96c46fea4e5419" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "FK_992f9af300d8c96c46fea4e5419"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_1a3badf27affbca3a224f01f7de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_992f9af300d8c96c46fea4e541"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "PK_a69e570bd35d7cd2139d12270e9"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "PK_65be8ded67af2677acfd19854c2" PRIMARY KEY ("actorId")`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP COLUMN "movieId"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD "movieId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_992f9af300d8c96c46fea4e541" ON "movie_actors_actor" ("movieId") `);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "PK_65be8ded67af2677acfd19854c2"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "PK_a69e570bd35d7cd2139d12270e9" PRIMARY KEY ("movieId", "actorId")`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "FK_992f9af300d8c96c46fea4e5419" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "movieId"`);
        await queryRunner.query(`ALTER TABLE "rating" ADD "movieId" integer`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_1a3badf27affbca3a224f01f7de" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
