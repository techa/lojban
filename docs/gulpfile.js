// プラグイン
// https://www.npmjs.com/package

var gulp = require("gulp");

gulp.task("html",function() {
    // gulp.src(["./**/*.html","!./src/donot.html"])
    gulp.src("./*.html")//操作対象
        .pipe(gulp.dest("./dist"));//destination行き先  distribution配布
});

/*
// npm i -D gulp-imagemin
var imagemin = require("gulp-imagemin");
gulp.task("img",function() {
	gulp.src("./images/*.jpg")
		.pipe(imagemin())
        .pipe(gulp.dest("./dist/images"));
});
*/

// npm i -D gulp-concat gulp-uglify
// var concat = require("gulp-concat");
var uglify = require("gulp-uglify");// minify
gulp.task("js",function() {
    gulp.src(["./js/**/*.js","./js/*.js","!./js/lib"])
		// .pipe(concat("all.min.js"))
		.pipe(uglify({preserveComments:"some"}))//  /*!*/のコメントを残すオプション
        .pipe(gulp.dest("./dist/js"));
});


// npm i -D gulp-less gulp-minify-css gulp-autoprefixer
var less = require("gulp-less");
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');// ベンダープレフィックス（-webkit-とか-ms-）を自動で付けてくれる

gulp.task("less",function() {
    gulp.src("./css/style.less")
		// .pipe(concat("all.min.js"))
		.pipe(less())
		.pipe(minifyCSS())
		.pipe(autoprefixer())
        .pipe(gulp.dest("./dist/css"));
});


// 順番に実行されないので、したければhttp://dotinstall.com/lessons/basic_gulp/30606
gulp.task("default",["html","js","less"]);

// ~/workspace $ gulp   で実行
