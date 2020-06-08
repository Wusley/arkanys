
'use strict';

module.exports = ( function() {

  function memberDAO( mongoose ) {

    var ObjectId = require( 'mongoose' ).Types.ObjectId;

    let schemaMember = require( '../Models/Member' ),
        schemaRequestMaster = require( '../Models/RequestMaster' ),
        SchemaMember = mongoose.Schema( schemaMember ),
        SchemaRequestMaster = mongoose.Schema( schemaRequestMaster );

        // SchemaMember.add( { yourMasterId: 'string', yourDisciples: [ { id: { type: String } } ] } );

    let Members = mongoose.models.Members || mongoose.model( 'Members', SchemaMember );
    let RequestsMasters = mongoose.models.RequestsMasters || mongoose.model( 'RequestsMasters', SchemaRequestMaster );

  	return {
      getMemberByName: async function( name ) {

        try {

          let member = await Members.findOne( {
            name: { $regex: name, $options: 'i' }
          } );

          return member;

        } catch ( err ) {

          console.error( 'memberDAO getMemberByName' );
          console.error( err );

        }

      },
      getMemberById: async function( id ) {

        try {

          let member = await Members.findOne( { '_id': new ObjectId( id ) } );

          return member;

        } catch ( err ) {

          console.error( 'memberDAO getMemberById' );
          console.error( err );

        }

      },
      getAvailableDisciples: async function() {

        try {

          let disciples = await Members.find( { $or: [ { yourMasterId: '' }, { yourMasterId: null }, { yourMasterId: false } ] } );

          return disciples;

        } catch ( err ) {

          console.error( 'memberDAO getMemberById' );
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

          let count = 0;
          for( ; count < requestsMasters.length ; count++ ) {

            let infoMaster = await Members.findOne( { _id: requestsMasters[ count ].masterId } );

            requestsMasters[ count ].infoMaster = infoMaster;

          }

          return requestsMasters;

        } catch ( err ) {

          console.error( 'memberDAO getRequestsMasters' );
          console.error( err );

        }

      },
      getRequestsPendings: async function( memberName ) {

        try {

          let query = { 'name': { $regex: memberName, $options: 'i' } };

          let member = await Members.findOne( query );

          let queryRequestsMasters = { 'masterId': member._id };

          let requestsMasters = await RequestsMasters.find( queryRequestsMasters );

          let count = 0;
          for( ; count < requestsMasters.length ; count++ ) {

            let infoMember = await Members.findOne( { _id: requestsMasters[ count ].memberId } );

            requestsMasters[ count ].infoMember = infoMember;

          }

          return requestsMasters;

        } catch ( err ) {

          console.error( 'memberDAO getRequestsPendings' );
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
          let findedRequest = await RequestsMasters.find( { 'masterId': findedMaster._id } );

          // pode seguir caso ainda não tenha feito um registro como esse e também os usuários não sejam os mesmos
          if( ( !findedRequest || findedRequest.length === 0 ) && findedMaster.name !== findedMember.name ) {

            // usuarios encontrados
            if( findedMaster && findedMember ) {

              let obj = {
                memberId: findedMember._id,
                masterId: findedMaster._id
              }

              let requestsMasters = await RequestsMasters( obj );

              result = requestsMasters.save();

            }

          } else {

            result = findedRequest;

          }

        } catch ( err ) {

          console.error( 'memberDAO requestMaster' );
          console.error( err );

        } finally {

          return result;

        }
      },
      acceptRequestMaster: async function( id ) {

        let result = false;

        try {
          let queryRequest = { '_id': new ObjectId( id ) };
          let findedRequest = await RequestsMasters.findOne( queryRequest );

          if( findedRequest ) {

            let queryMember = { _id: findedRequest.memberId };
            let queryMaster = { _id: findedRequest.masterId };

            let yourDisciples = await Members.findOne( queryMaster )
                                                .where( {
                                                  'yourDisciples': {
                                                    $elemMatch: { id: findedRequest.memberId }
                                                  }
                                                } );

            if( !yourDisciples ) {

              let findedMaster = await Members
                              .findOneAndUpdate( queryMaster, {
                                $push: {
                                  'yourDisciples': {
                                    id: findedRequest.memberId
                                  }
                                }
                              } );

              let findedMember = await Members.findOneAndUpdate( queryMember, { yourMasterId: findedRequest.masterId } );

              if( findedMember && findedMaster ) {

                await RequestsMasters.deleteOne( queryRequest );

                result = { member: findedMember, master: findedMaster };

              }

            }

          }

        } catch ( err ) {

          console.error( 'memberDAO acceptRequestMaster' );
          console.error( err );

        } finally {

          return result;

        }
      },
      unlinkMaster: async function( masterId, memberId ) {

        let result = false;

        try {
          let queryMember = { '_id': new ObjectId( memberId ) };
          let queryMaster = { '_id': new ObjectId( masterId ) };

          let findedDisciples = await Members.findOne( queryMaster )
                                              .where( {
                                                'yourDisciples': {
                                                  $elemMatch: { id: memberId }
                                                }
                                              } );

          let findedMaster = await Members.findOne( queryMember )
                                              .where( { 'yourMasterId': masterId } );

          if( findedDisciples && findedMaster ) {



            findedMaster = await Members
                                      .findOneAndUpdate( queryMaster, {
                                        $pull: {
                                          'yourDisciples': {
                                            id: memberId
                                          }
                                        }
                                      } );

            let findedMember = await Members.findOneAndUpdate( queryMember, { yourMasterId: '' } );

            if( findedMember && findedMaster ) {

              result = { member: findedMember, master: findedMaster };

              console.log( result );

            }

          }

        } catch ( err ) {

          console.error( 'memberDAO unlinkMaster' );
          console.error( err );

        } finally {

          return result;

        }
      },
      cancelRequestMaster: async function( id ) {

        let result = false;

        try {
          let query = { '_id': new ObjectId( id ) };

          let deletedRequest = await RequestsMasters.deleteOne( query );

          if( deletedRequest ) {

            result = deletedRequest;

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
