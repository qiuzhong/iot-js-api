// Copyright 2016 Intel Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var client = require( process.argv[ 4 ] ).client;

console.log( JSON.stringify( { assertionCount: 3 } ) );

client
	.on( "resourcefound", function( resource ) {
		client.retrieve( resource )
			.then(
				function( retrievedResource ) {
					console.log( JSON.stringify( { assertion: "ok", arguments: [
						retrievedResource === resource,
						"Client: Retrieved resource is the discovered resource"
					] } ) );
					console.log( JSON.stringify( { assertion: "deepEqual", arguments: [
						retrievedResource.properties, { value: 42 },
						"Client: Retrieved resource properties are as expected"
					] } ) );
				},
				function( error ) {
					console.log( JSON.stringify( { assertion: "ok", arguments: [
						false, "Client: retrieve() failed unexpectedly: " +
							( "" + error ) + "\n" + JSON.stringify( error, null, 4 )
					] } ) );
				} )
			.then( function() {

				// Retrieve the resource again, this time with query options
				return client.retrieve( resource, { scale: -1 } );
			} )
			.then(
				function( retrievedResource ) {
					console.log( JSON.stringify( { assertion: "deepEqual", arguments: [
						retrievedResource.properties, { value: -42 },
						"Client: Retrieved resouce properties change based on query options"
					] } ) );
				},
				function( error ) {
					console.log( JSON.stringify( { assertion: "ok", arguments: [
						false, "Client: retrieve() with options failed unexpectedly: " +
							( "" + error ) + "\n" + JSON.stringify( error, null, 4 )
					] } ) );
				} )
			.then( function() {
				console.log( JSON.stringify( { finished: 0 } ) );
			} );
	} )
	.findResources( { resourcePath: "/a/" + process.argv[ 2 ] } )
	.catch( function( error ) {
		console.log( JSON.stringify( { assertion: "ok", arguments: [
			false, "Client: Starting device discovery failed: " +
				( "" + error ) + "\n" + JSON.stringify( error, null, 4 )
		] } ) );
	} );
