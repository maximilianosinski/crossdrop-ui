import { useAsync } from "react-async";
import ActionHandler from "./classes/ActionHandler.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

const getDevice = async () => {
    return await ActionHandler.searchDevice();
}

const App = () => {
    const { data, error, isPending } = useAsync({promiseFn: getDevice });

    if(error) {
        return (
            <div>{error.message}</div>
        )
    }

    if(isPending) {
        return (
            <div className={"flex flex-col items-center justify-center h-screen"}>
                <div className={"flex flex-row items-center text-2xl font-bold"}>
                    <FontAwesomeIcon className={"mr-3"} icon={faSpinner} spin/>
                    <h1>Searching for device...</h1>
                </div>
                <p className={"text-xs my-2"}>Your destination device must have ChunkDrop open to be found.</p>
            </div>
        )
    }
    if(data) {
        return (
            <div>
                Found device! {data}
            </div>
        )
    }


}
export default App