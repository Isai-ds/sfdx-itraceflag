import {DebugLevel, Entity} from './sfdc-interfaces'

export interface Validation {
    validate (): void    
}

export interface IDirectory {
    pathExists(pathDirectory: string): void
    saveLog(logFile: ApexLogFile, pathDirectory: string): Promise<void>
}

export interface Configuration{
    entity: string;
    logtype?: string;
    startdate?: Date;
    expirationdate?: Date;
    debuglevelname?: string;
    filters?: string;
    directory?: string;
}

export interface TraceConfig {
    entity: Entity;
    debugLevel: DebugLevel;
    startDate: Date;
    expirationDate: Date;
    logType: string;
}

export interface TraceSaveLogConfig {
    entity: Entity;
    filters: string;
    directory: string;
}

export interface ApexLogFile {
    name: string;
    body: string;
}