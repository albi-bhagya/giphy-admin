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

    const logins = await prisma.login.aggregateRaw({
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
            users: {
              $addToSet: "$userId",
            },
          },
        },
        {
          $project: {
            _id: 1,
            users: 1,
            count: {
              $size: "$users",
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$_id",
                {
                  count: "$count",
                  users: "$users",
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

    if (!logins) {
      return NextResponse.json({ data: [] }, { status: 204 });
    }

    return NextResponse.json({ data: logins }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error: ${err.message}` },
      { status: 400 }
    );
  }
}
