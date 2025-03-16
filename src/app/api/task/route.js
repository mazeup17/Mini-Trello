import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json({ error: 'Board non trouvé' }, { status: 404 });
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description || '',
        dueDate: taskData.dueDate,
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

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { boardId, taskId } = params;
    const taskData = await request.json();

    // Verify board ownership
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json({ error: 'Board non trouvé' }, { status: 404 });
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Update task
    const task = await prisma.task.update({
      where: {
        id: taskId,
        boardId: boardId,
      },
      data: {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        dueDate: taskData.dueDate,
        columnId: taskData.columnId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
