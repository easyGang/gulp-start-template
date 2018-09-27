// ---- Обьявляем модули ---- //
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      browserSync = require('browser-sync'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      cssnano = require('gulp-cssnano'),
      cleanCSS = require('gulp-clean-css'),
      rename = require('gulp-rename'),
      del = require('del'),
      imagemin = require('gulp-imagemin'),
      autoprefixer = require('gulp-autoprefixer'),
      rsync = require('gulp-rsync'),
      pug = require('gulp-pug'),
      babel = require('gulp-babel'),
      notify = require('gulp-notify'),
      cache = require('gulp-cache'),
      eslint = require('gulp-eslint'),
      minifyJS = require('gulp-minify')

const params = {
  proxy: 'localproxy.dev', // Если работа ведется с использованием сервера и php
  projectName: 'projectNamme'
}

// ---- esLint ---- //
/*
 * прверяем правильность написаия кода, его стиля и граммотности
 */
gulp.task('esLint', () => {
    return gulp.src(['src/views/components/**/*.js', 'src/assets/scripts/myLibs/**/*.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError())
})

// ---- BrowserSync ---- //

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'src/',
            index: 'page-home.html'
        },
        notify: false
    })
})

gulp.task('browser-sync-php', function () {
    browserSync({
        proxy: params.proxy,
        notify: false
    })
})

// ---- Js ---- //

/*
 * Обрабатывем стороние библиотеки
 */

