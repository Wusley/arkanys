
'use strict';

module.exports = ( function() {

  function memberDAO( mongoose ) {

    var ObjectId = require( 'mongoose' ).Types.ObjectId;

    let schemaMember = require( '../Models/Member' ),
        schemaRequestMaster = require( '../Models/RequestMaster' ),
        schemaRequestDisciple = require( '../Models/RequestDisciple' ),
        SchemaMember = mongoose.Schema( schemaMember ),
        SchemaRequestMaster = mongoose.Schema( schemaRequestMaster ),
        SchemaRequestDisciple = mongoose.Schema( schemaRequestDisciple );

        // SchemaMember.add( { yourMasterId: 'string', yourDisciples: [ { id: { type: String } } ] } );

    let Members = mongoose.models.Members || mongoose.model( 'Members', SchemaMember );
    let RequestsMasters = mongoose.models.RequestsMasters || mongoose.model( 'RequestsMasters', SchemaRequestMaster );
    let RequestsDisciples = mongoose.models.RequestsDisciples || mongoose.model( 'RequestsDisciples', SchemaRequestDisciple );

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
      getRequestsDisciples: async function( memberName ) {

        try {

          let query = { 'name': { $regex: memberName, $options: 'i' } };

          let member = await Members.findOne( query );

          let queryRequestsDisciples = { 'masterId': member._id };

          let requestsDisciples = await RequestsDisciples.find( queryRequestsDisciples );

          let count = 0;
          for( ; count < requestsDisciples.length ; count++ ) {

            let infoDisciples = await Members.findOne( { _id: requestsDisciples[ count ].memberId } );

            requestsDisciples[ count ].infoDisciple = infoDisciples;

          }

          return requestsDisciples;

        } catch ( err ) {

          console.error( 'memberDAO getRequestsDisciples' );
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
      getRequestsPendingsDisciples: async function( memberName ) {

        try {

          let query = { 'name': { $regex: memberName, $options: 'i' } };

          let member = await Members.findOne( query );

          let queryRequestsDisciples = { 'memberId': member._id };

          let requestsDisciples = await RequestsDisciples.find( queryRequestsDisciples );

          let count = 0;
          for( ; count < requestsDisciples.length ; count++ ) {

            let infoMaster = await Members.findOne( { _id: requestsDisciples[ count ].masterId } );

            requestsDisciples[ count ].infoMaster = infoMaster;

          }

          return requestsDisciples;

        } catch ( err ) {

          console.error( 'memberDAO getRequestsPendingsDisciples' );
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
      requestMaster: async function( masterId, memberId ) {

        let result = false;

        try {
          let queryMaster = { '_id': new ObjectId( masterId ), 'master': true };
          let queryMember = { '_id': new ObjectId( memberId ), $and: [ { $or: [ { yourMasterId: '' }, { yourMasterId: null } ] } ] }; // <- yourMasterId blank because he need only one master

          let findedMaster = await Members.findOne( queryMaster );
          let findedMember = await Members.findOne( queryMember );
          let findedRequest = await RequestsMasters.find( { $and: [ { 'masterId': findedMaster._id }, { 'memberId': findedMember._id } ] } );

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
      requestDisciple: async function( discipleId, masterId ) {

        let result = false;

        try {
          let queryMaster = { '_id': new ObjectId( masterId ), 'master': true };
          let queryMember = { '_id': new ObjectId( discipleId ), $and: [ { $or: [ { yourMasterId: '' }, { yourMasterId: null } ] } ] }; // <- yourMasterId blank because he need only one master

          let findedMaster = await Members.findOne( queryMaster );
          let findedMember = await Members.findOne( queryMember );
          let findedRequest = await RequestsDisciples.find( { $and: [ { 'masterId': findedMaster._id }, { 'memberId': findedMember._id } ] } );

          // pode seguir caso ainda não tenha feito um registro como esse e também os usuários não sejam os mesmos
          if( ( !findedRequest || findedRequest.length === 0 ) && findedMaster.name !== findedMember.name ) {

            // usuarios encontrados
            if( findedMaster && findedMember ) {

              let obj = {
                memberId: findedMember._id,
                masterId: findedMaster._id
              }

              let requestsDisciples = await RequestsDisciples( obj );

              result = requestsDisciples.save();

            }

          } else {

            result = findedRequest;

          }

        } catch ( err ) {

          console.error( 'memberDAO requestDisciple' );
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
      acceptRequestDisciple: async function( id ) {

        let result = false;

        try {
          let queryRequest = { '_id': new ObjectId( id ) };
          let findedRequest = await RequestsDisciples.findOne( queryRequest );

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

                await RequestsDisciples.deleteOne( queryRequest );

                result = { member: findedMember, master: findedMaster };

              }

            }

          }

        } catch ( err ) {

          console.error( 'memberDAO acceptRequestDisciple' );
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

          console.error( 'memberDAO cancelRequestMaster' );
          console.error( err );

        } finally {

          return result;

        }
      },
      cancelRequestDisciple: async function( id ) {

        let result = false;

        try {
          let query = { '_id': new ObjectId( id ) };

          let deletedRequest = await RequestsDisciples.deleteOne( query );

          if( deletedRequest ) {

            result = deletedRequest;

          }

        } catch ( err ) {

          console.error( 'memberDAO cancelRequestDisciple' );
          console.error( err );

        } finally {

          return result;

        }
      }
    }

  }

  return memberDAO;

} () );
