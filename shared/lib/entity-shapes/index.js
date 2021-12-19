"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.symptomEventDefaults = exports.symptomDefaults = exports.nutritionItemDefaults = exports.nutritionEventDefaults = exports.exerciseTypeDefaults = exports.exerciseInstanceDefaults = exports.NO_EVENT_ID = exports.eventDefaults = exports.BASIC_DEFAULTS = void 0;
exports.BASIC_DEFAULTS = {
    _id: "not yet saved",
    createdOn: new Date().toISOString(),
    lastModifiedOn: new Date().toISOString(),
    _v: -1
};
exports.eventDefaults = {
    _id: "not yet saved",
    createdOn: new Date().toISOString(),
    lastModifiedOn: new Date().toISOString(),
    _v: -1,
    time: new Date().toISOString(),
    timeStart: new Date().toISOString(),
    timeEnd: new Date().toISOString()
};
exports.NO_EVENT_ID = "NO_EVENT_ID";
exports.exerciseInstanceDefaults = __assign(__assign({}, exports.BASIC_DEFAULTS), { exerciseId: "no id yet", eventId: exports.NO_EVENT_ID });
exports.exerciseTypeDefaults = {
    _id: "not yet saved",
    createdOn: new Date().toISOString(),
    lastModifiedOn: new Date().toISOString(),
    _v: -1,
    title: ""
};
exports.nutritionEventDefaults = __assign(__assign({}, exports.BASIC_DEFAULTS), { eventId: exports.NO_EVENT_ID, nutritionId: "" });
exports.nutritionItemDefaults = __assign(__assign({}, exports.BASIC_DEFAULTS), { title: "", ingredientIds: [], ingredientIdsFlat: [] });
exports.symptomDefaults = __assign(__assign({}, exports.BASIC_DEFAULTS), { title: "" });
exports.symptomEventDefaults = __assign(__assign({}, exports.BASIC_DEFAULTS), { eventId: exports.NO_EVENT_ID, symptomId: "", strength: 0 });
