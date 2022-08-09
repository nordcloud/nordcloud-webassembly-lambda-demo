package main

import (
	"os"
)

/*
type Message struct {
	Message string `json:"message"`
}
type Response struct {
	StatusCode int    `json:"statusCode"`
	Body       string `json:"body"`
}
*/

func main() {
	/*
			message := Message{
				Message: "Hello world from Go application!",
			}
			messageData, err := json.Marshal(message)
		response := Response{
			StatusCode: 200,
			Body:       string(messageData),
		}
		data, err := json.Marshal(response)
		if err != nil {
			fmt.Println("Error:", err)
		}
	*/
	// Marshaling doesn't work in TinyGo / WebAssembly / WASI so we use a string constant for now.
	data := []byte(`{"statusCode": 200, "headers": { "Content-Type": "application/json" }, "body": "{ \"message\": \"Hello world from Go application!\" }"}`)
	os.Stdout.Write(data)
}
