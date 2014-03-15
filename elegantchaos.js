var com = com || {};

com.elegantchaos = (function() {
	var my = {};
	var persistent = [[NSThread mainThread] threadDictionary];
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

	my.persistentWindow = function(title, persistName, level, setup) {
		var window = persistent[persistName];
		if (window == null) {
			window = my.makeWindow(title, persistName, level, setup);
			persistent[persistName] = window;
		}

		return window;
	}

	my.makeWindow = function(title, autosave, level, setup) {
		var frame = NSMakeRect(0,0,512,128);
		var mask = NSTitledWindowMask + NSClosableWindowMask + NSMiniaturizableWindowMask + NSResizableWindowMask;
		var window = [[NSWindow alloc] initWithContentRect:frame styleMask:mask backing:NSBackingStoreBuffered defer:true];
		window.title = title;
		window.level = level;
		[window setFrameAutosaveName:autosave];

		setup(window);

		[window setReleasedWhenClosed:NO];
		[window makeKeyAndOrderFront:nil];

		return window;
	}

	my.logWindow = function() {
		var window = my.persistentWindow("Console", "LogWindow", NSStatusWindowLevel, function(window) {
			var scrollview = [[NSScrollView alloc] initWithFrame:[[window contentView] frame]];
			var contentSize = [scrollview contentSize];

			[scrollview setBorderType:NSNoBorder];
			[scrollview setHasVerticalScroller:YES];
			[scrollview setHasHorizontalScroller:YES];
			[scrollview setAutoresizingMask:NSViewWidthSizable | NSViewHeightSizable];

			var FLT_MAX = 3.40282347e+38;
			var view = [[NSTextView alloc] initWithFrame:NSMakeRect(0, 0, contentSize.width, contentSize.height)];
			[view setMinSize:NSMakeSize(0.0, contentSize.height)];
			[view setMaxSize:NSMakeSize(FLT_MAX, FLT_MAX)];
			[view setVerticallyResizable:YES];
			[view setHorizontallyResizable:YES];
			[view setAutoresizingMask:NSViewWidthSizable | NSViewHeightSizable];
			[[view textContainer] setContainerSize:NSMakeSize(FLT_MAX, FLT_MAX)];
			[[view textContainer] setWidthTracksTextView:NO];

			[scrollview setDocumentView:view];
			[window setContentView:scrollview];
			[window makeFirstResponder:view];
		});

		return window;
	};

	my.log = function(message) {
		var logWindow = my.logWindow();
		[logWindow makeKeyAndOrderFront:nil];

		textField = [[logWindow contentView] documentView];
		if (console == null)
			console = "blah";

		console = message + "\n" + console;
		[textField setString:console];
		log(console);
		persistent["console"] = console;
	};

	return my;
}());
