import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const assetLinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'dev.pages.candycrusherultra.twa',
        sha256_cert_fingerprints: [
          '9D:17:25:5D:27:2E:68:85:9D:D8:33:91:CC:66:5E:71:19:1F:26:C6:A6:7E:C9:60:92:09:52:29:7E:DD:1D:E0',
        ],
      },
    },
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'dev.pages.candycrushultra.twa',
        sha256_cert_fingerprints: [
          '9D:17:25:5D:27:2E:68:85:9D:D8:33:91:CC:66:5E:71:19:1F:26:C6:A6:7E:C9:60:92:09:52:29:7E:DD:1D:E0',
        ],
      },
    },
  ];

  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
}
