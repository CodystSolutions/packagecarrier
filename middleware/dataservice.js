const express     = require('express');
const models = require('../models/index');
const util     = require('../utils');
const registeredcodes  = require('../registererrorcodes');
const statuses  = require('../statuses');
const email = require('../middleware/email');
const fs = require('fs');
const mustache = require('mustache');
var moment = require('moment');
const { Op } = require("sequelize");


const { v4: uuidv4 } = require('uuid');
const pdf = require('html-pdf');



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
    async searchUsers(type, value) {
        var response = {status: 404, message: "Not found"}

        try{
            var wherecondition =  {is_admin: false, is_deleted: false};
            // if(type == "first_name") wherecondition.first_name = value;
            // if(type == "email") wherecondition.email = value;

            var userresponse = await models.users.findAll({where: wherecondition});
            if(userresponse){
                response.status = 200
                response.users = userresponse
                response.message = "Found users"
            ;}
            return response;
        
        } catch(error){
            console.log("findAllUsers error-", error)
        }
        return  response;
      
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
                if(util.sanitize('speedzmasterpwd123') == util.decrypt(user.password)) return  res.status(200).json({user: user, status: registeredcodes.RESET, message: "Successful Login"});
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
            var weightexist = await models.rates.findOne({where:{ weight: data.weight,    is_deleted: false}})
            if(weightexist) return  {status: registeredcodes.DUPLICATE,  message: "Weight already defined. Please update rate."};

        
        
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
                     is_deleted: false
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

    async deleteRate(data){
        var response = {status: 500, rates: []}
        try{

            
             const result = await models.rates.update({is_deleted: true}, {
                 where: {
                     id: data.id ,
                 }
             })
             console.log("result", result)

             if(result.length > 0){
                console.log("result ", result.length)
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Deleted"};
             } 
          

        } catch(err){
            console.log("err", err)
        }
        return  response;
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
        if(weight == 0){
            response.status = 200
            response.rate = 0;
            response.weight = 0;
            response.charges = 0
            response.subtotal = 0
            response.total = 0
            return response;

        }
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
    async findRatebyTrackingNumbers(tracking_numbers,) {
        var response = {status: 404, weights: []}
        var subtotal = 0;
        var total = 0;
        try{
            //get weight of each package
            tracking_numbers = tracking_numbers.split(',');
            for (var i = 0; i < tracking_numbers.length; i++){
                var packagedetails = await models.packages.findOne({where: {tracking_number: tracking_numbers[i], is_deleted: false}})
                if(packagedetails) {

                    if(packagedetails.method == "prepaid"){
                        subtotal = 0;
                        total = subtotal;
                    } else{

                        var weight = Math.ceil(packagedetails.weight) 

                        var rate = await models.rates.findOne({where: {weight: weight}});
                        if(rate) {
                             subtotal += (rate.rate)
                             total = subtotal;
                        } 
                        if(!rate){
                            //calculate rate using increment and base rate
                            var baserate = await models.charges.findOne({where:{ name: "baserate"}});
                            var incrementrate = await models.charges.findOne({where:{ name: "incrementrate"}})
                            if(baserate &&incrementrate){
                                var freightcost = baserate.amount + (weight * incrementrate.amount) 
                                if(freightcost) {
                                
                                    subtotal += freightcost
                                    total = subtotal;
            
                                }
                                console.log("rate not found total", response.total)
            
                            }
                        
                        
                        }
                    }
                  
                }
            
            }
            response.charges = 0
            response.subtotal = subtotal
            response.total = total
            response.status = 200

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


    async addBatch(data){
       
        try{
            //ensure user doesnt exist
            var batchexist = await models.batches.findOne({where:{ name: util.sanitize(data.name.toLowerCase())}})
            if(batchexist) return  res.status(registeredcodes.SUCCESS).json({status: registeredcodes.DUPLICATE, branch: branchexist, message: "Branch with the same name exist"});
            let requestdata = {
                name: util.sanitize(data.name.toLowerCase()),
                type:  data.type,
                description: data.description,
                status: data.status,
                count:data.count,
                source:  data.source,
                destination: data.destination,
                current_location: data.current_location,
                code: util.generateTrackingNumber(6),
                notes: data.notes,
                is_deleted: false
            };

            const batch = await models.batches.create(requestdata);
            if(batch){
                return  {success: true, batch: batch, status: registeredcodes.SUCCESS, message: "Successfully Added"};
            } 
            console.log(`Batch Creation error: batch could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create branch"}


    
    }   


    async findAllBatches() {
        var response = {status: 404, batches: []}

        try{
            var batches = await models.batches.findAll({where: {is_deleted: false}, order: [[ 'id', 'DESC' ]]});
            if(batches) {
                response.status = 200
                response.batches = batches;
            }
            return response;
        
        } catch(error){
            console.log("findAllBatches error-", error)
        }
        return  response;
      
    }

    async findBatch(id) {
        var response = {status: 404}

        try{
            var batchresponse = await models.batches.findOne({where: {id: id}});
            if(batchresponse){
                response.status = 200
                response.batch = batchresponse
            }
            return response;
        
        } catch(error){
            console.log("findAllBatches error-", error)
        }
        return  response;
      
    }
    async updateBatch(data){
       
        try{
           
            let requestdata = {
                name: util.sanitize(data.name.toLowerCase()),
                type:  data.type,
                description: data.description,
                status: data.status,
                count:data.count,
                source:  data.source,
                destination: data.destination,
                current_location: data.current_location,
                code: data.code,
                notes: data.notes
            };

             const result = await models.batches.update(requestdata, {
                 where: {
                     id: data.id ,
                 }
             })

             if(result.length > 0){
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
             } 
          
            console.log(`batches Creation error: batch could not be created for ${data.name}`);

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
            var userexist = null;
            data.create_an_account = true;
            if(!util.isNullOrEmpty(data.sender_email)){
               
               userexist =  await models.users.findOne({where: {email: util.sanitize(data.sender_email.toLowerCase())}})
               if(!userexist) 
               {
                 var uuid = uuidv4();
                 //create anonymous user
                  userexist = await models.users.create({is_anonymous: true, email: util.sanitize(data.sender_email.toLowerCase()), first_name: data.sender_first_name, last_name: data.sender_last_name, password: "SPEEDZ!#$", contact:data.sender_contact, uuid: uuid, is_admin: false, is_active: true})
               }
            }
            var sender_info = {
                first_name: data.sender_first_name,
                last_name: data.sender_last_name,
                email: data.sender_email?.toLowerCase(),
                contact: data.sender_contact,
                address: data.sender_address

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
                    if(data.method == "prepaid"){
                        var pkglist = []
                        pkglist.push(package_result.packagedetails)
                        var transactionresult =  await this.addTransaction(data, pkglist, userexist.id)
                        console.log("transaction reukt", transactionresult)
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
                            var resulttobesent=  {success: true, dropoff: requestinfo, package: package_result.packagedetails, transaction: transactionresult.transaction,  status: registeredcodes.SUCCESS, message: "Successfully Added"};
                            var templatedata = {
                                request_id: resulttobesent.dropoff.id,
                                date: moment(resulttobesent.dropoff.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                                code: resulttobesent.dropoff.code,
                                weight: resulttobesent.package.weight,
                                category: resulttobesent.package.category,
                                source: resulttobesent.package.source,
                                destination: resulttobesent.package.destination,
                                tracking_number: resulttobesent.package.tracking_number,
                                rate: resulttobesent.transaction.total,
                                subtotal: resulttobesent.transaction.total,
                                total: resulttobesent.transaction.total,
                                discount: 0.00,
                                tax: 0.00,
                                tendered: resulttobesent.transaction.tendered,
                                change: resulttobesent.transaction.change,
                          
                              
              
                            }
              
                            // var emailsent = await this.sendemail('receipt.html', 'Drop Off Receipt', data.sender_email, templatedata )
                            // console.log("Email Sent ",emailsent)
            
                            var emailsent = await this.sendemailwithpdf('dropoffreceiptemail.html','dropoffreceiptpdf.html', 'Drop Off Receipt',requestinfo.sender_info.email, templatedata )

                          
                            return resulttobesent;
        
                        } else{
                            //delete package 
                           var result =  await models.packages.destroy({
                               where: {
                               id: package_result.packagedetails.id
                               }
                           })
                            //delete dropoff 
                           var result =  await models.requests.destroy({
                               where: {
                               id: requestinfo.id
                               }
                           })
                           return  {success: false,  status: registeredcodes.FAILED_CREATION, message: "Failed to create transaction. Reversed dropoff and package creations."};
   
                   

                        }
                     }
                     else{
                        var resulttobesent =  {success: true, dropoff: requestinfo, package: package_result.packagedetails,  status: registeredcodes.SUCCESS, message: "Successfully Added"}
                       
                        try{
                            var templatedata = {
                                request_id: resulttobesent.dropoff.id,
                                date: moment(resulttobesent.dropoff.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                                code: resulttobesent.dropoff.code,
                                weight: resulttobesent.package.weight,
                                category: resulttobesent.package.category,
                                source: resulttobesent.package.source,
                                destination: resulttobesent.package.destination,
                                tracking_number: resulttobesent.package.tracking_number
                                    
                              
              
                            }
                            // var emailsent = await this.sendemail('postpaidreceipt.html', 'Drop Off Receipt', data.sender_email, templatedata )
                            // console.log("Email Sent ",emailsent)
                            var emailsent = await this.sendemailwithpdf('dropoffreceiptemail.html','postpaidreceipt.html', 'Drop Off Receipt',requestinfo.sender_info.email, templatedata )
 
                        }catch(emailerror){
                          console.log(emailerror)
                          resulttobesent.message = "Email not sent but added successfully"
                          resulttobesent.status = registeredcodes.EMAIL_SENDING_FAILURE
                          
                        }
                 
                        
                        return resulttobesent;

                     }

                } else {
                    //delete dropoff 
                    var result =  await models.requests.destroy({
                        where: {
                        id: requestinfo.id
                        }
                    })
                    return  {success: true,  status: registeredcodes.FAILED_CREATION, message: "Failed to create package"};

                }

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
            var dropoffs = await models.requests.findAll({where:
                 {type: "dropoff", is_deleted: false}
                 , order: [[ 'id', 'DESC' ]]
                });
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
            var dropoffresponse = await models.requests.findOne({where: {type: "dropoff", id: id, is_deleted: false}});
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
           
           
            var id = data.id
            var sender_info = {
                first_name: data.sender_first_name,
                last_name: data.sender_last_name,
                email: data.sender_email?.toLowerCase(),
                contact: data.sender_contact,
                address: data.sender_address

            }
            delete data.id
            data.sender_info = sender_info
            console.log("Updating the following: ", data)

             const result = await models.requests.update(data, {
                 where: {
                     id: id ,
                     is_deleted: false
                 }
             })

             if(result[0] > 0){
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
             } 
          
            console.log(`Dropoff Requests Creation error: dropoff could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update dropoff"}


    
    } 

    async deleteDropoff(id){
        try{
            console.log("deleting id", id)
            //can only remove if the statuses are in pending transit
            const result = await models.requests.update({is_deleted: true, status: statuses.dropoffstatuses.cancelled }, {
                where: {
                    id: id ,
                    status: statuses.dropoffstatuses.pending
                }
            })
                  
            console.log("request delete resulet", result)
            
            if(result[0] > 0){
                const packageresult = await models.packages.update({is_deleted: true, status: statuses.packagesstatuses.cancelled }, {
                    where: {
                        request_id: id ,
                        status: statuses.packagesstatuses.pending
                    }
                })
                if(packageresult[0] > 0 ){
                    return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Deleted"};
                } else{

                    //undo deleting if the package did not delete
                    const result = await models.requests.update({is_deleted: false, status: statuses.dropoffstatuses.pending }, {
                        where: {
                            id: id ,
                            status: statuses.dropoffstatuses.pending
                        }
                    })
                    return  {success: false, status: registeredcodes.FAILED_UPDATE, message: "No pending package found for drop off, cannot cancelled."};

                }
            }  else{
                return  {success: false, status: registeredcodes.FAILED_UPDATE, message: "Drop off is not in pending status, cannot cancelled."};

            }
             
        } catch(error){
            console.log("TRY CATCH ERROR,", error)
        }
       
        return  {success: false, status: registeredcodes.FAILED_UPDATE, message: "Could not delete dropoff"};

    }
 
 
    async findDropoffDetails(dropoffid){
        var response = {status: 500}
        var dropoffresponse = await models.requests.findOne({where: {type: "dropoff", id: dropoffid , is_deleted: false}});
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

        } else{
            response.status = registeredcodes.ITEM_NOT_FOUND
            response.message = "Dropoff not found"
        }
        console.log("response", response)
        return response;
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

        return response;
    }
    async emailReceiptInfo(dropoffid){
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
         

        }

        try{
            if(response.dropoff.method =="prepaid"){
                var templatedata = {
                  request_id: response.dropoff.id,
                  date: moment(response.dropoff.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                  code: response.dropoff.code,
                  weight: response.packages[0].weight,
                  category: response.packages[0].category,
                  source: response.packages[0].source,
                  destination: response.packages[0].destination,
                  tracking_number: response.packages[0].tracking_number,
                  rate: response.transaction.total,
                  subtotal: response.transaction.total,
                  total: response.transaction.total,
                  discount: 0.00,
                  tax: 0.00,
                  tendered: response.transaction.tendered,
                  change: response.transaction.change,
            
                
    
              }
               const template =  fs.readFileSync('./public/templates/receipt.html', 'utf-8');
    
               var html = mustache.render(template, templatedata)
    
              var emailsent = await this.sendemailwithpdf('dropoffreceiptemail.html','dropoffreceiptpdf.html', 'Drop Off Receipt',dropoffresponse.sender_info.email, templatedata )

            //   var emailsent = await this.sendemail('receipt.html', 'Drop Off Receipt',dropoffresponse.sender_email, templatedata )
            response.status = 200
            
    
          } else{
                var templatedata = {
                  request_id: response.dropoff.id,
                  date: moment(response.dropoff.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                  code: response.dropoff.code,
                  weight: response.packages[0].weight,
                  category: response.packages[0].category,
                  source: response.packages[0].source,
                  destination: response.packages[0].destination,
                  tracking_number: response.packages[0].tracking_number,
            
                
    
              }
              const template = fs.readFileSync('./public/templates/postpaidreceipt.html', 'utf-8');
    
              var html = mustache.render(template, templatedata)
              //var emailsent = await this.sendemail('postpaidreceipt.html', 'Drop Off Receipt', dropoffresponse.sender_email, templatedata )
              var emailsent = await this.sendemailwithpdf('dropoffreceiptemail.html','postpaidreceipt.html', 'Drop Off Receipt',dropoffresponse.sender_info.email, templatedata )
              response.status = 200
            
             
          }

        }catch(emailerror){
            console.log(emailerror)
            response.status=500
            response.message ="Internal failure with sending emails"
        }
      
      
    
        return response;
    }
    async getLabelInfo(dropoffid){
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
    async addPackage(data, request_id){
       
        try{
            var senderexist = null;
            var dropoffrequest = await models.requests.findOne({where: {id: request_id}});
            if(dropoffrequest){
                 senderexist = await models.users.findOne({where: {id: dropoffrequest.user_id}});
            }
            //dont create account for reciever
            var receiverexist = null;
            if(!util.isNullOrEmpty(data.receiver_email)){
                receiverexist =  await models.users.findOne({where: {email: util.sanitize(data.receiver_email.toLowerCase())}})
                if(!receiverexist) 
                {
                  var uuid = uuidv4();
                  //create anonymous user
                  receiverexist = await models.users.create({is_anonymous: true, email: util.sanitize(data.receiver_email.toLowerCase()), first_name: data.receiver_first_name, last_name: data.receiver_last_name, password: "SPEEDZ!#$", contact:data.receiver_contact, uuid: uuid, is_admin: false, is_active: true})
                }
            }

           
            var sender_info = {
                address: data.sender_address
            }
            var receiver_info = {
                address: data.receiver_address
            }
            //calculate current rate and store on package 
            // var rateresponse = await findRatebyWeight(Math.ceil(data.weight));
            // var rate = (rateresponse && rateresponse.status == 200) ? rateresponse.rate : ""
            let requestdata = {
                sender_first_name: data.sender_first_name.toLowerCase(),
                sender_last_name: data.sender_last_name.toLowerCase(),
                sender_email: data.sender_email,
                sender_contact: data.sender_contact,
                receiver_first_name: data.receiver_first_name.toLowerCase(),
                receiver_last_name: data.receiver_last_name.toLowerCase(),
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
                created_on: Date.now(),
                modified_on: Date.now(),
                modified_by: data.modified_by
            };
            if(senderexist) requestdata.sender_id = senderexist.id
            if(receiverexist) requestdata.receiver_id = receiverexist.id

            var packagedetails = await models.packages.create(requestdata);
            if(packagedetails){
                console.log("Successfully created package")
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
    async findPackage(id) {
        var response = {status: 404, package: null}

        try{
            var packageinfo = await models.packages.findOne({
                where:   {is_deleted: false, id: parseInt(id)}, 
                include: [
                    { model: models.batches },
                    { model: models.requests },
                    { model: models.collection_requests },
                    { model: models.transactions }

                ]
            });
            if(packageinfo) {
                response.status = 200
                response.package = packageinfo;
            }
            return response;
        
        } catch(error){
            console.log("findpackage -", error)
        }
        return  response;
      
    }
    async findAllPackages() {
        var response = {status: 404, branches: []}

        try{
            var packages = await models.packages.findAll({
                where:   {is_deleted: false},  
                include: [
                    { model: models.batches },
                    { model: models.requests }

                ]
                , order: [[ 'id', 'DESC' ]]

            });
            if(packages) {
                response.status = 200
                response.packages = packages;
            }
            return response;
        
        } catch(error){
            console.log("findAllPackageserror-", error)
        }
        return  response;
      
    }
    async scanPackage(data){
       
        try{
           
            
            let requestdata = data
            if(data.batch_id == null || data.current_location == null ) return {status: registeredcodes.FAILED_CREATION, message: "No batch or current location assigned"}

            delete requestdata.id;
             const result = await models.packages.update({batch_id: parseInt(data.batch_id), status: data.status, current_location: data.current_location, modified_by: data.modified_by, modified_on: Date.now()}, {
                 where: {
                    tracking_number: data.tracking_number,
                    is_deleted: false

                 }
               
             })


             console.log("RESULT OF SCAN - ", data.tracking_number + " ", result )
             if(result[0] > 0){
                


                 var packagedetails = await models.packages.findOne({where:
                     {tracking_number: data.tracking_number, is_deleted: false},
                     include: [
                        { model: models.batches }
                    ]
    
                    })

                  //send email to receiver
                  var templatedata = {
                    date: moment(packagedetails.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    package: packagedetails
                  }
                  try{

                    var emailsentreceiver = await this.sendemail('statusupdateemail.html', 'Status Update', packagedetails.receiver_email, templatedata )
                    var emailsentsender = await this.sendemail('statusupdateemail.html', 'Status Update', packagedetails.sender_email, templatedata )

                  } catch(error){

                    console.log("ERROR: SENDING EMAIL FOR SCANNING",emailsentreceiver, emailsentsender , error)
                  }
                   
                     return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated", package: packagedetails};
             } 
            else{
                return {status: registeredcodes.FAILED_CREATION, message: "No package found to update"}

            }
            console.log(`scanning Requests Creation error: scanning could not be done for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to scan package"}


    
    } 

    async updatePackage(data){
       
        try{
           
           
            var id = data.id
            
            delete data.id

             const result = await models.packages.update(data, {
                 where: {
                     id: id ,
                     is_deleted: false
                 }
             })

             if(result[0] > 0){
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
             } 
          
            console.log(`Packages Requests Creation error: packages could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update packages"}


    
    } 

    async deletePackage(id){
        try{
           
                const packageresult = await models.packages.update({is_deleted: true, status: statuses.packagesstatuses.cancelled }, {
                    where: {
                        id: id ,
                        status: statuses.packagesstatuses.pending
                    }
                })
                if(packageresult[0] > 0 ){
                    return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Deleted"};
                } 
           
             
        } catch(error){
            console.log("TRY CATCH ERROR,", error)
        }
       
        return  {success: false, status: registeredcodes.FAILED_UPDATE, message: "Could not delete dropoff"};

    }

    async findAllPickupRequests() {
        var response = {status: 404, pickups: []}

        try{
            var pickups = await models.collection_requests.findAll({where: {type: "pickup",is_deleted: false}, order: [[ 'id', 'DESC' ]]});
            if(pickups) {
                response.status = 200
                response.pickups = pickups;
            }
            return response;

        
        } catch(error){
            console.log("findAllPickup error-", error)
        }
        return  response;
      
    }
    async findPickup(id) {
        var response = {status: 404, collection_request: null}

        try{
            var collection_request = await models.collection_requests.findOne({
                where:   {is_deleted: false, id: parseInt(id)}, 
                include: [
                    { model: models.transactions }

                ]
            });
            if(collection_request) {
                response.status = 200
                response.collection_request = collection_request;
            }
            return response;
        
        } catch(error){
            console.log("findpackage -", error)
        }
        return  response;
      
    }
    async updatePickup(data){
       
        try{
           
            
            let requestdata = data
            console.log("pickup ", data)
             const result = await models.collection_requests.update(requestdata, {
                 where: {
                     id: data.id ,
                 }
             })

             if(result[0] > 0){
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
             } 
          
            console.log(`pickup Requests Creation error: pickup could not be created for ${data.name}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to create pickup"}


    
    } 
    async deletePickup(id){
        try{
           
                const requestsresult = await models.collection_requests.update({is_deleted: true, status: statuses.collectionsstatuses.cancelled }, {
                    where: {
                        id: id ,
                    }
                })
                if(requestsresult[0] > 0 ){
                    return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Deleted"};
                } 
           
             
        } catch(error){
            console.log("delete pickup try catch ,", error)
        }
       
        return  {success: false, status: registeredcodes.FAILED_UPDATE, message: "Could not delete dropoff"};

    }
  
    
  async addPickupCheckout(data){
       
    try{

         //create user or get id
         var userexist = false;
         data.create_an_account = true;
         if(!util.isNullOrEmpty(data.collector_email) && data.create_an_account == true){
            userexist =  await models.users.findOne({where: {email: util.sanitize(data.collector_email.toLowerCase)}})
            if(!userexist) 
            {
              var uuid = uuidv4();
              //create anonymous user
               userexist = await models.users.create({is_anonymous: true, email: util.sanitize(data.collector_email.toLowerCase), first_name: data.collector_first_name, last_name: data.collector_last_name, password: "SPEEDZ!#$", contact:data.collector_contact, uuid: uuid, is_admin: false, is_active: true})
            }
         }
 
         //get tracking numbers
         var tracknums = data.tracking_nums.split(',') ;
         console.log("tracknums",tracknums, data.tracking_nums.split(','))
         //create collector request
 
         let requestdata = {
             user_id: userexist?.id,
             packages:tracknums, 
             code: "SPDCOL"+util.makeid(8),
             type: "pickup",
             description: data.description,
             request_type: data.request_type,
             status:  "picked up",
             method: data.method,
             notes: data.notes,
             details: data,
             is_deleted: false,
             collector_first_name: data.collector_first_name,
             collector_email: data.collector_email, 
             collector_last_name:data.collector_last_name,
             collector_contact: data.collector_contact,
             
         };
         if(userexist) requestdata.user_id = userexist?.id
 
        const collectionreqresponse = await models.collection_requests.create(requestdata);
        if (collectionreqresponse){
            var packages =  await models.packages.findAll({where: {tracking_number: data.tracking_nums.split(",")}})
            if(packages) {
                for(var i = 0; i < packages.length; i++){
                    var packageinfo = packages[i]
                    var dropoffreq = await models.requests.findOne({where: {id: packageinfo.request_id}})
                    //update package to picked up
                    var reqdata = {status: "picked up", 
                        collector_first_name: data.collector_first_name,
                        collector_email: data.collector_email, 
                        collector_last_name:data.collector_last_name,
                        collector_contact: data.collector_contact,
                        collected_on: Date.now(),
                        collector_id: userexist.id,
                        collection_id: collectionreqresponse.id
                        }
                    const packageupdateresult = await models.packages.update(reqdata, {
                        where: {
                            id: packageinfo.id
                        }
                    })

                    try{
                        packageinfo.status = 'picked up'
                        var templatedata = {
                            date: moment(packageinfo.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                            package: packageinfo
                          }
                            var emailsentreceiver = await this.sendemail('statusupdateemail.html', 'Status Update', packageinfo.receiver_email, templatedata )
                            var emailsentsender = await this.sendemail('statusupdateemail.html', 'Status Update', packageinfo.sender_email, templatedata )
                            var emailsentcollector= await this.sendemail('statusupdateemail.html', 'Status Update', data.collector_email, templatedata )


                    }catch(err){
                        console.log("error sending email addpickupcheckout")
                    }
    
                    //update dropoffreq to completed if all packages are collected

                    //search for the packages that has the request id 
                    var dropoffpkgscount = await models.packages.count({where: {request_id: dropoffreq.id}});
                    var dropofffullfiedpkgscount = await models.packages.count({where: {request_id: dropoffreq.id, status: "picked up"}});
                    if(dropoffpkgscount == dropofffullfiedpkgscount){
                        const dropoffresult = await models.requests.update({status: "completed"}, {
                            where: {
                                id: dropoffreq.id ,
                            }
                        })
                    }
                    
    

                }
            } 
        
            //get all the packages that were post paid
            var postpaidpackages =  await models.packages.findAll({where: {tracking_number: data.tracking_nums.split(","), method: "pay on collect"}})
            var postpaidpackagestrackings =  await models.packages.findAll({where: {tracking_number: data.tracking_nums.split(","), method: "pay on collect"}})

            if(postpaidpackages && postpaidpackages.length > 0 && data.total != 0) {
                var userid =  (userexist) ? userexist.id : null;
                if(data.total > 0){

                    var transactionresult =  await this.addTransaction(data, postpaidpackages,  userid);
                   
                    if(transactionresult.status == 200){
                        for(var i = 0; i < postpaidpackages.length; i++ ){
                            var pkgdata = {transaction_id: transactionresult.transaction.id};
                            const result = await models.packages.update(pkgdata, {
                                where: {
                                    id: postpaidpackages[i].id ,
                                }
                            });
                            const collectionresult = await models.collection_requests.update(pkgdata, {
                                where: {
                                    id: collectionreqresponse.id ,
                                }
                            });
                        }
                        
                        return  {success: true, collection_request: collectionreqresponse, transaction: transactionresult.transaction,  status: registeredcodes.SUCCESS, message: "Successfully Added"};
        
                    }else{
                        for(var i = 0; i < postpaidpackages.length; i++ ){
                            //update package to picked up
                            
                                var reqdata = {status: "ready for pickup", 
                                collector_first_name: null,
                                collector_email: null,
                                collector_last_name:null,
                                collector_contact: null,
                                collector_id: null,
                                collection_id: null
                            }
                            const packageupdateresult = await models.packages.update(reqdata, {
                                where: {
                                    id: postpaidpackages[i].id
                                }
                             })
                        }
                   
                        const removecollectionresult = await models.collection_requests.update({is_deleted: true}, {
                            where: {
                                id: collectionreqresponse.id
                            }
                        })
                     

                        return  {success: false,    status: registeredcodes.FAILED_UPDATE, message: "Failed to update/create transaction"};

                    }

                

                }
                return  {success: true, collection_request: collectionreqresponse,   status: registeredcodes.SUCCESS, message: "Successfully Added"};
            }

            return  {success: true, collection_request: collectionreqresponse,   status: registeredcodes.SUCCESS, message: "Successfully Added"};

        }

        
               

              
        
        console.log(`Dropoff Request Creation error: dropoff could not be created for ${data.name}`);

    }
    catch (ex) 
    {
        console.log(ex)
    }
    return {status: registeredcodes.FAILED_CREATION, message: "Failed to create pickup"}



}   


    async getPickupReceiptInfo(collection_id){
        var response = {status: 500}
        var pickupresponse = await models.collection_requests.findOne({where: { id: collection_id}});
        if(pickupresponse){
            //get pickup collection request 
            response.collection = pickupresponse
            //get packages 
            response.packages =[]
            var packagesresponse = await models.packages.findAll({where: { collection_id: pickupresponse.id}});
            if(packagesresponse){
                response.packages = packagesresponse

            }

            var transactionresponse = await models.transactions.findOne({where: { id: pickupresponse.transaction_id}});
            if(transactionresponse){
                response.transaction = transactionresponse
                
            }
            response.status = 200

        }
        console.log("response", response)

        return response;
    }
    async emailPickupReceiptInfo(collection_id){
        var response = {status: 500}
        var pickupresponse = await models.collection_requests.findOne({where: { id: collection_id}});
        if(pickupresponse){
            //get pickup collection request 
            response.collection = pickupresponse
            //get packages 
            response.packages =[]
            var packagesresponse = await models.packages.findAll({where: { collection_id: pickupresponse.id}});
            if(packagesresponse){
                response.packages = packagesresponse

            }

            var transactionresponse = await models.transactions.findOne({where: { id: pickupresponse.transaction_id}});
            if(transactionresponse){
                response.transaction = transactionresponse
                
            }
            response.status = 200

        }


        try{
          
            if(!response.transaction){
                var templatedata = {
                  request_id: response.collection.id,
                  date: moment(response.collection.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                  code: response.collection.code,
                  packages: response.packages,
                  
                
            
                

              }
              const template =  fs.readFileSync('./public/templates/prepaidpickupcheckoutreceipt.html', 'utf-8');

            

              var html = mustache.render(template, templatedata)

              var emailsentreceiver = await this.sendemailwithpdf('pickupreceiptemail.html','prepaidpickupcheckoutreceipt.html', 'Pickup Receipt', response.packages[0].receiver_email , templatedata )
              var emailsentsender = await this.sendemailwithpdf('pickupreceiptemail.html','prepaidpickupcheckoutreceipt.html', 'Pickup Receipt', response.packages[0].sender_email , templatedata )
              var emailsentcollector = await this.sendemailwithpdf('pickupreceiptemail.html','prepaidpickupcheckoutreceipt.html', 'Pickup Receipt', pickupresponse.collector_email , templatedata )

              console.log("Email Sent emailsentreceiver ",response.packages[0].receiver_email ,emailsentreceiver)
    
              response.status = 200
              
          } else{
                var templatedata = {
                  request_id: response.collection.id,
                  date: moment(response.collection.created_on).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                  code: response.collection.code,
                  packages: response.packages,
                  rate: response.transaction.total,
                  subtotal: response.transaction.total,
                  total: response.transaction.total,
                  discount: 0.00,
                  tax: 0.00,
                  tendered: response.transaction.tendered,
                  change: response.transaction.change,
                

              }
              const template = fs.readFileSync('./public/templates/pickupcheckoutreceipt.html', 'utf-8');

              var emailsentreceiver = await this.sendemailwithpdf('pickupreceiptemail.html','pickupcheckoutreceipt.html', 'Pickup Receipt', response.packages[0].receiver_email , templatedata )
              var emailsentsender = await this.sendemailwithpdf('pickupreceiptemail.html','pickupcheckoutreceipt.html', 'Pickup Receipt', response.packages[0].sender_email , templatedata )
              var emailsentcollector = await this.sendemailwithpdf('pickupreceiptemail.html','pickupcheckoutreceipt.html', 'Pickup Receipt', pickupresponse.collector_email , templatedata )

              console.log("Email Sent ", response.packages[0].receiver_email ,emailsentreceiver)
              console.log("Email Sent ", response.packages[0].sender_email ,emailsentsender)
              console.log("Email Sent ",pickupresponse.collector_email ,emailsentcollector)

              response.status = 200
          }
          

        }catch(emailerror){
            console.log(emailerror)
            response.status=500
            response.message ="Internal failure with sending emails"
        }
    

        return response;
    }
    async scanPickupPackage(data){
       
        try{
           
            
            var packagedetails = await models.packages.findOne({where:
                {tracking_number: data.tracking_number},
                include: [
                   { model: models.batches },
                   { model: models.requests },

               ]

               })
            return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Found", package: packagedetails};
   
          
        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to find packages"}


    
    } 
    async scanPickupPackageByName(data){
       
        try{
           
            
            var packages = await models.packages.findAll({where:
                {receiver_first_name: data.receiver_first_name.toLowerCase(), receiver_last_name: data.receiver_last_name.toLowerCase(), status: 'ready for pickup'},
                include: [
                   { model: models.batches },
                   { model: models.requests },

               ]

               })
            return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Found", packages: packages};
   
          
        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to find packages"}


    
    } 
    async findAllTransactions() {
        var response = {status: 404, transactions: []}

        try{
            var transactions = await models.transactions.findAll({where: {is_deleted: false}});
            if(transactions) {
                response.status = 200
                response.transactions = transactions;
            }
            return response;
        
        } catch(error){
            console.log("findAlltransactionsserror-", error)
        }
        return  response;
      
    }
    async findTransaction(id) {
        var response = {status: 404, transaction: null}

        try{
            var transaction = await models.transactions.findOne({
                where:   {is_deleted: false, id: parseInt(id)}, 
              
            });
            console.log("transaction",transaction)
            if(transaction) {
                response.status = 200
                response.transaction = transaction;
            }
            return response;
        
        } catch(error){
            console.log("find transaction -", error)
        }
        return  response;
      
    }
    async addTransaction(data,packages, sender_id){
       
        try{
        

            var package_ids = []
            var tracking_nums = []
            // if(packages.length < 1) package_ids.push(packages.id.toString());
            if(packages.length > 0 ) 
            {
               for (var i = 0; i< packages.length ; i++){
                    package_ids.push(packages[i].id.toString());
                    tracking_nums.push(packages[i].tracking_number.toString());
               }
            }

             //get last package entered 
            var latesttransactionrecord = await models.transactions.findOne({limit: 1,order: [ [ 'id', 'DESC' ]]});
            var latesttransactionnumber = 1;

            if(latesttransactionrecord){
                if(latesttransactionrecord.transaction_number != null)
                    latesttransactionnumber = parseInt(latesttransactionrecord.transaction_number) + 1
            }
            //creating transaction
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
                is_deleted: false,
                order_number: "S-O-"+util.makeid(8),
                type: "general",
                is_successful: true,
                method: data.method, 
                package_tracking_numbers: tracking_nums,
                modified_by: data.modified_by,
                receipt_number: latesttransactionnumber

            };
          
            console.log("Creating transaction with this", requestdata)
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

    async updateTransaction(data){
       
        try{
           
            
            let requestdata = data
             const result = await models.transactions.update(requestdata, {
                 where: {
                     id: data.id ,
                 }
             })

             if(result[0] > 0){
                 var transactionresponse = await models.transactions.findOne({where: {id: data.id}});
                 if(transactionresponse && transactionresponse.status == "cancelled"){
                    //update collection_request to deleted 
                    var collectionresult = await models.collection_requests.update({is_deleted: true}, {
                        where: {
                            id: transactionresponse.collection_id ,
                        }
                    })
                    //update all packages back to ready
                    var packagesresult = await models.packages.update({status: statuses.packagesstatuses.readyforpickup}, {
                        where: {
                            id: transactionresponse.package_ids ,
                        }
                    })
                    
                    //TODO: update requests after canceling transaction 


                    
                 }
                 return  {success: true, status: registeredcodes.SUCCESS, message: "Successfully Updated"};
             } 
          
            console.log(`Transaction Requests update error: transaction could not be created for ${data.order_number}`);

        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_CREATION, message: "Failed to update transaction"}


    
    } 
    async getBilling(tracking_numbers,) {
        var response = {status: 404, weights: []}
        var subtotal = 0;
        var total = 0;
        var billinginfo = []
        try{
            //get weight of each package
            tracking_numbers = tracking_numbers.split(',');
            for (var i = 0; i < tracking_numbers.length; i++){
                var packagedetails = await models.packages.findOne({where: {tracking_number: tracking_numbers[i], is_deleted: false}})
                if(packagedetails) {


                        var weight = Math.ceil(packagedetails.weight) 

                        var rate = await models.rates.findOne({where: {weight: weight}});
                        if(rate) {
                            billinginfo.push({
                                package_total: rate.rate,
                                weight: weight
                            })
                             subtotal += (rate.rate)
                             total = subtotal;
                        } 
                        if(!rate){
                            //calculate rate using increment and base rate
                            var baserate = await models.charges.findOne({where:{ name: "baserate"}});
                            var incrementrate = await models.charges.findOne({where:{ name: "incrementrate"}})
                            if(baserate &&incrementrate){
                                var freightcost = baserate.amount + (weight * incrementrate.amount) 
                                if(freightcost) {
                                
                                    billinginfo.push({
                                        package_total: freightcost,
                                        weight: weight
                                    })
                                    subtotal += freightcost
                                    total = subtotal;
            
                                }
                                console.log("rate not found total", response.total)
            
                            }
                        
                        
                        }
                    
                  
                }
            
            }
            response.charges = 0
            response.subtotal = subtotal
            response.total = total
            response.status = 200
            response.billinginfo = billinginfo;
            return response;
        
        } catch(error){
            console.log("findRate error-", error)
        }
        return  response;
      
    }
    async getBillingByID(package_ids) {
        var response = {status: 404, weights: []}
        var subtotal = 0;
        var total = 0;
        var billinginfo = []
        try{
            //get weight of each package
            for (var i = 0; i < package_ids.length; i++){
                var packagedetails = await models.packages.findOne({where: {id: package_ids[i], is_deleted: false}})
                if(packagedetails) {


                        var weight = Math.ceil(packagedetails.weight) 

                        var rate = await models.rates.findOne({where: {weight: weight}});
                        if(rate) {
                            billinginfo.push({
                                total: rate.rate,
                                weight: weight,
                                 package: packagedetails
                            })
                             subtotal += (rate.rate)
                             total = subtotal;
                        } 
                        if(!rate){
                            //calculate rate using increment and base rate
                            var baserate = await models.charges.findOne({where:{ name: "baserate"}});
                            var incrementrate = await models.charges.findOne({where:{ name: "incrementrate"}})
                            if(baserate &&incrementrate){
                                var freightcost = baserate.amount + (weight * incrementrate.amount) 
                                if(freightcost) {
                                
                                    billinginfo.push({
                                        total: freightcost,
                                        weight: weight, 
                                         package: packagedetails
                                    })
                                    subtotal += freightcost
                                    total = subtotal;
            
                                }
                                console.log("rate not found total", response.total)
            
                            }
                        
                        
                        }
                    
                  
                }
            
            }
            response.charges = 0
            response.subtotal = subtotal
            response.total = total
            response.status = 200
            response.billinginfo = billinginfo;
            return response;
        
        } catch(error){
            console.log("package ids billing  error-", error)
        }
        return  response;
      
    }


    async sendemail (templatename, subject, receiver_email,variables){

        if(receiver_email == null) return false;
        //send activation email
       /// var template = fs.readFileSync(`../public/templates/${templatename}`, 'utf-8'); 
       const template =  fs.readFileSync(`./public/templates/${templatename}`, 'utf-8');

        var output = (template != null) ? mustache.render(template, variables) : "Unable to render template";
    
        var mail = {
            html: output,
            message: {
                to: receiver_email,
                //to: "jtanjels@gmail.com",
                subject: subject, 
                bcc: process.env.COURIER_EMAIL_CC,
                html: output
            },
        }
        //send email
        console.log("SENDING EMAIL to ", receiver_email )
        var emailsent = await email(mail)
       //if (!emailsent) return false;
        return true;
    }
 
    async sendemailwithpdf (htmltemplatename, pdftemplatename, subject, receiver_email,variables){
        if(receiver_email == null) return false;
        //send activation email
       /// var template = fs.readFileSync(`../public/templates/${templatename}`, 'utf-8'); 
        const template =  fs.readFileSync(`./public/templates/${pdftemplatename}`, 'utf-8');
        var output = (template != null) ? mustache.render(template, variables) : "Unable to render template";
       
        const htmltemplate =  fs.readFileSync(`./public/templates/${htmltemplatename}`, 'utf-8');
        var htmloutput = (htmltemplate != null) ? mustache.render(htmltemplate, variables) : "Unable to render template";
       
       
        // try{
        //     var htmlContent = '<h1>Hello World</h1><p>This is custom HTML content.</p>';
        //     htmlContent = output
        //     await this.generatePDFfromHTML(htmlContent, 'custom.pdf');
            

        // } catch(error){
        //     console.log("generating pdf error", error)
        // }
       
        return await pdf.create(output, {
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }}).toBuffer(async function (err, buffer) {
            if (err) {
                console.log(err);
              return false
                
            } 
            console.log('PDF generated successfully:');

            var mail = {
                html: htmloutput,
                message: {
                    to: receiver_email,
                    //to: "jtanjels@gmail.com",
                    subject: subject, 
                    bcc: process.env.COURIER_EMAIL_CC,
                    html: htmloutput,
                    attachments: [
                        {
                            filename: "receipt.pdf",
                            content: buffer
                        }
                    ],
                },
                attachments: [
                    {
                        filename: "receipt.pdf",
                        content: buffer
                    }
                ],
            }
            //send email
            console.log("SENDING EMAIL to ", receiver_email )
            var emailsent = await email(mail)
            if (!emailsent) return false;
            return true;
          });
        
    }
 
    async getDropOffDataAnalytics(rangetype,  rangenumber = 0 , startofrangetype = 'year', startrangenumber, method='all'){
        
        try{
            
            var whereclause = {
                type: "dropoff",
                is_deleted: false,
                created_on: {
                    [Op.lte]: moment().endOf(`${rangetype}`).subtract(rangenumber, `${rangetype}s`).toDate(),
                    [Op.gte]: moment().startOf(`${startofrangetype}`).subtract(startrangenumber, `${rangetype}s`).toDate()
    
                }
            }
          
            if(method == 'prepaid' || method == 'pay on collect' ) whereclause.method = method
            const transactions_list  = await models.requests.findAll({ 
                where: whereclause,
                group: [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on'))],
    
                attributes: [
                   [models.sequelize.literal("COUNT(DISTINCT(id))"), "count"],
                    [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on')), 'createdOn'],
                  
               
                ],
             
                raw: true
            })
            return {status: registeredcodes.SUCCESS, message: "Successful", transactions_list}

            
        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_DELETE, message: "Failed to retrieving report"}

    }
    async getPickupDataAnalytics(rangetype,  rangenumber = 0 , startofrangetype = 'year', startrangenumber, method='all'){
        
        try{
            
            var whereclause = {
                is_deleted: false,
                created_on: {
                    [Op.lte]: moment().endOf(`${rangetype}`).subtract(rangenumber, `${rangetype}s`).toDate(),
                    [Op.gte]: moment().startOf(`${startofrangetype}`).subtract(startrangenumber, `${rangetype}s`).toDate()
    
                }
            }

            if(method == 'prepaid' || method == 'pay on collect' ) whereclause.method = method
            const transactions_list  = await models.collection_requests.findAll({ 
                where: whereclause,
                group: [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on'))],
    
                attributes: [
                   [models.sequelize.literal("COUNT(DISTINCT(id))"), "count"],
                    [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on')), 'createdOn'],
                  
               
                ],
             
                raw: true
            })
            return {status: registeredcodes.SUCCESS, message: "Successful", transactions_list}

            
        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_DELETE, message: "Failed to retrieving report"}

    }
    
    async getTransactionDataAnalytics(rangetype,  rangenumber = 0 , startofrangetype = 'year', startrangenumber, method='all'){
        
        try{
            
            var whereclause = {
                is_deleted: false,
                created_on: {
                    [Op.lte]: moment().endOf(`${rangetype}`).subtract(rangenumber, `${rangetype}s`).toDate(),
                    [Op.gte]: moment().startOf(`${startofrangetype}`).subtract(startrangenumber, `${rangetype}s`).toDate()
    
                }
            }

            if(method == 'prepaid' || method == 'pay on collect' ) whereclause.method = method
            const transactions_list  = await models.transactions.findAll({ 
                where: whereclause,
                group: [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on'))],
    
                attributes: [
                   [models.sequelize.literal("COUNT(DISTINCT(id))"), "count"],
                    [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on')), 'createdOn'],
                  
               
                ],
             
                raw: true
            })
            return {status: registeredcodes.SUCCESS, message: "Successful", transactions_list}

            
        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_DELETE, message: "Failed to retrieving report"}

    }
    async getPaymentsDataAnalytics(rangetype,  rangenumber = 0 , startofrangetype = 'year', startrangenumber, method='all'){
        
        try{
            
            var whereclause = {
                is_deleted: false,
                created_on: {
                    [Op.lte]: moment().endOf(`${rangetype}`).subtract(rangenumber, `${rangetype}s`).toDate(),
                    [Op.gte]: moment().startOf(`${startofrangetype}`).subtract(startrangenumber, `${rangetype}s`).toDate()
    
                }
            }

            if(method == 'prepaid' || method == 'pay on collect' ) whereclause.method = method
            const transactions_list  = await models.transactions.findAll({ 
                where: whereclause,
                group: [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on'))],
    
                attributes: [
                   [models.sequelize.literal("COUNT(DISTINCT(id))"), "count"],
                    [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on')), 'createdOn'],
                    [models.sequelize.fn('sum', models.sequelize.col('total')), 'total'],

               
                ],
             
                raw: true
            })
            return {status: registeredcodes.SUCCESS, message: "Successful", transactions_list}

            
        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_DELETE, message: "Failed to retrieving report"}

    }

    async getPackageDataAnalytics(rangetype,  rangenumber = 0 , startofrangetype = 'year', startrangenumber, method='all', key = null, value=null){
        
        try{
            
            var whereclause = {
              
                is_deleted: false,
                created_on: {
                    [Op.lte]: moment().endOf(`${rangetype}`).subtract(rangenumber, `${rangetype}s`).toDate(),
                    [Op.gte]: moment().startOf(`${startofrangetype}`).subtract(startrangenumber, `${rangetype}s`).toDate()
    
                }
            }
            console.log('value and key', value, key,value != null , key == 'sourcebranch' )
            if(value != null && key == 'sourcebranch') whereclause.source = value
            if(value != null && key == 'destinationbranch') whereclause.destination = value

            if(method == 'prepaid' || method == 'pay on collect' ) whereclause.method = method
            const transactions_list  = await models.packages.findAll({ 
                where: whereclause,
                group: [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on'))],
    
                attributes: [
                   [models.sequelize.literal("COUNT(DISTINCT(id))"), "count"],
                    [models.sequelize.fn('date_trunc', `${rangetype}`, models.sequelize.col('created_on')), 'createdOn'],
                  
               
                ],
             
                raw: true
            })
            return {status: registeredcodes.SUCCESS, message: "Successful", transactions_list}

            
        }
        catch (ex) 
        {
            console.log(ex)
        }
        return {status: registeredcodes.FAILED_DELETE, message: "Failed to retrieving report"}

    }

    async getDashboardAnalytics(){

        var response = {status: 200, data: {}}
        const TODAY_START = new Date();
        TODAY_START.setHours(0, 0, 0, 0)
        const NOW = new Date();

        var dropofftodaytotal = await models.requests.count({where: {
            type: "dropoff", is_deleted: false, 

            created_on: {
                //[Op.gt]: moment().tz('').toDate()
               // [Op.between]: [TODAY_START.toISOString(), NOW.toISOString()]
                [Op.gt]: TODAY_START.toISOString(),
                 [Op.lt]: NOW

            }
        }})

        var dropofftotal = await models.requests.count({where: {
            type: "dropoff", is_deleted: false, 
         
        }})

        response.data.dropofftotal  = dropofftotal || 0;
        response.data.dropofftodaytotal  = dropofftodaytotal || 0 ;
        
        var collectiontodaytotal = await models.collection_requests.count({where: {
            is_deleted: false, 
            created_on: {
            
                [Op.gt]: TODAY_START.toISOString(),
                [Op.lt]: NOW

            }
        }})
        var collectiontotal = await models.collection_requests.count({where: {
           is_deleted: false, 
         
        }})

        response.data.collectiontodaytotal  = collectiontodaytotal || 0;
        response.data.collectiontotal  = collectiontotal || 0 ;

        var packagetodaytotal = await models.packages.count({where: {
             is_deleted: false, 
            created_on: {
                [Op.gt]: TODAY_START.toISOString(),
                [Op.lt]: NOW

            }
        }})
        var packagetotal = await models.packages.count({where: {
            is_deleted: false, 
         
        }})
        response.data.packagetodaytotal  = packagetodaytotal || 0;
        response.data.packagetotal  = packagetotal || 0;
 

        var transactiontodaytotal = await models.transactions.count({where: {
            is_deleted: false, 
           created_on: {
               [Op.gt]: TODAY_START.toISOString(),
               [Op.lt]: NOW

           }
       }})
       var transactiontotal = await models.transactions.count({where: {
           is_deleted: false, 
        
       }})
       response.data.transactiontodaytotal  = transactiontodaytotal || 0;
       response.data.transactiontotal  = transactiontotal || 0;


       return response;

    }

    async generatePDFfromHTML(htmlContent, outputPath) {
        return await pdf.create(htmlContent).toFile(outputPath, (err, res) => {
            if (err) return console.log(err);
            console.log('PDF generated successfully:', res);
          });
      }
      




}

const dataService = new DataService();
module.exports = dataService ;
