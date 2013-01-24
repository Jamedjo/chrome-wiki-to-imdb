// http://www.omdbapi.com/?i=tt0047296&tomatoes=true
// http://imdbapi.org/?id=tt0047296&type=json&plot=none&episode=0&lang=en-US&aka=simple&release=simple&business=0&tech=0

var getImdbElement = function(rating,url) {
	return "<div style='float:right;'><a href='"+url+"'>"+rating+"</a></div>";
  var tag = $('<span/>');
  tag.html(' (' + rating + ') ');
  tag.css('color', '#444');
  return tag;
};

var detectMovie = function(){
  	var matched=false;
	$("a.external[href*='imdb.com/title/tt']").each(function(){
		if(!matched) {
			matched=this.href.match(/title\/(tt[a-z0-9]+)/i);
		}});
	return matched;
};



var fetchRating = function(tt,ratingCallback){
	if(tt){
		$.get('http://www.omdbapi.com/?i='+tt+'&tomatoes=true', function(response, xhr) {
			var data = JSON.parse(response);
			// Fail fast if imdbRating is missing
			if (!data || !data.imdbRating) {
				return;
			}
			var raw_rating = parseFloat(data.imdbRating, 10);
			var rating = (raw_rating ? (typeof raw_rating != 'number' ? raw_rating : raw_rating.toFixed(1)) : 'N/A');
			ratingCallback(rating);
		});
	}
};

$(function() {
  	var m = detectMovie();
  	var tt = m[1];
 	var url = m.input;
	var ratingCallback = function(r_imdb){
		$("h1#firstHeading").prepend(getImdbElement(r_imdb,url));
	};
	fetchRating(tt,ratingCallback);
});