alex.namespace("alex.record");
alex.record.repository = {};

/*
 alex.record.config = {
 databases: {
 "default": {
 version: 1,
 displayName: "Default DB",
 estimatedSize: 1024*1024
 }
 }
 };
 */
alex.record.openDatabase = function(dbName){
    if (!dbName) {
        dbName = "default";
    }
    if (alex.record.openDatabase._cache[dbName]) {
        return alex.record.openDatabase._cache[dbName];
    }
    var dbDef = alex.record.config.databases[dbName];
    if (dbDef.version == undefined) {
        throw new Error("database's version is required");
    }
    var db = openDatabase(dbName, String(dbDef.version), dbDef.displayName, dbDef.estimatedSize);
    alex.record.openDatabase._cache[dbName] = db;
    return db;
};
alex.record.openDatabase._cache = {};
alex.record.Class = function(meta){
    var clazz = function(props){
        var properties = {};
        var self = this;
        if (props) {
            alex.extend(properties, props);
        }
        // generate accessors
        var columns = clazz.columns;
        for (var i = 0, n = columns.length; i < n; i++) {
            var ref = columns[i].reference;
            var propertyName = columns[i].propertyName;
            if (ref) {
                propertyName = ref.propertyName || ref.columnName;
            }
            var p = alex.beans.upFirstLetter(propertyName);
            this["set" + p] = (function(prop){
                return function(value){
                    self.set(prop, value);
                };
            })(propertyName);
            if (columns.reference && ref.lazyFetch) {
                throw new Error("not yet implemented");
            }
            else {
                this["get" + p] = (function(prop){
                    return function(){
                        var val = self.get(prop);
                        return val === undefined ? null : val;
                    }
                })(propertyName);
            }
        }
        self.populate = function(values){
            alex.extend(properties, values);
        };
        self.set = function(propertyName, value){
            properties[propertyName] = value;
        };
        self.get = function(propertyName){
            return properties[propertyName];
        };
        self.populateByColumnName = function(values){
            for (var colName in values) {
                self.setByColumnName(colName, values[colName]);
            }
        };
        self.setByColumnName = function(colName, value){
            var column = clazz.columnMap[colName];
            self.set(column.propertyName, value);
        };
        self.getByColumnName = function(colName){
            var column = clazz.columnMap[colName];
            return self.get(column.propertyName);
        }
    };
    clazz.prototype = {
        save: function(callback, tx){
            var sql = "replace into " + clazz.tableName + "(";
            var columns = clazz.columns;
            var colNames = [], questions = [], values = [];
            for (var i = 0, n = columns.length; i < n; i++) {
                var column = columns[i];
				/*
                if (column.autoIncrement) {
                    continue;
                }
                */
                var value;
                if (column.reference) {
                    var refObj = this.get(column.reference.propertyName);
                    if (!refObj) {
                        continue;
                    }
                    value = refObj.getByColumnName(column.reference.columnName);
                }
                else {
                    value = this.get(column.propertyName);
                }
                
                if (value === undefined) {
                    value = null;
                }
                values.push(value);
                colNames.push(column.name);
                questions.push("?");
            }
            sql += colNames.join(",") + ") values (" + questions.join(",") + ")";
            var self = this;
            alex.record.executeSql(sql, values, function(result, error){
                if (error) {
                    callback(undefined, error);
                }
                else {
                    self.set(clazz.rowIdColumn.propertyName, result.insertId);
                    callback(result);
                }
            }, tx || clazz.database);
        },
        update: function(callback, tx){
            if (!this.getRowId()) {
                setTimeout(function(){
                    callback(undefined, new Error("record must have rowid"));
                }, 0);
                return;
            }
            var sql = "update " + clazz.tableName + " set ";
            var columns = clazz.columns;
            var colNames = [], values = [];
            for (var i = 0, n = columns.length; i < n; i++) {
                var column = columns[i];
                if (column.autoIncrement) {
                    continue;
                }
                var value;
                if (column.reference) {
                    var refObj = this.get(column.reference.propertyName);
                    if (!refObj) {
                        continue;
                    }
                    value = refObj.getByColumnName(column.reference.columnName);
                }
                else {
                    value = this.get(column.propertyName);
                }
                if (value === undefined) {
                    value = null;
                }
                values.push(value);
                colNames.push(column.name + "=?");
            }
            sql += colNames.join(",");
            sql += " where " + clazz.rowIdColumn.name + "=?";
            values.push(this.getRowId())
            alex.record.executeSql(sql, values, callback, tx || clazz.database);
        },
        remove: function(callback, tx){
            if (!this.getRowId()) {
                setTimeout(function(){
                    callback(undefined, new Error("record has no rowid"));
                }, 0);
                return;
            }
            var sql = ["delete from ", clazz.tableName, " where ", clazz.rowIdColumn.name, "=?"].join("");
            alex.record.executeSql(sql, [this.getRowId()], callback, tx || clazz.database);
        },
        getRowId: function(){
            return this.get(clazz.rowIdColumn.propertyName);
        }
    };
    clazz.tableName = meta.tableName;
    var columns = clazz.columns = meta.columns;
    clazz.database = meta.database || "";
    clazz.refColumns = [];
    clazz.columnMap = {};
    clazz.propertyMap = {};
    for (var i = 0; i < columns.length; i++) {
        var column = columns[i];
        if (column.primaryKey) {
            clazz.pkColumn = column;
            if (column.type && column.type.toLowerCase() == "integer") {
                clazz.rowIdColumn = column;
            }
        }
        if (column.reference) {
            clazz.refColumns.push(column);
        }
        var propertyName = column.propertyName || column.name;
        column.propertyName = propertyName;
        
        clazz.columnMap[column.name] = column;
        clazz.propertyMap[column.propertyName] = column;
    }
    if (!clazz.rowIdColumn) {
        clazz.rowIdColumn = {
            name: "rowId",
            primaryKey: true
        };
    }
    if (!clazz.pkColumn) {
        clazz.pkColumn = clazz.rowIdColumn;
    }
    clazz.filter = function(expr /*, args... */){
        var query = new alex.record.query.Query(clazz);
        if (arguments.length > 0) {
            query.filter.apply(query, alex.toArray(arguments));
        }
        return query;
    };
    clazz.isAlexRecord = true;
    clazz.createTable = function(callback, options){
        var sql = alex.record.query.createTableStatement(this.tableName, this.columns, options);
        alex.record.executeSql(sql, null, callback, clazz.database);
    };
    clazz.create = function(props, callback, tx){
        if (!props) {
            throw new Error("RecordClass.create() must be specifies props.");
        }
        var record = new clazz(props);
        record.save(function(result, error){
            if (!error) {
                callback(record);
            }
            else {
                callback(undefined, error);
            }
        }, tx);
    };
    clazz.dropTable = function(callback){
        var sql = alex.record.query.dropTableStatement(this.tableName);
        alex.record.executeSql(sql, null, callback, clazz.database);
    };
    clazz.find = function(id, callback, tx){
        var query = new alex.record.query.Query(clazz);
        query.filter(clazz.tableName + "." + clazz.pkColumn.name + "=?", id);
        query.fetchRecords(function(records, error){
            if (error) {
                callback(undefined, error);
            }
            else {
                callback(records.length > 0 ? records[0] : null);
            }
        }, tx || clazz.database);
    };
    var repository = alex.record.repository[clazz.database];
    if (!repository) {
        repository = alex.record.repository[clazz.database] = {
            classes: {}
        };
    }
    repository.classes[clazz.tableName] = clazz;
    return clazz;
};
alex.record._executeSqlInner = function(sql, args, tx, callback){
    var logMsg = sql;
    if (args) {
        logMsg += "[" + args.join(",") + "]";
    }
    console.log(logMsg);
    tx.executeSql(sql, args, function(tx, rs){
        if (typeof callback == "function") {
            callback(new alex.record.ResultSet(rs));
        }
    }, function(tx, error){
        if (typeof callback == "function") {
            callback(undefined, error);
        }
    });
};
alex.record.executeSql = function(sql, args, callback, dbOrTransaction){
    if (!dbOrTransaction) {
        var db = alex.record.openDatabase();
    }
    else {
        var db = dbOrTransaction["transaction"] ? dbOrTransaction : null;
        var transaction = dbOrTransaction["executeSql"] ? dbOrTransaction : null;
    }
    if (db) {
        if (typeof db == "string") {
            db = alex.record.openDatabase(dbName);
        }
        db.transaction(function(tx){
            alex.record._executeSqlInner(sql, args, tx, callback);
        })
    }
    else {
        alex.record._executeSqlInner(sql, args, transaction, callback);
    }
};

