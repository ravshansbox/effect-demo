import { Effect, Layer, pipe, Redacted } from 'effect';
import { NodeContext, NodeRuntime } from '@effect/platform-node';
import { PgClient, PgMigrator } from '@effect/sql-pg';
import { SqlClient } from '@effect/sql';
import { DATABASE_URL, MIGRATIONS_DIR, MIGRATIONS_TABLE } from './constants';

const SqlLive = PgClient.layer({ url: Redacted.make(DATABASE_URL) });

const MigratorLive = PgMigrator.layer({
  loader: PgMigrator.fromFileSystem(MIGRATIONS_DIR),
  table: MIGRATIONS_TABLE,
}).pipe(Layer.provide(SqlLive));

const EnvLive = Layer.mergeAll(SqlLive, MigratorLive).pipe(
  Layer.provide(NodeContext.layer)
);

const getUserByUsername = (username: string) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    return yield* sql<{
      readonly id: number;
      readonly name: string;
    }>`select id, name from users where name = ${username}`;
  });

const program = Effect.gen(function* () {
  const user = yield* getUserByUsername('John');

  yield* Effect.log(user);
});

pipe(program, Effect.provide(EnvLive), NodeRuntime.runMain);
