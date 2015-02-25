/*
To do:
	+ Make it so that the posts displayed in full can be reduced in size at a 
	specified point
		+ Same point as Tumblr's built in "Read moar"?
		+ Does this even have to rely on Javascript?
	+ Convert unixTime to relative time (i.e. x minutes|hours|days|etc ago)
	+ How to handle image|sound|etc. posts?
		+ via script if-else?
		+ via array?
	+ Can this script allow for the display of an old post from "the list" in the "main area"?
*/


var username = tumblr_api_read['tumblelog']['name'];


// USER DEFINITIONS
//
// Set nummber of full posts to display
var fullPostsToDisplay = 5;

// Set number of past posts to display
var pastPostsToDisplay = 5;

// ****
// IMPORTANT: THESE TWO VALUES MUST NOT BE GREATER THAN 50
// THIS IS A LIMITATION OF THE API
// ****

// Set the prettified log text on successful loop
var loopSuccessMessage = "%c Loop finished "; 
var loopSuccessStyling = "background: #006400; color: #fff; border-radius: 6px;";

// Ditto for individual posts successful log
var postSuccessMessagePart1 = "\t%c Post ";
var postSuccessMessagePart2 = " successfully listed"
var postSuccessStyling = ""

// Set the prettified log text for each post not found
var postErrorMessagePart1 = "%c Post "
var postErrorMessagePart2_1 = " not listed : not yet written, or private ";
var postErrorMessagePart2_2 = " not listed : over the allowable 50 ";
var postErrorStyling = "background-color: gold; color: #333; border-radius: 6px;";



// DEBUG OPTIONS
//
// Set to true to better understand how script works
var debugMode = true;

// Set to true if post "error" log messages desired while in debug mode
var postLogErrorMessage = true;

// Ditto for post successful messages while in debug mode
var postLogSuccessMessage = true;

// Ditto for section headers
var debugSectionHeader = true;

// Ditto for section colors
var debugSectionColor = true;

// Ditto for OL in pastPosts
var debugOL = true;

// Ditto for totals at end
var extraLogs = true;


// Set debugOff|On styling
var debugOnStyling = loopSuccessStyling;
var debugOffStyling = "background: #8b0000; color: #fff; border-radius: 6px;";



// MATH
//
// postsTotal is the total number of posts in the feed
// The API however only allows for a maximum of 50 posts per page
// Simplify variable
var postsTotal = tumblr_api_read['posts-total'];

// Calcuate total number of posts to show on page
var totalPostsToDisplay = fullPostsToDisplay + pastPostsToDisplay;

if(totalPostsToDisplay > 50){ // If user configues script to show more than 50 posts on the page, show this modal
	document.write(
		"<div id=\"modal\">\n"+
			"<div>\n"+
				"<h5>Ruh roh!</h5>\n"+
				"<div>\n"+
					"<span>" + fullPostsToDisplay + " + " + pastPostsToDisplay + " = " + totalPostsToDisplay + " ; " + totalPostsToDisplay + " > 50</span>\n"+
					"<p>The API supports a maximum of 50 posts.</p>\n"+
					"<p>Please alter either <code>fullPostsToDisplay</code> or <code>pastPostsToDisplay</code> so their sum is less than or equal to 50.</p>\n"+
					"<p>While the script will still work, not altering one or both of those variables accordingly will cause parts of the script to return incorrect numbers/stats.</p>\n"+
				"</div>\n"+
			"</div>\n"+
		"</div>"
	);
}
// Conditionally define total number of posts actually shown on page
// Used in console log stats
if(postsTotal < totalPostsToDisplay){
	var postsShown = postsTotal;
} else {
	var postsShown = totalPostsToDisplay;
}

// Conditionally calculate posts not shown (due to existing outside of the scope as set by totalPostsToDisplay)
// Used in console log stats
if(postsShown < totalPostsToDisplay){
	var postsNotShown = 0;
} else {
	var postsNotShown = postsTotal - totalPostsToDisplay;
}

