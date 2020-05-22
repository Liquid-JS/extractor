import compiler from '@ampproject/rollup-plugin-closure-compiler'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import MagicString from 'magic-string'
import { terser } from 'rollup-plugin-terser'

export default [
    {
        input: 'dist/index.js',
        output: [
            {
                format: 'iife',
                file: 'dist/bundle.js',
                name: 'serializeWithStyles'
            }
        ],
        plugins: [
            commonjs(),
            nodeResolve(),
            compiler({
                compilation_level: 'ADVANCED',
                language_in: 'ECMASCRIPT_2018',
                language_out: 'ECMASCRIPT_2015'
            }),
            {
                name: 'insert',
                async renderChunk(code, chunk, options) {
                    const ms = new MagicString(code)

                    const pos = code.indexOf('var serializeWithStyles')
                    ms.overwrite(pos, pos + 23, 'window.serializeWithStyles')

                    return {
                        code: ms.toString(),
                        map: ms.generateMap()
                    }
                }
            },
            terser()
        ]
    }
]
