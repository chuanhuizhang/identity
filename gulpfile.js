const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const lab = require('gulp-lab')

gulp.task('serve', () => {
  nodemon({
    script: 'server/index.js',
    ext: 'js json ejs',
    ignore: [
      'node_modules/',
      'test/',
      'tmp/',
      'gulpfile.js'
    ],
    env: {

    }
  })
})

gulp.task('test', () => {
  return gulp.src('test')
    .pipe(lab('-v -l -C'))
})

gulp.task('coverage', ['test'], () => {
  return gulp.src('test')
    .pipe(lab('-c -r html -o tmp/coverage.html'))
})

gulp.task('default', ['serve'])
