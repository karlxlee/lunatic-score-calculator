SELECT VOTER AS ADDRESS, COUNT(DISTINCT TX_ID) AS COUNT FROM terra.gov_vote
WHERE TX_STATUS = 'SUCCEEDED'
GROUP BY ADDRESS