import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const assetLinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.candycrushultra.app',
        sha256_cert_fingerprints: [
          '14:6D:E9:7D:66:B9:4C:E9:78:E5:60:F4:71:0F:78:55:76:A8:1B:32:0C:68:55:92:DF:D3:5D:87:66:03:D0:68',
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
