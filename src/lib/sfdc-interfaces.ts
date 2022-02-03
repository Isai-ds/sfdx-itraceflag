import { RecordResult } from "jsforce";
import { ApexLogFile } from "./itrace-interfaces";

export interface Organization {
    Name: string;
    TrialExpirationDate: string;
    TimeZoneSidKey: string;
}

export interface Entity {
    Id: string;
    Email: string;
    UserName: String;
}

export interface DebugLevel{
    Id: string;
    DeveloperName: string;
    ApexCode: string;
    ApexProfiling: string;
    Callout: string; 
    Database: string;
    System: string;
    Validation: string;
    Visualforce: string;
}

export interface TraceFlag{
    Id: string;
    StartDate: Date;
    ExpirationDate: Date; 
    LogType: string;
    TracedEntityId: string;
    DebugLevelId: string;
}

export interface ApexLog{
    Id: string;
    LogLength: number;
    Status: string;
}

export interface ApexLogResponse{
    body: string
}

export interface ISalesforceDAO {
    getOrganization(): Promise<Organization[]>    
    getEntity(entity: string): Promise<Entity[]>
    getDebugLevelName(name: string): Promise<DebugLevel[]>
    getTraceFlag(tracedEntityId: string, logType: string): Promise<TraceFlag[]>
    getApexLogs(query:string): Promise<ApexLog[]>
    createTraceFlag(traceFlag: TraceFlag): Promise<RecordResult>
    updateTraceFlag(traceFlag: TraceFlag): Promise<RecordResult>
    updateTraceFlag(traceFlag: TraceFlag): Promise<RecordResult>
    deleteApexLogs(ids: string[]): Promise<RecordResult[]>
}

export interface ISalesforceHandler {
    getEntity(): Entity
    getDebugLevel(): DebugLevel
    execute(): Promise<void>
}

export interface ISalesforceREST {
    getLogRequest(logId: string): Promise<ApexLogFile>
    getLogs(logs: ApexLog[]): Promise<ApexLogFile>[]
}
