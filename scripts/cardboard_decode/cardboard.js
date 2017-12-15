function retrieveParams(parameter) {
	var ProtoBuf = dcodeIO.ProtoBuf;
	var  ByteBuffer = ProtoBuf.ByteBuffer,
	Long = ProtoBuf.Long;                                // as well as Long.js (not used in this example)
	var builder = ProtoBuf.loadProtoFile("/GoogleVR/scripts/cardboard_decode/cardboard.proto"), JS = builder.build("cardboard");
	var config = uriToParamsProto(parameter);	// Returns just the 'js' namespace if that's all we need
	return JS.DeviceParams.decode64(config);
}

function base64FromUrl(s) {
    s = s + '==='.slice(0, [0, 3, 2, 1][s.length % 4]);
    return s.replace(/-/g, '+').replace(/_/g, '/');
}

/**
 * @param uri: goo.gl/7Bw74D or https://goo.gl/7Bw74D
 */
function uriToParamsProto(uri) {
	var myregexp = new RegExp("goo.gl/");
	var array = uri.split(myregexp);
	uri = array[1]; // uri: 7Bw74D

	var urlSolved = resolveUrl(uri);
	
	return base64FromUrl(urlSolved);
}

function resolveUrl(shorturl) {
	var urlShortener = "https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/";
	var key = "AIzaSyC4sZkpQ-kRib06NcGTFVwrFUZJzheP4XA";
	var urlRequest = urlShortener + shorturl + "&key=" + key;
	var arrayUrl;

	$.ajax({
  		url: urlRequest,
  		async: false,
  		success: function(data) {
  			var longUrl = data.longUrl;
			var myregexp = new RegExp("\\?p=");
			arrayUrl = longUrl.split(myregexp);
  		}
	});
	return arrayUrl[1];
}