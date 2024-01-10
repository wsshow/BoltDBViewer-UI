const getBaseUrl = (relativePath)=>{
    return `http://127.0.0.1:10000/${relativePath}`
}

const req = (relativePath, data) => {
    return fetch(getBaseUrl(relativePath), {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
}

export const reqConnect = (data) => {
    return req('connect', data)
}

export const reqClose = (data) => {
    return req('close', data)
}

export const reqDataFromBucket = (data) => {
    return req('data_from_bucket', data)
}

export const reqSet = (data) => {
    return req('set', data)
}

export const reqGet = (data) => {
    return req('get', data)
}

export const reqDelete = (data) => {
    return req('delete', data)
}