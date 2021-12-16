import { UX } from '@salesforce/command'
import { Org } from '@salesforce/core'
import {ApexLogFile, IDirectory, TraceConfig, TraceSaveLogConfig} from '../lib/itrace-interfaces' 
import { ISalesforceREST, ISalesforceDAO, TraceFlag, ApexLog } from '../lib/sfdc-interfaces'
import * as SalesforeDAO from './sfdc-dao'
import * as util from '../util' 
import { ErrorResult } from 'jsforce'
import * as SFDCRest from '../services/sfdc-rest'
import {ItraceConstants} from '../constants'
import * as DirectoryHandler from '../services/directory-handler'

export async function trace (configuration: TraceConfig, org: Org, ux: UX) : Promise<void> {
    await new TraceHandler(configuration,org, ux).trace()
} 

export async function saveLogs(configuration: TraceSaveLogConfig, org: Org, ux: UX){
    await new TraceHandlerSaveLog(configuration,org,ux).save()
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
        this.logInfo()
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

    logInfo() : void {
        if (this.currentSession){
            this.ux.log('You have a current trace session. It will be updated with the new information provided')
        }
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

class TraceHandlerSaveLog {
    config: TraceSaveLogConfig
    org: Org
    ux: UX
    sfREST: ISalesforceREST
    sfDAO: ISalesforceDAO
    apexLogs: ApexLog[]
    dirHandler: IDirectory
    constructor(config: TraceSaveLogConfig, org: Org, ux: UX){
        this.config = config
        this.org = org
        this.ux = ux
        this.sfREST = SFDCRest.getInstance(this.org.getConnection())
        this.sfDAO = SalesforeDAO.getInstance(org.getConnection())
        this.dirHandler =  DirectoryHandler.getInstance()

    }
    async queryApexLogs (): Promise<ApexLog[]>{
        let filters = `WHERE LogUserId = '${this.config.entity.Id}' ORDER BY StartTime`
        let query: string
        if (this.config.filters !== '' && this.config.filters){
            filters = `(${this.config.filters})`
            query = `SELECT Id, LogLength, Status FROM ApexLog WHERE LogUserId = '${this.config.entity.Id}' AND ${filters}` 
        }else{
            query = `SELECT Id, LogLength, Status FROM ApexLog ${filters}` 
        }

        try {
            this.apexLogs = await this.sfDAO.getApexLogs(query)    
        } catch (error) {
            util.handleQueryException(error)
        }
        
        return this.apexLogs 
    }



    notResultsFound (): void{
        this.ux.log(`Found 0 logs`)
        this.ux.stopSpinner()
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
            downloadInfo = `Downloading ${bytes/ItraceConstants.KBYTES} kilobytes`
        }else{
            downloadInfo = `Downloading ${bytes/ItraceConstants.MBYTES} megabytes`
        }
        this.ux.startSpinner(`Found ${this.apexLogs.length} logs. ${downloadInfo}`)

    }

    async getApexLogs (): Promise<void> {
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
           await this.getApexLogs()
        }
    }
}