import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'EraPOS - Phần mềm quản lý bán hàng',
        short_name: 'EraPOS',
        description: 'Phần mềm quản lý bán hàng giúp bạn quản lý khách hàng, hóa đơn, báo cáo, ...',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [
            {
                src: '/images/icon_512x512.png',
                sizes: 'any',
                type: 'image/png',
            },
        ]
    }
}