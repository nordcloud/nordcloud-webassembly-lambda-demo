const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("{s}", .{
        \\ {
        \\   "statusCode": 200,
        \\   "headers": {
        \\     "Content-Type": "application/json"
        \\   },
        \\   "body": "{\"message\": \"Hello world from Zig application!\"}"
        \\ }
    });
}
