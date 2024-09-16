import axiosClient from "../utils/axiosClient";
import { errorResponse, successResponse } from "../utils/responseWrapper";

export const createThread = async () => {
    try {

        const create_thread_url = `/threads/`;
        const response = await axiosClient.post(create_thread_url);
        console.log("create thread response", response.data);
        return successResponse(response.data);
    } catch (error) {
        const errorMessage = "error occurred while creating thread";
        console.log(errorMessage, error);
        return errorResponse(errorMessage);
    }
}

export const createMessage = async (thread_id, content) => {
    try {

        const create_message_url = `/threads/${thread_id}/messages`
        const create_message_body = {
            role: "user",
            content
        }

        const response = await axiosClient.post(create_message_url, create_message_body)
        console.log("create message response", response.data);
        return successResponse(response.data);
    } catch (error) {
        const errorMessage = "error occurred while creating message";
        console.log(errorMessage, error);
        return errorResponse(errorMessage);
    }
}

export const createRun = async (thread_id, assistant_id) => {
    try {

        const create_run_url = `threads/${thread_id}/runs`;
        const create_run_body = {
            assistant_id
        }

        const response = await axiosClient.post(create_run_url, create_run_body);
        console.log("create run response", response.data);
        return successResponse(response.data);

    } catch (error) {
        const errorMessage = "error occurred while creating run";
        console.log(errorMessage, error);
        return errorResponse(errorMessage);
    }
}

export const getRun = async (thread_id, run_id) => {
    try {

        const get_run_url = `/threads/${thread_id}/runs/${run_id}`;
        const response = await axiosClient.get(get_run_url);
        console.log("get run response", response.data);
        return successResponse(response.data);

    } catch (error) {
        const errorMessage = "error occurred while getting run";
        console.log(errorMessage, error);
        return errorResponse(errorMessage);
    }
}

export const getMessages = async (thread_id) => {
    try {

        const get_messages_url = `/threads/${thread_id}/messages`;
        const response = await axiosClient.get(get_messages_url);
        console.log("get messages response", response.data);
        return successResponse(response.data);

    } catch (error) {
        const errorMessage = "error occurred while getting messages";
        console.log(errorMessage, error);
        return errorResponse(errorMessage);
    }
}