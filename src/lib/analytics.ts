import { db } from "@/db";
import { linkClicks, pageVisits, links } from "@/db/schema";
import { sql, eq, gte, and, count } from "drizzle-orm";

function getStartDate(period: string): string {
  const now = new Date();
  switch (period) {
    case "7d":
      now.setDate(now.getDate() - 7);
      break;
    case "30d":
      now.setDate(now.getDate() - 30);
      break;
    case "90d":
      now.setDate(now.getDate() - 90);
      break;
    default:
      return "2000-01-01";
  }
  return now.toISOString();
}

export async function getOverviewStats(period: string) {
  const startDate = getStartDate(period);

  const [totalVisitsResult, totalClicksResult, topLinks] = await Promise.all([
    db
      .select({ count: count() })
      .from(pageVisits)
      .where(gte(pageVisits.visitedAt, startDate)),
    db
      .select({ count: count() })
      .from(linkClicks)
      .where(gte(linkClicks.clickedAt, startDate)),
    db
      .select({
        linkId: linkClicks.linkId,
        title: links.title,
        clicks: count(),
      })
      .from(linkClicks)
      .leftJoin(links, eq(linkClicks.linkId, links.id))
      .where(gte(linkClicks.clickedAt, startDate))
      .groupBy(linkClicks.linkId)
      .orderBy(sql`count(*) DESC`)
      .limit(5),
  ]);

  const visits = totalVisitsResult[0]?.count || 0;
  const clicks = totalClicksResult[0]?.count || 0;
  const ctr = visits > 0 ? ((clicks / visits) * 100).toFixed(1) : "0";

  return { visits, clicks, ctr, topLinks };
}

export async function getClicksByDay(period: string, linkId?: number) {
  const startDate = getStartDate(period);

  const conditions = linkId
    ? and(gte(linkClicks.clickedAt, startDate), eq(linkClicks.linkId, linkId))
    : gte(linkClicks.clickedAt, startDate);

  return db
    .select({
      date: sql<string>`to_char(${linkClicks.clickedAt}, 'YYYY-MM-DD')`.as(
        "date",
      ),
      count: count(),
    })
    .from(linkClicks)
    .where(conditions)
    .groupBy(sql`to_char(${linkClicks.clickedAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${linkClicks.clickedAt}, 'YYYY-MM-DD') ASC`);
}

export async function getVisitsByDay(period: string) {
  const startDate = getStartDate(period);

  return db
    .select({
      date: sql<string>`to_char(${pageVisits.visitedAt}, 'YYYY-MM-DD')`.as(
        "date",
      ),
      count: count(),
    })
    .from(pageVisits)
    .where(gte(pageVisits.visitedAt, startDate))
    .groupBy(sql`to_char(${pageVisits.visitedAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${pageVisits.visitedAt}, 'YYYY-MM-DD') ASC`);
}

export async function getDeviceBreakdown(period: string) {
  const startDate = getStartDate(period);

  return db
    .select({
      deviceType: pageVisits.deviceType,
      count: count(),
    })
    .from(pageVisits)
    .where(gte(pageVisits.visitedAt, startDate))
    .groupBy(pageVisits.deviceType);
}

export async function getCampaignPerformance(period: string) {
  const startDate = getStartDate(period);

  return db
    .select({
      campaignTag: linkClicks.campaignTag,
      clicks: count(),
    })
    .from(linkClicks)
    .where(
      and(
        gte(linkClicks.clickedAt, startDate),
        sql`${linkClicks.campaignTag} IS NOT NULL`
      )
    )
    .groupBy(linkClicks.campaignTag)
    .orderBy(sql`count(*) DESC`);
}

export async function getReferrerBreakdown(period: string) {
  const startDate = getStartDate(period);

  return db
    .select({
      referrer: pageVisits.referrer,
      count: count(),
    })
    .from(pageVisits)
    .where(
      and(
        gte(pageVisits.visitedAt, startDate),
        sql`${pageVisits.referrer} IS NOT NULL`
      )
    )
    .groupBy(pageVisits.referrer)
    .orderBy(sql`count(*) DESC`)
    .limit(10);
}
