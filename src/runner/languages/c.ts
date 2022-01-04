import { JudgeRequest, JudgeSourceType, JudgeType } from '../../types/request'
import { execute, getLimitString } from '../util'
import commonJudge from '../common'

export function build(path: string, uid: string) {
    return execute(
        `p-${uid}`,
        getLimitString(
            { cpuLimit: 50 },
            `gcc Main.c -o Main -O2 -Wall -lm --static -std=c99 -DONLINE_JUDGE`
        ),
        { cwd: path }
    )
}

export function getExecuteCommand(path: string, uid: string) {
    return path + '/Main'
}

export function getLanguage() {
    return JudgeSourceType.C
}

export function getSupportedType() {
    return [
        JudgeType.CommonJudge,
        JudgeType.Interactive,
        JudgeType.SpecialJudge,
    ]
}

export function getTimeLimit(baseTime: number) {
    return baseTime
}

export function getMemoryLimit(baseMemory: number) {
    return baseMemory
}
