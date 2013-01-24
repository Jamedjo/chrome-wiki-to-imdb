// http://www.omdbapi.com/?i=tt0047296&tomatoes=true
// http://imdbapi.org/?id=tt0047296&type=json&plot=none&episode=0&lang=en-US&aka=simple&release=simple&business=0&tech=0

var getImdbElement = function(rating,url) {
	var el = "<a href='"+url+"'><div class='imdb-rating' style='background-image:url("+chrome.extension.getURL("imdb-star.png")+")'>"+rating+"</div></a>";
	return el;
};

var detectMovie = function(){
  	var matched=[];
	$("a.external[href*='imdb.com/title/tt']").each(function(){
		if($(this).parents(".reference-text").length!=0){
			return;//Link is a citation reference not external link
		}
		m=this.href.match(/title\/(tt[a-z0-9]+)\/?$/i);
		if(m){
			matched.push(m);
		}
	});
	return matched[matched.length-1];//Last match is most likely to be the one in 'External References'
};

var fetchRating = function(tt,ratingCallback){
	if(tt){
		$.get('http://www.omdbapi.com/?i='+tt+'&tomatoes=true', function(response, xhr) {
			var data;
			try{
				data = JSON.parse(response);
			} catch(e) {
				return;
			}
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
		$("body").addClass("rated-movie");
		$("h1#firstHeading").prepend(getImdbElement(r_imdb,url));
	};
	fetchRating(tt,ratingCallback);
});