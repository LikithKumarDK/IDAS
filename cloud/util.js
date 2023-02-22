// require('dotenv').config();
const parseObj = require("./parseObj");
const _ = require('lodash');
// const fs = require('fs');
// const pdf = require('html-pdf');

const encodes = require("../locale/en.json");
const jacodes = require("../locale/ja.json");
const zhcodes = require("../locale/zh.json");
const vicodes = require("../locale/vi.json");
const mycodes = require("../locale/my.json");

module.exports.respMessage = (key, type, request, ditectedUser) => {
    let user = request ? request.object || request.user || ditectedUser : undefined;
    let lang = user ? user.get("language") : 'en';
    let langCodes = encodes;
    switch (lang) {
        case 'en':
            langCodes = encodes;
            break;
        case 'ja':
            langCodes = jacodes;
            break;
        case 'zh':
            langCodes = zhcodes;
            break;
        case 'vi':
            langCodes = vicodes;
            break;
        case 'my':
            langCodes = mycodes;
            break;
    }
    if (type === "ERROR") {
        return langCodes["ERROR"][key] ? langCodes["ERROR"][key] : "Something went wrong!";
    }
    else if (type === "SUCCESS") {
        return langCodes["SUCCESS"][key] ? langCodes["SUCCESS"][key] : "Something went correct!";
    }
    else if (type === "EXCEL_REPORT") {
        return langCodes["EXCEL_REPORT"][key] ? langCodes["EXCEL_REPORT"][key] : "Something went correct!";
    }
    else {
        return "Something went really wrong!";
    }
}

module.exports.isAdmin = async (user) => {
    return await isAdmin(user);
}

module.exports.destroyAllSessions = async (user) => {
    var getQuery = new Parse.Query(Parse.Session);
    getQuery.equalTo("user", user);
    return await getQuery.find({ useMasterKey: true })
        .then((allsessions) => {
            return allsessions
        })
        .catch((error) => {

        })
}

module.exports.getGroupsByCondition = async (conditions) => {
    var getQuery = new Parse.Query('GroupUser');
    if (conditions && typeof conditions === 'object') {
        for (const condition of conditions) {
            switch (condition.where) {
                case 'equal':
                    getQuery.equalTo(condition.key, condition.value);
                    break;
                case 'in':
                    getQuery.containedIn(condition.key, condition.value);
                    break;
                case 'nin':
                    getQuery.notContainedIn(condition.key, condition.value);
                    break;
            }

        }
    }
    return await getQuery.find({ useMasterKey: true })
        .then((groupusers) => {
            return groupusers
        })
        .catch((error) => {

        })
}

module.exports.getFavusersByCondition = async (conditions) => {
    var getQuery = new Parse.Query('FavUser');
    if (conditions && typeof conditions === 'object') {
        for (const condition of conditions) {
            switch (condition.where) {
                case 'equal':
                    getQuery.equalTo(condition.key, condition.value);
                    break;
                case 'in':
                    getQuery.containedIn(condition.key, condition.value);
                    break;
                case 'nin':
                    getQuery.notContainedIn(condition.key, condition.value);
                    break;
            }

        }
    }
    return await getQuery.find({ useMasterKey: true })
        .then((groupusers) => {
            return groupusers
        })
        .catch((error) => {

        })
}

async function isAdmin(user) {
    // if (process.env.USER_SERVICE) {
    //     return false;
    // }
    // var adminRoleQuery = new Parse.Query("AdminUser");
    // adminRoleQuery.equalTo('objectId', user.id);
    // console.log("adminRoleQuery", adminRoleQuery);
    // return adminRoleQuery.first({ useMasterKey: true }).then(function (adminRole) {
    //     console.log("adminRole", adminRole);

    //     if (!adminRole) {
    //         return false;
    //     }
    //     else {
    //         return true;
    //     }
    // });

    var adminRoleQuery = new Parse.Query(Parse.Role);
    adminRoleQuery.equalTo('name', 'admin');
    adminRoleQuery.equalTo('users', user);

    return adminRoleQuery.first({ useMasterKey: true }).then(function (adminRole) {
        if (!adminRole) {
            return false;
        }
        else {
            return true;
        }
    });
}