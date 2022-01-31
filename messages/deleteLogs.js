module.exports = {
  "commandDescription": "Delete salesforce logs", 
  "entity": "[default: targetusername] salesforce user id whose actions triggered the logs",
  "filter": "filter to query and delete the logs. The filter string must be enclosed in double quotes. For example f=\"Status != 'Success'\"",  
  "all": "remove all logs from the target org. Ignore the entity,or target user or any filter", 
  "errorNoOrgResults": "No results found for the org '%s'",
  "errorEntity": "No results found for user id %s",
  "errorInvalidField": "Invalid field. The field %s not exist",
  "errorMalformedQuery": "Malformed filter parameter. Please review the help",
  "commandExample1": `$ sfdx trace:delete:logs -u myOrg -e 0051U000002O1Wg`,
  "commandExample2": `$ sfdx trace:delete:logs -u myOrg -f "Operation = 'VFRemoting' AND Status != 'Success'"`,
  "commandExample3": `$ sfdx trace:delete:logs -u myOrg --all`,
}
