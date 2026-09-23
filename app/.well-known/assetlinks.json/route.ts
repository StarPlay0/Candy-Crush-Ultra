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
          'F0:8A:EB:DE:C9:CD:A1:4E:81:11:BA:DB:A3:E1:3D:B7:C8:0F:D4:DB:11:80:F9:23:1F:DF:2E:23:D3:F2:4A:0D',
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
