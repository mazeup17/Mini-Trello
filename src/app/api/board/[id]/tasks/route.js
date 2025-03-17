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

    const { id: boardId } = params;
    console.log('Fetching tasks for board:', boardId);

    // Vérifier que l'utilisateur a accès au board
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      console.log('Board not found:', boardId);
      return NextResponse.json(
        { error: 'Tableau non trouvé' },
        { status: 404 }
      );
    }

    if (board.userId !== session.user.id) {
      console.log('Unauthorized access to board:', boardId);
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer les tâches du board
    const tasks = await prisma.task.findMany({
      where: { boardId },
      orderBy: { id: 'desc' }, // Changed from updatedAt to id which is available
    });

    console.log(`Found ${tasks.length} tasks for board ${boardId}`);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id: boardId } = params;
    const taskData = await request.json();

    // Vérifier que l'utilisateur a accès au board
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Tableau non trouvé' },
        { status: 404 }
      );
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Créer la tâche
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        // Temporarily comment out description field until schema is updated
        // description: taskData.description || '',
        status: taskData.status || 'todo',
        boardId: boardId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    return NextResponse.json(
      {
        error: 'Erreur serveur',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
