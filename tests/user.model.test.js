var mongoose = require('mongoose');
var should = require('should');
var userModule = require('../index').manf;
var UserModel = mongoose.model('MANF');
var database = require('./database');
var user;
var payload = {
		name : "test",
		branch : true,
		tin : "123",
		email : "def@gmail.com",
		password : "abc",
		street : "asde",
		city : "Bangalore",
		state : "Karnataka",
		country : "India",
		pincode : 560034,
		landmark : 'Near Marathahalli Kalamandir',
		phone_numbers : "9090909090" ,
		fax_numbers :  '04021212349' ,
		verified : false
	};

describe('User Model Tests',function(){
    before(function(done){
        var db = database();
        done();
    });

    describe('User Persistence test',function(){
      it('first time persistence should pass', function(done){
        userModule.saveManf(payload,function(err,res){
              should.not.exist(err);
              done();
            });
        });

    it('second time persistence should fail', function(done){
      userModule.saveManf(payload,function(err,res){
            console.log(err);
            should.exist(err);
            done();
          });
      });
  });

  after(function(done) {
    UserModel.remove(function(){
      done();
    });
  });
});
