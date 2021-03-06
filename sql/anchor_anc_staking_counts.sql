WITH stakes as (
  SELECT msg_value : sender as ADDRESS, COUNT(DISTINCT TX_ID) AS COUNT FROM terra.msgs
  WHERE msg_value : execute_msg : send : contract = 'terra1f32xyep306hhcxxxf7mlyh0ucggc00rm2s9da5' -- Sends to governance contract
  AND msg_value : execute_msg : send : msg : stake_voting_tokens IS NOT NULL
  AND msg_value : contract = 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76' -- ANC token contract
  GROUP BY ADDRESS
)

SELECT LTRIM(ADDRESS) AS ADDRESS, COUNT FROM stakes
WHERE COUNT >= 0
