import { sql } from '@/lib/db';

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
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Page Views</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Number(pageViews).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Form Submissions</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Number(formSubmissions).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Image Clicks</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Number(imageClicks).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Video Plays</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Number(videoPlays).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Pages */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Popular Pages</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {popularPages.map((page: any) => (
            <li key={page.page_path} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">{page.page_path}</div>
                <div className="text-sm text-gray-500">{Number(page.views).toLocaleString()} views</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

