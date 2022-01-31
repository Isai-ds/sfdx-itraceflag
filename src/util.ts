import { Messages } from "@salesforce/core";
import { ItraceConstants } from "./constants"
import { ITraceError } from "./lib/ItraceError"

Messages.importMessagesDirectory(__dirname);
const logsMessages = Messages.loadMessages(ItraceConstants.PACKAGE_NAME, ItraceConstants.COMMAND_GET_LOG);

export function isSFDCID (value: string): boolean{
    const regexExp = new RegExp('([a-zA-Z0-9]{18}|[a-zA-Z0-9]{15})$')
    return regexExp.test(value)
}

export function isEmpty(records: any[]){
    if (!records || records.length == 0 ){            
        return true
    }
    return false
}

export function handleQueryException (error){
    if (error.errorCode == ItraceConstants.MALFORMED_QUERY){
        throw new ITraceError(logsMessages.getMessage('errorMalformedQuery'));
    }else if (error.errorCode == ItraceConstants.INVALID_FIELD){
        const sString = 'No such column \'';
        const eString = '\' on entity';

        const si = error.message.indexOf(sString)
        const ei = error.message.indexOf(eString)
        const fieldName = error.message.substring(si + sString.length, ei)
        
        throw new ITraceError(logsMessages.getMessage('errorInvalidField',[fieldName]));

    }
}

export function chunkArray (arr: any[], size: number): any[]{
    const result = []
    for (let i = 0; i < arr.length; i += size){
        let chunk = arr.slice(i, i + size)
        result.push(chunk)
    }
    return result
}