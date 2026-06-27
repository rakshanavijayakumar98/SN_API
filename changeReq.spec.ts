import {test,expect} from '@playwright/test'

let user_Name="admin"
let password1="FGf1Zodo==R5"
let user_Cred=`${user_Name}:${password1}`
let login_Cred=btoa(user_Cred)
let Sys_ID1:any

test("Create a new change",async({request})=>{
    let createRequest=await request.post("https://dev212269.service-now.com/api/now/table/change_request",{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Basic ${login_Cred}`
        },
        data:{
            "short_description": "Created via REST API",
            "description": "This change request was created using the ServiceNow Table API."
        }
    })
let changeRequest = await createRequest.json()
console.log(changeRequest)
Sys_ID1= changeRequest.result.sys_id
expect(createRequest.status()).toBe(201)
})

test("Retrive a change",async({request})=>{
    let getChangeRequest = await request.get(`https://dev212269.service-now.com/api/now/table/change_request/${Sys_ID1}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Basic ${login_Cred}`
        }
    })
expect(getChangeRequest.status()).toBe(200)
console.log("Fetched change request data successfully")
})

test("Update the Short desciption using Patch",async({request})=>{
    let updateDescription=await request.patch(`https://dev212269.service-now.com/api/now/table/change_request/${Sys_ID1}`,{
        headers:{
            "Authorization": `Basic ${login_Cred}`,
            "Content-Type":"application/json"
        },
        data:{
            "short_description": "Short description updated successfully"
        }
    })
expect(updateDescription.status()).toBe(200)
console.log("Description updated successfully")
})

test("Delete the Change Request",async({request})=>{
    let deleteData=await request.delete(`https://dev212269.service-now.com/api/now/table/change_request/${Sys_ID1}`,{
        headers:{
            "Authorization": `Basic ${login_Cred}`,
            "Content-Type":"application/json"
        }
    })
expect(deleteData.status()).toBe(204)
console.log("Change request deleted successfully")
})