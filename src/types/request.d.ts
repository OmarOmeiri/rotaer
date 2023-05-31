import { NextRequest, NextResponse } from "next/server"

type MyRequest<T> = {
  req: NextRequest,
  reqData: T
  res: NextResponse
}