import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/ds";
import intervalParamsGenerator from "../helpers/intervalParamsGenerator";

export async function POST(req: NextRequest) {
  try {
    let { start, end, interval } = await req.json();

    if (!start) {
      throw new Error("Start Date is required");
    }

    let startDate: Date | string = new Date(String(start));
    let endDate: Date | string = end ? new Date(String(end)) : new Date();
    let intervalParams = intervalParamsGenerator(interval);

    if (startDate > endDate) {
      return NextResponse.json(
        { data: [], message: "Invalid Range" },
        { status: 400 }
      );
    }

    startDate = startDate.toISOString();
    endDate = endDate.toISOString();

    const favorites = await prisma.login.aggregateRaw({
      pipeline: [
        {
          $match: {
            $and: [
              {
                $expr: {
                  $gte: [
                    "$createdAt",
                    {
                      $dateFromString: {
                        dateString: startDate,
                      },
                    },
                  ],
                },
              },
              {
                $expr: {
                  $lte: [
                    "$createdAt",
                    {
                      $dateFromString: {
                        dateString: endDate,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: intervalParams,
            favorite_count: {
              $sum: 1,
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$_id",
                {
                  favorite_count: "$favorite_count",
                },
              ],
            },
          },
        },
        {
          $sort: {
            primary: 1,
            secondary: 1,
          },
        },
      ],
    });

    if (!favorites) {
      return NextResponse.json({ data: [] }, { status: 204 });
    }

    // favorites.sort();
    console.log(typeof favorites);

    return NextResponse.json({ data: favorites }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error: ${err.message}` },
      { status: 400 }
    );
  }
}
