module.exports.FAVOURITE_USER_PO = Parse.Object.extend("FavUser");
module.exports.LOGIN_HISTORY_PO = Parse.Object.extend("LoginHistory");
module.exports.OTP_CODE_PO = Parse.Object.extend("Otpcode");
module.exports.CONTRACT_PO = Parse.Object.extend("Contract");
module.exports.PLAN_PO = Parse.Object.extend("Plan");
module.exports.SUBSCRIPTION_PO = Parse.Object.extend("Subscription");
module.exports.SUBSCRIPTION_USAGE_PO = Parse.Object.extend("SubscriptionUsage");

//DEFECT OBJECTS
module.exports.DEFECT_FORMAT_PO = Parse.Object.extend("DefectFormat");
module.exports.DEFECT_FORMAT_TRANSLATION_PO = Parse.Object.extend("DefectFormatTranslation");
module.exports.DEFECT_CATEGORY_PO = Parse.Object.extend("DefectCategory");
module.exports.DEFECT_CATEGORY_TRANSLATION_PO = Parse.Object.extend("DefectCategoryTranslation");
module.exports.DEFECT_ITEM_PO = Parse.Object.extend("DefectItem");
module.exports.DEFECT_ITEM_TRANSLATION_PO = Parse.Object.extend("DefectItemTranslation");
//STYLE
module.exports.STYLE_PO = Parse.Object.extend("Style");
module.exports.STYLE_SKU_PO = Parse.Object.extend("StyleSku");
//TEMPLATETYPE
module.exports.TEMPLATE_TYPE_PO = Parse.Object.extend("TemplateType");
module.exports.TEMPLATE_TYPE_TRANSLATION_PO = Parse.Object.extend("TemplateTypeTranslation");

//GROUP OBJECTS
module.exports.GROUP_PO = Parse.Object.extend("Group");
module.exports.GROUP_FACTORYLINE_PO = Parse.Object.extend("GroupFactoryLine");
module.exports.GROUP_USER_PO = Parse.Object.extend("GroupUser");
//INSPECTION REPORT
module.exports.INSPECTION_REPORT_PO = Parse.Object.extend("InspectionReport");
module.exports.INSPECTION_SETTING_PO = Parse.Object.extend("InspectionReportSetting");
module.exports.INSPECTION_COMMENT_PO = Parse.Object.extend("InspectionReportComment");
module.exports.INSPECTION_SAVE_PO = Parse.Object.extend("InspectionSave");
module.exports.INSPECTION_SUMMARY_PO = Parse.Object.extend("InspectionReportSummary");
module.exports.INSPECTION_CORRECTION_PO = Parse.Object.extend("InspectionCorrection");
module.exports.INSPECTION_EDITCOMMENT_PO = Parse.Object.extend("InspectionEditComment");
// AQL Inspection
module.exports.AQL_SAMPLE_CHARACTER_PO = Parse.Object.extend("AqlSampleCharacter");
module.exports.AQL_INSPECTION_RESULT_PO = Parse.Object.extend("AqlInspectionResultMaster");
