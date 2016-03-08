// grab the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
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
//the schema is useless so far
//we need to create a model using it
var User = mongoose.model('USER', userSchema);

userSchema.pre('save', function(callback) {
	var user = this;

	// Break out if the password hasn't changed
	if (!user.isModified('password'))
		return callback();

	// Password changed so we need to hash it
	bcrypt.genSalt(5, function(err, salt) {
		if (err)
			return callback(err);

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err)
				return callback(err);
			user.password = hash;
			callback();
		});
	});
});

userSchema.methods.verifyPassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err)
			return cb(err);		
		cb(null, isMatch);
	});
};

exports.saveUsers = function(body, callback) {
	var userObj = new User({
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

	User.count({$or : [ {manf_id : body.tin}, {email : body.email} ]},		
	    function(err, count) {
			if(!err){
				if (count === 0) {
				userObj.save(function(err) {
					if (err)
						callback(err , "");
					else {
						callback(null,"user created");
					}
				});
			} else
				callback(null,"user already exists");
			}
		else{
			callback(err);
		}
	});
};

//returns the count after checking
exports.checkUserByEmailAndPassword = function(body, callback) {
	var isExists = false;
	User.count({
		email : body.username,
		password : body.password
	}, function(err, count) {
		if(err)
			callback(err);
		else
		{			
			if(count === 1)
			{
				isExists = true;
				callback(null, isExists);
			}
			else if(count === 0)
			{
				calbback(null, isExists);
			}
			else{
				callback(new Error("user exists more than on time"))
			}
		}
	});
};

//returns the result set after finding
exports.findUserById = function(userId, callback) {	 
		User.findById(userId, function(err, result) {
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
exports.UserModel = User;