alex.record.ResultSet = function(rs){
    // when not insert statement, accessing to insertId may be error
    try {
        this.insertId = rs.insertId;
    } 
    catch (e) {
    }
    this.rowsAffected = rs.rowsAffected;
    this._rows = rs.rows;
    this._length = rs.rows.length || 0;
    this._index = -1;
};
alex.record.ResultSet.prototype = {
    each: function(callback){
        try {
            while (this.next()) {
                callback(this);
            }
        }
        finally {
            this.close();
        }
    },
    next: function(){
        if (this._index >= this._length) {
            throw new Error("ResultSet's index is out of bounds");
        }
        this._index++;
        return this._index < this._length;
    },
    close: function(){
    },
    get: function(fieldName){
        var row = this._rows.item(this._index);
        return row[fieldName];
    },
    object: function(){
        var result = {};
        return this._rows.item(this._index);
    },
    record: function(recordClass){
        var record = new recordClass();
        var tableName = recordClass.tableName;
        var columns = recordClass.columns;
        var rowIdColumn = recordClass.rowIdColumn;
        record.set(rowIdColumn.propertyName, this.get(tableName + "_" + rowIdColumn.name));
        if (!record.getRowId()) {
            throw new Error("rowid is missing. You must contain \"" +
            tableName +
            "." +
            rowIdColumn.name +
            " as " +
            tableName +
            "_" +
            rowIdColumn.name +
            "\" into selected columns");
        }
        for (var i = 0, n = columns.length; i < n; i++) {
            var column = columns[i];
            record.setByColumnName(column.name, this.get(tableName + "_" + column.name));
        }
        return record;
    }
};

