module.exports = function (grunt) {

	var package = require("./package.json");
	var version = package.version,
		electronVersion = package.electronVersion;

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			browser: {
				src: [
						"js/default.js",
						"js/util/database.js",
						"js/util/settings.js",
						 "js/tabState.js",
						"js/util/urlParser.js",
						"js/filteringRenderer.js",
						"js/webviews.js",
						 "js/webviewMenu.js",
						"js/bookmarksHistory/bookmarksHistory.js",
						 "js/api-wrapper.js",
						 "js/searchbar/searchbar.js",
							"js/searchbar/searchbar-plugins.js",
							"js/searchbar/searchbar-autocomplete.js",
							"js/searchbar/historyPlugin.js",
							"js/searchbar/instantAnswerPlugin.js",
							"js/searchbar/bookmarksPlugin.js",
							"js/searchbar/openTabsPlugin.js",
							"js/searchbar/searchSuggestionsPlugin.js",
							"js/searchbar/historySuggestionsPlugin.js",
							"js/searchbar/hostsSuggestionsPlugin.js",
							"js/readerview.js",
						 "js/navbar/tabActivity.js",
							"js/navbar/tabColor.js",
						 "js/navbar/navbarTabs.js",
							"js/navbar/expandedTabMode.js",
							"js/navbar/addTabButton.js",
						 "js/keybindings.js",
						 "js/fileDownloadManager.js",
						 "js/findinpage.js",
							"js/sessionRestore.js",
							"js/focusMode.js",

						 ],
				dest: 'dist/build.js'
			},
			webview: {
				src: [
						"js/webview/default.js",
						"js/webview/bookmarksExtractor.js",
						"js/webview/contextMenu.js",
						"js/webview/phishDetector.js",
						"js/webview/readerDetector.js",
						"js/webview/swipeEvents.js",
						"js/webview/zoom.js",
						"js/webview/keywordExtractor.js",
						 ],
				dest: 'dist/webview.js'
			},
			main: {
				src: [
						"main/main.js",
					"main/filtering.js",
						 ],
				dest: 'main.build.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= grunt.template.today("mm-dd-yyyy") %> */\n'
			},
			browser: {
				src: 'dist/build.js',
				dest: 'dist/build.min.js'
			},
			webview: {
				src: 'dist/webview.js',
				dest: 'dist/webview.min.js'
			},
		},
		electron: {
			osxBuild: {
				options: {
					name: 'Min',
					dir: '',
					out: 'dist/app',
					version: electronVersion,
					'app-version': version,
					platform: 'darwin',
					arch: 'x64',
					icon: "icon.icns",
					ignore: 'dist/app',
					overwrite: true,
					protocols: [{
						name: "HTTP link",
						schemes: ["http", "https"]
					}, {
						name: "File",
						schemes: ["file"]
					}],
				}
			},
			windowsBuild: {
				options: {
					name: 'Min',
					dir: '',
					out: 'dist/app',
					version: electronVersion,
					'app-version': version,
					platform: 'win32',
					arch: 'all',
					ignore: 'dist/app',
					overwrite: true,
				}
			},
			linuxBuild: {
				options: {
					name: 'Min',
					dir: '',
					out: 'dist/app',
					version: electronVersion,
					'app-version': version,
					platform: 'linux',
					arch: 'all',
					ignore: 'dist/app',
					overwrite: true,
				}
			}
		},
		'electron-installer-debian': {
			options: {
				productName: "min",
				genericName: "Web Browser",
				version: version,
				section: "web",
				homepage: "https://palmeral.github.io/min/",
				icon: "icons/icon256.png",
				categories: ["Network", "WebBrowser"],
				mimeType: ["x-scheme-handler/http", "x-scheme-handler/https", "text/html"]
			},
			linux32: {
				options: {
					arch: 'i386'
				},
				src: 'dist/app/Min-linux-ia32',
				dest: 'dist/app/linux'
			},
			linux64: {
				options: {
					arch: 'amd64'
				},
				src: 'dist/app/Min-linux-x64',
				dest: 'dist/app/linux'
			}
		},
		'electron-installer-redhat': {
			options: {
				name: "min",
				description: "Min Web Browser",
				productName: "min",
				productDescription: "A fast and efficient browser with built-in ad-blocking",
				genericName: "Web Browser",
				version: version,
				homepage: "https://palmeral.github.io/min/",
				icon: "icons/icon256.png",
				categories: [
					"Network"
				]
			},
			linux32: {
				options: {
					arch: 'i686',
					requires: [
            "libnotify.so.4",
						"libXtst.so.6",
						"libgconf-2.so.4",
						"libpk-gtk-module.so",
						"libcanberra-gtk.so.0"
					],
				},
				src: 'dist/app/Min-linux-ia32',
				dest: 'dist/app/linux'
			},
			linux64: {
				options: {
					arch: 'x86_64',
					requires: [
						"libnotify.so.4()(64bit)",
						"libXtst.so.6()(64bit)",
						"libgconf-2.so.4()(64bit)",
						"libpk-gtk-module.so()(64bit)",
						"libcanberra-gtk.so.0()(64bit)"
					],
				},
				src: 'dist/app/Min-linux-x64',
				dest: 'dist/app/linux'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-electron');
	grunt.loadNpmTasks('grunt-electron-installer-debian');
	grunt.loadNpmTasks('grunt-electron-installer-redhat');

	grunt.registerTask('default', ['concat:browser', 'uglify:browser', 'concat:webview', 'uglify:webview', 'concat:main']);
	grunt.registerTask('browser', ['concat:browser', 'uglify:browser']);
	grunt.registerTask('webview', ['concat:webview', 'uglify:webview']);
	grunt.registerTask('build', ['concat:browser', 'uglify:browser', 'concat:webview', 'uglify:webview', 'concat:main', 'electron:osxBuild', 'electron:windowsBuild', 'electron:linuxBuild', 'electron-installer-debian:linux32', 'electron-installer-debian:linux64', 'electron-installer-redhat:linux32', 'electron-installer-redhat:linux64'])

};
