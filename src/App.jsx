import { useAsync } from "react-async";
import ActionHandler from "./classes/ActionHandler.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile, faPaperPlane, faSpinner, faWifi} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

const getDevice = async () => {
    return await ActionHandler.searchDevice();
}

const App = () => {
    window.actionHandler = ActionHandler;
    const { data, error, isPending } = useAsync({ promiseFn: getDevice });
    const [fileName, setFileName] = useState("");
    const [sending, setSending] = useState(false);

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

    const handleFileSelection = () => {
        ActionHandler.selectFile().then(name => {
            setFileName(name);
        });
    }

    const handleSending = () => {
        setSending(true);

        ActionHandler.sendFile().then(() => {
            new Promise(r => setTimeout(r, 2000)).then(() => {
                setSending(false);
                setFileName("");
            });
        });
    }

    if(data) {
        return (
            <div className={"flex flex-col m-10"}>
                <h2 className={"font-bold text-xs"}>CrossDrop</h2>
                <div className={"flex flex-row items-center"}>
                    <h1 className={"text-2xl font-bold mr-3"}>Connected</h1>
                    <FontAwesomeIcon icon={faWifi}/>
                </div>
                <p className={"text-sm font-bold text-gray-500"}>{data.ipAddress}</p>
                <div className={"fixed top-0 left-0 flex flex-col items-center justify-center h-screen w-full"}>
                    <h3 className={"text-2xl font-bold mb-5"}>Drop &amp; Go!</h3>
                    <button onClick={() => handleFileSelection()} className={"w-32 h-32 shadow-black/10 shadow-md hover:shadow-xl hover:shadow-blue-400/50 rounded-full text-blue-400 text-3xl duration-150"}>
                        <FontAwesomeIcon icon={faFile}/>
                    </button>
                    {fileName !== "" &&
                        <div className={"flex flex-col"}>
                            <div className={"mt-5 flex flex-row items-center"}>
                                <span className={"truncate max-w-xs text-gray-300 font-bold"}>{fileName}</span>
                                <span className={"text-blue-400 font-bold"}>&nbsp;ready to send.</span>
                            </div>
                            <button onClick={() => handleSending()} disabled={sending} className={"mt-3 duration-200 shadow-black/10 shadow-md rounded-full py-1 hover:text-blue-400"}>
                                {sending ? <FontAwesomeIcon className={"mr-2"} icon={faPaperPlane} beat/> : <FontAwesomeIcon icon={faPaperPlane} fade/>}
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    }


}
export default App