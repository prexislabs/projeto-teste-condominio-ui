export function reduceAddress(address){
    if(!address) return
    let firstPart = address.substr(0, 6)
    let secondPart = address.substr(37,42)
    return firstPart + '...' + secondPart
}