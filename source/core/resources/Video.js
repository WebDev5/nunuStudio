"use strict";

/**
 * Video resources are used to store video.
 * 
 * Video data stored in base64.
 * 
 * @class Video
 * @constructor
 * @extends {Resource}
 * @module Resources
 * @param {String} url URL to video file.
 * @param {String} encoding Image encoding, required for ArrayBuffer data.
 */
function Video(url, encoding)
{
	Resource.call(this, "video", "Video");

	if(url !== undefined)
	{	
		//Base64 data
		if(url.startsWith("data:video"))
		{
			this.encoding = Base64Utils.getFileFormat(url);
			this.format = "base64";
			this.data = url;
		}
		//URL
		else
		{
			this.encoding = FileSystem.getFileExtension(url);
			this.data = "data:video/" + this.encoding + ";base64," + FileSystem.readFileBase64(url);
			this.format = "base64";
		}
	}
}

Video.prototype = Object.create(Resource.prototype);

/**
 * Check if a file name refers to a supported video file.
 *
 * @method fileIsVideo
 * @static
 * @param {File} file
 * @return {boolean} True if the file refers to a supported video format.
 */
Video.fileIsVideo = function(file)
{
	if(file !== undefined)
	{
		if(file.type.startsWith("video"))
		{
			return true;
		}
	}

	return false;
};

/**
 * Load arraybuffer data to this image.
 *
 * Creates a blob with data to be stored on data atribute and used by external objects.
 *
 * @method loadArrayBufferData
 * @param {ArrayBuffer} data Data to be loaded.
 * @param {String} encoding Video enconding (mp4, webm, etc).
 */
Video.prototype.loadArrayBufferData = function(data, encoding)
{
	var view = new Uint8Array(data);
	var blob = new Blob([view], {type: "video/" + encoding});

	this.data = URL.createObjectURL(blob);
	this.arraybuffer = data;
	this.encoding = encoding;
	this.format = "arraybuffer";
};

/**
 * Serialize resource to json.
 * 
 * Video data is stored in Base64.
 *
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
Video.prototype.toJSON = function(meta)
{
	var data = Resource.prototype.toJSON.call(this, meta);
	
	if(meta.videos[this.uuid] !== undefined)
	{
		return meta.videos[this.uuid];
	}

	data.encoding = this.encoding;
	data.format = this.format;
	data.data = this.data;

	meta.videos[this.uuid] = data;

	return data;
};
