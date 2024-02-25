const express     = require('express');
const models = require('../models/index');
const util     = require('../utils');
const registeredcodes  = require('../registererrorcodes');
const { v4: uuidv4 } = require('uuid');


class DataService {

    async findAllUsers() {
        var response = {status: 404}

        try{
            var users = await models.users.findAll({where: {is_admin: true, is_deleted: false}});
            if(users) response.status = 200
            response.users = users;
            return response;
        
        } catch(error){
            console.log("findAllUsers error-", error)
        }
        return  response;
      
    }


    async findUser(id) {
        var response = {status: 404}

        try{
            var userresponse = await models.users.findOne({where: {id: id, is_admin: true, is_deleted: false}});
            if(userresponse){
                response.status = 200
                response.user = userresponse
            ;}
            return response;
        
        } catch(error){
            console.log("findAllUsers error-", error)
        }
        return  response;
      
    }
    async deleteUser(id){
       
        try{
          
           
            //permanently delete roles
            var result  = await models.users.update({is_deleted: true},{
                where: {
                    id: id,
                    
                }
            });
            if(result > 0){
                return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Deleted"};
            } 
            console.log(`Role Updated error: Role could not be updated for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update role"}


    
    }    

    async authenticateUser(data){
        //find user
        try{
            var user = await models.users.findOne({where: {email: data.email, is_active: true, is_deleted: false}});
            if(!user)  return  { message: "Invalid email or password", status: 404};       
            if(user){
                //validate password
                if(util.sanitize(data.password) == util.decrypt(user.password)) return {user: user, status: 200, message: "Successful Login"};
                if(util.sanitize('tobereset') == util.decrypt(user.password)) return  res.status(200).json({user: user, status: registeredcodes.RESET, message: "Successful Login"});
                console.log(`Login error: User could not login, ${data.email}`, user);
                return  {user: user, status: 500, message: "Incorrect Details"};
        
            }
            return  {user: user, status: 500, message: "Incorrect Details"};

        } catch(error){
            console.log("authenticateUser error-", error)
        }
        return  { status: 500, message: "Incorrect Details"};

    }
    async addAdmin(data){
       
        try{
            //ensure user doesnt exist
            var userexist = await models.users.findOne({where:{ email: util.sanitize(data.email.toLowerCase()), is_admin: false, is_deleted: false}})
            if(userexist) return  res.status(registeredcodes.SUCCESS).json({status: registeredcodes.DUPLICATE, user: userexist, message: "User exist"});

            var password =  util.sanitize(data.password.trim());
            var encryptedpwd  = util.encrypt(password);
            var uuid = uuidv4();

        
            let requestdata = {
                first_name: util.sanitize(data.first_name),
                last_name: util.sanitize(data.last_name),
                email: util.sanitize(data.email.toLowerCase()),
                password: encryptedpwd,
                type: 1,
                trn: data.trn, 
                uuid: uuid,
                contact: data.contact,
                is_active: true,
                is_verified: true,
                is_admin: true,
                role: data.role,
                branch: data.branch
            };

            const user = await models.users.create(requestdata);
            if(user){
                return  {success: true,user: user, status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`User Creation error: User could not be created for ${data.trn}`);

        }
        catch (ex) 
        {
            console.log(ex)
            console.log(`Server error: Email could not be sent for ${data.trn}`, ex);
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create user"}


    }
    async updateAdminUser(data){
       
        try{
          
            
            //ensure user doesnt exist
            var userexist = await models.users.findOne({where:{   id: data.id, is_deleted: false}})
            if(!userexist) return  {status: registeredcodes.ITEM_NOT_FOUND, role: rolenameexist, message: "User does not exist"};
           
            

        
            let requestdata = {
                first_name: util.sanitize(data.first_name),
                last_name: util.sanitize(data.last_name),
                email: util.sanitize(data.email.toLowerCase()),
             
                trn: data.trn, 
                contact: data.contact,
                is_active: data.is_active,
               
                role: data.role,
                branch: data.branch
            };
            if(data.password != null && data.password != ""){
                var password =  util.sanitize(data.password.trim());
                var encryptedpwd  = util.encrypt(password);
                requestdata.password = encryptedpwd;
            }
            const result = await models.users.update(requestdata, {
                where: {
                    id: data.id ,
                }
            })
            
            if(result > 0){
                var updateduser = await models.users.findOne({where: {id: data.id}})

                return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated", updateduser};
            } 
            console.log(`Role Updated error: Role could not be updated for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update role"}


    
    }  
    async addRole(data){
       
        try{
            //ensure user doesnt exist
            var roleexist = await models.roles.findOne({where:{ name: util.sanitize(data.name.toLowerCase())}})
            if(roleexist) return  res.status(registeredcodes.SUCCESS).json({status: registeredcodes.DUPLICATE, role: roleexist, message: "Role exist"});

        
        
            let requestdata = {
                name: util.sanitize(data.name.toLowerCase()),
        
                is_active: true,
                permissions: data.permissions
            };

            const role = await models.roles.create(requestdata);
            if(role){
                return  {success: true,role: role, status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`Role Creation error: Role could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create role"}


    
    }   
    async findAllRoles() {
        var response = {status: 404}

        try{
            var roles = await models.roles.findAll({where: {is_active: true}});
            if(roles) response.status = 200
            response.roles = roles;
            return response;
        
        } catch(error){
            console.log("findAllRoles error-", error)
        }
        return  response;
      
    }
    async findRole(id) {
        var response = {status: 404}

        try{
            var role = await models.roles.findOne({where: {id: id}});
            if(role) response.status = 200
            response.role = role;
            return response;
        
        } catch(error){
            console.log("findRole error-", error)
        }
        return  response;
      
    }
    async updateRole(data){
       
        try{
          
            var roleexist = await models.roles.findOne({where:{ id: data.id}})
            if(!roleexist) return {status: registeredcodes.ITEM_NOT_FOUND, role: roleexist, message: "Role exist"};

            //ensure user doesnt exist
            var rolenameexist = await models.roles.findOne({where:{   name: util.sanitize(data.name.toLowerCase())}})
            if(rolenameexist && rolenameexist.id != data.id) return  {status: registeredcodes.DUPLICATE, role: rolenameexist, message: "Role name exist"};

            let requestdata = {
                name: util.sanitize(data.name.toLowerCase()),
                permissions: data.permissions
            };

            const result = await models.roles.update(requestdata, {
                where: {
                    id: data.id ,
                }
            })
            if(result > 0){
                return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
            } 
            console.log(`Role Updated error: Role could not be updated for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update role"}


    
    }  
    async deleteRole(id){
       
        try{
          
            var roleexist = await models.roles.findOne({where:{ id: id}})
            if(!roleexist) return {status: registeredcodes.ITEM_NOT_FOUND, role: roleexist, message: "Role exist"};


            var userexist = await models.users.findOne({where:{ role: roleexist.name}})
            if(userexist) return {status: registeredcodes.EXIST,  message: "Assigned to user"};

            console.log("delete rolexs")
            //permanently delete roles
            var result  = await models.roles.update({is_active: false},{
                where: {
                    id: id,
                    
                }
            });
            if(result > 0){
                return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Deleted"};
            } 
            console.log(`Role Updated error: Role could not be updated for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update role"}


    
    }    

    async getPermissionsByRoleName(rolename){
        var response = []

        try{
            var role = await models.roles.findOne({where: {name: rolename.toLowerCase()}});
            if(role) {
                response.status = 200
                response = role.permissions;
            } 
            return response;
        
        } catch(error){
            console.log("getPermissionsByRoleName error-", error)
        }
        return  response;
    }

    async addRate(data){
       
        try{
            //ensure weight doesnt exist
            var weightexist = await models.rates.findOne({where:{ weight: data.weight}})
            if(weightexist) return  res.status(registeredcodes.SUCCESS).json({status: registeredcodes.DUPLICATE, role: roleexist, message: "Weight already defined. Please update rate."});

        
        
            let requestdata = {
                weight: data.weight,
                rate: data.rate, 
                is_deleted: false
            };

            const role = await models.rates.create(requestdata);
            if(role){
                return  {success: true,role: role, status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`Rate Creation error: rate could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create rate"}


    
    } 
    async updateRate(data){
       
        try{
            console.log("update rate data", data)
            let requestdata = {
                rate: data.rate
             };
             const result = await models.rates.update(requestdata, {
                 where: {
                     id: data.id ,
                 }
             })
             console.log("result", result)

             if(result.length > 0){
                console.log("result ", result.length)
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
             } 
          
            console.log(`Rate Creation error: rate could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create rate"}


    
    } 


    async findAllRates() {
        var response = {status: 404, rates: []}

        try{
            var rates = await models.rates.findAll({where: {is_deleted: false},order: [[ 'weight', 'ASC' ]]});
            if(rates) {
                response.status = 200
                response.rates = rates;
            }
            return response;
        
        } catch(error){
            console.log("findAllRoles error-", error)
        }
        return  response;
      
    }
    async findRate(id) {
        var response = {status: 404}

        try{
            var rate = await models.rates.findOne({where: {id: id}});
            if(rate) {
                response.status = 200
                response.rate = rate;
            } 
            return response;
        
        } catch(error){
            console.log("findRate error-", error)
        }
        return  response;
      
    }
    async findRatebyWeight(weight) {
        var response = {status: 404}
        weight = Math.ceil(weight)
        try{
            var rate = await models.rates.findOne({where: {weight: weight}});
            if(rate) {
                response.status = 200
                response.rate = rate.rate;
                response.weight = rate.weight;
                response.charges = 0
                response.subtotal = response.rate + response.charges
                response.total = response.subtotal + 0
            } 

            
            if(!rate){
                //calculate rate using increment and base rate
                var baserate = await models.charges.findOne({where:{ name: "baserate"}});
                var incrementrate = await models.charges.findOne({where:{ name: "incrementrate"}})
                if(baserate &&incrementrate){
                    var freightcost = baserate.amount + (weight * incrementrate.amount) 
                    if(freightcost) {
                        response.status = 200
                        response.rate = freightcost;
                        response.weight = weight;
                        response.charges = 0
                        response.subtotal = response.rate + response.charges
                        response.total = response.subtotal + 0

                    }

                }
               
            
            }
            return response;
        
        } catch(error){
            console.log("findRate error-", error)
        }
        return  response;
      
    }

    async addorupdateBaseCharge(data){
       
        try{
            //ensure weight doesnt exist
            var charge = await models.charges.findOne({where:{ name: "baserate"}})
            if(charge){
                let requestdata = {
                   amount: data.amount
                };
                const result = await models.charges.update(requestdata, {
                    where: {
                        id: charge.id ,
                    }
                })
                if(result > 0){
                    return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
                } 
            
            }
            if(!charge)
            {
                let requestdata = {
                    amount: data.amount,
                    name: "baserate", 
                    description: "based rate"
                 };
                 const charge = await models.charges.create(requestdata);
                if(charge) return  {success: true,charge: charge, status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`charge Creation error: charge could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update charge"}


    
    } 
    async addorupdateIncrementCharge(data){
       
        try{
            //ensure weight doesnt exist
            var charge = await models.charges.findOne({where:{ name: "incrementrate"}})
            if(charge){
                let requestdata = {
                   amount: data.amount
                };
                const result = await models.charges.update(requestdata, {
                    where: {
                        id: charge.id ,
                    }
                })
                if(result > 0){
                    return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
                } 
            
            }
            if(!charge)
            {
                let requestdata = {
                    amount: data.amount,
                    name: "incrementrate", 
                    description: "increment rate"
                 };
                 const charge = await models.charges.create(requestdata);
                if(charge) return  {success: true,charge: charge, status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`charge Creation error: charge could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update charge"}


    
    } 
    async findBaseCharge() {
        var response = {status: 404}

        try{
            var charge = await models.charges.findOne({where: {name: "baserate"}});
            if(charge){
                response.status = 200
                response.charge = charge.amount;
            } 
            return response;
        
        } catch(error){
            console.log("findRole error-", error)
        }
        return  response;
      
    }
   async findIncrementCharge() {
        var response = {status: 404}

        try{
            var charge = await models.charges.findOne({where: {name: "incrementrate"}});
            if(charge){
                response.status = 200
                response.charge = charge.amount;
            } 
            return response;
        
        } catch(error){
            console.log("findRole error-", error)
        }
        return  response;
      
    }
    async addBranch(data){
       
        try{
            //ensure user doesnt exist
            var branchexist = await models.branches.findOne({where:{ name: util.sanitize(data.name.toLowerCase())}})
            if(branchexist) return  res.status(registeredcodes.SUCCESS).json({status: registeredcodes.DUPLICATE, branch: branchexist, message: "Branch with the same name exist"});

            var location = data.address1 + " " + data.address2 + " " + data.city + " " + data.state + " " + "Jamaica"
            let requestdata = {
                name: util.sanitize(data.name.toLowerCase()),
                location: location,
                address:{
                    address1: data.address1,
                    address2: data.address2,
                    city: data.city,
                    state: data.state,
                    country: data.country
                },
                type: "branch",
                is_deleted: false,
                description: data.description,
                notes:data.notes
                
            };

            const branch = await models.branches.create(requestdata);
            if(branch){
                return  {success: true, branch: branch, status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`Branch Creation error: branch could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create branch"}


    
    }   


    async findAllBranches() {
        var response = {status: 404, branches: []}

        try{
            var branches = await models.branches.findAll({where: {is_deleted: false}});
            if(branches) {
                response.status = 200
                response.branches = branches;
            }
            return response;
        
        } catch(error){
            console.log("findAllBranches error-", error)
        }
        return  response;
      
    }

    async findBranch(id) {
        var response = {status: 404}

        try{
            var branchresponse = await models.branches.findOne({where: {id: id}});
            if(branchresponse){
                response.status = 200
                response.branch = branchresponse
            }
            return response;
        
        } catch(error){
            console.log("findAllUsers error-", error)
        }
        return  response;
      
    }
    async updateBranch(data){
       
        try{
           
            var location = data.address1 + " " + data.address2 + " " + data.city + " " + data.state + " " + "Jamaica"
            let requestdata = {
                name: util.sanitize(data.name.toLowerCase()),
                location: location,
                address:{
                    address1: data.address1,
                    address2: data.address2,
                    city: data.city,
                    state: data.state,
                    country: data.country
                },
                type: "branch",
                is_deleted: false,
                description: data.description,
                notes:data.notes
            };

             const result = await models.branches.update(requestdata, {
                 where: {
                     id: data.id ,
                 }
             })

             if(result.length > 0){
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
             } 
          
            console.log(`Branches Creation error: branch could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create branch"}


    
    } 

    async deleteBranch(id){
       
        try{
          
            //permanently delete roles
            var result  = await models.branches.update({is_deleted: true},{
                where: {
                    id: id,
                    
                }
            });
            if(result > 0){
                return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Deleted"};
            } 
            console.log(`branch Updated error: Role could not be updated for ${data.id}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update brach"}


    
    }    
    async addDropoff(data){
       
        try{
            //create user or get id
            var userexist = false;
            data.create_an_account = true;
            if(!util.isNullOrEmpty(data.sender_email) && data.create_an_account == true){
               userexist =  await models.users.findOne({where: {email: util.sanitize(data.sender_email.toLowercase)}})
               if(!userexist) 
               {
                 var uuid = uuidv4();
                 //create anonymous user
                  userexist = await models.users.create({is_anonymous: true, email: util.sanitize(data.sender_email.toLowercase), first_name: data.sender_first_name, last_name: data.sender_last_name, password: "SPEEDZ!#$", contact:data.sender_contact, uuid: uuid, is_admin: false, is_active: true})
               }
            }
            var sender_info = {
                first_name: data.sender_first_name,
                last_name: data.sender_last_name,
                email: data.sender_email,
                contact: data.sender_contact


            }

            let requestdata = {
                sender_first_name: data.sender_first_name,
                sender_last_name: data.sender_last_name,
                sender_info: sender_info,
                code: "SPEED"+util.makeid(8),
                type: "dropoff",
                description: data.description,
                request_type: data.request_type,
                status:  "pending transit",
                method: data.method,
                notes: data.notes,
                details: data,
                is_deleted: false
                
            };
            if(userexist) requestdata.user_id = userexist.id

            const requestinfo = await models.requests.create(requestdata);
            if(requestinfo){
                var package_result = await this.addPackage(data, requestinfo.id)
                if(package_result.status == 200){
                   var transactionresult =  await this.addTransaction(data, package_result.packagedetails.id, userexist.id)
                   if(transactionresult.status == 200){
                    const result = await models.packages.update({transaction_id: transactionresult.transaction.id}, {
                        where: {
                            id: package_result.packagedetails.id ,
                        }
                    })
                    const requestsresult = await models.requests.update({transaction_id: transactionresult.transaction.id}, {
                        where: {
                            id: requestinfo.id ,
                        }
                    })
                    return  {success: true, dropoff: requestinfo, package: package_result.packagedetails, transaction: transactionresult.transaction,  status: registeredcodes.SUCCESS, message: "Successfully Added"};

                   }
                }
                return  {success: true, dropoff: requestinfo, package: package_result.packagedetails, transaction: null,  status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`Dropoff Request Creation error: dropoff could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create dropoff"}


    
    }   
    async findAllDropoffRequests() {
        var response = {status: 404, branches: []}

        try{
            var dropoffs = await models.requests.findAll({where: {type: "dropoff", is_deleted: false}});
            if(dropoffs) {
                response.status = 200
                response.dropoffs = dropoffs;
            }
            return response;
        
        } catch(error){
            console.log("findAllDropoffserror-", error)
        }
        return  response;
      
    }
    async findDropoff(id) {
        var response = {status: 404}

        try{
            var dropoffresponse = await models.requests.findOne({where: {type: "dropoff", id: id}});
            if(dropoffresponse){
                response.status = 200
                response.dropoff = dropoffresponse
            }
            return response;
        
        } catch(error){
            console.log("findAllUsers error-", error)
        }
        return  response;
      
    }
    async updateDropoff(data){
       
        try{
           
            
            let requestdata = data
            delete requestdata.id
             const result = await models.requests.update(requestdata, {
                 where: {
                     id: data.id ,
                 }
             })

             if(result.length > 0){
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
             } 
          
            console.log(`Dropoff Requests Creation error: dropoff could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create dropoff"}


    
    } 
    async addPackage(data, request_id){
       
        try{
            //create user or get id
            var senderexist = {};
            data.create_an_account = true
            if(!util.isNullOrEmpty(data.sender_email) && data.create_an_account == true){
                senderexist =  await models.users.findOne({where: {email: util.sanitize(data.sender_email.toLowercase)}})
               if(!senderexist) 
               {
                 //create anonymous user
                 var userdata  = {is_anonymous: true, email: util.sanitize(data.sender_email.toLowercase), first_name: data.sender_first_name, last_name: data.sender_last_name, password: "SPEEDZ!#$", is_admin: false, is_active: true}
                 userdata.contact = data.sender_contact
                 var uuid = uuidv4();
                 userdata.uuid = uuid;
                 senderexist = await models.users.create(userdata)
               }
            }
            //dont create account for reciever
            var receiverexist = {};
            if(!util.isNullOrEmpty(data.receiver_email) && data.create_an_account == true){
                receiverexist =  await models.users.findOne({where: {email: util.sanitize(data.receiver_email.toLowercase)}})
            }
            var sender_info = {
                address: data.sender_address
            }
            var receiver_info = {
                address: data.receiver_address
            }
            let requestdata = {
                sender_first_name: data.sender_first_name,
                sender_last_name: data.sender_last_name,
                sender_email: data.sender_email,
                sender_contact: data.sender_contact,
                receiver_first_name: data.receiver_first_name,
                receiver_last_name: data.receiver_last_name,
                receiver_email: data.receiver_email,
                receiver_contact: data.receiver_contact,
                sender_info: sender_info,
                receiver_info: receiver_info,
                request_id: request_id,
                destination: data.destination,
                source: data.source,
                tracking_number: "1XZ"+ util.generateTrackingNumber(10)+Date.now(),
                code: "SPEEDPKG"+ util.makeid(8),
                weight: Math.ceil(data.weight),
                actual_weight: data.weight,
                category: data.category,
                description: data.description,
                status: "pending transit",
                current_location: data.source,
                method: data.method,
                notes: data.text,
                is_deleted: false,
            };
            if(senderexist) requestdata.sender_id = senderexist.id
            if(receiverexist) requestdata.receiver_id = receiverexist.id

            var packagedetails = await models.packages.create(requestdata);
            if(packagedetails){
                return  {success: true, packagedetails: packagedetails, status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`Package Request Creation error: package could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create package"}


    
    }   
    async findAllDropoffRequests() {
        var response = {status: 404, branches: []}

        try{
            var dropoffs = await models.requests.findAll({where: {type: "dropoff", is_deleted: false}});
            if(dropoffs) {
                response.status = 200
                response.dropoffs = dropoffs;
            }
            return response;

        
        } catch(error){
            console.log("findAllDropoffserror-", error)
        }
        return  response;
      
    }
    async findDropoff(id) {
        var response = {status: 404}

        try{
            var dropoffresponse = await models.requests.findOne({where: {type: "dropoff", id: id}});
            if(dropoffresponse){
                response.status = 200
                response.dropoff = dropoffresponse
            }
            return response;
        
        } catch(error){
            console.log("findAllUsers error-", error)
        }
        return  response;
      
    }
    async updateDropoff(data){
       
        try{
           
            
            let requestdata = data
            delete requestdata.id
             const result = await models.requests.update(requestdata, {
                 where: {
                     id: data.id ,
                 }
             })

             if(result.length > 0){
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
             } 
          
            console.log(`Dropoff Requests Creation error: dropoff could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create dropoff"}


    
    } 
    async addTransaction(data,package_id, sender_id){
       
        try{
        

            var package_ids = []
            package_ids.push(package_id)
            let requestdata = {
                
                user_id: sender_id,
                paymentmethod: data.paymentmethod,
                reference: data.reference,
                cclast4: data.cclast4,
                cctype: data.cctype,
                tendered: data.tendered,
                change:data.change,
                total: data.total,
                package_ids: package_ids,
                status: "approved",
                details: data.transaction_details,
                notes:  data.transaction_notes,
                 is_deleted: false
            };
          
            var transaction = await models.transactions.create(requestdata);
            if(transaction){
                return  {success: true, transaction, status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`transaction Request Creation error: transaction could not be created for ${package_id}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create transaction"}


    
    }  

    async getReceiptInfo(dropoffid){
        var response = {status: 500}
        var dropoffresponse = await models.requests.findOne({where: {type: "dropoff", id: dropoffid}});
        if(dropoffresponse){
            //get dropoff request 
            response.dropoff = dropoffresponse
            //get packages 
            response.packages =[]
            var packagesresponse = await models.packages.findAll({where: { request_id: dropoffresponse.id}});
            if(packagesresponse){
                response.packages = packagesresponse

            }

            var transactionresponse = await models.transactions.findOne({where: { id: dropoffresponse.transaction_id}});
            if(transactionresponse){
                response.transaction = transactionresponse
                
            }
            response.status = 200

        }
        console.log("response", response)

        return response;
    }
}
const dataService = new DataService();
module.exports = dataService ;
