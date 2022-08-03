// WebAssembly AssemblyScript demo
import "wasi"

console.log("{")
console.log("  \"statusCode\": \"200\",")
console.log("  \"headers\": {")
console.log("    \"Content-Type\":\"application/json\"")
console.log("  },")
console.log("  \"body\": \"{ \\\"message\\\": \\\"Hello world from AssemblyScript application!\\\" }\"")
console.log("}")
