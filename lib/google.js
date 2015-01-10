var gcloud = require('gcloud') ({
	  projectId: 'in-forums',
// 	  credentials: require('../../../server/boot/in-forums-813cd8e709fc.json')
        credentials: require('../key.json')
	});
var ds;

// From Google Compute Engine:
ds = gcloud.datastore.dataset();

var LIST_NAME = 'default-list';

var Connector = require('loopback-connector').Connector;
var async = require('async');
var debug = require('debug')('loopback:connector:googledata');

/**
 * @module loopback-connector-googledata
 *
 * Initialize the Google Datastore connector against the given data source
 *
 * @param {DataSource} dataSource The loopback-datasource-juggler dataSource
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, done) {
	debug("Google datastore connector initializeDataSource()");

	var s = dataSource.settings  || {};

	var options = {
		
	};
	
	debug("googledata connector initializeDataSource(): options:" + JSON.stringify([options]));
	var connector = new GoogleData(options, dataSource); // Construct the connector instance
	
	connector.connectToGoogleDataStore(s, dataSource);
	
	dataSource.connector = connector; // Attach connector to dataSource
	connector.dataSource = dataSource; // Hold a reference to dataSource
	
	connector.DataAccessObject = function (){};


	process.nextTick(done);
};

/**
 * @constructor
 * Constructor for Google connector
 * @param {Object} client The node-mysql? client object
 */
function GoogleData(settings, dataSource) {
  debug("testing");
  this.name = 'googledata';
  this._resources = {};
  this._models = {};
  this._settings = settings;
  this.dataSource = dataSource;
  Connector.call(this, 'googledata', settings);
}

require('util').inherits(GoogleData, Connector);
exports.GoogleData = GoogleData;


GoogleData.prototype.getTypes = function () {
  return ['googledata'];
};

/*
	**************************start implementing the interface methods*****************************************
*/

GoogleData.prototype.connectToGoogleDataStore = function(settings, dataSource) {
	this.self = this;
	// From Google Compute Engine:
// 	this.ds = gcloud.datastore.dataset({
// 	  projectId: 'in-forums',
// 	  credentials: require('../../../server/boot/in-forums-813cd8e709fc.json')
// 	});

    this.ds = gcloud.datastore.dataset();
	
	debug(ds);
	
}


GoogleData.prototype.define =  function(definition) {
        console.log("calling define" );
        console.log(definition.model.modelName);
	    var m = definition.model.modelName;
        // this.installPostProcessor(definition);
        this._models[m] = definition;
        // this._resources[m] = new RestResource(definition.settings.resourceName || definition.model.pluralModelName, this._baseURL, this._request);
        
  };

/**
 * Create a new model instance
 */
GoogleData.prototype.create = function (model, data, callback) {
// 	var key = ds.key('Company');

// 	ds.save({
// 	  key: key,
// 	  data: {
// 	    rating: '10'
// 	  }
// 	}, function(err) {console.log(data)});
	
	
	data.completed = false;
    ds.save({
      key: ds.key(['TodoList', LIST_NAME, model]),
      data: data
    }, function(err, key) {
      if (err) {
        callback(err);
        return;
      }
      data.id = key.path.pop();
      callback(null, data);
    });
	
};
 
/**
 * Save a model instance
 */
GoogleData.prototype.save = function (model, data, callback) {
    
    ds.save({
      key: ds.key(['TodoList', LIST_NAME, model.toString(), id]),
      data: data
    }, function(err) {
      if (err) {
        callback(err);
        return;
      }
      data.id = id;
      callback(null, data);
    });
  
};
 
/**
 * Check if a model instance exists by id
 */
GoogleData.prototype.exists = function (model, id, callback) {
    var self = this;
    var test = false;
    ds.get(ds.key([model.toString(), id]), function(err, entity) {
        if(!entity)
        {
            test = true;
        }
        callback(err,test);
    });
    
};
 
/**
 * Find a model instance by id
 */
GoogleData.prototype.find = function find(model, id, callback) {
    
    var self = this;

    ds.get(ds.key([model.toString(), id]), function(err, entity) {
        callback(err,entity);
    });
    
	
	
};
 
/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
GoogleData.prototype.updateOrCreate = function updateOrCreate(model, data, callback) {
};
 
/**
 * Delete a model instance by id
 */
GoogleData.prototype.destroy = function destroy(model, id, callback) {
     ds.delete(ds.key(['TodoList', LIST_NAME, model.toString(), id]), function(err) {
      callback(err || null);
    });
};
 
/**
 * Query model instances by the filter
 */
GoogleData.prototype.all = function all(model, filter, callback) {
    
    var self = this;
    var q = ds.createQuery(null,model);
    ds.runQuery(q, function (err,items) {
        if (err) {
            callback(err);
            return;
        }
        callback(err,items);
    });
};
 
/**
 * Delete all model instances
 */
GoogleData.prototype.destroyAll = function destroyAll(model, callback) {
};
 
/**
 * Count the model instances by the where criteria
 */
GoogleData.prototype.count = function count(model, callback, where) {
};
 
/**
 * Update the attributes for a model instance by id
 */
GoogleData.prototype.updateAttributes = function updateAttrs(model, id, data, callback) {
	
};


/**
 * Match and transform data structure to model
 * @param {String} model name
 * @param {Object} data from DB
 * @returns {object} modeled document
 */
GoogleData.prototype.matchDataToModel = function (model, data) {
    var self = this;
    if (!data) {
        return null;
    }
    try {
        var properties = this._models[model].properties;
        var document = {};

        for (var propertyName in properties) {
            var propertyValue = data[propertyName];
            if (propertyValue) {
                document[propertyName] = self.getValueFromProperty(properties[propertyName], propertyValue);
            }
        }
        return document;
    } catch (err) {
        console.trace(err.message);
        return null;
    }
}


/**
 * Get value from property checking type
 * @param {object} property
 * @param {String} value
 * @returns {object}
 */
GoogleData.prototype.getValueFromProperty = function (property, value) {
    if (property.type instanceof Array) {
        if (!value || (value.length === 0)) {
            return new Array();
        } else {
            return new Array(value.toString());
        }
    } else if (property.type === String) {
        return value.toString();
    } else if (property.type === Number) {
        return Number(value);
    } else {
        return value;
    }
}

/**
 * Convert data source to model
 * @param {String} model name
 * @param {Object} data object
 * @returns {object} modeled document
 */
GoogleData.prototype.dataSourceToModel = function (model, data) {
    if ((!data) || (!data.found) && (data.found === false)) {
        return null;
    }
    return this.matchDataToModel(model, data._source);
};