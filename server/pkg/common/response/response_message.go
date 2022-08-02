package response

type ResponseMessage struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func SuccessMsg(data interface{}) *ResponseMessage {
	msg := &ResponseMessage{
		Message: "OK",
		Data:    data,
	}
	return msg
}

func FailureMsg(msg string) *ResponseMessage {
	msgObj := &ResponseMessage{
		Message: msg,
	}
	return msgObj
}

func FailureCodeMsg(code int, msg string) *ResponseMessage {
	msgObj := &ResponseMessage{
		Message: msg,
	}
	return msgObj
}