// Preload for loop variables to be shared with both document.write loops
/*for(i = 0; i < postsTotal; i++){
	// Simplify
	var prePost = tumblr_api_read['posts'][i];

	if(prePost == null){
		// Do nothing

	} else {
		// Simplify again
		var unixTime = tumblr_api_read['posts'][i]['unix-timestamp'];
		var postTags = tumblr_api_read['posts'][i]['tags'];
		var postText = tumblr_api_read['posts'][i]['regular-body'];
		var postTitle = tumblr_api_read['posts'][i]['regular-title'];

		// Use SEO friendly URL
		var postURL = tumblr_api_read['posts'][i]['url-with-slug'];
	}
	
}*/


// Initiate simulated real-time logging of script actions
console.log(" tumblr-sans-tumblr.js Initiated");

if(debugMode == true) {
	// Set debug "ON" styling in console
	console.log("%c Debug mode : on ", debugOnStyling); 
	console.log(" Starting loops ...");
} else {
	// Set debug "OFF" styling in console
	console.log("%c Debug mode : off ", debugOffStyling);
}

// Indicate debug mode on in HTML
if(debugMode == true){
	document.write(
		"<div>\n"+
			"<h2>Debug mode on</h2>\n"+
			"<span>Data from: <a href=\"http:\/\/" + username + ".tumblr.com\">http://" + username + ".tumblr.com</a></span>\n"+
		"</div>"
		);
}

// Wraps both loops in a div
document.write("<div>");

// DISPLAY FULL POSTS
//
if(debugMode == true) {
	console.log(" Displaying " + fullPostsToDisplay + " full posts ...");
}

// Wraps the first loop in a div
// Debug mode on
if(debugMode == true){

	if(debugSectionColor == true){
		document.write("<div id=\"postsFull\" style=\"background-color: red;\">");
	}
} else {
	document.write("<div id=\"postsFull\">");
}

	// Debug mode on
	if(debugMode == true){

		// Show section header if debug mode on
		if(debugSectionHeader == true){
			document.write("<h2 class=\"debugSectionHeader\">The " + fullPostsToDisplay + " most recent posts appear below in full</h2>");
		}
	}

	// Full posts loop
	for(i = 0; i < fullPostsToDisplay; i++){

		// Simplify
		var prePost = tumblr_api_read['posts'][i];

		// Only useful when this script is paired with a new blog
		if(prePost == null) {

			// Debug mode on
			if(debugMode == true) {

				// Post listing error message
				if(postLogErrorMessage == true){
					console.log(
						postErrorMessagePart1 + (i+1) +
						postErrorMessagePart2_1, postErrorStyling
					);
				}
			}

		} else {

			// Simplify again
			var unixTime = tumblr_api_read['posts'][i]['unix-timestamp'];
			var postTags = tumblr_api_read['posts'][i]['tags'];
			var postText = tumblr_api_read['posts'][i]['regular-body'];
			var postTitle = tumblr_api_read['posts'][i]['regular-title'];

			// Use SEO friendly URL
			var postURL = tumblr_api_read['posts'][i]['url-with-slug'];

			// Build fullPost so it can be looped. Final [source invisible] outut as follows:
			/*
			<article>
				<h3><a rel="external" href="[postURL]">[postTitle]</a></h3>
				<span class="meta">[unixTime] &middot; [tags]</span>
				<div class="postText">[postText]</div>
			</article>
			*/
			if(postTags == null){
				var fullPost = 
					"<article>\n"+
						"<h3><a rel=\"external\" href=\"" + postURL + "\">" + postTitle + "</a></h3>\n"+
						"<span class=\"meta\">" + unixTime + "</span>\n"+
						"<div class=\"postText\">" + postText + "</div>"+
					"</article>";
			} else {
				var fullPost = 
				"<article>\n"+
					"<h3><a rel=\"external\" href=\"" + postURL + "\">" + postTitle + "</a></h3>\n"+
					"<span class=\"meta\">" + unixTime + " &middot; " + postTags + "</span>\n"+
					"<div class=\"postText\">" + postText + "</div>"+
				"</article>";
			}

			// Finally document.write the dataz
			document.write(fullPost);

			// Debug mode on
			if(debugMode == true){

				// Post successfully listed
				if(postLogSuccessMessage == true){
					console.log(
						postSuccessMessagePart1 + (i+1) +
						postSuccessMessagePart2, postSuccessStyling
					);
				}
			}
		}
	} 
	// Loop complete?
	if(debugMode == true) {
		console.log(loopSuccessMessage, loopSuccessStyling);
	}
