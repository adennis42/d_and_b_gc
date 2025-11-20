import { sql } from '@/lib/db';
import { Eye, FileText, Image as ImageIcon, Play, TrendingUp } from 'lucide-react';

export default async function AnalyticsPage() {
  // Get overview stats
  const pageViewsResult = await sql`
    SELECT COUNT(*)::text as count
    FROM analytics_events
    WHERE event_type = 'page_view'
  `;

  const formSubmissionsResult = await sql`
    SELECT COUNT(*)::text as count
    FROM analytics_events
    WHERE event_type = 'form_submit'
  `;

  const imageClicksResult = await sql`
    SELECT COUNT(*)::text as count
    FROM analytics_events
    WHERE event_type = 'image_click'
  `;

  const videoPlaysResult = await sql`
    SELECT COUNT(*)::text as count
    FROM analytics_events
    WHERE event_type = 'video_play'
  `;

  // Get popular pages
  const popularPagesResult = await sql`
    SELECT page_path, COUNT(*)::text as views
    FROM analytics_events
    WHERE event_type = 'page_view'
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 10
  `;

  // Extract values from results (postgres package returns arrays directly)
  const pageViews = Array.isArray(pageViewsResult) ? pageViewsResult[0]?.count || '0' : '0';
  const formSubmissions = Array.isArray(formSubmissionsResult) ? formSubmissionsResult[0]?.count || '0' : '0';
  const imageClicks = Array.isArray(imageClicksResult) ? imageClicksResult[0]?.count || '0' : '0';
  const videoPlays = Array.isArray(videoPlaysResult) ? videoPlaysResult[0]?.count || '0' : '0';
  const popularPages = Array.isArray(popularPagesResult) ? popularPagesResult : [];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
          Analytics
        </h1>
        <p className="text-slate-400">Track visitor behavior and engagement metrics</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={Eye}
          label="Page Views"
          value={Number(pageViews).toLocaleString()}
          gradient="from-blue-500 to-blue-600"
          bgGradient="from-blue-500/10 to-blue-600/10"
        />
        <StatCard
          icon={FileText}
          label="Form Submissions"
          value={Number(formSubmissions).toLocaleString()}
          gradient="from-green-500 to-green-600"
          bgGradient="from-green-500/10 to-green-600/10"
        />
        <StatCard
          icon={ImageIcon}
          label="Image Clicks"
          value={Number(imageClicks).toLocaleString()}
          gradient="from-purple-500 to-purple-600"
          bgGradient="from-purple-500/10 to-purple-600/10"
        />
        <StatCard
          icon={Play}
          label="Video Plays"
          value={Number(videoPlays).toLocaleString()}
          gradient="from-red-500 to-red-600"
          bgGradient="from-red-500/10 to-red-600/10"
        />
      </div>

      {/* Popular Pages */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-100">Popular Pages</h3>
          </div>
        </div>
        <ul className="divide-y divide-slate-800">
          {popularPages.length === 0 ? (
            <li className="px-6 py-12 text-center text-slate-500">
              No page views recorded yet
            </li>
          ) : (
            popularPages.map((page: any, index: number) => (
              <li key={page.page_path} className="px-6 py-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                      {index + 1}
                    </div>
                    <div className="text-sm font-medium text-slate-200">{page.page_path}</div>
                  </div>
                  <div className="text-sm font-semibold text-slate-300">
                    {Number(page.views).toLocaleString()} <span className="text-slate-500 font-normal">views</span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
  bgGradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  gradient: string;
  bgGradient: string;
}) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-800 overflow-hidden hover:shadow-xl hover:border-slate-700 transition-all">
      <div className={`p-6 bg-gradient-to-br ${bgGradient} border border-slate-800/50`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-100">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

