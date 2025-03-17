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

    const { boardId } = params;

    // Vérifier que le board appartient à l'utilisateur
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        userId: session.user.id,
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board non trouvé ou non autorisé' },
        { status: 404 }
      );
    }

    // Récupérer toutes les tâches du tableau
    const tasks = await prisma.task.findMany({
      where: {
        boardId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { boardId } = params;
    const taskData = await request.json();

    // Vérifier que le board appartient à l'utilisateur
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        userId: session.user.id,
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board non trouvé ou non autorisé' },
        { status: 404 }
      );
    }

    // Créer la tâche
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description || '', // Uncomment this line
        status: taskData.status || 'todo',
        boardId: boardId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