// Closes first loop div
document.write("</div>");

// DISPLAY PAST POSTS
//
if(debugMode == true) {
	console.log(" Listing the next " + pastPostsToDisplay + " posts ...");
}

// Wraps the second loop in a div
// Debug mode on
if(debugMode == true){

	if(debugSectionColor == true){
		document.write("<div id=\"postsPast\" style=\"background-color: yellow;\">");
	}
} else {
	document.write("<div id=\"postsPast\">");
}
	// Debug mode on
	if(debugMode == true){

		// Show section header if debug mode on
		if(debugSectionHeader == true){
			document.write(
				"<h2 class=\"debugSectionHeader\">The next " + 
				pastPostsToDisplay + " posts appear below in reduced form</h2>"
			);
		}
	}

	// Debug mode on
	if(debugMode == true){

		if(debugOL == true){
			document.write("<ol start=\"" + (fullPostsToDisplay + 1) + "\">")
		}
	} else {
		document.write("<ul>")
	}

	// Past posts loop
	for(i = fullPostsToDisplay; i < totalPostsToDisplay; i++){

		// Simplify
		var prePost = tumblr_api_read['posts'][i];

		// Only useful when this script is paired with a new blog
		if(prePost == null) {
		
			// Debug mode on
			if(debugMode == true) {

				// Post listing error message
				if(postLogErrorMessage == true) {
					console.log(
						postErrorMessagePart1 + (i+1) +
						postErrorMessagePart2_1, postErrorStyling
					);

				}
	
			}

		} else {

			// Simplify again
			var unixTime = tumblr_api_read['posts'][i]['unix-timestamp'];
			var postTags = tumblr_api_read['posts'][i]['tags'];
			var postText = tumblr_api_read['posts'][i]['regular-body'];
			var postTitle = tumblr_api_read['posts'][i]['regular-title'];

			// Use SEO friendly URL
			var postURL = tumblr_api_read['posts'][i]['url-with-slug'];
			
			// Build pastPost so it can be looped. Final [source invisible] outut as follows:
			/*
			<li>
				<a rel="external" href="[postURL]">[postTitle]</a>
				<span class="meta">[unixTime]</span>
			</li>
			*/
			var pastPost = 
				"<li>\n"+
					"<a rel=\"external\" href=\"" + postURL + "\">" + 
					postTitle + "</a>\n"+ 
					"<span class=\"meta\">" + unixTime + "</span>\n"+ 
				"</li>";

			// Finally document.write the dataz
			document.write(pastPost);	

			// Debug mode on
			if(debugMode == true){

				// Post successfully listed
				if(postLogSuccessMessage == true){
					console.log(
						postSuccessMessagePart1 + (i+1) +
						postSuccessMessagePart2, postSuccessStyling
					);
				}
			}
		}
	} 
	// Loop complete?
	// Debug mode on
	if(debugMode == true) {
		console.log(loopSuccessMessage, loopSuccessStyling);
		document.write("</ol>");

	} else {
		document.write("</ul>");

		if(postsNotShown == 0){
			document.write("No posts available.");

		}
	}
// Closes second loop div
document.write("</div>");

// Closes the div around both loops
document.write("</div>");


// Place some more logs on the fire. Useful for all scenarios. Because fireplaces are cozy

if(debugMode == true) {

	if(extraLogs == true) {

		console.log(
			"\n%c  Posts allowed by API    : 50\n\n", "font-weight: bold; color: red;");
		console.log(
			" Posts available in feed : " + postsTotal +
			"\n%c- Posts shown on page     : " + postsShown + " \n",
			"border-bottom: 1px solid;");
		console.log(
			" Posts not shown on page : " + postsNotShown + " \n\n"
			);
		console.log(
			"tumblr-sans-tumblr.js Complete");
	}
}