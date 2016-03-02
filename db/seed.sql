INSERT INTO restaurants (name, neighborhood, phone, address, city, state, cuisine, website) VALUES ('The Little Owl', 'West Village', '2127414695', '90 Bedford St', 'New York', 'NY', 'American (New)', 'thelittleowlnyc.com');
INSERT INTO restaurants (name, neighborhood, phone, address, city, state, cuisine, website) VALUES ('dellanima', 'West Village', '2123666633', '38 8th Ave', 'New York', 'NY', 'Italian', 'www.dellanima.com');
INSERT INTO restaurants (name, neighborhood, phone, address, city, state, cuisine, website) VALUES ('Sushi of Gari', 'Upper East Side', '2125175340', '402 E 78th St', 'New York', 'NY', 'Japanese', 'www.sushiofgari.com/sog.html');
INSERT INTO restaurants (name, neighborhood, phone, address, city, state, cuisine, website) VALUES ('Carbone', 'Greenwich Village', '2122543000', '181 Thompson St', 'New York', 'NY', 'Japanese', 'www.sushiofgari.com/sog.html');
INSERT INTO restaurants (name, neighborhood, phone, address, city, state, cuisine, website) VALUES ('Swine', 'Nolita', '2129937189', '248 Mulberry St', 'New York', 'NY', 'American (New)', 'swinenyc.com');
INSERT INTO restaurants (name, neighborhood, phone, address, city, state, cuisine, website) VALUES ('Parm', 'Upper East Side', '2125175340', '402 E 78th St', 'New York', 'NY', 'Italian', 'parmnyc.com');
INSERT INTO restaurants (name, neighborhood, phone, address, city, state, cuisine, website) VALUES ('Salinas', 'Chelsea', '2127761990', '136 9th Ave', 'New York', 'NY', 'Spanish', 'salinasnyc.com');

-- add restaurants to the user
INSERT INTO rests_users_join VALUES (3, 3, FALSE);
INSERT INTO rests_users_join VALUES (2, 2, FALSE);

-- update the user's record from visited to not visited
UPDATE rests_users_join
SET visited=TRUE
WHERE rest_id=3 AND user_id=3;
