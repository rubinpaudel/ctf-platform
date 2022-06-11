import { CTFDataSource } from "./dataSource";

export const CleanAll = async () => {

    try {
        // Clear All Attempts
        await CTFDataSource.dropDatabase();
        await CTFDataSource.synchronize();
        
    } catch (err) {
        console.log(err)
        throw new Error(`Failed to clear database: ${err}`);
    }


}