alex.record.query = {};
alex.record.query.createTableStatement = function(tableName, columns, options){
    _foreignKeyClause = function(options){
        var s = "references " + options.tableName;
        s += "(" + options.columnName + ")";
        return s;
    }
    if (!options) {
        options = {};
    }
    var sql = "create table ";
    if (options.temporary) {
        sql += " temp "
    }
    sql += "if not exists " + tableName + "("
    var tmp = [];
    for (var i = 0, n = columns.length; i < n; i++) {
        var column = columns[i];
        var colDef = [column.name];
        if (column.type) {
            var type = column.type.toLowerCase();
            switch (type) {
                case "integer":
                    colDef.push("integer");
                    break;
                case "numeric":
                    colDef.push("numeric");
                    break;
                case "real":
                    colDef.push("real");
                    break;
                default:
                    colDef.push("text");
                    break;
            }
        }
        column.primaryKey && colDef.push("primary key");
        column.autoIncrement && colDef.push("autoincrement");
        column.unique && colDef.push("unique");
        column.notNull && colDef.push("not null");
        column.defaultValue !== undefined && colDef.push("default " + column.defaultValue);
        column.reference !== undefined && colDef.push(_foreignKeyClause(column.reference));
        
        tmp.push(colDef.join(" "));
    }
    sql += tmp.join(",");
    sql += ")";
    return sql;
};

