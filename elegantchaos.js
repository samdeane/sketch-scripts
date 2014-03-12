var com = com || {};

com.elegantchaos = (function() {
	log("defined");

	var my = {};
	var persistent = [[NSThread mainThread] threadDictionary];
	var logWindow = persistent["logWindow"];
	var console = persistent["console"];

	my.export = function(document, kind){
		var file_url = [document fileURL];
		var file_name = [[file_url URLByDeletingPathExtension] lastPathComponent];
		var export_folder = [[[file_url URLByDeletingLastPathComponent] URLByDeletingLastPathComponent] URLByAppendingPathComponent:"Exported"]
		var export_url = [[export_folder URLByAppendingPathComponent:file_name] URLByAppendingPathExtension:kind];
		var export_path = [export_url path]
		var slice = [[[document currentPage] sliceContainer] layerAtIndex:0];
		[document saveArtboardOrSlice:slice toFile:export_path];
	};

	my.sendAction = function(commandToPerform) {
		try {
			[NSApp sendAction:commandToPerform to:nil from:doc]
		} catch(e) {
			log(e)
		}
	};

	my.selection = function() {
		if (selection == null) {
			selection = [[NSArray alloc] init]
		}

		return selection;
	};

	my.makeLogWindow = function() {
		var frame = NSMakeRect(0,0,512,128);
		var mask = NSTitledWindowMask + NSClosableWindowMask + NSMiniaturizableWindowMask + NSResizableWindowMask;
		var window = [[NSWindow alloc] initWithContentRect:frame styleMask:mask backing:NSBackingStoreBuffered defer:true];
		window.title = "Console";
		window.level = NSStatusWindowLevel;
		var textField = [[NSTextField alloc] initWithFrame:[[window contentView] bounds]];
		[textField setStringValue:"Test"];
		[textField setBordered:NO];
		[textField setEditable:NO];
		[textField setDrawsBackground:YES];
		[textField setAlignment:NSLeftTextAlignment];
		[[window contentView] addSubview:textField];

		[window setReleasedWhenClosed:NO];
		[window makeKeyAndOrderFront:nil];

		return window;
	};

	my.log = function(message) {
		if (logWindow == null) {
			logWindow = my.makeLogWindow();
			persistent["logWindow"] = logWindow;
		}

		[logWindow makeKeyAndOrderFront:nil];

		textField = [[logWindow contentView] subviews][0];
		if (console == null)
			console = "blah";

		console = message + "\n" + console;
		[textField setStringValue:console];
		log(console);
		persistent["console"] = console;
	};

	return my;
}());
