import { NextRequest } from 'next/server';

export const getCookie = (req: NextRequest, name: string) => req.cookies.get(name)?.value || null;
