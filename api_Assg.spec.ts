import {test,expect} from '@playwright/test'

let generatedToken:any
let instanceUrl:any
let tokenType:any
let oppr_id:any

test("Generate SF access token",async({request})=>{ //Generate a token
    let accessToken=await request.post("https://login.salesforce.com/services/oauth2/token",{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "Connection":"keep-alive"
        },
        form:{
            "grant_type":"password",
            "client_id":"3MVG9HtWXcDGV.nGu3RuFekKR0OvlonYS01.sH5MMaRlnYoAL155oXQce_DgNTXKEqvm4LTUvwTv1IjMSGV9u",
            "client_secret":"12D3718DDD4000B7D1C6340A671699E752B20D240E099CA0D38D0D778A504CB1",
            "username":"rakshanaabinesh.de5abe8db387@agentforce.com",
            "password":"Siddarth@98yqa3QWSBKkP5gKvF1VCDldrqu",
        }
    })
let token=await accessToken.json()
console.log(token)
generatedToken=token.access_token
instanceUrl=token.instance_url
tokenType=token.token_type
})

test("Create an opportunity",async({request})=>{ //Create an opportunity
    let createOppr=await request.post(`${instanceUrl}/services/data/v59.0/sobjects/Opportunity`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${tokenType} ${generatedToken}`
        },
        data:{
            "Name":"Playwright Automation",
            "CloseDate":"2027-12-31",
            "StageName":"Qualification"
        }
    })
let Oppr=await createOppr.json()
oppr_id=Oppr.id
expect(createOppr.status()).toBe(201)
console.log("Opportunity is created successfully")
})

test("Update the opportunity",async({request})=>{ //Update the oppurtunity
    let updateOppr=await request.patch(`${instanceUrl}/services/data/v59.0/sobjects/Opportunity/${oppr_id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${tokenType} ${generatedToken}`
        },
        data:{
            "Type": "New Customer",
            "StageName":"Prospecting"
        }
    })
expect(updateOppr.status()).toBe(204)
})

test("Get the opportunity",async({request})=>{ //retrive the opportunity
    let getOppr=await request.get(`${instanceUrl}/services/data/v59.0/sobjects/Opportunity/${oppr_id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${tokenType} ${generatedToken}`
        }
    })
let OpprDetails= await getOppr.json()
console.log(OpprDetails)
expect(getOppr.status()).toBe(200)
})

test("Delete the opportunity",async({request})=>{
    let delOpportunity=await request.delete(`${instanceUrl}/services/data/v59.0/sobjects/Opportunity/${oppr_id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${tokenType} ${generatedToken}`
        }
    })
expect(delOpportunity.status()).toBe(204)
console.log("Opportunity deleted successfully")
})
