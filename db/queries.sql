-- Restaurants query

SELECT (r.name, r.neighborhood, r.cuisine, r.website)
FROM restaurants AS r
LEFT JOIN rests_users_join AS j
ON r.rest_id = j.rest_id
WHERE user_id != 3 OR user_id IS NULL
ORDER BY cuisine;

-- open restaurants query
SELECT (r.name, r.neighborhood, r.cuisine, r.website)
FROM restaurants AS r
LEFT JOIN rests_users_join AS j
ON r.rest_id = j.rest_id
WHERE j.user_id = 3 AND j.visited = FALSE
ORDER BY cuisine;
