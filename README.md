# sfdx-itraceflag
[![Version](https://img.shields.io/npm/v/sfdx-itraceflag.svg)](https://npmjs.org/package/sfdx-itraceflag)
[![CircleCI](https://circleci.com/gh/Isai-ds/sfdx-itraceflag/tree/master.svg?style=shield)](https://circleci.com/gh/Isai-ds/sfdx-itraceflag/tree/master)
[![Codecov](https://codecov.io/gh/Isai-ds/sfdx-itraceflag/branch/master/graph/badge.svg)](https://codecov.io/gh/Isai-ds/sfdx-itraceflag)
[![Known Vulnerabilities](https://snyk.io/test/github/Isai-ds/sfdx-itraceflag/badge.svg)](https://snyk.io/test/github/Isai-ds/sfdx-itraceflag)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-itraceflag.svg)](https://npmjs.org/package/sfdx-itraceflag)
[![License](https://img.shields.io/npm/l/sfdx-itraceflag.svg)](https://github.com/Isai-ds/sfdx-itraceflag/blob/master/package.json)
## Description
Set debug trace flags and download logs for Replay Debugger

# Installation
```sh
sfdx plugins:install sfdx-itraceflag
```

# Usage

## trace:set:log
```sh
sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00'
```

```sh
sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00' -e 0051U000002O1Wg
```

<!-- commands -->
* [`sfdx trace:set:log -u <string> -s <datetime> -x <datetime> [-e <string>] [-l user|developer] [-d <string>] [--duration <minutes>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-tracesetlog--u-string--s-datetime--x-datetime--e-string--l-userdeveloper--d-string---duration-minutes---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx trace:set:log -u <string> -s <datetime> -x <datetime> [-e <string>] [-l user|developer] [-d <string>] [--duration <minutes>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Create a trace record flag in the target org
```
USAGE
  $ sfdx trace:set:log -u <string> -s <datetime> -x <datetime> [-e <string>] [-l user|developer] [-d <string>] 
  [--duration <minutes>] [--apiversion <string>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -s, --stardate                                                                    date and time when the trace flag
                                                                                    take effect. Expiration date mus be
                                                                                    less 24 hours

  -x, --expirationdate                                                              date an time when the trace flag
                                                                                    expires

  -e, --entity                                                                      [default: targetusername]
                                                                                    salesforce user id to set the trace

  -l, --logtype                                                                     [default: user] salesforce log types:
                                                                                    DEVELOPER_LOG or USER_DEBUG are oly 
                                                                                    available
  
  -d, --debuglevelname                                                              [default: SFDC_DevConsole] developer 
                                                                                    name of the debug level to assign

  --duration=duration                                                               trace log duration in minutes. 
                                                                                    Default 30 minutes. Duration parameter 
                                                                                    is ignored when expirationdate is 
                                                                                    not null
  
  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```
<!-- commandsstop -->

## trace:get:logs
```sh
sfdx trace:get:logs -u myOrg -d /documents/log 
```

```sh
sfdx trace:get:logs -u myOrg -d /documents/log -f "Operation = 'VFRemoting' AND Status != 'Success'"
```
<!-- commands -->
* [`sfdx trace:get:logs -u <string> -d <directory> [-e <string>] [-f <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-tracegetlogs--u-string--d-directory--e-string--f-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx trace:get:logs -u <string> -d <directory> [-e <string>] [-f <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Download and save salesforce logs locally
```
USAGE
  $ sfdx trace:get:logs -u <string> -d <directory> [-e <string>] [-f <string>] [--apiversion <string>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -d, --directory                                                                   source folder to save the logs

  -e, --expirationdate                                                              date an time when the trace flag
                                                                                    expires

  -e, --entity                                                                      [default: targetusername]
                                                                                    salesforce user id whose actions 
                                                                                    triggered the logs
  
  -f, --filter                                                                      filter to query and get the logs. 
                                                                                    The filter string must be enclosed 
                                                                                    in double quotes. For example, 
                                                                                    f="Status != 'Success'"
  
  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```
<!-- commandsstop -->
