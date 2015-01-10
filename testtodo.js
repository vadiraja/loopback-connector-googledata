var todos = require('./todo.js');

var res,result = "";

function _handleApiResponse(res,result) {
  return function(err,result) {
      console.log(result);
      console.log(err);
  }
}


todos.getAll(_handleApiResponse(res,result));