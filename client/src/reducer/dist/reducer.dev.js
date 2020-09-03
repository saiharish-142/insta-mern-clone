"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = exports.InitialState = void 0;
var InitialState = null;
exports.InitialState = InitialState;

var reducer = function reducer(state, action) {
  if (action.type === "USER") {
    return action.payload;
  }

  if (action.type === "CLEAR") {
    return null;
  }

  return state;
};

exports.reducer = reducer;