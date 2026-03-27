import { NextResponse } from "next/server";

export function ok(data = {}, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message = "Unexpected error", status = 500, details = null) {
  return NextResponse.json({ success: false, message, details }, { status });
}
