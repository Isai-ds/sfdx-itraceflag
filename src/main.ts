import { Org } from '@salesforce/core';
import {Configuration} from './lib/itrace-interfaces'
import {TraceSFDCHandler, TraceLogSFDCHandler} from './services/sfdc-handler'
import * as DateTimeHandler from './services/datetime-handler'
import { UX } from '@salesforce/command';
import * as TraceHandler from './services/sfdc-trace-handler'
import * as DirectoryHandler from './services/directory-handler'

export async function trace(configuration: Configuration, org: Org, ux: UX) {
    const sfdcHandler = new TraceSFDCHandler(configuration, org)    
    await sfdcHandler.execute()     
    DateTimeHandler.execute(configuration)
    await TraceHandler.trace({
        entity: sfdcHandler.getEntity(),
        debugLevel: sfdcHandler.getDebugLevel(),
        startDate: configuration.startdate,
        expirationDate: configuration.expirationdate,
        logType: configuration.logtype
    }, org, ux)
}

export async function logs(configuration: Configuration, org: Org, ux: UX){
    const sfdcHandler = new TraceLogSFDCHandler(configuration, org)
    await sfdcHandler.execute()     
    
    const dirHandler = DirectoryHandler.getInstance()
    dirHandler.pathExists(configuration.directory)
   

    await TraceHandler.saveLogs({
        entity: sfdcHandler.getEntity(),
        filters: configuration.filters,
        directory: configuration.directory
    }, org, ux)
}

export async function deleteLogs (configuration: Configuration, org: Org, ux: UX){
    const sfdcHandler = new TraceLogSFDCHandler(configuration, org)
    await sfdcHandler.execute()

    await TraceHandler.deleteLogs({
        entity: sfdcHandler.getEntity(),
        filters: configuration.filters,
        all: configuration.all
    }, org, ux)
}