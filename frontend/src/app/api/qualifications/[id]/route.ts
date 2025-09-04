import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  return NextResponse.json({ success: true, data: { id } })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  return NextResponse.json({ success: true, message: 'Updated' })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  return NextResponse.json({ success: true, message: 'Deleted' })
}