const respCode = require("../../constants/responsecode.json");
const parseObj = require("../parseObj");
const util = require("../util");
const _ = require("lodash");
var useragent = require('express-useragent');

/**
* Before Login *** Admin ***
*/
// Parse.Cloud.beforeLogin(async request => {
//     const { object: user } = request;
//     var adminRoleQuery = new Parse.Query(Parse.Role);
//     adminRoleQuery.equalTo('name', 'admin');
//     adminRoleQuery.equalTo('users', user);

//     return adminRoleQuery.first({ useMasterKey: true }).then(function (adminRole) {
//         if (!adminRole) {
//             throw new Error('Access denied, only admin can access.');
//         }
//     });
// })

/**
* Before Login
*/
Parse.Cloud.beforeLogin(async request => {
    let device = useragent.parse(request.headers['user-agent']);
    let platform = ((device.isMobile) ? 'mobile' : 'pc');
    const { object: user } = request;
    if (user.get('status') === "removed") {
        throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, util.respMessage('USER_NOT_FOUND', 'ERROR', request));
    }
    if (user) {
        await validateContract(user);
    }
    // if (await util.getAllSessionsCount(user, platform) > 0 && (user.get('forcedLogin') == "" || user.get('forcedLogin') == undefined)) {
    //     user.set("forcedLogin", request.ip);
    //     await user.save(null, { useMasterKey: true });
    //     let sessionExistsErr = new Error(util.respMessage('USER_SESSION_EXISTS', 'ERROR', request));
    //     sessionExistsErr.code = respCode['ERROR']['USER_SESSION_EXISTS'];
    //     throw sessionExistsErr;
    // }
    // if (user.get('forcedLogin')) {
    //     user.set("forcedLogin", "");
    //     await user.save(null, { useMasterKey: true });
    //     let pcSession = await util.getLoginSession('pc', user);
    //     let mobileSession = await util.getLoginSession('mobile', user);
    //     let sessions = await util.destroyAllSessions(user);
    //     let sessionIds = [];
    //     if (platform == 'mobile' && pcSession && pcSession.get("session")) { sessionIds.push(pcSession.get("session").id) };
    //     if (platform == 'pc' && mobileSession && mobileSession.get("session")) { sessionIds.push(mobileSession.get("session").id) };

    //     for (const session of sessions) {
    //         if (sessionIds.indexOf(session.id) < 0) {
    //             await session.destroy({ useMasterKey: true });
    //         }
    //     }
    // }
    // if (platform == 'pc') {

    //     let currentsession = undefined;
    //     let installationId = request.installationId;
    //     let deviceAddress = request.ip || request.headers['x-forwarded-for'] || (request.connection.socket ? request.connection.socket.remoteAddress : null);
    //     let dimensionsStr = JSON.stringify(device);
    //     await loginHistory(deviceAddress, platform, user, "loginSuccess", dimensionsStr, currentsession, installationId);
    // }
});

// Set Password
Parse.Cloud.define("setPassword", async (request, response) => {
    var password = request.params.password;
    var user = request.user;
    if (!user) {
        console.log("userSession", request.params.sessionId);
        let userSession = await getUserBySession(request.params.sessionId);

        if (!process.env.USER_SERVICE) {
            user = userSession.get("sessionAdminUser");
        }
        else {
            user = userSession.get("sessionUser");
        }
        if (!user) {
            return { message: util.respMessage('USER_NOT_FOUND', 'ERROR', request), code: respCode['ERROR']['USER_NOT_FOUND'] };
        }
    }
    user.set("emailVerified", true);
    if (user.get('status') !== "removed") {
        user.set("status", 'active');
    }
    user.set("password", password);
    return await user.save(null, { useMasterKey: true }).then(function (gameTurnAgain) {
        return { message: util.respMessage('PASSWORD_UPDATED', 'SUCCESS', request, user), code: respCode['SUCCESS']['PASSWORD_UPDATED'] };
    }, function (error) {
        return { message: error.message, code: error.code };;
    });
});

