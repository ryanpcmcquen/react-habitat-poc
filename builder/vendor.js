import path from "path";
import gulp from "gulp";
//import gutil from "gulp-util";
import debug from "gulp-debug";
//import gutil from "gulp-util";
import gwebpack from "webpack-stream";
import webpack from "webpack";
import lazypipe from "lazypipe";
import gulpif from "gulp-if";
import rename from "gulp-rename";
import uglify from "gulp-uglify-es";
import filter from "gulp-filter";
import MemoryFileSystemStream from "memory-fs-stream";

function compileVendorScripts(done) {
	let release = lazypipe().pipe(uglify, { output: { beautify: false } });
	let js = filter(["**/*.js"], { restore: true });

	gwebpack(require("./config/vendor.webpack.config.js"), webpack, function(
		err,
		stats
	) {
		if (err) done(err);
		const fs = new MemoryFileSystemStream(
			stats.compilation.compiler.outputFileSystem
		);
		fs
			.pipe(debug({ title: "[vendor]" }))
			.pipe(js)
			.pipe(gulpif(process.env.NODE_ENV === "production", release()))
			.pipe(js.restore)
			.pipe(gulp.dest("./"))
			.on("end", done);
	});
}
compileVendorScripts.displayName = "vendor";
compileVendorScripts.description = "vendor";

export default compileVendorScripts;
