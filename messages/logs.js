module.exports = {
  "commandDescription": "Download and save salesforce logs locally", 
  "entity": "[default: targetusername] salesforce user id or username whose actions triggered the logs",
  "filter": "filter to query and get the logs. The filter string must be enclosed in double quotes. For example f=\"Status != 'Success'\"",
  "directory": "source folder to save the logs",
  "errorNoOrgResults": "No results found for the org '%s'",
  "errorEntity": "No results found for user %s",
  "errorPath": "The directory path does not exist. Please review it",
  "errorInvalidField": "Invalid field. The field %s not exist",
  "errorMalformedQuery": "Malformed filter parameter. Please review the help",
  "commandExample1": `$ sfdx trace:get:logs -u myOrg -d /documents/log`,
  "commandExample2": `$ sfdx trace:get:logs -u myOrg -d /documents/log -e 0051U000002O1Wg`,
  "commandExample3": `$ sfdx trace:get:logs -u myOrg -d /documents/log -f "Operation = 'VFRemoting' AND Status != 'Success'"`,
}
