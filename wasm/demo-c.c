/* WebAssembly C demo */
#include <stdlib.h>
#include <stdio.h>

int main() {
    printf("{\n");
    printf("  \"statusCode\": \"200\",\n");
    printf("  \"headers\": {\n");
    printf("    \"Content-Type\":\"application/json\"\n");
    printf("  },\n");
    printf("  \"body\": \"{ \\\"message\\\": \\\"Hello world from C application!\\\" }\"\n");
    printf("}\n");
    return 0;
}
