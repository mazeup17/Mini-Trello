import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Route pour créer un nouveau board
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, userId } = body;

    if (!name || !userId) {
      return new NextResponse(
        JSON.stringify({ error: "Le nom et l'ID utilisateur sont requis" }),
        { status: 400 }
      );
    }

    const newBoard = await prisma.board.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(newBoard);
  } catch (error) {
    console.error('Erreur lors de la création du board:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Échec de la création du board' }),
      { status: 500 }
    );
  }
}

// Route pour récupérer tous les boards d'un utilisateur
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "L'ID utilisateur est requis" }),
        { status: 400 }
      );
    }

    const boards = await prisma.board.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(boards);
  } catch (error) {
    console.error('Erreur lors de la récupération des boards:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Échec de la récupération des boards' }),
      { status: 500 }
    );
  }
}
