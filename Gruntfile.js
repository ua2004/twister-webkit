'use strict';

module.exports = function (grunt) {

    grunt.util.linefeed = '\n';

    // Platforms
    var inputPlatforms = (grunt.cli.tasks.length === 1 && ['win','nsis','mac','linux32','linux64'].indexOf(grunt.cli.tasks[0]) !== -1)
            ? grunt.cli.tasks[0] : 'all',
        buildPlatforms = {
            mac: /mac|all/.test(inputPlatforms),
            win: /win|nsis|all/.test(inputPlatforms),
            linux32: /linux32|all/.test(inputPlatforms),
            linux64: /linux64|all/.test(inputPlatforms)
        };

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        app: grunt.file.readJSON('app/package.json'),
        twister_win_ia32_url: 'https://dl.dropboxusercontent.com/s/5hwve6gxncnli4g/twister-0.9.22-win32.zip',
        twister_mac_x64_url: 'http://twisterd.net/osx_bin.zip',
        nsis_path: process.platform === 'win32' ? (process.arch === 'x64' ? '%ProgramFiles(x86)%' : '%ProgramFiles%') + '\\NSIS\\' : '',

        // Task configuration.
        clean: {
            webkit: ['build'],
            nsis: ['build-win/source/**/*', 'build-win/*.exe']
        },
        copy: {
            app: {
                files: [
                    {
                        cwd: 'app/',
                        src: ['**'],
                        dest: 'build/source/',
                        expand: true
                    }
                ]
            },
            theme_default: {
                files: [
                    {
                        cwd: 'build/themes/twister-html-master',
                        src: ['**'],
                        dest: 'build/releases/twister/win/twister/html/default/',
                        expand: true
                    },
                    {
                        cwd: 'build/themes/twister-html-master',
                        src: ['**'],
                        dest: 'build/releases/twister/mac/twister.app/Contents/Resources/html/default/',
                        expand: true
                    },
                    {
                        cwd: 'build/themes/twister-html-master',
                        src: ['**'],
                        dest: 'build/releases/twister/linux32/twister/html/default/',
                        expand: true
                    },
                    {
                        cwd: 'build/themes/twister-html-master',
                        src: ['**'],
                        dest: 'build/releases/twister/linux64/twister/html/default/',
                        expand: true
                    }
                ]
            },
            theme_calm: {
                files: [
                    {
                        cwd: 'build/themes/twister-calm-master',
                        src: ['**'],
                        dest: 'build/releases/twister/win/twister/html/calm/',
                        expand: true
                    },
                    {
                        cwd: 'build/themes/twister-calm-master',
                        src: ['**'],
                        dest: 'build/releases/twister/mac/twister.app/Contents/Resources/html/calm/',
                        expand: true
                    },
                    {
                        cwd: 'build/themes/twister-calm-master',
                        src: ['**'],
                        dest: 'build/releases/twister/linux32/twister/html/calm/',
                        expand: true
                    },
                    {
                        cwd: 'build/themes/twister-calm-master',
                        src: ['**'],
                        dest: 'build/releases/twister/linux64/twister/html/calm/',
                        expand: true
                    }
                ]
            },
            empty: {
                files: {
                    'build/releases/twister/win/twister/html/': 'empty.html',
                    'build/releases/twister/mac/twister.app/Contents/Resources/html/': 'empty.html',
                    'build/releases/twister/linux32/twister/html/': 'empty.html',
                    'build/releases/twister/linux64/twister/html/': 'empty.html'
                }
            },
            twister_osx_x64: {
                files: [
                    {
                        cwd: 'build/download/twister-osx-bundle/bin',
                        src: ['**'],
                        dest: 'build/releases/twister/mac/twister.app/Contents/Resources/bin/',
                        mode: 777, // =c777
                        expand: true
                    }
                    ]
            },        
            nsis: {
                files: [
                    {
                        cwd: 'build/releases/twister/win/twister/',
                        src: ['**'],
                        dest: 'build-win/source',
                        expand: true
                    },
                    {
                        cwd: 'build/themes/twister-html-master',
                        src: ['**'],
                        dest: 'build-win/source/html/default/',
                        expand: true
                    },
                    {
                        cwd: 'build/themes/twister-calm-master',
                        src: ['**'],
                        dest: 'build-win/source/html/calm/',
                        expand: true
                    },
                    {
                        cwd: 'build/twister-win32-bundle/',
                        src: ['twisterd.exe', '*.dll'],
                        dest: 'build-win/source/bin',
                        expand: true
                    }
                ]
            }
        },
        nodewebkit: {
            src: ['build/source/**/*'],
            options: {
                build_dir: 'build',
                version: '0.9.2',
                win: buildPlatforms.win,
                mac: buildPlatforms.mac,
                linux32: buildPlatforms.linux32,
                linux64: buildPlatforms.linux64,
                credits: 'build-mac/credits.html',
                mac_icns: 'build-mac/nw.icns'
            }
        },
        compress: {
            twister_win_ia32: {
                options: {
                    archive: 'build/twister_win_ia32.zip',
                    pretty: true
                },
                files: [
                    {
                        cwd: 'build/releases/twister/win/twister',
                        src: ['**'],
                        expand: true
                    }
                ]
            },
            twister_osx_x64: {
                options: {
                    archive: 'build/twister_osx_x64.tar.gz',
                    pretty: true
                },
                files: [
                    {
                        cwd: 'build/releases/twister/mac/',
                        src: ['**'],
                        mode: 484, // = 0744
                        expand: true
                    },
                    {
                        cwd: 'build-mac/',
                        src: ['build-twister.sh'],
                        mode: 484, // = 0744
                        expand: true
                    }
                ]
            },
            twister_linux_ia32: {
                options: {
                    archive: 'build/twister_linux_ia32.tar.gz',
                    pretty: true
                },
                files: [
                    {
                        cwd: 'build/releases/twister/linux32/',
                        src: ['twister/html/**', 'twister/nw.pak', 'twister/libffmpegsumo.so'],
                        expand: true
                    },
                    {
                        cwd: 'build/releases/twister/linux32/',
                        src: ['twister/twister'],
                        mode: 484, // = 0744
                        expand: true
                    },
                    {
                        cwd: 'build-linux/',
                        src: ['twister.sh', 'build-twister.sh'],
                        dest: 'twister/',
                        mode: 484, // = 0744
                        expand: true
                    },
                    {
                        cwd: 'build-linux/',
                        src: ['*.png'],
                        dest: 'twister/',
                        expand: true
                    }
                ]
            },
            twister_linux_x64: {
                options: {
                    archive: 'build/twister_linux_x64.tar.gz',
                    pretty: true
                },
                files: [
                    {
                        cwd: 'build/releases/twister/linux64/',
                        src: ['twister/html/**', 'twister/nw.pak', 'twister/libffmpegsumo.so'],
                        expand: true
                    },
                    {
                        cwd: 'build/releases/twister/linux64/',
                        src: ['twister/twister'],
                        mode: 484, // = 0744
                        expand: true
                    },
                    {
                        cwd: 'build-linux/',
                        src: ['twister.sh', 'build-twister.sh'],
                        dest: 'twister/',
                        mode: 484, // = 0744
                        expand: true
                    },
                    {
                        cwd: 'build-linux/',
                        src: ['*.png'],
                        dest: 'twister/',
                        expand: true
                    }
                ]
            }
        },
        curl: {
            twister_theme_default: {
                files: {
                    'build/download/twister-theme-default.zip': 'https://codeload.github.com/miguelfreitas/twister-html/zip/master'
                }
            },
            twister_theme_calm: {
                files: {
                    'build/download/twister-theme-calm.zip': 'https://codeload.github.com/iHedgehog/twister-calm/zip/master'
                }
            },
            twister_win_ia32: {
                src: '<%= twister_win_ia32_url %>',
                dest: 'build/download/twister-win32-bundle.zip'
            },
            twister_osx_x64: {
                src: '<%= twister_mac_x64_url %>',
                dest: 'build/download/twister-osx-bundle.zip'
            },
        },
        unzip: {
            twister_default: {
                src: 'build/download/twister-theme-default.zip',
                dest: 'build/themes'
            },
            twister_calm: {
                src: 'build/download/twister-theme-calm.zip',
                dest: 'build/themes'
            },
            twister_win_ia32: {
                src: 'build/download/twister-win32-bundle.zip',
                dest: 'build/twister-win32-bundle'
            },
            twister_osx_x64: {
                src: 'build/download/twister-osx-bundle.zip',
                dest: 'build/download/twister-osx-bundle'
            }
        },
        exec: {
            nsis: {
                cwd: 'build-win',
                command: '"<%= nsis_path %>makensis" /DVersion="<%= app.version %>" setup.nsi'
            }
        }
    });

    grunt.log.ok('Twister-Webkit ver. ' + grunt.config('app.version'));

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task.
    grunt.registerTask('default', [
        'copy:app',
        'nodewebkit',
        'curl:twister_theme_default',
        'curl:twister_theme_calm',
        'curl:twister_win_ia32',
        'curl:twister_osx_x64',
        'unzip:twister_default',
        'unzip:twister_calm',
        'unzip:twister_win_ia32',
        'unzip:twister_osx_x64',
        'copy:twister_osx_x64',
        'copy:theme_default',
        'copy:theme_calm',
        'copy:empty',
        'compress'
    ]);
    // Win32
    grunt.registerTask('win', [
        'copy:app',
        'nodewebkit',
        'curl:twister_theme_default',
        'curl:twister_theme_calm',
        'curl:twister_win_ia32',
        'unzip:twister_default',
        'unzip:twister_calm',
        'unzip:twister_win_ia32',
        'copy:theme_default',
        'copy:theme_calm',
        'copy:empty',
        'compress:twister_win_ia32'
    ]);
    // Mac OSX
    grunt.registerTask('mac', [
        'copy:app',
        'nodewebkit',
        'curl:twister_theme_default',
        'curl:twister_theme_calm',
        'curl:twister_osx_x64',
        'unzip:twister_default',
        'unzip:twister_calm',
        'unzip:twister_osx_x64',
        'copy:twister_osx_x64',
        'copy:theme_default',
        'copy:theme_calm',
        'copy:empty',
        'compress:twister_osx_x64'
    ]);
    // Linux32
    grunt.registerTask('linux32', [
        'copy:app',
        'nodewebkit',
        'curl:twister_theme_default',
        'curl:twister_theme_calm',
        'unzip:twister_default',
        'unzip:twister_calm',
        'copy:theme_default',
        'copy:theme_calm',
        'copy:empty',
        'compress:twister_linux_ia32'
    ]);
    // Linux64
    grunt.registerTask('linux64', [
        'copy:app',
        'nodewebkit',
        'curl:twister_theme_default',
        'curl:twister_theme_calm',
        'unzip:twister_default',
        'unzip:twister_calm',
        'copy:theme_default',
        'copy:theme_calm',
        'copy:empty',
        'compress:twister_linux_x64'
    ]);
    // Win32 - NSIS
    grunt.registerTask('nsis', [
        'win',
//        'curl:twister_win_ia32',
//        'unzip:twister_win_ia32',
        'copy:nsis',
        'exec:nsis'
    ]);
    //grunt.registerTask('nsis', ['clean']); // just a note that clean task exists

};
