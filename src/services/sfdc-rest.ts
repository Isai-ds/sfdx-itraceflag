import { Connection } from "@salesforce/core"
import { ApexLog, ISalesforceREST } from "../lib/sfdc-interfaces";
import fetch from "node-fetch"
import { ApexLogFile } from "../lib/itrace-interfaces";
export function getInstance (connection: Connection) : ISalesforceREST{
    return new SalesforceREST(connection)
}
class SalesforceREST{
    connection: Connection
    constructor (connection: Connection){
        this.connection = connection
    }

    getBearerToken(): string{
        return `Bearer ${this.connection.accessToken}`
    } 
    
    async getLogRequest(logId: string): Promise<ApexLogFile>{
        return new Promise(async resolve => {
            let url = this.connection.baseUrl()+`/sobjects/ApexLog/${logId}/Body/`;        
            let response = await fetch(url, {
                method:'GET', 
                headers: {'Authorization': this.getBearerToken()}})
            let body = await response.text()
            resolve({
                name: logId, 
                body: body
            })           
        });
       
    }
    getLogs(logs: ApexLog[]): Promise<ApexLogFile>[] {
        const requests = []
        for (const log of logs){
            requests.push(this.getLogRequest(log.Id))
        }
        return requests
    }
}