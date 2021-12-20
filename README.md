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
## trace:get:logs
```sh
sfdx trace:get:logs -u myOrg -d /documents/log 
```

```sh
sfdx trace:get:logs -u myOrg -d /documents/log -f "Operation = 'VFRemoting' AND Status != 'Success'"
```

## trace:set:log
```sh
sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00'
```

```sh
sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00' -e 0051U000002O1Wg
```
## Command Description
<!-- commands -->
* [`sfdx trace:get:logs -d <directory> [-e <id>] [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-tracegetlogs--d-directory--e-id--f-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx trace:set:log [-e <id>] [-l user|developer] [-s <datetime>] [-x <datetime>] [-d <string>] [--duration <minutes>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-tracesetlog--e-id--l-userdeveloper--s-datetime--x-datetime--d-string---duration-minutes--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx trace:get:logs -d <directory> [-e <id>] [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Download and save salesforce logs locally

```
Download and save salesforce logs locally

USAGE
  $ sfdx trace:get:logs -d <directory> [-e <id>] [-f <string>] [-u <string>] [--apiversion <string>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --directory=directory                                                         (required) source folder to save the
                                                                                    logs

  -e, --entity=entity                                                               [default: targetusername] salesforce
                                                                                    user id whose actions triggered the
                                                                                    logs

  -f, --filter=filter                                                               filter to query and get the logs.
                                                                                    The filter string must be enclosed
                                                                                    in double quotes. For example
                                                                                    f="Status != 'Success'"

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx trace:get:logs -u myOrg -d /documents/log
  $ sfdx trace:get:logs -u myOrg -d /documents/log -e 0051U000002O1Wg
  $ sfdx trace:get:logs -u myOrg -d /documents/log -f "Operation = 'VFRemoting' AND Status != 'Success'"
```

_See code: [lib/commands/trace/get/logs.js](https://github.com/Isai-ds/sfdx-itraceflag/blob/v0.0.3/lib/commands/trace/get/logs.js)_

## `sfdx trace:set:log [-e <id>] [-l user|developer] [-s <datetime>] [-x <datetime>] [-d <string>] [--duration <minutes>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Set a trace flag for the specified user

```
Set a trace flag for the specified user

USAGE
  $ sfdx trace:set:log [-e <id>] [-l user|developer] [-s <datetime>] [-x <datetime>] [-d <string>] [--duration 
  <minutes>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --debuglevelname=debuglevelname                                               [default: SFDC_DevConsole] developer
                                                                                    name of the debug level to assign

  -e, --entity=entity                                                               [default: targetusername] salesforce
                                                                                    user id to set the trace

  -l, --logtype=(user|developer)                                                    [default: user] salesforce log
                                                                                    types: DEVELOPER_LOG or USER_DEBUG
                                                                                    are only available

  -s, --startdate=startdate                                                         date and time when the trace flag
                                                                                    take effect. Expiration date mus be
                                                                                    less 24 hours

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -x, --expirationdate=expirationdate                                               date an time when the trace flag
                                                                                    expires

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --duration=duration                                                               trace log duration in minutes.
                                                                                    Default 30 minutes. Duration
                                                                                    parameter is ignored when
                                                                                    expirationdate is not null

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00'
  $ sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00' -e 0051U000002O1Wg
  $ sfdx trace:set:log -u myOrg -s 'Dec 16 2021 13:43' -x 'Dec 16 2021 15:00' -d Custom_Log_Type -l developer
```

_See code: [lib/commands/trace/set/log.js](https://github.com/Isai-ds/sfdx-itraceflag/blob/v0.0.3/lib/commands/trace/set/log.js)_
<!-- commandsstop -->
