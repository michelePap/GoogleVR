function retrieveParams(parameter) {
	console.log("retrieveParams");
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

var PARAMS_URI_PREFIX = 'https://www.google.com/cardboard/cfg?p=';
function uriToParamsProto(uri) {
    if (uri.substring(0, PARAMS_URI_PREFIX.length) !== PARAMS_URI_PREFIX) {
      return;
    }
    return base64FromUrl(uri.substring(PARAMS_URI_PREFIX.length));
}

