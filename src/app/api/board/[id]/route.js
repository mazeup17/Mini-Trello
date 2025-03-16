// src/app/api/board/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID du board manquant' },
        { status: 400 }
      );
    }

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!board) {
      return NextResponse.json({ error: 'Board non trouvé' }, { status: 404 });
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé à ce board' },
        { status: 403 }
      );
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error('Erreur lors de la récupération du board:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
