import { JudgeSourceType, JudgeType } from '../../types/request'

export function build(
    path: string,
    uid: string,
    sourceName: string = 'Main'
) {
    return `ruby -c ${path}`
}

export function getExecuteCommand(
    path: string,
    uid: string,
    sourceName: string = 'Main'
) {
    return `ruby ${path}/${sourceName}.${getExtension()}`
}

export function getLanguage() {
    return JudgeSourceType.RUBY
}

export function getExtension() {
    return 'rb'
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
