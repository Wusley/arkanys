
'use strict';

module.exports = ( function() {

  function memberDAO( mongoose ) {

    var ObjectId = require( 'mongoose' ).Types.ObjectId;

    let schemaMember = require( '../Models/Member' ),
        schemaRequestMaster = require( '../Models/RequestMaster' ),
        SchemaMember = mongoose.Schema( schemaMember ),
        SchemaRequestMaster = mongoose.Schema( schemaRequestMaster );

    let Members = mongoose.models.Members || mongoose.model( 'Members', SchemaMember );
    let RequestsMasters = mongoose.models.RequestsMasters || mongoose.model( 'RequestsMasters', SchemaRequestMaster );

  	return {
      getName: async function( name ) {

        try {

          let member = await Members.findOne( {
            name: { $regex: name, $options: 'i' }
          } );

          return member;

        } catch ( err ) {

          console.error( 'memberDAO getName' );
          console.error( err );

        }

      },
      gestList: async function() {

        try {

          let members = await Members.find( { 'name': { $exists: true } } );

          return members;

        } catch ( err ) {

          console.error( 'memberDAO gestList' );
          console.error( err );

        }

      },
      getMasters: async function( master ) {

        try {

          let masters = await Members.find( {
            'name': { $exists: true },
            master: true
          } );

          return masters;

        } catch ( err ) {

          console.error( 'memberDAO getMasters' );
          console.error( err );

        }

      },
      getRequestsMasters: async function( memberName ) {

        try {

          let query = { 'name': { $regex: memberName, $options: 'i' } };

          let member = await Members.findOne( query );

          let queryRequestsMasters = { 'memberId': member._id };

          let requestsMasters = await RequestsMasters.find( queryRequestsMasters );

          let masters = [];

          let count = 0;
          for( ; count < requestsMasters.length ; count++ ) {

            let infoMaster = await Members.findOne( { _id: requestsMasters[ count ].masterId } );

            infoMaster.date = requestsMasters[ count ].date;

            masters.push( infoMaster );

          }

          console.log( masters );

          return masters;

        } catch ( err ) {

          console.error( 'memberDAO getRequestsMasters' );
          console.error( err );

        }

      },
      create: async function( member ) {

        let result = false;

        try {

          let query = { 'name': { $regex: member.name, $options: 'i' } };

          let finded = await Members.findOne( query );

          let obj = {
            name: member.name,
            master: member.master
          }

          if( !finded && obj ) {

            let member = await Members( obj );

            result = await member.save();

          }

        } catch ( err ) {

          console.error( 'memberDAO create' );
          console.error( err );

        } finally {

          return result;

        }

      },
      update: async function( id, member ) {

        let result = false;

        try {

          let query = { '_id': id };

          let finded = await Members.findOne( query );

          let obj = {
            name: member.name,
            master: member.master
          }

          if( finded && obj ) {

            result = await Members.findOneAndUpdate( query, obj );

          }

        } catch ( err ) {

          console.error( 'memberDAO update' );
          console.error( err );

        } finally {

          return result;

        }

      },
      requestMaster: async function( masterId, name ) {

        let result = false;

        try {
          let queryMaster = { '_id': new ObjectId( masterId ), 'master': true };
          let queryMember = { name: { $regex: name, $options: 'i' }, $and: [ { $or: [ { yourMasterId: '' }, { yourMasterId: null } ] } ] }; // <- yourMasterId blank because he need only one master

          let findedMaster = await Members.findOne( queryMaster );
          let findedMember = await Members.findOne( queryMember );

          let obj = {
            memberId: findedMember._id,
            masterId: findedMaster._id
          }

          if( findedMaster && findedMember && obj ) {

            let requestsMasters = await RequestsMasters( obj );

            result = await requestsMasters.save();

          }

        } catch ( err ) {

          console.error( 'memberDAO requestMaster' );
          console.error( err );

        } finally {

          return result;

        }
      }
    }

  }

  return memberDAO;

} () );
