
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        watch: {
            scripts: {
                files: ['javascript/src/*.js'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        },
        // Import package manifest
        pkg: grunt.file.readJSON("silverstripe-all-in-one-page.json"),
        // Banner definitions
        meta: {
            banner: "/*\n" +
                    " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                    " *  <%= pkg.description %>\n" +
                    " *  <%= pkg.homepage %>\n" +
                    " *\n" +
                    " *  Made by <%= pkg.author.name %>\n" +
                    " *  Under <%= pkg.licenses[0].type %> License\n" +
                    " */\n"
        },
        // Concat definitions
        concat: {
            dist: {
                files: {
                    'javascript/dist/AllInOnePage.js': ['javascript/src/HashSearch.js', 'javascript/src/AllInOnePage.js']
                }
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },
        // Lint definitions
        jshint: {
            src: ['javascript/src/HashSearch.js', 'javascript/src/AllInOnePage.js'],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        // Minify definitions
        uglify: {
            my_target: {
                files: {
                    'javascript/dist/AllInOnePage.min.js': ['javascript/dist/AllInOnePage.js']
                }
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["jshint", "concat", "uglify"]);
    grunt.registerTask("travis", ["jshint"]);

};
