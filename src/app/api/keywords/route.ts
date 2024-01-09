import { NextRequest, NextResponse } from "next/server";
import intervalParamsGenerator from "../helpers/intervalParamsGenerator";
import prisma from "@/lib/ds";
import { group } from "console";

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

    const keywords = await prisma.search.aggregateRaw({
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
            words: {
              $push: "$keyword",
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$_id",
                {
                  words: "$words",
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

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ data: [] }, { status: 204 });
    }

    return NextResponse.json({ data: keywords }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error: ${err.message}` },
      { status: 400 }
    );
  }
}
