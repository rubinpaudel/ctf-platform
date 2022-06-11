import { existsSync, fstat } from "fs";
import { UPLOADS_PATH } from "../../consts"
import fs from 'fs'
const decompress = require('decompress');

const decompressTar = require('decompress-tar');


export const isValidDockerAttachment = (File : Express.Multer.File) : Promise<boolean> => {


    return new Promise<boolean>((resolve, reject) => {
        
        // Check if the given file is tar type
        const fileExt = File.filename.split('.')[1];
        if (fileExt != 'tar') resolve(false);
    
    
        // Check if the given tar file has a Dockerfile
        // Decompress the file first 
        const decompressPath = UPLOADS_PATH + '/decompress-dist';
        decompress(File.path, decompressPath, {PluginArray : [decompressTar()]})
        .then(() => {
    
            // Check if the Docker file exists
            const DockerFilePath = decompressPath + '/Dockerfile';
    
            const isValid = existsSync(DockerFilePath)
    
            // Remove the unzipped files
            fs.rmSync(decompressPath, {recursive : true, force: true});
    
            resolve(isValid);
        })
        .catch((err) => {
            
            if (existsSync(decompressPath))
                fs.rmSync(decompressPath, {recursive : true, force: true});
            throw err;
        })
    })


}