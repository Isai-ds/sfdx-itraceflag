import { ApexLogFile, IDirectory } from "../lib/itrace-interfaces";
import * as fs from "fs-extra"
import * as path from 'path'
import { ITraceError } from "../lib/ItraceError";
import { Messages } from "@salesforce/core";
import { ItraceConstants } from "../constants";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(ItraceConstants.PACKAGE_NAME, ItraceConstants.COMMAND_GET_LOG);

export function getInstance () : IDirectory{
    return new TraceFlagDirectory()
}

class TraceFlagDirectory {
    pathExists(pathDirectory: string): void {
        if (!fs.pathExistsSync(pathDirectory)){
            throw new ITraceError(messages.getMessage('errorPath'));     
        }
    }
    async saveLog(logFile: ApexLogFile, pathDirectory: string): Promise<void> {
        const name = path.join(pathDirectory,`${logFile.name}${ItraceConstants.LOG_EXTENSION}`)
        await fs.outputFile(name, logFile.body)
    }
}