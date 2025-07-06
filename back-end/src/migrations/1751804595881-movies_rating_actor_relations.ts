import { MigrationInterface, QueryRunner } from "typeorm";

export class MoviesRatingActorRelations1751804595881 implements MigrationInterface {
    name = 'MoviesRatingActorRelations1751804595881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "actor" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_05b325494fcc996a44ae6928e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rating" ("id" SERIAL NOT NULL, "score" integer NOT NULL, "comment" character varying NOT NULL, "movieId" integer, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie_actors_actor" ("movieId" integer NOT NULL, "actorId" integer NOT NULL, CONSTRAINT "PK_a69e570bd35d7cd2139d12270e9" PRIMARY KEY ("movieId", "actorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_992f9af300d8c96c46fea4e541" ON "movie_actors_actor" ("movieId") `);
        await queryRunner.query(`CREATE INDEX "IDX_65be8ded67af2677acfd19854c" ON "movie_actors_actor" ("actorId") `);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_1a3badf27affbca3a224f01f7de" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "FK_992f9af300d8c96c46fea4e5419" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "FK_65be8ded67af2677acfd19854c2" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "FK_65be8ded67af2677acfd19854c2"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "FK_992f9af300d8c96c46fea4e5419"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_1a3badf27affbca3a224f01f7de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65be8ded67af2677acfd19854c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_992f9af300d8c96c46fea4e541"`);
        await queryRunner.query(`DROP TABLE "movie_actors_actor"`);
        await queryRunner.query(`DROP TABLE "rating"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "actor"`);
    }

}
