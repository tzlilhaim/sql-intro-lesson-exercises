USE sql_intro;

UPDATE Dolphin
SET healthy = 0
WHERE color = "green" OR color = "brown";