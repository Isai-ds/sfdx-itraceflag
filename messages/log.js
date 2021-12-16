module.exports = {
  "commandDescription": "Set a trace flag for the specified user", 
  "entity": "[default: targetusername] salesforce user id to set the trace",
  "logType": "salesforce log types: DEVELOPER_LOG or USER_DEBUG are only available",
  "startDate": "date and time when the trace flag take effect. Expiration date mus be less 24 hours",
  "expirationDate": "date an time when the trace flag expires",
  "debugLevelName": "developer name of the debug level to assign",
  "errorNoOrgResults": "No results found for the org '%s'",
  "errorDebugLevelName": "No results found for debug level %s",
  "errorEntity": "No results found for user id %s",
  "errorLogType": "Invalid option %s",
  "errorInvalidExpirationDate": "Your expirationdate must be in future",
  "errorInvalidDateRanges": "Invalid ranges. Your startdate is greater than your expiration date",
  "errorMaximumTimeFrame": "The maximum time for the trace is 24 hours",
  "commandExample1": `$ sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00'`,
  "commandExample2": `$ sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00' -e 0051U000002O1Wg`,
  "commandExample3": `$ sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00' -d Custom_Log_Type -l developer`,

}
