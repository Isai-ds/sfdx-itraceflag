import { Validation } from "../lib/itrace-interfaces";
import { Messages, Org } from '@salesforce/core';
import {DebugLevel, Entity, ISalesforceDAO, ISalesforceHandler} from '../lib/sfdc-interfaces'
import * as SalesforeDAO from './sfdc-dao'
import { ITraceError } from "../lib/ItraceError";
import {Configuration} from '../lib/itrace-interfaces'
import {ItraceConstants} from '../constants'

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(ItraceConstants.PACKAGE_NAME, ItraceConstants.COMMAND_SET_LOG);

export class TraceSFDCHandler implements ISalesforceHandler {
    entity: Entity
    debugLevel: DebugLevel
    org: Org
    config: Configuration
    sfDAO: ISalesforceDAO

    constructor(config: Configuration, org: Org){
        this.org = org
        this.config = config
        this.sfDAO = SalesforeDAO.getInstance(org.getConnection())
    }

    getEntity(): Entity {
        return this.entity;    
    }

    getDebugLevel(): DebugLevel {
        return this.debugLevel
    }

    async execute(): Promise<void> {    
        await this.processOrganization()
        await this.processEntity()
        await this.processDebugLevelName()
        this.processLogtype()              
    }

    async processOrganization (): Promise<void>{
        const organizations = await this.sfDAO.getOrganization()
        new RecordsValidation(organizations, {
            key: 'errorNoOrgResults',
            values: [this.org.getOrgId()]
        }).validate()
    }

    async processDebugLevelName (): Promise<void>{
        const debugLevelNames = await this.sfDAO.getDebugLevelName(this.config.debuglevelname)
        new RecordsValidation(debugLevelNames, {
            key: 'errorDebugLevelName',
            values: [this.config.debuglevelname]
        }).validate()
        this.debugLevel = debugLevelNames[0]
    }
    
    async processEntity(): Promise<void> {
        const entityIdOrUserName = this.config.entity ? this.config.entity : this.org.getConnection().getUsername()
        const entities = await this.sfDAO.getEntity(entityIdOrUserName)
        new RecordsValidation(entities,{
            key: 'errorEntity',
            values: [this.config.entity]
        }).validate()
        this.entity = entities[0]        
    }

    processLogtype(): void {
        if (this.config.logtype == ItraceConstants.DEVELOPER_CLI_OPTION){
            this.config.logtype = ItraceConstants.DEVELOPER_LOG
        }else if (this.config.logtype == ItraceConstants.USER_CLI_OPTION){
            this.config.logtype = ItraceConstants.USER_DEBUG
        }else{
            throw new ITraceError(messages.getMessage('errorLogType', [this.config.logtype]));
        }
    }
}

export class TraceSaveLogSFDCHandler extends TraceSFDCHandler{
    async execute(): Promise<void> {    
        await this.processOrganization()
        await this.processEntity()        
    }
}

interface MessageFormat {
    key: string
    values: string[]
}
class RecordsValidation implements Validation{
    records: any[]
    format: MessageFormat
    constructor (records: any[], format: MessageFormat){        
        this.records = records
        this.format = format
    }
    validate(): void {
        if (!this.records || this.records.length <= 0) {
            throw new ITraceError(messages.getMessage(this.format.key, this.format.values));
        }
    }
} 