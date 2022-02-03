import { UX } from '@salesforce/command'
import { Org } from '@salesforce/core'
import {ApexLogFile, IDirectory, TraceConfig, TraceSaveLogConfig, TraceDeleteLogConfig} from '../lib/itrace-interfaces' 
import { ISalesforceREST, ISalesforceDAO, TraceFlag, ApexLog } from '../lib/sfdc-interfaces'
import * as SalesforeDAO from './sfdc-dao'
import * as util from '../util' 
import { ErrorResult, RecordResult } from 'jsforce'
import * as SFDCRest from '../services/sfdc-rest'
import {ItraceConstants} from '../constants'
import * as DirectoryHandler from '../services/directory-handler'

export async function trace (configuration: TraceConfig, org: Org, ux: UX) : Promise<void> {
    await new TraceHandler(configuration,org, ux).trace()
} 

export async function saveLogs(configuration: TraceSaveLogConfig, org: Org, ux: UX){
    await new TraceHandlerSaveLog(configuration,org,ux).save()
}

export async function deleteLogs(configuration: TraceDeleteLogConfig, org: Org, ux: UX){
    await new TraceHandlerDeleteLog(configuration,org,ux).delete()
}

class TraceHandler {
    config: TraceConfig
    org: Org
    sfDAO: ISalesforceDAO
    ux: UX
    traceFlag: TraceFlag
    currentSession: boolean
    constructor(config: TraceConfig, org: Org, ux: UX){
        this.currentSession = false
        this.config = config
        this.org = org
        this.ux = ux
        this.sfDAO = SalesforeDAO.getInstance(org.getConnection())

    }
    async trace () : Promise<void> {   
        this.traceFlag = await this.getTraceFlag()
        if (this.traceFlag.Id){
            await this.updateTraceFlag()
        }else{
            await this.createTraceFlag()
        }
        
    }

    async queryTraceFlag(): Promise<TraceFlag[]> {        
        return await this.sfDAO.getTraceFlag(this.config.entity.Id, this.config.logType)
    }

    async getTraceFlag(): Promise<TraceFlag> {
        const traceFlags = await this.queryTraceFlag();
        let traceFlag = {} as TraceFlag
        if (!util.isEmpty(traceFlags)){                    
            this.currentSession = true
            traceFlag.Id  = traceFlags[0].Id
        }else{
            traceFlag.LogType = this.config.logType
            traceFlag.TracedEntityId = this.config.entity.Id
        }        
        traceFlag.StartDate = this.config.startDate
        traceFlag.ExpirationDate = this.config.expirationDate
        traceFlag.DebugLevelId = this.config.debugLevel.Id
        return traceFlag
    }

    async updateTraceFlag () : Promise<void>{
        const recordResult = await this.sfDAO.updateTraceFlag(this.traceFlag)
        if (!recordResult.success){
            const errorResult = recordResult as ErrorResult
            this.ux.log(errorResult.errors[0])
        }
    }

    async createTraceFlag () : Promise<void>{
        const recordResult = await this.sfDAO.createTraceFlag(this.traceFlag)
        if (!recordResult.success){
            const errorResult = recordResult as ErrorResult
            this.ux.log(errorResult.errors[0])
        }
    }
}

abstract class TraceHandlerLogs {
    ux: UX
    org: Org
    sfREST: ISalesforceREST
    sfDAO: ISalesforceDAO
    apexLogs: ApexLog[]
    constructor(org: Org, ux: UX){
        this.ux = ux
        this.org = org
        this.sfREST = SFDCRest.getInstance(this.org.getConnection())
        this.sfDAO = SalesforeDAO.getInstance(org.getConnection())

    }
    notResultsFound (): void{
        this.ux.log(`Found 0 logs`)
        this.ux.stopSpinner()
    }

    buildQuery (entityId: string, filters: string): string {
        let query: string
        if (filters !== '' && filters){
            query = `SELECT Id, LogLength, Status FROM ApexLog WHERE LogUserId = '${entityId}' AND (${filters})` 
        }else{
            query = `SELECT Id, LogLength, Status FROM ApexLog WHERE LogUserId = '${entityId}' ORDER BY StartTime` 
        }
        return query
    }
    
    abstract queryApexLogs (): Promise<ApexLog[]>;
}

class TraceHandlerSaveLog extends TraceHandlerLogs{
    config: TraceSaveLogConfig
    dirHandler: IDirectory
    constructor(config: TraceSaveLogConfig, org: Org, ux: UX){
        super(org, ux)
        this.config = config
        this.dirHandler =  DirectoryHandler.getInstance()
    }

    async queryApexLogs (): Promise<ApexLog[]>{
        let query = this.buildQuery(this.config.entity.Id, this.config.filters) 
        try {
            this.apexLogs = await this.sfDAO.getApexLogs(query)    
        } catch (error) {
            util.handleQueryException(error)
        }
        
        return this.apexLogs 
    }

