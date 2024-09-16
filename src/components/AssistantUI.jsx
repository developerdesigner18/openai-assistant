import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { createMessage, createRun, getMessages, getRun } from "../services/assistantServices";

const thread_id = import.meta.env.VITE_THREAD_ID;
const assistant_id = import.meta.env.VITE_ASSISTANT_ID;

const AssistantUI = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [scrollToLastMessage, setScrollToLastMessage] = useState(false);
    const [messageLoading, setMessageLoading] = useState(true);
    const messageEndRef = useRef(null);
    let run_id;

    const getMessagesHandler = async () => {
        // console.log("inside getMessagesHandler");

        if (!thread_id) {
            setMessageLoading(false);
            return;
        }

        // console.log("getting messages");

        const getMessagesResponse = await getMessages(thread_id);
        if (!getMessagesResponse.success) {
            console.log(getMessagesResponse.message);
            setMessageLoading(false);
            return;
        }

        // console.log("updating messages");
        const messages = getMessagesResponse.data.data;
        setMessages(messages.reverse());
        setScrollToLastMessage(true);
        setMessageLoading(false);
    }

    const checkForResponse = async () => {

        // console.log("inside checkForResponse");

        if (!run_id) {
            setMessageLoading(false);
            return;
        }

        let intervalId;
        intervalId = setInterval(async () => {
            const getRunResponse = await getRun(thread_id, run_id);
            if (!getRunResponse.success) {
                console.log(getRunResponse.message);
                setMessageLoading(false);
                clearInterval(intervalId);
                return;
            }

            const run = getRunResponse.data;

            if (run.status === "completed") {
                setMessageLoading(false);
                clearInterval(intervalId);
                getMessagesHandler();
                return;
            }

            if (run.status.t === "failed" || run.status === "cancelled" || run.status === "aborted") {
                setMessageLoading(false);
                clearInterval(intervalId);
                return;
            }
        }, 1000 * 2);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!thread_id || !input?.trim()) return;

        // console.log("creating message");
        setMessageLoading(true);
        const createMessageResponse = await createMessage(thread_id, input);

        if (!createMessageResponse.success) {
            console.log(createMessageResponse.message);
            setMessageLoading(false);
            return;
        }

        const message = createMessageResponse.data;
        setMessages((prev) => prev = [...prev, message]);
        setInput("");
        setScrollToLastMessage(true);

        // console.log("creating run");
        const createRunResponse = await createRun(thread_id, assistant_id);

        if (!createRunResponse.success) {
            console.log(createRunResponse.message);
            setMessageLoading(false);
            return;
        }

        // console.log("run created");

        const run = createRunResponse.data;
        run_id = run.id;

        checkForResponse();
    };

    useEffect(() => {
        if (scrollToLastMessage) {
            messageEndRef.current?.scrollIntoView({
                behavior: "smooth",
            })

            setScrollToLastMessage(false);
        }
    }, [scrollToLastMessage])

    useEffect(() => {
        getMessagesHandler();
    }, [])

    return (
        <div className="flex flex-col w-full h-full bg-gray-100 border">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-4 p-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div
                            className={`inline-block px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                        >

                            <ReactMarkdown>{message?.content?.[0]?.text?.value}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef}></div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
                <textarea
                    className="w-full p-2 border rounded-md resize-none disabled:cursor-default disabled:bg-gray-100"
                    placeholder="Type your message..."
                    rows="3"
                    disabled={messageLoading}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:cursor-default disabled:bg-gray-400"
                    type="submit"
                    disabled={messageLoading}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default AssistantUI;
