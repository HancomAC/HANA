import {
    CommonDataSet,
    JudgeRequest,
    JudgeSourceType,
    JudgeType,
    OutputOnly,
} from '../types/request'

import judgeText from './text'
import judgeCPP from './cpp'
import { JudgeResult } from '../types/response'
import { spawn } from 'child_process'

export const enum ResultType {
    normal,
    timeLimitExceeded,
    stdioError,
}

export function execute(
    userName: string,
    exePath: string,
    input?: string,
    timeout?: number
) {
    return new Promise<{
        resultType: ResultType
        code: number
        stdout: string
        stderr: string
    }>((resolve) => {
        const child = spawn(`su`, [userName, '-c', exePath], {
            stdio: ['pipe', 'pipe', 'pipe'],
        })
        child.stdin.on('error', (err) => {
            resolve({
                resultType: ResultType.stdioError,
                code: -1,
                stdout: '',
                stderr: '',
            })
        })
        child.on('error', (err) => {
            resolve({
                resultType: ResultType.stdioError,
                code: -1,
                stdout: '',
                stderr: '',
            })
        })

        let timeHandler: NodeJS.Timeout
        if (timeout)
            timeHandler = setTimeout(() => {
                child.kill()
                resolve({
                    resultType: ResultType.timeLimitExceeded,
                    code: -1,
                    stdout: '',
                    stderr: 'Time Limit Exceed',
                })
            }, timeout)

        child.stdin.write(input || '')
        child.stdin.end()

        let stdout = '',
            stderr = ''

        child.stdout.on('data', (data: any) => {
            stdout += data
        })

        child.stderr.on('data', (data: any) => {
            stderr += data
        })

        child.on('close', (code) => {
            if (timeHandler) clearTimeout(timeHandler)
            resolve({
                resultType: ResultType.normal,
                code: code || 0,
                stdout,
                stderr,
            })
        })
    })
}

export function isSame(in1: string, in2: string): boolean {
    let res1 = in1
            .split('\n')
            .map((str) => str.trimEnd())
            .filter((x) => x),
        res2 = in2
            .split('\n')
            .map((str) => str.trimEnd())
            .filter((x) => x)
    return res1.length === res2.length && res1.every((x, i) => x === res2[i])
}

export default function (data: JudgeRequest): Promise<JudgeResult> {
    switch (data.judgeType) {
        case JudgeType.OutputOnly:
            return judgeText(
                data as JudgeRequest<
                    JudgeType.OutputOnly,
                    JudgeSourceType.TEXT,
                    OutputOnly
                >
            )
        case JudgeType.CommonJudge:
            switch (data.language) {
                case JudgeSourceType.CPP:
                    return judgeCPP(
                        data as JudgeRequest<
                            JudgeType.CommonJudge,
                            JudgeSourceType.CPP,
                            CommonDataSet
                        >
                    )
            }
    }
    return Promise.resolve({
        uid: data.uid,
        result: Array(data.dataSet.data.length).fill(false),
        reason: 'CE',
        time: 0,
        memory: 0,
    })
}
