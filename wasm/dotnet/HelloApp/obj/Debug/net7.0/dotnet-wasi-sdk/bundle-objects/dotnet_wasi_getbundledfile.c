#include <string.h>

int mono_wasm_add_assembly(const char* name, const unsigned char* data, unsigned int size);

extern const unsigned char HelloApp_dll_A9063BD3[];
extern const int HelloApp_dll_A9063BD3_len;
extern const unsigned char System_Console_dll_944FB836[];
extern const int System_Console_dll_944FB836_len;
extern const unsigned char System_Memory_dll_574410C6[];
extern const int System_Memory_dll_574410C6_len;
extern const unsigned char System_Private_CoreLib_dll_225B1EFD[];
extern const int System_Private_CoreLib_dll_225B1EFD_len;
extern const unsigned char System_Private_Runtime_InteropServices_JavaScript_dll_B0A12A62[];
extern const int System_Private_Runtime_InteropServices_JavaScript_dll_B0A12A62_len;
extern const unsigned char System_Threading_dll_328CD325[];
extern const int System_Threading_dll_328CD325_len;
extern const unsigned char System_Collections_dll_32850823[];
extern const int System_Collections_dll_32850823_len;
extern const unsigned char System_Runtime_InteropServices_dll_A3CFB52E[];
extern const int System_Runtime_InteropServices_dll_A3CFB52E_len;
extern const unsigned char System_Runtime_dll_5B4A2B3F[];
extern const int System_Runtime_dll_5B4A2B3F_len;
extern const unsigned char System_Private_Uri_dll_E8F65C90[];
extern const int System_Private_Uri_dll_E8F65C90_len;

const unsigned char* dotnet_wasi_getbundledfile(const char* name, int* out_length) {
  return NULL;
}

void dotnet_wasi_registerbundledassemblies() {
  mono_wasm_add_assembly ("HelloApp.dll", HelloApp_dll_A9063BD3, HelloApp_dll_A9063BD3_len);
  mono_wasm_add_assembly ("System.Console.dll", System_Console_dll_944FB836, System_Console_dll_944FB836_len);
  mono_wasm_add_assembly ("System.Memory.dll", System_Memory_dll_574410C6, System_Memory_dll_574410C6_len);
  mono_wasm_add_assembly ("System.Private.CoreLib.dll", System_Private_CoreLib_dll_225B1EFD, System_Private_CoreLib_dll_225B1EFD_len);
  mono_wasm_add_assembly ("System.Private.Runtime.InteropServices.JavaScript.dll", System_Private_Runtime_InteropServices_JavaScript_dll_B0A12A62, System_Private_Runtime_InteropServices_JavaScript_dll_B0A12A62_len);
  mono_wasm_add_assembly ("System.Threading.dll", System_Threading_dll_328CD325, System_Threading_dll_328CD325_len);
  mono_wasm_add_assembly ("System.Collections.dll", System_Collections_dll_32850823, System_Collections_dll_32850823_len);
  mono_wasm_add_assembly ("System.Runtime.InteropServices.dll", System_Runtime_InteropServices_dll_A3CFB52E, System_Runtime_InteropServices_dll_A3CFB52E_len);
  mono_wasm_add_assembly ("System.Runtime.dll", System_Runtime_dll_5B4A2B3F, System_Runtime_dll_5B4A2B3F_len);
  mono_wasm_add_assembly ("System.Private.Uri.dll", System_Private_Uri_dll_E8F65C90, System_Private_Uri_dll_E8F65C90_len);
}

