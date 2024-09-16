export const successResponse = (data) => {
    return {
        success: true,
        message: null,
        data,
    }
}

export const errorResponse = (message) => {
    return {
        success: false,
        message,
        data: null,
    }
}