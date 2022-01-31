import { Connection } from '@salesforce/core';
import * as util from '../util' 
import {Organization, Entity, DebugLevel, TraceFlag, ApexLog} from '../lib/sfdc-interfaces'
import {ISalesforceDAO} from '../lib/sfdc-interfaces'
import { RecordResult } from 'jsforce';


export function getInstance(connection: Connection): ISalesforceDAO{
    return new SalesforceDAO(connection)
}

class SalesforceDAO {
    connection: Connection
    constructor (connection: Connection){
        this.connection = connection
    }

    async getOrganization(): Promise<Organization[]>{
        const result = await this.connection.query<Organization>('SELECT Name, TrialExpirationDate, TimeZoneSidKey FROM Organization');        
        return result.records;
    }

    getQueryEntity (entity: string): string{
        let query: string
        if (util.isSFDCID(entity)){
            query = `SELECT Id, Name, Email, UserName FROM User WHERE Id = '${entity}'`
        }else{
            query = `SELECT Id, Name, Email, UserName FROM User WHERE UserName = '${entity}'`
        }        
        return query
    }

    async getEntity(entity: string): Promise<Entity[]>{                
        const query = this.getQueryEntity(entity)
        const result = await this.connection.query<Entity>(query);        
        return result.records;
    }

    async getDebugLevelName (name: string): Promise<DebugLevel[]>{
        const query = `SELECT Id, DeveloperName, ApexCode, ApexProfiling, Callout, Database, System, Validation, Visualforce 
                        FROM DebugLevel WHERE DeveloperName = '${name}'`
        const result = await this.connection.tooling.query<DebugLevel>(query)
        return result.records;
    }

    async getTraceFlag (tracedEntityId: string, logType: string): Promise<TraceFlag[]>{
        const query = `SELECT Id, StartDate, ExpirationDate, LogType, TracedEntityId, DebugLevelId
                        FROM TraceFlag WHERE TracedEntityId = '${tracedEntityId}' AND LogType = '${logType}'
                        LIMIT 1`
        const result = await this.connection.tooling.query<TraceFlag>(query)
        return result.records
    }

    async getApexLogs (query: string): Promise<ApexLog[]>{
        const result = await this.connection.tooling.query<ApexLog>(query)
        return result.records
    }

    async updateTraceFlag (traceFlag: TraceFlag): Promise<RecordResult>{
        const result = await this.connection.tooling.update('TraceFlag',traceFlag) as RecordResult
        return result
    }

    async createTraceFlag (traceFlag: TraceFlag): Promise<RecordResult>{
        const result = await this.connection.tooling.create('TraceFlag',traceFlag) as RecordResult
        return result
    }

    async deleteApexLogs (logs: string[]): Promise<RecordResult[]>{
        const result = await this.connection.tooling.delete('ApexLog',
            logs,{
                allOrNone:false
            }
        ) as RecordResult[]
        return result
    }
}