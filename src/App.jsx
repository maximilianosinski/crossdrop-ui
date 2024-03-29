import { useAsync } from "react-async";
import ActionHandler from "./classes/ActionHandler.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faFile, faLink, faPaperPlane, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

const getDevice = async () => {
    return await ActionHandler.searchDevice();
}

const App = () => {
    window.actionHandler = ActionHandler;
    const { data, error, isPending } = useAsync({ promiseFn: getDevice });
    const [fileName, setFileName] = useState("");
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState("-1");
    const [currentFileName, setCurrentFileName] = useState("");
    const [connecting, setConnecting] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const [ipInput, setIpInput] = useState("");
    window.setProgress = setProgress;
    window.setCurrentFileName = setCurrentFileName;

    if(error) {
        return (
            <div>{error.message}</div>
        )
    }

    const handleCustomConnect = () => {
        setConnecting(true);
        ActionHandler.customConnect(ipInput).then();
    }

    if(isPending) {
        return (
            <div className={"flex flex-col items-center justify-center h-screen"}>
                <div className={"flex flex-row items-center text-2xl font-bold"}>
                    <FontAwesomeIcon className={"mr-3"} icon={faSpinner} spin/>
                    <h1>Searching for device...</h1>
                </div>
                <p className={"text-xs my-2"}>Your destination device must have ChunkDrop open to be found.</p>
                <button onClick={() => setShowCustom(!showCustom)} className={"flex flex-row items-center mt-20"}>
                    <p className={"text-gray-500 font-bold animate-pulse"}>Not connecting?</p>
                    <FontAwesomeIcon className={"ml-2 text-blue-500"} icon={faCircleInfo}/>
                </button>
                {showCustom &&
                    <div className={"flex flex-row items-center mt-3"}>
                        <input disabled={connecting} value={ipInput} onChange={(e) => setIpInput(e.target.value)} className={"mr-2 outline-none ring-blue-500 duration-200 hover:border-transparent hover:ring-2 bg-gray-100 border-2 border-gray-300 rounded-lg py-1.5 px-2 font-bold text-sm"} placeholder={"IP Address"}/>
                        <button disabled={connecting} onClick={() => handleCustomConnect()} className={"flex flex-row duration-200 hover:ring-2 ring-blue-500/50 items-center text-white bg-blue-500 rounded-lg text-sm font-bold py-2 px-2"}>
                            {connecting && <FontAwesomeIcon className={"mr-1.5"} icon={faSpinner} spin/>}
                            Connect
                        </button>
                    </div>
                }
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
            new Promise(r => setTimeout(r, 4000)).then(() => {
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
                    <FontAwesomeIcon icon={faLink}/>
                </div>
                <div className={"fixed top-0 left-0 flex flex-col items-center justify-center h-screen w-full"}>
                    <h3 className={"text-2xl font-bold mb-5"}>Drop &amp; Go!</h3>
                    {fileName === "" ?
                        <button onClick={() => handleFileSelection()} className={"w-32 h-32 shadow-black/10 shadow-md hover:shadow-xl hover:shadow-blue-500/50 rounded-full text-blue-500 text-3xl duration-150"}>
                            <FontAwesomeIcon icon={faFile}/>
                        </button>
                        :
                        <button disabled={sending} onClick={() => handleSending()} className={"w-32 h-32 shadow-black/10 shadow-md enabled:hover:shadow-xl enabled:hover:shadow-blue-500/50 rounded-full text-blue-500 text-3xl duration-150"}>
                            {sending ? <FontAwesomeIcon icon={faPaperPlane} beatFade/> : <FontAwesomeIcon icon={faPaperPlane} shake/>}
                        </button>
                    }
                    {fileName !== "" &&
                        <div className={"flex flex-col"}>
                            <div className={"mt-5 flex flex-row items-center"}>
                                <span className={"truncate max-w-xs text-gray-300 font-bold"}>{fileName}</span>
                                <span className={"text-blue-500 font-bold"}>&nbsp;{sending ? "is being sent." : "is ready to send."}</span>
                            </div>
                        </div>
                    }
                </div>
                {currentFileName !== "" && progress > -1 &&
                    <div className={"fixed bottom-0 left-0 w-full px-10 flex flex-col items-center mb-14"}>
                        <div className={"flex flex-col h-full w-full justify-between px-5 py-3 rounded-lg shadow-blue-500/50 shadow-xl"}>
                            <div className={"flex flex-row items-center"}>
                                <FontAwesomeIcon className={"mr-3"} icon={faSpinner} spin/>
                                <div className={"flex flex-col"}>
                                    <h3 className={"font-bold text-sm"}>Receiving file...</h3>
                                    <span className={"font-bold text-xs text-gray-400"}>{currentFileName}</span>
                                </div>
                            </div>
                            {false &&
                                <div className={"flex flex-col"}>
                                    <span className={"font-bold mb-2"}>{Math.round(parseFloat(progress))}%</span>
                                    <div className={"bg-gray-300 w-full h-1 rounded-full"}>
                                        <div style={{width: `${progress}%`}} className={"bg-blue-500 h-full rounded-full"}></div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }


}
export default App