DROP TABLE if EXISTS restaurants, users, rests_users_join CASCADE;

CREATE TABLE restaurants (
  rest_id SERIAL PRIMARY KEY UNIQUE,
  name VARCHAR(255),
  neighborhood VARCHAR(255),
  phone CHAR(10),
  address VARCHAR(255),
  city VARCHAR(255),
  state CHAR(2),
  cuisine VARCHAR(255),
  website VARCHAR(255),
  img_url VARCHAR(255)
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY UNIQUE,
  first VARCHAR(255),
  last VARCHAR(255),
  city VARCHAR(255),
  state CHAR(2),
  email VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE rests_users_join (
  rest_id integer REFERENCES restaurants,
  user_id integer REFERENCES users,
  visited boolean
);
