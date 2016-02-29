-- Restaurants query

-- this is one query that works for everything - returns only the restaurants not in a users list
SELECT r.*
FROM restaurants r
WHERE NOT EXISTS
  (SELECT j.* FROM rests_users_join j
   WHERE j.user_id = 3 AND r.rest_id = j.rest_id);


-- no longer working
-- first select all restaurants
-- SELECT *
-- FROM restaurants
-- ORDER BY cuisine;
--
-- -- then select an array of restaurants associated with the logged in user
-- SELECT j.user_id, array_agg(j.rest_id) as rests
-- FROM rests_users_join AS j
-- WHERE j.user_id = 2
-- GROUP BY j.user_id;

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
