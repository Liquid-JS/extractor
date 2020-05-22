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
                format: 'umd',
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

                    const l = code.trim()
                    const pos = l.match(/[a-zA-Z]+\.([a-zA-Z]+(=[a-zA-Z]+\(\)\)))$/)

                    const i = code.indexOf(pos[0])

                    ms.overwrite(
                        i,
                        i + pos[0].length - pos[2].length,
                        pos[0].substr(0, pos[0].length - pos[1].length) + 'serializeWithStyles'
                    )

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
