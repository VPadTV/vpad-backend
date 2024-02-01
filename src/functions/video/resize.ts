import {SmartStream} from "@infra/gateways";
import ffmpeg from "fluent-ffmpeg";

export const resize = (width: string, originalStream: SmartStream): Promise<SmartStream> => {
    return new Promise((res) => {
        ffmpeg(originalStream)
            .size(`${width}x?`)
            .output(originalStream, {end: true})
            .on("end", () => {
                res(originalStream)
        }).run();
    })
}