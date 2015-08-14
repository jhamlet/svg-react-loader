var gulp     = require('gulp'),
    ejs      = require('gulp-ejs'),
    concat   = require('gulp-concat'),
    fs       = require('fs'),
    // path     = require('path'),
    clean    = require('del'),
    pkgInfo  = require('./package.json'),
    LICENSE  = fs.readFileSync('LICENSE', 'utf8'),
    CLOBBER  = [];
    
gulp.task('clobber', function (done) {
    clean(CLOBBER, done);
});

gulp.task('readme', function () {
    return gulp.
        src('./tmpl/readme.ejs').
        pipe(ejs({
            pkg: pkgInfo,
            license: LICENSE
        })).
        pipe(concat('README.md')).
        pipe(gulp.dest('./'));
});
CLOBBER.push('README.md');

gulp.task('default', ['readme']);