alex.record.query.dropTableStatement = function(tableName){
    return "drop table if exists " + tableName;
};
alex.record.query.resultColumnsFlagment = function(tableName, columns){
    var cols = [[tableName, ".rowId as ", tableName, "_rowId"].join("")];
    for (var i = 0, n = columns.length; i < n; i++) {
        cols.push([tableName, ".", columns[i].name, " as ", tableName, "_", columns[i].name].join(""));
    }
    return cols.join(",");
};
alex.record.query.from = function(recordClass){
    return new alex.record.query.Query(recordClass);
};
alex.record.query.Query = function(recordClass){
    this.recordClass = recordClass;
    this._filters = [];
    this._params = [];
    this._orders = [];
};
alex.record.query.Query.prototype = {
    filter: function(expr /*, args */){
        var args = alex.toArray(arguments);
        args.shift();
        this._filters.push(expr);
        for (var i = 0; i < args.length; i++) {
            this._params.push(args[i]);
        }
        return this;
    },
    orderBy: function(columns){
        columns = alex.toArray(columns);
        for (var i = 0; i < columns.length; i++) {
            this._orders.push(columns[i]);
        }
        return this;
    },
    limit: function(n){
        this._limit = n;
        return this;
    },
    offset: function(n){
        this._offset = n;
        return this;
    },
    count: function(callback, dbOrTransaction){
        var sql = "select count(*) as count" + this._makeFilterFlagment();
        alex.record.executeSql(sql, this._params, function(results, error){
            if (error) {
                callback(undefined, error);
                return;
            }
            callback(results.next().get("count"));
        }, dbOrTransaction);
    },
    fetch: function(callback, dbOrTransaction){
        alex.record.executeSql(this.toString(), this._params, callback, dbOrTransaction);
    },
    fetchArray: function(callback, dbOrTransaction){
        this.fetch(function(rs, error){
            var results = [];
            rs.each(function(){
                results.push(rs.object());
            });
            callback(results);
        }, dbOrTransaction);
    },
    fetchRecords: function(callback, dbOrTransaction){
        var self = this;
        this.fetch(function(rs, error){
            var records = [];
            rs.each(function(){
                var clazz = self.recordClass;
                record = rs.record(clazz);
                for (var i = 0; i < clazz.refColumns.length; i++) {
                    var refClass = alex.record.repository[clazz.database].classes[clazz.refColumns[i].reference.tableName];
                    if (rs.get(refClass.tableName + "_" + refClass.rowIdColumn.name)) {
                        var refRecord = rs.record(refClass);
                        record.set(clazz.refColumns[i].reference.propertyName, refRecord);
                    }
                }
                records.push(record);
            });
            callback(records);
        }, dbOrTransaction);
    },
    toString: function(){
        var clazz = this.recordClass;
        var sql = "select " + alex.record.query.resultColumnsFlagment(clazz.tableName, clazz.columns);
        for (var i = 0; i < clazz.refColumns.length; i++) {
            var refClass = alex.record.repository[clazz.database].classes[clazz.refColumns[i].reference.tableName];
            sql += "," + alex.record.query.resultColumnsFlagment(refClass.tableName, refClass.columns);
        }
        sql += this._makeFilterFlagment();
        return sql;
    },
    _makeFilterFlagment: function(){
        var clazz = this.recordClass;
        var sql = " from " + clazz.tableName;
        for (var i = 0; i < clazz.refColumns.length; i++) {
            var refClass = alex.record.repository[clazz.database].classes[clazz.refColumns[i].reference.tableName];
            sql += [" left outer join ", refClass.tableName, " on (", clazz.tableName, ".", clazz.refColumns[i].name, "=", refClass.tableName, ".", clazz.refColumns[i].reference.columnName + ")"].join("");
        }
        if (this._filters.length > 0) {
            var where = [];
            for (var i = 0; i < this._filters.length; i++) {
                where.push("(" + this._filters[i] + ")");
            }
            sql += " where " + where.join(" and ");
        }
        if (this._orders.length > 0) {
            var orderBy = [];
            for (var i = 0; i < this._orders.length; i++) {
                var order = this._orders[i];
                if (typeof order == "string") {
                    orderBy.push(order);
                }
                else 
                    if (typeof order == "object") {
                        if (order.desc) {
                            orderBy.push(order.column + " desc");
                        }
                        else {
                            orderBy.push(order.column);
                        }
                    }
            }
            sql += " order by " + orderBy.join(",");
        }
        if (this._limit) {
            sql += " limit " + this._limit;
        }
        if (this._offset) {
            sql += " offset " + this._offset;
        }
        return sql;
    }
};
