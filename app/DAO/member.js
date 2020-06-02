
'use strict';

module.exports = ( function() {

  function memberDAO( mongoose ) {

    let schema = require( '../Models/Member' ),
        Schema = mongoose.Schema( schema );

    let Members = mongoose.models.Members || mongoose.model( 'Members', Schema );

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

          let member = await Members.findOne( {
            master: true
          } );

          return member;

        } catch ( err ) {

          console.error( 'memberDAO getMasters' );
          console.error( err );

        }

      },
      getMasters: async function( master ) {

        try {

          let member = await Members.findOne( {
            master: true
          } );

          return member;

        } catch ( err ) {

          console.error( 'memberDAO getMasters' );
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

          if( finded && obj ) {

            result = await Members.findOneAndUpdate( query, obj );

          } else if( obj ) {

            let member = await Members( obj );

            result = await member.save();

          }

        } catch ( err ) {

          console.error( 'memberDAO create' );
          console.error( err );

        } finally {

          return result;

        }

      }
    };

  }

  return memberDAO;

} () );
