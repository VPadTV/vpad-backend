import ffmpeg from "fluent-ffmpeg";
import {SmartStream} from "@infra/gateways";
import { Readable, Transform } from "stream";
import {PostCreateRequest} from "@functions/post/create";

// convert uploaded file to mp4
export const convert = (req: PostCreateRequest): Promise<Readable> => {
    /*    */
    if (req.media.mimetype.startsWith("video")) {
        let rs = new Transform();
        let buf: Buffer[] = [];
        rs.on("data", (chunk) => {
            buf.push(chunk)
        })
        return new Promise((res) => {
            ffmpeg(Readable.from(Transform.from(req.media.buffer)))
                .outputFormat("mp4")
                .audioChannels(2)
                .size("1920x?")
                .on("end",
                    () => {
                        console.log("read finished !")
                            res(Readable.from(buf))
                    })
                .output(rs).run()

        })
    } else {
        return new Promise(res => {
            res(SmartStream.from(req.media.buffer))
        })
    }
}