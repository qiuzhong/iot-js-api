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

var ocf = require( process.argv[ 4 ] );

console.log( JSON.stringify( { assertionCount: 3 } ) );

var conditionsMet = 0;
function maybeQuit() {
	if ( ++conditionsMet === 2 ) {
		console.log( JSON.stringify( { finished: 0 } ) );
	}
}

ocf.client
	.on( "platformfound", function( platform ) {
		if ( platform.supportURL === "ocf://test-device-" + process.argv[ 2 ] ) {
			console.log( JSON.stringify( { assertion: "ok", arguments: [
				true, "Client: Found platform via .on()"
			] } ) );
			maybeQuit();
		}
	} )
	.findPlatforms( function( platform ) {
		if ( platform.supportURL === "ocf://test-device-" + process.argv[ 2 ] ) {
			console.log( JSON.stringify( { assertion: "ok", arguments: [
				true, "Client: Found platform via convenience handler"
			] } ) );
			maybeQuit();
		}
	} ).then(
		function() {
			console.log( JSON.stringify( { assertion: "ok", arguments: [
				true, "Client: Platform discovery successfully started"
			] } ) );
		},
		function( error ) {
			console.log( JSON.stringify( { assertion: "ok", arguments: [
				true, "Client: Failed to start platform discovery: " +
					( "" + error ) + "\n" + JSON.stringify( error, null, 4 )
			] } ) );
		} );