/**
* Delete user
* @param uset  
* @return user 
*/
Parse.Cloud.define("delIdasUser", async (request, response) => {
    let userId = request.params.id || 0;
    if (await util.isAdmin(request.user)) {
        let user = await getData(userId, 'objectId', "_User");
        if (user) {
            if (user.get('status') !== "removed") {
                user.set('status', 'removed');
            }
            else {
                user.set('status', 'active');
            }
            await user.save(null, { useMasterKey: true });
            if (!await util.isAdmin(user)) {
                let sessions = await util.destroyAllSessions(user);

                for (const session of sessions) {
                    await session.destroy({ useMasterKey: true });
                }
                let otherGroups = await util.getGroupsByCondition([{ key: "user", value: user, where: "equal" }])
                if (otherGroups) {
                    for (const otherGroup of otherGroups) {
                        await otherGroup.destroy({ useMasterKey: true });
                    }
                }
                let favusers = await util.getFavusersByCondition([{ key: "user", value: user, where: "equal" }])
                if (favusers) {
                    for (const favuser of favusers) {
                        await favuser.destroy({ useMasterKey: true });
                    }
                }
                let othersfavusers = await util.getFavusersByCondition([{ key: "favourite", value: user, where: "equal" }])
                if (othersfavusers) {
                    for (const favuser of othersfavusers) {
                        await favuser.destroy({ useMasterKey: true });
                    }
                }
                await user.destroy({ useMasterKey: true });
            }
            return { message: util.respMessage('USER_DELETE_SUCCESS', 'SUCCESS', request), code: respCode['SUCCESS']['USER_DELETE_SUCCESS'] };
        }
        else {
            return { message: util.respMessage('USER_DELETE_REJECTED', 'SUCCESS', request), code: respCode['ERROR']['USER_DELETE_REJECTED'] };
        }
    }
    else {
        return { message: util.respMessage('USER_DELETE_REJECTED', 'SUCCESS', request), code: respCode['ERROR']['USER_DELETE_REJECTED'] };
    }

});

function getUserBySession(sessionId) {
    var sessionQuery = new Parse.Query(Parse.Session);
    sessionQuery.equalTo('objectId', sessionId);

    return sessionQuery.first
        ({
            success: function (sessionRetrieved) {
                console.log("sessionid", sessionRetrieved)
                return sessionRetrieved;
            },
            error: function (error) {
                return error;
            },
            useMasterKey: true
        });
};

async function getData(value, fieldId, className) {
    var getQuery = new Parse.Query(className);
    getQuery.equalTo(fieldId, value);
    getQuery.includeAll();
    return await getQuery.first
        ({
            success: function (resultRetrieved) {
                return resultRetrieved;
            },
            error: function (error) {
                return error;
            },
            useMasterKey: true
        });
};

function getUserContract(user) {
    var contractQuery = new Parse.Query('Contract');
    contractQuery.equalTo('user', user);
    contractQuery.includeAll();
    return contractQuery.first
        ({
            success: function (contractRetrieved) {
                return contractRetrieved;
            },
            error: function (error) {
                return error;
            },
            useMasterKey: true
        });
};

function getDefaultPlan(name) {
    var planQuery = new Parse.Query('Plan');
    planQuery.equalTo('name', name);
    return planQuery.first
        ({
            success: function (planRetrieved) {
                return planRetrieved;
            },
            error: function (error) {
                return error;
            },
            useMasterKey: true
        });
};

async function validateContract(user) {
    let plan = await getDefaultPlan('SILVER+');

    let contract = await getUserContract(user);
    if (!contract) {
        console.log('plan', plan);
        var expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + plan.get('period')); // timestamp
        expiresAt = new Date(expiresAt); // Date object
        const Contract = parseObj.CONTRACT_PO;
        const contract = new Contract();
        await contract.save({ "user": user, "plan": plan, "expiresAt": expiresAt }, { useMasterKey: true })
    }
};