gulp.task('js-libs', function () {
    return gulp.src([
        'src/assets/scripts/libs/*.js'
    ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('src/assets/scripts/common/'))
})

/*
 * Обрабатываем собственные библиотеки
 */

gulp.task('js-myLibs', function () {
    return gulp.src([
        'src/assets/scripts/myLibs/*.js'
    ])
        .pipe(concat('myLibs.js'))
        .pipe(gulp.dest('src/assets/scripts/common/'))
})

/*
 * Обрабатываем Js в компонентах
 */

gulp.task('js-components', function () {
    return gulp.src([
        'src/views/components/**/*.js'
    ])
        .pipe(concat('components.js'))
        .pipe(gulp.dest('src/assets/scripts/common/'))
})


/*
 * Обрабатываем Js в секциях
 */

gulp.task('js-sections', function () {
  return gulp.src([
    'src/views/sections/**/*.js'
  ])
    .pipe(concat('sections.js'))
    .pipe(gulp.dest('src/assets/scripts/common/'))
})

/*
 * Обрабатываем весь Js
 */

gulp.task('dev-js', ['js-libs', 'js-myLibs', 'js-components', 'js-sections'], function () {
    return gulp.src([
        'src/assets/scripts/common/libs.js',
        'src/assets/scripts/common/myLibs.js',
        'src/assets/scripts/common/components.js',
        'src/assets/scripts/common/sections.js'
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(babel({
            presets: ['env']
        }))

        .pipe(gulp.dest('src/assets/scripts/common/'))
        .pipe(browserSync.reload({ stream: true }))
})

gulp.task('dist-js', ['js-libs', 'js-myLibs', 'js-components', 'js-sections'], function () {
    return gulp.src([
        'src/assets/scripts/common/libs.js',
        'src/assets/scripts/common/myLibs.js',
        'src/assets/scripts/common/components.js',
        'src/assets/scripts/common/sections.js'
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist/assets/scripts/common/'))
})

gulp.task('prod-js', ['js-libs', 'js-myLibs', 'js-components', 'js-sections'], function () {
    return gulp.src([
        'src/assets/scripts/common/libs.js',
        'src/assets/scripts/common/myLibs.js',
        'src/assets/scripts/common/components.js',
        'src/assets/scripts/common/sections.js'
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('prod/assets/scripts/common/'))
})

// ---- SASS ---- //

/*
 * Обрабатывем SASS главного экрана
 */

gulp.task('dev-sass-common-screen', function () {
    return gulp.src([
        'src/assets/sass/common-screen.+(scss|sass)'
    ])
        .pipe(concat('common-screen.sass'))
        .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(cssnano())
        .pipe(gulp.dest('src/assets/css'))
})

gulp.task('dist-sass-common-screen', function () {
    return gulp.src([
        'src/assets/sass/common-screen.+(scss|sass)'
    ])
        .pipe(concat('common-screen.sass'))
        .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(cssnano())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/assets/css'))
})

gulp.task('prod-sass-common-screen', function () {
    return gulp.src([
        'src/assets/sass/common-screen.+(scss|sass)'
    ])
        .pipe(concat('common-screen.sass'))
        .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(cssnano())
        .pipe(cleanCSS())
        .pipe(gulp.dest('prod/assets/css'))
})

/*
 * Обрабатываем Общие стили
 */

gulp.task('dev-sass-common', function () {
    return gulp.src([
        'src/assets/sass/common.+(scss|sass)'
    ])
        .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(cssnano())
        .pipe(gulp.dest('src/assets/css'))
})

gulp.task('dist-sass-common', function () {
    return gulp.src([
        'src/assets/sass/common.+(scss|sass)'
    ])
        .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(cssnano())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/assets/css'))
})

gulp.task('prod-sass-common', function () {
    return gulp.src([
        'src/assets/sass/common.+(scss|sass)'
    ])
        .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(cssnano())
        .pipe(cleanCSS())
        .pipe(gulp.dest('prod/assets/css'))
})

/*
 * Обрабатываем все SASS стили
 */

gulp.task('dev-sass', ['dev-sass-common-screen', 'dev-sass-common'], function () {
    return gulp.src([
        'src/assets/css/common.min.css',
        'src/assets/css/common-screen.min.css'
    ])
        .pipe(browserSync.reload({ stream: true }))
})

gulp.task('prod-sass', ['prod-sass-common-screen', 'prod-sass-common'])

gulp.task('dist-sass', ['dist-sass-common-screen', 'dist-sass-common'])

/*
 * Обрабатываем стороние Css библиотеки
 */

gulp.task('css-libs', function () {
    return gulp.src('src/assets/cssLibs/**/*.css')
        .pipe(concat('libs.min.css'))
        .pipe(cssnano())
        .pipe(cleanCSS())
        .pipe(gulp.dest('src/assets/css'))
})

// ---- Pug ---- //

gulp.task('pug', function () {
    return gulp.src([
        'src/views/pages/page-*/*.+(pug|jade)',
        'src/views/pages/404/*.+(pug|jade)'
    ])
        .pipe(pug({ pretty: true }))// Читаемость и каскадность кода
        .pipe(rename({ dirname: '' })) // Вытаскиваем без папок
        .pipe(gulp.dest('src'))
})

// ---- PUG-PHP ---- //

gulp.task('pug-php', function () {
    return gulp.src([
        'src/views/pages/page-*/*.+(pug|jade)',
        'src/views/pages/404/*.+(pug|jade)'
    ])
        .pipe(pug({ pretty: true }))// Читаемость и каскадность кода
        .pipe(rename({ dirname: '', extname: '.php' })) // Вытаскиваем без папок
        .pipe(gulp.dest('src'))
})

// ---- Минимизация изображений ---- //

gulp.task('dist-imagemin', function () {
    return gulp.src([
        'src/assets/images/**/*'
    ])
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/assets/images'))
})

gulp.task('prod-imagemin', function () {
    return gulp.src([
        'src/assets/images/**/*'
    ])
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('prod/assets/images'))
})

// ------------------------------------------------------ //

// --- Отслеживание --- //

gulp.task('dev-watch', ['dev-sass', 'pug', 'dev-js', 'css-libs', 'browser-sync'], function () {
    gulp.watch(['src/assets/sass/**/*.+(scss|sass)', 'src/views/**/*.+(scss|sass)'], ['dev-sass'])
    gulp.watch(['src/views/**/*.+(pug|jade)'], ['pug'])
    gulp.watch(['src/assets/scripts/libs/**/*.js', 'src/assets/scripts/myLibs/**/*.js', 'src/views/**/*.js'], ['dev-js'])
    gulp.watch('src/assets/cssLibs/**/*.css', ['css-libs'])
    gulp.watch('src/*.html', browserSync.reload)
})

gulp.task('dev-watch-php', ['dev-sass', 'pug-php', 'dev-js', 'css-libs', 'browser-sync'], function () {
    gulp.watch(['src/assets/sass/**/*.+(scss|sass)', 'src/views/**/*.+(scss|sass)'], ['dev-sass'])
    gulp.watch(['src/views/**/*.+(pug|jade)'], ['pug'])
    gulp.watch(['src/assets/scripts/libs/**/*.js', 'src/assets/scripts/myLibs/**/*.js', 'src/views/**/*.js'], ['dev-js'])
    gulp.watch('src/assets/cssLibs/**/*.css', ['css-libs'])
    gulp.watch('src/*.html', browserSync.reload)
    gulp.watch('src/**/*.php', browserSync.reload)
})

// ------------------------------------------------------ //

// --- Deploy --- //

/*
 * Создаем папку dist
 */

gulp.task('dist-build', ['removedist', 'dist-imagemin', 'dist-sass', 'dist-js'], function () {
    var buildFiles = gulp.src([
        'src/*.html',
        'src/*.php',
        'src/.htaccess'
    ]).pipe(gulp.dest('dist'))

    var buildCss = gulp.src([
        'src/assets/css/common.min.css',
        'src/assets/css/common-screen.min.css'
    ])  .pipe(cleanCSS())
        .pipe(cssnano())
        .pipe(gulp.dest('dist/assets/css/'))

    var buildFonts = gulp.src([
        'src/assets/fonts/**/*'
    ]).pipe(gulp.dest('dist/assets/fonts/'))

    var buildPhp = gulp.src([
        'src/assets/php/**/*'
    ]).pipe(gulp.dest('dist/assets/php/'))
})
/*
 * Создаем папку prod - окончательная версия проекта
 */

gulp.task('prod-build', ['removeprod', 'prod-imagemin', 'prod-sass', 'prod-js'], function() {

    var buildFiles = gulp.src([
        'src/*.html',
        'src/*.php',
        'src/.htaccess'
    ]).pipe(gulp.dest('prod'))

    var buildCss = gulp.src([
        'src/assets/css/common.min.css',
        'src/assets/css/common-screen.min.css'
    ])  .pipe(cleanCSS())
        .pipe(cssnano())
        .pipe(gulp.dest('prod/assets/css/'))

    var buildFonts = gulp.src([
        'src/assets/fonts/**/*'
    ]).pipe(gulp.dest('prod/assets/fonts/'))

    var buildPhp = gulp.src([
        'src/assets/php/**/*'
    ]).pipe(gulp.dest('prod/assets/php/'))
})

// removes

gulp.task('removeprod', function () { return del.sync('prod') })
gulp.task('removedist', function () { return del.sync('dist') })
gulp.task('clearcache', function () { return cache.clearAll() })

// -- Делаем выборку компонентов для деплоя в коллекцию-- //

function GetText (AInputText) {
  const VRegExp = new RegExp(/[a-z-A-Z0-9]+$/)
  const VResult = AInputText.match(VRegExp)
  return VResult
}

const dirName = GetText(__dirname)

gulp.task('components-pug', function () {
  return gulp.src([
    'src/views/components/**/*.+(pug|jade)'
  ])
    .pipe(pug({ pretty: true }))// Читаемость и каскадность кода
    .pipe(rename({ dirname: '' })) // Вытаскиваем без папок
    .pipe(gulp.dest('components-bundle'))
})

gulp.task('components-bundle', function () {
  return gulp.src([
    'src/views/components/**/'
  ])
    .pipe(gulp.dest('components-bundle/' + dirName + '/src/'))
})

gulp.task('components-export', ['removeComponentsBundle', 'components-bundle'], function ()  {
  console.log(`Название папки с Бандлом ${dirName} - корневая дирректория`)
})

/*
 * Удаляем директоию с компонентами
 */

gulp.task('removeComponentsBundle', function () { return del.sync('components-bundle') })
