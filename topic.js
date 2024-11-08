//call dot env variable in separate file


//login management

//1.Register

//2.Login

//3.my profile

//4.my profile update

//5. update password

// 6. read all user /web-users => get =>admin,superadmin

// 7. read specific user /web-users/:id => get=>admin,superadmin

//8. delete user /web-users/:id => delete => superadmin

//9.update specific user /web-users/:id => patch =>admin,superadmin

// 10. forgot and reset password

//isAuthenticated
//authorized


/* 
REGISTER PROCESS
    1. Register (save data to database)
        fullname
        email
        password
        dob
        gender
        role =>superAdmin, admin, customer 
        isVerifiedEmail

    2. verify email
        1. postman sends token
        2.get token
        3.verify token
        4.get _id from token
        5.make isVerifiedEmai true
*/

/* 
LOGIN PROCESS
    1.email and password
    2.check if that email exist in our DB => if not found throw error
    3.check if that email is verified => if not throw error
    4.check if password match => if not throw error
    5.then generate token => attach _id
    6.send token to postman(or front end)
*/

/* 
MY PROFILE PROCESS
        PART-1
    1.pass token from postman
    2.get token from postman
    3.verify token => if token is not valid throw error
    4.get _id from valid token
    5.pass _id to another middleware
    
        PART-2
    6.find the details by using that _id
*/

/* 
UPDATE PROFILE
    1. pass token from postman
    2.pass that token from isAuthenticated
    3.get _id from valid token
    4.get data from body using req.body
    5. delete email and password from body using delete data.email , delete data.password
    5.update profile
    6.send response
*/

/* 
UPDATE PASSWORD
    1.pass token from postman
    2.pass that token from isAuthenticated
    3.get _id from valid token
    4.get data from body using req.body
             /oldPassword
            /newPassword
    5. check either old password match with database password => if not throw error else
    6.hash newPassword
    7.update to database
    8.send response
    
*/

/* 
READ ALL USER
        admin,superadmin

READ SPECIFIC USER

UPDATE SPECIFIC USER

DELETE SPECFIC USER

 */

/* 
STATUS CODE
    success
        2xx
        create => 201
        read => 200
        update => 201
        delete => 200

    error
    4xx
    400
    401=> token not valid, credential not matched
    403=> token is valid but not authorized
    409=> conflict (duplicate such as email)
    404=> api not found
*/

/* 
FORGOT PASSWORD PROCESS
    1.FORGOT PASSWORD
       i. pass email from postman
       ii. get email
       iii. check if that emails exist in our db => if not throw error with status code 404
       iv.if exist, send email with link(frontend link with token)
       v.send response

    2.RESET PASSWORD
        i.pass token from postman
        ii.pass password from postman
        iii.pass through isAuthenticated
        iv.get _id
        v.hash password
        vi.update that _id
        vii.send response
*/

/* 
isAuthenticated => middleware
postman pass token
isAuthenticated
_id
read details of that _id
get role of that details
AUTHORIZATION
    superAdmin=> user read, delete user
    admin=> user read
    customer=>doesnot have permission to read user

    1.if that role is either admin or superadmin next() => else throw error with status code 403
 */


//includes
let roles = ["admin","superadmin"]
roles.includes("admin")//true
roles.includes("superadmin")//true
roles.includes("customer")//false

/* 
MONGODB ATLAS
    website => we create cluster(big database)=>link => get link and paste it in the connectdb file in url

what we do
    we create account at mongodb atlas
    sign in
    create cluster
        every cluster has username and password
    get the link of cluster
    paste the link of cluster to our application
*/

/* 
LOGIN MANAGEMENT FRONTEND

register
verify

login

profile
update profile

update password

forgot password
reset password
*/