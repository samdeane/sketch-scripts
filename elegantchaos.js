var com = com || {};

com.elegantchaos = {
	export: function(document, kind){
		var file_url = [document fileURL];
		var file_name = [[file_url URLByDeletingPathExtension] lastPathComponent];
		var export_folder = [[[file_url URLByDeletingLastPathComponent] URLByDeletingLastPathComponent] URLByAppendingPathComponent:"Exported"]
		var export_url = [[export_folder URLByAppendingPathComponent:file_name] URLByAppendingPathExtension:kind];
		var export_path = [export_url path]
		var slice = [[[document currentPage] sliceContainer] layerAtIndex:0];
		[document saveArtboardOrSlice:slice toFile:export_path];
		}
};
