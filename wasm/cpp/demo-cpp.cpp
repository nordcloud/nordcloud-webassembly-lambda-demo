/* WebAssembly C++ demo */
#include <iostream>

using namespace std;

int main() {
    cout << "{" << endl;
    cout << "  \"statusCode\": \"200\"," << endl;
    cout << "  \"headers\": {" << endl;
    cout << "    \"Content-Type\":\"application/json\"" << endl;
    cout << "  }," << endl;
    cout << "  \"body\": \"{ \\\"message\\\": \\\"Hello world from C++ application!\\\" }\"" << endl;
    cout << "}" << endl;
    return 0;
}
