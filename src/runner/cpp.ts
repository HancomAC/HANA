import { JudgeRequest } from '../types/request'
import { execute, getLimitString } from './util'
import commonJudge from './common'

export default function (data: JudgeRequest) {
    return commonJudge(
        data,
        (path) =>
            execute(
                `p-${data.uid}`,
                getLimitString(
                    { cpuLimit: 50 },
                    `g++ ${path}/Main.cpp -o ${path}/Main -O2 -Wall -lm --static -pipe -std=c++17 -DONLINE_JUDGE`
                )
            ),
        (path) => path + '/Main'
    )
}
