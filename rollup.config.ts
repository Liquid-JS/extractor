import compiler from '@liquid-js/rollup-plugin-closure-compiler'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { RollupOptions } from 'rollup'

export default new Array<RollupOptions>({
    input: 'src/index.ts',
    output: {
        dir: './lib',
        format: 'esm'
    },
    plugins: [
        typescript({
            declaration: true,
            declarationDir: './lib/',
            inlineSources: true,
            tsconfig: 'tsconfig.lib.json'
        }),
        compiler({
            language_in: 'ECMASCRIPT_2020',
            language_out: 'ECMASCRIPT_2020',
            compilation_level: 'ADVANCED_OPTIMIZATIONS'
        }),
        terser()
    ]
})
