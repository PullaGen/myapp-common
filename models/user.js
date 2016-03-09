// grab the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
// create a schema
var manfSchema = new Schema({
	name : {
		type : String,
		required : true
	},
	branch : {
		type : String,
		required : true
	},
	manf_id : {
		type : String,
		required : true,
		unique : true
	},
	email : {
		type : String,
		required : true,
		unique : true
	},
	password : {
		type : String,
		required : true
	},
	address : {
		street : String,
		city : String,
		state : String,
		country : String,
		pincode : Number,
		landmark : String
	},
	phone_numbers : Array,
	fax_numbers : Array,
	verified : Boolean
});

manfSchema.pre('save', function(callback) {
	var manf = this;

	// Break out if the password hasn't changed
	if (!manf.isModified('password'))
		return callback();

	// Password changed so we need to hash it
	bcrypt.genSalt(5, function(err, salt) {
		if (err)
			return callback(err);

		bcrypt.hash(manf.password, salt, null, function(err, hash) {
			if (err)
				return callback(err);
			manf.password = hash;
			callback();
		});
	});
});

manfSchema.methods.verifyPassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err)
			return cb(err);		
		cb(null, isMatch);
	});
};

//the schema is useless so far
//we need to create a model using it
var Manf = mongoose.model('MANF', manfSchema);

exports.saveManf = function(body, callback) {		
	var manfObj = new Manf({
		name : body.name,
		branch : true,
		manf_id : body.tin,
		email : body.email,
		password : body.password,
		address : {
			street : body.address,
			city : body.city,
			state : body.state,
			country : body.country,
			pincode : body.pincode,
			landmark : 'Near Marathahalli Kalamandir'
		},
		phone_numbers : [ body.phone ],
		fax_numbers : [ '04021212349' ],
		verified : false
	});

	Manf.count({$or : [ {manf_id : body.tin}, {email : body.email} ]},		
	    function(err, count) {
		console.log("Count::"+count);
			if(!err){
				if (count === 0) {
				manfObj.save(function(err,res) {
					if (err)
						callback(err);
					else {
						callback(null, res);
					}
				});
			} else
				callback(null,"already exists");
			}
		else{
			callback(err);
		}
	});
};

//returns the count after checking
exports.checkManfByEmailAndPassword = function(body, callback) {	
	Manf.findOne({
		email : body.username,		
	}, function(err, manf) {
		if(err)
			callback(err);
		else
		{			
			if(manf)
			{
				//console.log(manf);
				manf.verifyPassword(body.password, function(err,isMatch) {
					if(err)
						callback(err);
					else if(isMatch == true)
						callback(null, manf);
					else if(isMatch == false)
						callback(new Error("invalid username or password"));						
				});								
			}			
			else{
				callback(new Error("invalid username or password"));
			}
		}
	});
};

//returns the result set after finding
exports.findManfById = function(manfId, callback) {	 
		User.findById(manfId, function(err, result) {
			if(err)
				callback(err);
			else				
				callback(null, result);				
		});
	};

//returns the result set after finding
exports.findManfByTinId = function(tinId, callback) {	 
		Manf.findOne({manf_id:tinId}, function(err, result) {
			if(err)
				callback(err);
			else				
				callback(null, result);				
		});
	};

/*exports.updateUserById = function(userId, body, callback) {
	User.findOne({
		_id : userId
	}, function(err, user) {
		if(err)
			res.send(err);
		else
			{
			user.password = body.password;
			user.save(function(err){
			if (err)
				res.send(err);

			res.json(product);
		});}
	});
};*/
// make this available to our users in our Node applications
exports.ManfModel = Manf;