-- Restaurants query

-- first select all restaurants
SELECT *
FROM restaurants
ORDER BY cuisine;

-- then select an array of restaurants associated with the logged in user
SELECT j.user_id, array_agg(j.rest_id) as rests
FROM rests_users_join AS j
WHERE j.user_id = 2
GROUP BY j.user_id;

-- in the restaurants ejs, only the restaurants that are not in the user array render.

-- SELECT r.rest_id, r.name, r.neighborhood, r.cuisine, j.user_id, sum(j.rest_id)
-- FROM restaurants AS r
-- FULL OUTER JOIN rests_users_join AS j
-- ON r.rest_id = j.rest_id
-- WHERE j.user_id = 2 or j.user_id IS NULL
-- GROUP BY r.rest_id, r.name, r.neighborhood, r.cuisine, j.user_id;



-- open restaurants query
SELECT r.*
FROM restaurants AS r
LEFT JOIN rests_users_join AS j
ON r.rest_id = j.rest_id
WHERE j.user_id = 3 AND j.visited = FALSE
ORDER BY cuisine;

-- restaurants I've been to query
SELECT r.*
FROM restaurants AS r
LEFT JOIN rests_users_join AS j
ON r.rest_id = j.rest_id
WHERE j.user_id = 3 AND j.visited = TRUE
ORDER BY cuisine;

SELECT masseuists.id as id, masseuists.name as name, array_agg(massages.name) as massages
FROM masseuists
LEFT JOIN proficiencies on proficiencies.masseuist_id = masseuists.id
LEFT JOIN massages on proficiencies.massage_id = massages.id
WHERE masseuists.id = $1
GROUP BY masseuists.name, masseuists.id;
