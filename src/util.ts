export function isSFDCID (value: string): boolean{
    const regexExp = new RegExp('[a-zA-Z0-9]{18}|[a-zA-Z0-9]{15}')
    return regexExp.test(value)
}

export function isEmpty(records: any[]){
    if (!records || records.length == 0 ){            
        return true
    }
    return false
}