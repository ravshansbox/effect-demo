import { Effect } from 'effect';
import { SqlClient } from '@effect/sql';

export default Effect.flatMap(
  SqlClient.SqlClient,
  (sql) => sql`
    create table users (
      id serial primary key,
      name varchar(255) not null,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    )
  `
);
