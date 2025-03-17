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

    const { boardId, taskId } = params;

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

    // Récupérer la tâche spécifique
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        boardId,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Tâche non trouvée' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
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
    const updateData = await request.json();

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

    // Mettre à jour la tâche
    const task = await prisma.task.update({
      where: {
        id: taskId,
        boardId,
      },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { boardId, taskId } = params;

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

    // Supprimer la tâche
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Tâche supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
