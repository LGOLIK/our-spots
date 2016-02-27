DROP TABLE if EXISTS restaurants, rests_users_join CASCADE;

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
  yelp VARCHAR(255)
);

CREATE TABLE rests_users_join (
  rest_id integer REFERENCES restaurants,
  user_id integer REFERENCES users,
  visited boolean
);
