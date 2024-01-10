import { NextRequest, NextResponse } from "next/server";
import intervalParamsGenerator from "../helpers/intervalParamsGenerator";
import prisma from "@/lib/ds";

export async function POST(req: NextRequest) {
  try {
    let { start, end, interval } = await req.json();

    if (!start) {
      throw new Error("Start Date is required");
    }

    let startDate: Date | string = new Date(String(start));
    let endDate: Date | string = end ? new Date(String(end)) : new Date();
    let intervalParams = {
      ...intervalParamsGenerator(interval),
      keyword: "$keyword",
    };

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
            count: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: {
              primary: "$_id.primary",
              secondary: "$_id.secondary",
            },
            keywords: {
              $push: {
                keyword: "$_id.keyword",
                count: "$count",
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$_id",
                {
                  keywords: "$keywords",
                },
              ],
            },
          },
        },
        {
          $sort: {
            tertiary: 1,
            primary: 1,
            secondary: 1,
          },
        },
      ],
    });

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ data: [] }, { status: 404 });
    }

    let updatedKeywords = JSON.parse(JSON.stringify(keywords));
    updatedKeywords.map((el: any) => {
      let temp = el.keywords;
      temp.sort((a: any, b: any) => b.count - a.count);
      temp = temp.slice(0, 5);
      return {
        ...el,
        keywords: temp,
      };
    });

    return NextResponse.json({ data: updatedKeywords }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error: ${err.message}` },
      { status: 400 }
    );
  }
}
