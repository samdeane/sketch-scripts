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
	},

	sendAction: function(commandToPerform) {
		try {
			[NSApp sendAction:commandToPerform to:nil from:doc]
		} catch(e) {
			log(e)
		}
	},

	selection: function() {
		if (selection == null) {
			selection = [[NSArray alloc] init]
		}

		return selection;
	},

	makeLogWindow: function() {
		var frame = NSMakeRect(0,0,512,256);
		var window = [[NSWindow alloc] initWithContentRect:frame styleMask:1+2+8 backing:2 defer:true];
		window.title = "Console";
		var textField = [[NSTextField alloc] initWithFrame:[[window contentView] bounds]];
		[textField setStringValue:"Testing"];
		[textField setBordered:NO];
		[textField setEditable:YES];
		[textField setDrawsBackground:YES];
		[textField setAlignment:NSCenterTextAlignment];
		[[window contentView] addSubview:textField];

		[window setReleasedWhenClosed:NO];
		[window makeKeyAndOrderFront:nil];

		log("made new log window");

		return window;
	},

	log: function(message) {
		if (com.elegantchaos.logWindow == null) {
			com.elegantchaos.logWindow = com.elegantchaos.makeLogWindow();
		}

		textField = [[com.elegantchaos.logWindow contentView] subviews][0];
		text = [textField stringValue];
		text = text + "\n" + message;
		[textField setStringValue:text];
	}
};