    printResultsApexLog(): void {
        let downloadInfo : string 
        
        let bytes = 0
        this.apexLogs.forEach((value: ApexLog, index: number, array: ApexLog[])=>{
            bytes += value.LogLength;
        })

        if (bytes < ItraceConstants.KBYTES){
            downloadInfo = `Downloading ${bytes} bytes`
        }else if (bytes > ItraceConstants.KBYTES && bytes < ItraceConstants.MBYTES){
            downloadInfo = `Downloading ${(bytes/ItraceConstants.KBYTES).toFixed(2)} kilobytes`
        }else{
            downloadInfo = `Downloading ${(bytes/ItraceConstants.MBYTES).toFixed(2)} megabytes`
        }
        this.ux.startSpinner(`Found ${this.apexLogs.length} logs. ${downloadInfo}`)

    }

    async fetchApexLogs (): Promise<void> {
        this.printResultsApexLog()
        const requests = this.sfREST.getLogs(this.apexLogs)
        
        requests.forEach((request: Promise<ApexLogFile>, index: number, array:Promise<ApexLogFile>[])=>{
            request.then((response:ApexLogFile)=>{
               this.dirHandler.saveLog(response, this.config.directory).then(()=>{
                    this.ux.setSpinnerStatus(`Saved log: ${response.name}${ItraceConstants.LOG_EXTENSION}`)
                })
            }).catch((reason)=>{
                this.ux.log(reason.message);
            });
        })
    }

    async save(): Promise<void>{
        this.ux.startSpinner('Getting logs','Querying logs')               
        await this.queryApexLogs()
        if (util.isEmpty(this.apexLogs)){
            this.notResultsFound()
        }else{
           await this.fetchApexLogs()
        }
    }
}

class TraceHandlerDeleteLog extends TraceHandlerLogs{
    config: TraceDeleteLogConfig
    constructor(config: TraceDeleteLogConfig, org: Org, ux: UX){
        super(org, ux)
        this.config = config
    }

    async queryApexLogs (): Promise<ApexLog[]>{
        let query = this.buildQuery(this.config.entity.Id, this.config.filters) 
        if (this.config.all){
            query = `SELECT Id FROM ApexLog` 
        }
        try {
            this.apexLogs = await this.sfDAO.getApexLogs(query)    
        } catch (error) {
            util.handleQueryException(error)
        }
        return this.apexLogs 
    }
    getApexLogIds (): string[] {
        const apexLogsIds = [] as string[]        
        for (const log of this.apexLogs){
            apexLogsIds.push(log.Id)
        }
        return apexLogsIds
    }

    async bulkApexLogDeletion (promiseArrayDeletion: Promise<any[]>[]): Promise<number> {
        return new Promise(resolve=>{
            Promise.all(promiseArrayDeletion).then((values : any[])=>{
                let count = 0; 
                for (let i = 0; i < values.length; i++){
                    const results = values[i] as RecordResult[]
                    for (const r of results){
                        if (r.success){
                            count++
                        }else{
                            const e = r as ErrorResult
                            this.ux.log(e.errors[0])
                        }
                    }                    
                }
                resolve(count)
            }).catch((reason)=>{
                this.ux.log(reason.message);
            })
        })       
    }

    async deleteApexLogs (): Promise<void> {
        this.ux.startSpinner(`Found ${this.apexLogs.length} logs to delete.`)
        const logIdsChunks = util.chunkArray(this.getApexLogIds(), ItraceConstants.CHUNK_SIZE_RECORD_NUMBER)
        const groupChunks = util.chunkArray(logIdsChunks, ItraceConstants.DELETION_THREAD_NUMBER)
        let promiseArrayDeletion = [] as Promise<any[]>[]
        let countApexLogsDeleted = 0

        for (const chunk of groupChunks){
            this.ux.setSpinnerStatus(`Deleting logs`)
            promiseArrayDeletion = []
            for (const logsIds of chunk){
                const request = this.sfDAO.deleteApexLogs(logsIds);
                promiseArrayDeletion.push(request)
            }
            countApexLogsDeleted += await this.bulkApexLogDeletion(promiseArrayDeletion)
        }
        this.ux.stopSpinner(`Total of logs deleted: ${countApexLogsDeleted}. Failed logs deleted: ${this.apexLogs.length - countApexLogsDeleted}`)
    }

    async delete (): Promise<void>{
        this.ux.startSpinner('Getting logs','Querying logs')               
        await this.queryApexLogs()
        if (util.isEmpty(this.apexLogs)){
            this.notResultsFound()
        }else{
            this.deleteApexLogs()
        }
    }
}