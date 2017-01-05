'use strict';
////////////////////////////
/////////// REQUIRED PLUGIN
////////////////////////////
var gulp =  require("gulp"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    rubysass = require("gulp-ruby-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    cssnano = require('gulp-cssnano'),
    useref = require("gulp-useref"),
    jade = require("gulp-jade"),
    livereload = require("gulp-livereload"),
    webserver = require("gulp-webserver"),
    plumber = require("gulp-plumber"),
    autoPrefixer = require("gulp-autoprefixer"),
    rename = require("gulp-rename"),
    gulpIf = require('gulp-if');


///////////////////////////
////////// JADE TASK
////////////////////////////
gulp.task('jade', function() {
  return gulp.src('assets/markup/*.jade')
             .pipe(plumber())
             .pipe(jade({
                  // Your options in here.
                  pretty: true
             }))
             .pipe(gulp.dest("./"))
             .pipe(livereload());
});

////////////////////////////
/////////// SASS/SCSS TASK
////////////////////////////
gulp.task("rubysass", function(){
    return rubysass("assets/styles/sass/main.sass")
               .pipe(sourcemaps.init())
               .on("error", sass.logError)
               .pipe(autoPrefixer("last 2 versions"))
               .pipe(sourcemaps.write("./maps"))
               .pipe(gulp.dest("assets/styles/css"))
               .pipe(livereload());
});
////////////////////////////
/////////// SCRIPTS TASK
////////////////////////////
gulp.task("scripts", function(){
  return gulp.src("assets/scripts/**/*js")
             .pipe(plumber())
             .pipe(gulp.dest("assets/scripts"))
             .pipe(livereload());
});

////////////////////////////
/////////// SERVER TASK
////////////////////////////
//Gulp plugin to run a local webserver with LiveReload
gulp.task('webserver', function() {
  gulp.src('./')
      .pipe(webserver({
        port: 3030,
        livereload: true,
        directoryListing: true,
        open: true
      }));
});

// ////////////////////////////
/////////// OPTIMIZATION CONCATONATE AND MINIFYING TASK
////////////////////////////
////////////////////////////
gulp.task("useref", function(){
    return gulp.src("./*.html")
               .pipe(plumber())
               .pipe(useref())
               // Minifies only if it's a JavaScript file
               .pipe(gulpIf("*.js",uglify()))
                // Minifies only if it's a CSS file
               .pipe(gulpIf('*.css', cssnano()))
               .pipe(gulp.dest("dist"))
               .pipe(livereload());
});
//
// //for image
// gulp.task('images', function(){
//   return gulp.src('assets/img/**/*.+(png|jpg|gif|svg)')
//   .pipe(imagemin())
//   .pipe(gulp.dest('dist/img'))
// });

/////////// WATCH TASK
////////////////////////////
//this will watch the the js file in the js folder, and then while watching, the scripts task will run.
gulp.task("watch", function(){
    livereload.listen();
    //watch the jade file
    gulp.watch("assets/markup/**/*jade", ["jade"]);
    gulp.watch("assets/styles/sass/**/*sass", ["rubysass"]);
    gulp.watch("assets/scripts/**/*.js", ["scripts"]);

});


////////////////////////////
/////////// DEFAULT TASK
////////////////////////////
gulp.task("default", ["webserver", "jade", "rubysass", "watch"]);
