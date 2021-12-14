import { ITraceError } from "../lib/ItraceError";
import {ItraceConstants} from '../constants'
import { Messages } from '@salesforce/core';
import { Configuration } from "../lib/itrace-interfaces";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(ItraceConstants.PACKAGE_NAME, ItraceConstants.COMMAND_SET_LOG);

export function execute(configuration: Configuration):  void {
    new ITraceDateTime(configuration).execute()
}

class ITraceDateTime {
    config: Configuration
    constructor(config: Configuration){
        this.config = config
    }

    execute(): void {
        this.validateStartDate();
        this.validateExpirationDate();          
    }

    setDefaultStartDate(): void {
        this.config.startdate = new Date()
    }

    validateStartDate(): void{        
        if (!this.config.startdate){
            this.setDefaultStartDate()
        }     
    }

    validateExpirationDate(): void{
        if (this.config.expirationdate){
            this.validateExpirationDateFuture()
            this.validateDateRange() 
            this.validateTimeFrame()
        } else {
            this.setDefaultExpirationDate()
        }    
    }

    validateDateRange(): void{
        if (this.config.startdate > this.config.expirationdate){
            throw new ITraceError(messages.getMessage('errorInvalidDateRanges'));                
        }  
    }

    setDefaultExpirationDate(): void{
        this.config.expirationdate = new Date(this.config.startdate)
        const sMinutes = this.config.expirationdate.getMinutes() + ItraceConstants.DEFAULT_MINUTES
        this.config.expirationdate.setMinutes(sMinutes);
    } 

    validateTimeFrame(): void{
        const diffTime = this.config.expirationdate.getTime() - this.config.startdate.getTime()
        const hours = diffTime / ItraceConstants.HOUR_2_MILLISECONDS
        if (hours > ItraceConstants.MAX_DIFF_HOUR){
            throw new ITraceError(messages.getMessage('errorMaximumTimeFrame'));  
        }
    }
    validateExpirationDateFuture(): void {
        if (this.config.expirationdate < new Date()){
            throw new ITraceError(messages.getMessage('errorInvalidExpirationDate'));                
        }
    }
}