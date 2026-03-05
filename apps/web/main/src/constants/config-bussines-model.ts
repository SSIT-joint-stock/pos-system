import { BusinessType } from '@repo/types';
import { Coffee, Hotel, Scissors, Sparkles, Store, Utensils } from 'lucide-react';
import React from 'react';

export const BUSINESS_MODEL_CONFIG: Record<
  BusinessType,
  {
    label: string;
    description: string;
    icon: React.ElementType;
  }
> = {
  [BusinessType.RETAIL]: {
    label: 'Bán lẻ',
    description: 'Cửa hàng tạp hóa, siêu thị, shop quần áo...',
    icon: Store,
  },
  [BusinessType.RESTAURANT]: {
    label: 'Nhà hàng',
    description: 'Quán ăn, nhà hàng tiệc cưới, suất ăn công nghiệp...',
    icon: Utensils,
  },
  [BusinessType.CAFE]: {
    label: 'Quán Cafe',
    description: 'Quán cafe, trà sữa, trà chanh...',
    icon: Coffee,
  },
  [BusinessType.SPA]: {
    label: 'Spa & Làm đẹp',
    description: 'Thẩm mỹ viện, cơ sở chăm sóc sắc đẹp...',
    icon: Sparkles,
  },
  [BusinessType.SALON]: {
    label: 'Tóc & Nails',
    description: 'Tiệm cắt tóc, làm móng, tạo mẫu tóc...',
    icon: Scissors,
  },
  [BusinessType.HOTEL]: {
    label: 'Khách sạn',
    description: 'Khách sạn, nhà nghỉ, homestay...',
    icon: Hotel,
  },
};

export const businessModelOptions = Object.entries(BUSINESS_MODEL_CONFIG).map(
  ([value, config]) => ({
    value,
    label: config.label,
    description: config.description,
    leftSection: React.createElement(config.icon, { size: 16 }),
    disabled: value !== BusinessType.RETAIL && value !== BusinessType.RESTAURANT,
  })
);
